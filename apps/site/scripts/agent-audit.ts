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
  unnamed: Unnamed;
  unseen: number;
}

const withUnseen = ({ unnamed, unseen }: Scan): Unnamed =>
  unseen > 0 ? { ...unnamed, unseen } : unnamed;

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

async function scan(page: Page, url: string): Promise<Scan> {
  await openBridgePage(page, url);
  return await page.evaluate(async () => {
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
}

function judge(
  scanned: Scan | undefined,
  pinned: Baseline[PagePath] = {}
): Verdict[] {
  if (scanned === undefined) {
    return [{ kind: "stale", text: "remove the page, it isn't built" }];
  }
  const counts = withUnseen(scanned);
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

const formatUnnamed = (unnamed: Unnamed) =>
  Object.entries(unnamed)
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
    const unnamed = formatUnnamed(
      scanned === undefined ? {} : withUnseen(scanned)
    );
    if (unnamed === "" && verdicts.length === 0) {
      return [];
    }
    const line = [
      pagePath,
      gated.has(pagePath) ? "gate" : "report",
      unnamed === "" ? "-" : unnamed,
      status(verdicts),
    ];
    return [
      {
        failing: verdicts.some((verdict) => verdict.kind !== "pinned"),
        line: line.join("  "),
        unnamed: unnamed !== "",
      },
    ];
  });

const failures = rows.filter((row) => row.failing).length;
const withUnnamed = rows.filter((row) => row.unnamed).length;
console.log(rows.map((row) => row.line).join("\n"));
console.log(
  `\n${pages.length} pages scanned, ${withUnnamed} with unnamed entries, ${failures} gated failures.`
);
process.exitCode = failures > 0 ? 1 : 0;
