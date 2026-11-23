import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { AgentComponent } from "@ui-sdk/react/agent";
import type { Page } from "playwright";
import { z } from "zod";

import { ambiguousIn } from "./agent-names.ts";
import type { Named } from "./agent-names.ts";
import {
  builtAssetsDir,
  gatedSlugs,
  launch,
  NoBridgeError,
  openBridgePage,
  serveSite,
} from "./bridge-site.ts";

type Kind = string;
type PagePath = string;
type Unnamed = Record<Kind, number>;
interface Scan {
  ambiguous: string[];
  native: string[];
  unnamed: Unnamed;
  unopened: string[];
  unseen: number;
}

const countsOf = ({ ambiguous, native, unnamed, unopened, unseen }: Scan) =>
  Object.fromEntries([
    ...Object.entries(unnamed),
    ...(ambiguous.length > 0 ? [["ambiguous", ambiguous.length] as const] : []),
    ...(native.length > 0 ? [["native", native.length] as const] : []),
    ...(unopened.length > 0 ? [["unopened", unopened.length] as const] : []),
    ...(unseen > 0 ? [["unseen", unseen] as const] : []),
  ]);

const baselineSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.object({ count: z.number().int().positive(), why: z.string().min(1) })
  )
);
type Baseline = z.infer<typeof baselineSchema>;

type Verdict =
  | { kind: "fail"; text: string }
  | { kind: "stale"; text: string }
  | { kind: "pinned" };

const home = "/";
const workers = 4;
const baselinePath = path.join(
  import.meta.dirname,
  "agent-audit-baseline.json"
);
const assetsDir = path.resolve(process.argv[2] ?? builtAssetsDir);

async function gatedPages() {
  const slugs = await gatedSlugs();
  return new Set(slugs.map((slug) => `/docs/components/${slug}`));
}

async function listPages() {
  const files = await readdir(assetsDir, { recursive: true });
  const pages = files
    .map((file) => file.split(path.sep).join("/"))
    .filter(
      (file) =>
        path.posix.basename(file) === "index.html" &&
        /^(?:docs|blocks)\//u.test(file)
    )
    .map((file) => `/${path.posix.dirname(file)}`);
  return [home, ...pages].toSorted();
}

const hiddenMark = "data-agent-audit-hidden";

const toNamed = (entries: AgentComponent[]): Named[] =>
  entries.flatMap(({ actions, component, label, offPage, row }) =>
    component === "more" || offPage === true || (label?.trim() ?? "") === ""
      ? []
      : [{ actions, component, label: label?.trim() ?? "", row }]
  );

async function nativeUnseenIn(page: Page, index: number): Promise<string[]> {
  return await page.evaluate((at) => {
    const demo = document.querySelectorAll("[data-slot='demo']")[at];
    if (demo === undefined || globalThis.agentBridge === undefined) {
      return [];
    }
    const { agent } = globalThis.agentBridge;
    const controls = [
      ...demo.querySelectorAll<HTMLElement>(
        "a[href], button, input:not([type='hidden']), select, textarea"
      ),
    ].filter(
      (control) =>
        control.closest(
          "[aria-hidden='true'], [data-agent-hidden], [inert]"
        ) === null && control.checkVisibility()
    );
    const bridgeSeesItAlone = (control: HTMLElement) => {
      const hidden: Element[] = [];
      for (
        let el: Element = control;
        el !== demo && el.parentElement;
        el = el.parentElement
      ) {
        for (const sibling of el.parentElement.children) {
          if (sibling !== el && !sibling.hasAttribute("aria-hidden")) {
            sibling.setAttribute("aria-hidden", "true");
            hidden.push(sibling);
          }
        }
      }
      const seen = agent
        .snapshot()
        .some((entry) => entry.component !== "more" && entry.offPage !== true);
      for (const el of hidden) {
        el.removeAttribute("aria-hidden");
      }
      return seen;
    };
    return controls
      .filter((control) => !bridgeSeesItAlone(control))
      .map((control) => {
        const name = (
          control.getAttribute("aria-label") ??
          control.textContent ??
          ""
        )
          .trim()
          .slice(0, 40);
        return `${control.localName}${name === "" ? "" : ` "${name}"`}`;
      });
  }, index);
}

interface DemoScan {
  named: Named[];
  native: string[];
}

// A docs page repeats a component across demos on purpose, so names are compared
// within one demo: the others and the page around it are hidden from the agent.
async function scanDemo(page: Page, index: number): Promise<DemoScan> {
  await page.evaluate(
    ({ at, mark }) => {
      const demo = document.querySelectorAll("[data-slot='demo']")[at];
      for (let el = demo; el?.parentElement; el = el.parentElement) {
        for (const sibling of el.parentElement.children) {
          if (sibling !== el && !sibling.hasAttribute("aria-hidden")) {
            sibling.setAttribute("aria-hidden", "true");
            sibling.setAttribute(mark, "");
          }
        }
      }
    },
    { at: index, mark: hiddenMark }
  );
  const named = toNamed(
    await page.evaluate(() => globalThis.agentBridge?.agent.snapshot() ?? [])
  );
  const native = await nativeUnseenIn(page, index);
  await page.evaluate((mark) => {
    for (const el of document.querySelectorAll(`[${mark}]`)) {
      el.removeAttribute("aria-hidden");
      el.removeAttribute(mark);
    }
  }, hiddenMark);
  return { named, native };
}

async function scanDemos(
  page: Page,
  [name, ...rest]: string[],
  index = 0
): Promise<Pick<Scan, "ambiguous" | "native">> {
  if (name === undefined) {
    return { ambiguous: [], native: [] };
  }
  const demo = await scanDemo(page, index);
  const others = await scanDemos(page, rest, index + 1);
  return {
    ambiguous: [
      ...ambiguousIn(demo.named).map((clash) => `${name}: ${clash}`),
      ...others.ambiguous,
    ],
    native: [
      ...demo.native.map((control) => `${name}: ${control}`),
      ...others.native,
    ],
  };
}

const popupRenderMs = 100;

const liveEntries = async (page: Page) =>
  await page.evaluate(() =>
    (globalThis.agentBridge?.agent.snapshot() ?? []).filter(
      (entry) => entry.component !== "more" && entry.offPage !== true
    )
  );
type LiveEntry = Awaited<ReturnType<typeof liveEntries>>[number];

const setOpen = async (page: Page, ref: string, open: boolean) =>
  await page.evaluate(
    async (step) => {
      const result = await globalThis.agentBridge?.agent.act({
        steps: [{ action: "setOpen", args: [step.open], ref: step.ref }],
      });
      return result?.ok === true;
    },
    { open, ref }
  );

async function openEach(
  page: Page,
  [popup, ...rest]: LiveEntry[],
  known: Set<string>
): Promise<{ entries: LiveEntry[]; label: string; opened: boolean }[]> {
  if (popup === undefined) {
    return [];
  }
  const label = popup.label ?? popup.component;
  if (!(await setOpen(page, popup.ref, true))) {
    return [
      { entries: [], label, opened: false },
      ...(await openEach(page, rest, known)),
    ];
  }
  await page.waitForTimeout(popupRenderMs);
  const after = await liveEntries(page);
  const entries = after.filter((entry) => !known.has(entry.ref));
  for (const entry of entries) {
    known.add(entry.ref);
  }
  await setOpen(page, popup.ref, false);
  return [
    { entries, label, opened: true },
    ...(await openEach(page, rest, known)),
  ];
}

async function scanPopups(page: Page) {
  const before = await liveEntries(page);
  const popups = await openEach(
    page,
    before.filter(
      (entry) => entry.open === false && entry.actions.includes("setOpen")
    ),
    new Set(before.map((entry) => entry.ref))
  );
  const inside = popups.flatMap(({ entries }) => entries);
  return {
    ambiguous: popups.flatMap(({ entries, label }) =>
      ambiguousIn(toNamed(entries)).map((clash) => `popup "${label}": ${clash}`)
    ),
    unnamed: Object.fromEntries(
      Object.entries(
        Object.groupBy(
          inside.filter((entry) => (entry.label?.trim() ?? "") === ""),
          (entry) => `${entry.component} in popup`
        )
      ).map(([kind, group]) => [kind, group?.length ?? 0])
    ),
    unopened: popups.filter(({ opened }) => !opened).map(({ label }) => label),
  };
}

async function scan(page: Page, url: string): Promise<Scan> {
  await openBridgePage(page, url);
  const demos = await page.$$eval("[data-slot='demo']", (found) =>
    found.map((demo) =>
      demo instanceof HTMLElement ? (demo.dataset.demo ?? "demo") : "demo"
    )
  );
  const { ambiguous, native } = await scanDemos(page, demos);
  const counted = await page.evaluate(async () => {
    if (globalThis.agentBridge === undefined) {
      throw new Error("agent bridge left the page");
    }
    const { agent } = globalThis.agentBridge;
    type Entry = ReturnType<typeof agent.snapshot>[number];
    const listed = (list: Entry[]) =>
      list.filter((entry) => entry.component !== "more");
    const left = (list: Entry[]) =>
      Number(list.find((entry) => entry.component === "more")?.more ?? 0);
    const unnamedIn = (list: Entry[]) =>
      listed(list).filter((entry) => (entry.label?.trim() ?? "") === "");
    const tally = (list: Entry[]) =>
      Object.fromEntries(
        Object.entries(
          Object.groupBy(unnamedIn(list), (entry) => entry.component)
        ).map(([kind, group]) => [kind, group?.length ?? 0])
      );

    const entries = agent.snapshot();
    const more = left(entries);
    if (more === 0) {
      return { unnamed: tally(entries), unseen: 0 };
    }
    const kinds = [...new Set(listed(entries).map((entry) => entry.component))];
    const found = await Promise.all(
      kinds.map(async (kind) => {
        const result = await agent.query({ kind });
        if ("error" in result) {
          throw new Error(`query ${kind}: ${result.error}`);
        }
        return result;
      })
    );
    const all = found.flatMap(listed);
    return {
      unnamed: tally(all),
      unseen: listed(entries).length + more - all.length,
    };
  });
  const popups = await scanPopups(page);
  return {
    ambiguous: [...ambiguous, ...popups.ambiguous],
    native,
    unnamed: { ...counted.unnamed, ...popups.unnamed },
    unopened: popups.unopened,
    unseen: counted.unseen,
  };
}

function judge(
  scanned: Scan | undefined,
  pinned: Baseline[PagePath] = {}
): Verdict[] {
  if (scanned === undefined) {
    return [{ kind: "stale", text: "remove the page, it isn't built" }];
  }
  const counts = countsOf(scanned);
  const kinds = new Set([...Object.keys(counts), ...Object.keys(pinned)]);
  return [...kinds].toSorted().map((kind): Verdict => {
    const actual = counts[kind] ?? 0;
    const allowed = pinned[kind]?.count;
    if (allowed === undefined) {
      return { kind: "fail", text: `${kind}×${actual} not in baseline` };
    }
    if (actual > allowed) {
      return { kind: "fail", text: `${kind} ${actual} > baseline ${allowed}` };
    }
    if (actual < allowed) {
      return { kind: "stale", text: `lower ${kind} to ${actual}` };
    }
    return { kind: "pinned" };
  });
}

function status(verdicts: Verdict[]) {
  const fails = verdicts.filter((verdict) => verdict.kind === "fail");
  const stale = verdicts.filter((verdict) => verdict.kind === "stale");
  if (fails.length > 0) {
    return `FAIL: ${fails.map((verdict) => verdict.text).join("; ")}`;
  }
  if (stale.length > 0) {
    return `stale: ${stale.map((verdict) => verdict.text).join(", ")}`;
  }
  return verdicts.length > 0 ? "pinned" : "ok";
}

const formatCounts = (counts: Unnamed) =>
  Object.entries(counts)
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([kind, count]) => `${kind}×${count}`)
    .join(" ");

const baseline = baselineSchema.parse(
  JSON.parse(await readFile(baselinePath, "utf-8"))
);
const [gated, pages] = await Promise.all([gatedPages(), listPages()]);

const server = await serveSite(assetsDir);
const { origin } = server;

const browser = await launch();
const results = new Map<PagePath, Scan>();
const crashed = new Map<PagePath, string>();
const queue = pages.filter((pagePath) => pagePath !== home);

async function drain(page: Page): Promise<void> {
  const pagePath = queue.shift();
  if (pagePath === undefined) {
    return;
  }
  try {
    results.set(pagePath, await scan(page, `${origin}${pagePath}`));
  } catch (error) {
    crashed.set(
      pagePath,
      (error instanceof Error ? error.message : String(error)).split("\n")[0] ??
        ""
    );
  }
  await drain(page);
}

let bridgeMissing = false;
try {
  const first = await browser.newPage();
  try {
    results.set(home, await scan(first, origin));
  } catch (error) {
    if (!(error instanceof NoBridgeError)) {
      throw error;
    }
    bridgeMissing = true;
  }
  if (!bridgeMissing) {
    const others = await Promise.all(
      Array.from({ length: workers - 1 }, async () => await browser.newPage())
    );
    await Promise.all([first, ...others].map(drain));
  }
} finally {
  await browser.close();
  server.close();
}

if (bridgeMissing) {
  console.error(
    `No agent bridge on ${home}. Build the site with VITE_AGENT_BRIDGE=1, as root \`vpr agent-audit\` does.`
  );
  process.exit(2);
}

function verdictsFor(pagePath: PagePath): Verdict[] {
  const failure = crashed.get(pagePath);
  if (failure !== undefined) {
    return [{ kind: "fail", text: `scan failed: ${failure}` }];
  }
  if (gated.has(pagePath)) {
    return judge(results.get(pagePath), baseline[pagePath]);
  }
  if (pagePath in baseline) {
    return [{ kind: "stale", text: "remove the page, it isn't gated" }];
  }
  return [];
}

const rows = [...new Set([...pages, ...Object.keys(baseline)])]
  .toSorted()
  .flatMap((pagePath) => {
    const scanned = results.get(pagePath);
    const verdicts = verdictsFor(pagePath);
    const counts = formatCounts(scanned === undefined ? {} : countsOf(scanned));
    if (counts === "" && verdicts.length === 0) {
      return [];
    }
    const line = [
      pagePath,
      gated.has(pagePath) ? "gate" : "report",
      counts === "" ? "-" : counts,
      status(verdicts),
    ];
    const ambiguous = scanned?.ambiguous ?? [];
    const native = scanned?.native ?? [];
    const unopened = scanned?.unopened ?? [];
    return [
      {
        ambiguous: ambiguous.length > 0,
        failing: verdicts.some((verdict) => verdict.kind !== "pinned"),
        lines: [
          line.join("  "),
          ...ambiguous.map((pair) => `    ambiguous: ${pair}`),
          ...native.map((control) => `    native: ${control}`),
          ...unopened.map((popup) => `    unopened: ${popup}`),
        ],
        native: native.length > 0,
        unnamed: Object.keys(scanned?.unnamed ?? {}).length > 0,
      },
    ];
  });

const failures = rows.filter((row) => row.failing).length;
const withUnnamed = rows.filter((row) => row.unnamed).length;
const withAmbiguous = rows.filter((row) => row.ambiguous).length;
const withNative = rows.filter((row) => row.native).length;
console.log(rows.flatMap((row) => row.lines).join("\n"));
console.log(
  `\n${pages.length} pages scanned, ${withUnnamed} with unnamed entries, ${withAmbiguous} with ambiguous names, ${withNative} with native controls the bridge can't see, ${crashed.size} failed to scan, ${failures} failing.`
);
process.exitCode = failures > 0 ? 1 : 0;
