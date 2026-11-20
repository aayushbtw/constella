import { once } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

import type { createAgent } from "@ui-sdk/react/agent";
import { chromium, errors } from "playwright";
import type { Page } from "playwright";
import { z } from "zod";

declare global {
  var agent: ReturnType<typeof createAgent> | undefined;
}

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
const siteDir = path.join(import.meta.dirname, "..");
const baselinePath = path.join(
  import.meta.dirname,
  "agent-audit-baseline.json"
);
const assetsDir = path.resolve(
  process.argv[2] ??
    path.join(siteDir, ".cloudflare/output/v0/workers/default/assets")
);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

const gatedSections = new Set(["AI", "TanStack"]);

async function gatedPages() {
  const dir = path.join(siteDir, "content/components");
  const files = await readdir(dir);
  const gated = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const text = await readFile(path.join(dir, file), "utf-8");
        const section = /^section:\s*(?<section>.+?)\s*$/mu.exec(text)?.groups
          ?.section;
        return section !== undefined && gatedSections.has(section)
          ? [`/docs/components/${path.basename(file, ".md")}`]
          : [];
      })
  );
  return new Set(gated.flat());
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

async function serve(req: IncomingMessage, res: ServerResponse) {
  try {
    const target = path.join(
      assetsDir,
      decodeURIComponent(new URL(req.url ?? home, "http://localhost").pathname)
    );
    const file =
      path.extname(target) === "" ? path.join(target, "index.html") : target;
    const type = contentTypes.get(path.extname(file));
    if (type === undefined || !file.startsWith(assetsDir)) {
      throw new Error("not served");
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": type }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}

interface Settling {
  length: number;
  reads: number;
  stable: number;
}

async function settle(page: Page, state: Settling): Promise<void> {
  if (state.stable >= 5 || state.reads >= 100) {
    return;
  }
  await page.waitForTimeout(100);
  const length = await page.evaluate(
    () => globalThis.agent?.snapshot().length ?? 0
  );
  await settle(page, {
    length,
    reads: state.reads + 1,
    stable: length === state.length ? state.stable + 1 : 0,
  });
}

async function scan(page: Page, url: string): Promise<Scan> {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(() => globalThis.agent !== undefined, null, {
    timeout: 10_000,
  });
  await settle(page, { length: -1, reads: 0, stable: 0 });
  return await page.evaluate(async () => {
    const { agent } = globalThis;
    if (agent === undefined) {
      throw new Error("agent bridge left the page");
    }
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

const server = createServer((req, res) => {
  void serve(req, res);
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const { port } = z.object({ port: z.number() }).parse(server.address());
const origin = `http://127.0.0.1:${port}`;

const browser = await chromium.launch({ headless: true });
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
    if (!(error instanceof errors.TimeoutError)) {
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
