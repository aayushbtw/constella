import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { Page } from "playwright";
import { z } from "zod";

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
  unnamed: Unnamed;
  unseen: number;
}

const countsOf = ({ ambiguous, unnamed, unseen }: Scan) =>
  Object.fromEntries([
    ...Object.entries(unnamed),
    ...(ambiguous.length > 0 ? [["ambiguous", ambiguous.length] as const] : []),
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

interface Named {
  actions: string[];
  component: string;
  label: string;
  row?: string;
}

// Mirrors how the agent finds a component by name: the same folded label, or its
// words inside another's label and row. Two it finds that take the same action
// can't be told apart by that action, so the name isn't an address. A button and a
// popup of one name are a trigger and what it opens, which the agent tells apart.
const fold = (text: string) =>
  text
    .replaceAll(/[ßẞ]/gu, "ss")
    .normalize("NFKD")
    .replaceAll(/\p{M}/gu, "")
    .toLowerCase();
const wordsOf = (text: string) =>
  ` ${fold(text)} `.replaceAll(/[^\p{L}\p{N}]+/gu, " ");
const addressOf = ({ label, row }: Named) =>
  [label, row].filter(Boolean).join(" ");
const finds = (entry: Named, other: Named) =>
  fold(other.label) === fold(addressOf(entry)) ||
  wordsOf(addressOf(other)).includes(wordsOf(addressOf(entry)));
const triggerAndPopup = (entry: Named, other: Named) =>
  (entry.component === "button") !== (other.component === "button") &&
  fold(entry.label) === fold(other.label);
const sameAction = (entry: Named, other: Named) =>
  !triggerAndPopup(entry, other) &&
  entry.actions.some((action) => other.actions.includes(action));

function ambiguousIn(named: Named[]) {
  const same = Object.values(
    Object.groupBy(named, (entry) => fold(addressOf(entry)))
  ).flatMap((group = []) =>
    group.some((entry) =>
      group.some((other) => other !== entry && sameAction(entry, other))
    )
      ? [`"${addressOf(group[0])}"×${group.length}`]
      : []
  );
  const inside = named.flatMap((entry) =>
    named
      .filter(
        (other) =>
          fold(addressOf(other)) !== fold(addressOf(entry)) &&
          finds(entry, other) &&
          sameAction(entry, other)
      )
      .map((other) => `"${addressOf(entry)}" in "${addressOf(other)}"`)
  );
  return [...same, ...new Set(inside)];
}

const hiddenMark = "data-agent-audit-hidden";

// A docs page repeats a component across demos on purpose, so names are compared
// within one demo: the others and the page around it are hidden from the agent.
async function namedInDemo(page: Page, index: number): Promise<Named[]> {
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
  const named = await page.evaluate(() =>
    (globalThis.agentBridge?.agent.snapshot() ?? []).flatMap(
      ({ actions, component, label, offPage, row }) =>
        component === "more" || offPage === true || (label?.trim() ?? "") === ""
          ? []
          : [{ actions, component, label: label?.trim() ?? "", row }]
    )
  );
  await page.evaluate((mark) => {
    for (const el of document.querySelectorAll(`[${mark}]`)) {
      el.removeAttribute("aria-hidden");
      el.removeAttribute(mark);
    }
  }, hiddenMark);
  return named;
}

async function ambiguousInDemos(
  page: Page,
  [name, ...rest]: string[],
  index = 0
): Promise<string[]> {
  if (name === undefined) {
    return [];
  }
  const clashes = ambiguousIn(await namedInDemo(page, index)).map(
    (clash) => `${name}: ${clash}`
  );
  return [...clashes, ...(await ambiguousInDemos(page, rest, index + 1))];
}

async function scan(page: Page, url: string): Promise<Scan> {
  await openBridgePage(page, url);
  const demos = await page.$$eval("[data-slot='demo']", (found) =>
    found.map((demo) =>
      demo instanceof HTMLElement ? (demo.dataset.demo ?? "demo") : "demo"
    )
  );
  const ambiguous = await ambiguousInDemos(page, demos);
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
  return { ambiguous, ...counted };
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
const queue = pages.filter((pagePath) => pagePath !== home);

async function drain(page: Page): Promise<void> {
  const pagePath = queue.shift();
  if (pagePath === undefined) {
    return;
  }
  results.set(pagePath, await scan(page, `${origin}${pagePath}`));
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
    return [
      {
        ambiguous: ambiguous.length > 0,
        failing: verdicts.some((verdict) => verdict.kind !== "pinned"),
        lines: [
          line.join("  "),
          ...ambiguous.map((pair) => `    ambiguous: ${pair}`),
        ],
        unnamed: Object.keys(scanned?.unnamed ?? {}).length > 0,
      },
    ];
  });

const failures = rows.filter((row) => row.failing).length;
const withUnnamed = rows.filter((row) => row.unnamed).length;
const withAmbiguous = rows.filter((row) => row.ambiguous).length;
console.log(rows.flatMap((row) => row.lines).join("\n"));
console.log(
  `\n${pages.length} pages scanned, ${withUnnamed} with unnamed entries, ${withAmbiguous} with ambiguous names, ${failures} gated failures.`
);
process.exitCode = failures > 0 ? 1 : 0;
