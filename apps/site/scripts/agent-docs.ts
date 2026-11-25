import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import type { Page } from "playwright";

import {
  builtAssetsDir,
  componentsDir,
  gatedSlugs,
  launch,
  NoBridgeError,
  openBridgePage,
  serveSite,
  settle,
} from "./bridge-site.ts";

interface Entry {
  label?: string;
  component: string;
  actions: string[];
  confirm?: string;
  disabled?: true;
}

interface Row {
  label: string;
  component: string;
  actions: string;
}

interface Demo {
  name: string;
  entries: Entry[];
}

interface PageScan {
  slug: string;
  markdown: string;
  preview: Demo;
  others: Demo[];
}

const { values: flags } = parseArgs({
  options: {
    check: { type: "boolean", default: false },
  },
});

function demoNames(markdown: string): string[] {
  const names: string[] = [];
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) {
      fenced = !fenced;
    } else if (!fenced) {
      const name = /^<!-- ::demo name="(?<name>[^"]+)" -->$/u.exec(line.trim())
        ?.groups?.name;
      if (name !== undefined) {
        names.push(name);
      }
    }
  }
  return names;
}

async function scopedSnapshot(page: Page, index: number) {
  await page.evaluate((at) => {
    const demo = document.querySelectorAll('[data-slot="demo"]')[at];
    let node: Element | null = demo;
    while (node !== null && node !== document.body) {
      const keep: Element = node;
      for (const sibling of node.parentElement?.children ?? []) {
        if (
          sibling !== keep &&
          sibling instanceof HTMLElement &&
          sibling.dataset.agentHidden === undefined
        ) {
          sibling.dataset.agentHidden = "";
          sibling.dataset.agentDocsHidden = "";
        }
      }
      node = node.parentElement;
    }
  }, index);
  await settle(page);
  const listed = await page.evaluate(() => {
    if (globalThis.agentBridge === undefined) {
      throw new Error("agent bridge left the page");
    }
    return globalThis.agentBridge.agent.snapshot().map((entry) => ({
      label: entry.label,
      component: entry.component,
      actions: entry.actions,
      confirm: entry.confirm,
      disabled: entry.disabled === true,
      offPage: entry.offPage === true,
    }));
  });
  await page.evaluate(() => {
    for (const element of document.querySelectorAll<HTMLElement>(
      "[data-agent-docs-hidden]"
    )) {
      delete element.dataset.agentHidden;
      delete element.dataset.agentDocsHidden;
    }
  });
  if (listed.some((entry) => entry.component === "more")) {
    throw new Error(`demo ${index} lists over 100 entries`);
  }
  return listed
    .filter((entry) => !entry.offPage)
    .map(({ label, component, actions, confirm, disabled }) => {
      const entry: Entry = { component, actions };
      if (label !== undefined && label.trim() !== "") {
        entry.label = label;
      }
      if (confirm !== undefined) {
        entry.confirm = confirm;
      }
      if (disabled) {
        entry.disabled = true;
      }
      return entry;
    });
}

async function scanDemos(
  page: Page,
  names: string[],
  index: number
): Promise<Demo[]> {
  const [name, ...later] = names;
  if (name === undefined) {
    return [];
  }
  const demo = { name, entries: await scopedSnapshot(page, index) };
  return [demo, ...(await scanDemos(page, later, index + 1))];
}

async function scanPage(
  page: Page,
  origin: string,
  slug: string
): Promise<PageScan> {
  const markdown = await readFile(
    path.join(componentsDir, `${slug}.md`),
    "utf-8"
  );
  const [previewName, ...otherNames] = demoNames(markdown);
  if (previewName === undefined) {
    throw new Error(`${slug}: no ::demo comment`);
  }
  await openBridgePage(page, `${origin}/docs/components/${slug}`);
  const rendered = await page.locator('[data-slot="demo"]').count();
  if (rendered !== otherNames.length + 1) {
    throw new Error(
      `${slug}: ${otherNames.length + 1} ::demo comments but ${rendered} rendered demos`
    );
  }
  const preview = { name: previewName, entries: await scopedSnapshot(page, 0) };
  if (preview.entries.length > 0) {
    return { slug, markdown, preview, others: [] };
  }
  const others = await scanDemos(page, otherNames, 1);
  return { slug, markdown, preview, others };
}

async function scanPages(
  page: Page,
  origin: string,
  slugs: string[]
): Promise<PageScan[]> {
  const [slug, ...later] = slugs;
  if (slug === undefined) {
    return [];
  }
  const scan = await scanPage(page, origin, slug);
  return [scan, ...(await scanPages(page, origin, later))];
}

const firstWord = (entry: Entry) => entry.label?.trim().split(/\s+/u)[0];

const sameKind = (a: Entry, b: Entry) =>
  a.component === b.component &&
  a.actions.join(",") === b.actions.join(",") &&
  a.confirm === b.confirm &&
  a.disabled === b.disabled &&
  firstWord(a) !== undefined &&
  firstWord(a) === firstWord(b);

function repeats(entries: Entry[]): [Entry, ...Entry[]][] {
  const groups: [Entry, ...Entry[]][] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last !== undefined && sameKind(last[0], entry)) {
      last.push(entry);
    } else {
      groups.push([entry]);
    }
  }
  return groups;
}

function actionsCell(entry: Entry) {
  if (entry.disabled) {
    return "None while disabled";
  }
  if (entry.actions.length === 0) {
    return "None";
  }
  const actions = entry.actions.map((action) => `\`${action}\``).join(", ");
  return entry.confirm === undefined ? actions : `${actions} (asks the person)`;
}

const rowsOf = (entries: Entry[]): Row[] =>
  repeats(entries).map(([first, ...rest]) => ({
    label: `${first.label ?? "No name"}${rest.length > 0 ? ` and ${rest.length} more` : ""}`,
    component: first.component,
    actions: actionsCell(first),
  }));

// The formatter's width: it rewrites a wider aligned table in compact form, and `--check` compares exact text.
const printWidth = 80;

const cell = (text: string) => text.replaceAll("|", String.raw`\|`);

function table(rows: Row[]) {
  const cells = [
    ["Label", "Component", "Actions"],
    ...rows.map((row) => [row.label, row.component, row.actions].map(cell)),
  ];
  const widths = [0, 1, 2].map((column) =>
    Math.max(3, ...cells.map((line) => line[column].length))
  );
  const aligned = 4 + widths.reduce((sum, width) => sum + width + 3, 0) - 3;
  const compact = aligned > printWidth;
  const line = (values: string[]) =>
    `| ${values.map((value, column) => (compact ? value : value.padEnd(widths[column]))).join(" | ")} |`;
  const [header, ...body] = cells;
  return [
    line(header),
    line(widths.map((width) => "-".repeat(compact ? 3 : width))),
    ...body.map(line),
  ];
}

function ownedLines({ slug, preview, others }: PageScan): string[] {
  if (preview.entries.length > 0) {
    return [
      "What `agent.snapshot()` lists for the preview example:",
      "",
      ...table(rowsOf(preview.entries)),
    ];
  }
  const busy = others.filter((demo) => demo.entries.length > 0);
  if (busy.length > 0) {
    throw new Error(
      `${slug}: the preview lists nothing but ${busy.map((demo) => demo.name).join(", ")} do; give the preview the part's controls`
    );
  }
  return ["Its examples add no entry to `agent.snapshot()`."];
}

const tableAfter = (lines: string[]) => {
  const start = lines.findIndex((line) => line.trim() !== "");
  const end = lines.findIndex(
    (line, at) => at >= start && !line.startsWith("|")
  );
  return start === -1 || end === -1 ? [] : lines.slice(end);
};

function writerNotes(section: string[]) {
  const lines = section.slice(1);
  const intro = lines.findIndex((line) => line.trim() !== "");
  if (intro === -1) {
    return [];
  }
  const rest = lines.slice(intro + 1);
  const notes = lines[intro].endsWith(":") ? tableAfter(rest) : rest;
  const first = notes.findIndex((line) => line.trim() !== "");
  const last = notes.findLastIndex((line) => line.trim() !== "");
  return first === -1 ? [] : notes.slice(first, last + 1);
}

function h2Lines(lines: string[]) {
  let fenced = false;
  return lines.flatMap((line, at) => {
    if (line.startsWith("```")) {
      fenced = !fenced;
    }
    return !fenced && line.startsWith("## ") ? [at] : [];
  });
}

function withAgentSection(scan: PageScan) {
  const lines = scan.markdown.split("\n");
  const h2s = h2Lines(lines);
  const reference = h2s.find((at) => lines[at] === "## API Reference");
  if (reference === undefined) {
    throw new Error(`${scan.slug}: no ## API Reference`);
  }
  const agent = h2s.find((at) => lines[at] === "## Agent");
  const end = agent === undefined ? reference : h2s.find((at) => at > agent);
  const start = agent ?? reference;
  if (end !== reference) {
    throw new Error(
      `${scan.slug}: ## Agent must sit right before ## API Reference`
    );
  }
  const notes = agent === undefined ? [] : writerNotes(lines.slice(agent, end));
  const section = [
    "## Agent",
    "",
    ...ownedLines(scan),
    "",
    ...(notes.length > 0 ? [...notes, ""] : []),
  ];
  return [...lines.slice(0, start), ...section, ...lines.slice(end)].join("\n");
}

const slugs = await gatedSlugs();
const server = await serveSite(builtAssetsDir);
const browser = await launch();
let scans: PageScan[] = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  scans = await scanPages(page, server.origin, slugs);
} catch (error) {
  if (!(error instanceof NoBridgeError)) {
    throw error;
  }
  console.error(
    "No agent bridge on the built pages. Build the site with VITE_AGENT_BRIDGE=1, as root `vpr agent-docs` does."
  );
  process.exitCode = 2;
} finally {
  await browser.close();
  server.close();
}

if (process.exitCode !== 2) {
  const changed = scans.flatMap((scan) => {
    const next = withAgentSection(scan);
    return next === scan.markdown ? [] : [{ next, slug: scan.slug }];
  });
  if (flags.check) {
    if (changed.length > 0) {
      console.error(
        `Agent sections out of date, run \`vpr agent-docs\`:\n${changed.map(({ slug }) => `- content/components/${slug}.md`).join("\n")}`
      );
      process.exitCode = 1;
    } else {
      console.log(`${scans.length} Agent sections up to date.`);
    }
  } else {
    await Promise.all(
      changed.map(async ({ next, slug }) => {
        await writeFile(path.join(componentsDir, `${slug}.md`), next);
      })
    );
    console.log(`${changed.length} of ${scans.length} Agent sections written.`);
  }
}
