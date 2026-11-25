// Diffs the prerendered docs pages of two site builds, after normalizing what
// differs between two builds of the same source. See docs/ui-sdk-migration.md, Checks.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
const textTags = new Set(["style", "textarea", "title"]);

function parseTag(html: string, start: number) {
  let i = start + 1;
  const nameEnd = html.slice(i).search(/[\s/>]/u) + i;
  const name = html.slice(i, nameEnd).toLowerCase();
  const attrs: [string, string | undefined][] = [];
  i = nameEnd;

  for (;;) {
    while (/\s/u.test(html[i] ?? "")) {
      i += 1;
    }
    if (html.startsWith("/>", i)) {
      return { attrs, end: i + 2, name, selfClosing: true };
    }
    if (html[i] === ">") {
      return { attrs, end: i + 1, name, selfClosing: false };
    }
    const attrEnd = html.slice(i).search(/[\s=/>]/u) + i;
    const attr = html.slice(i, attrEnd);
    i = attrEnd;
    if (html[i] === "=") {
      const quote = html[i + 1];
      if (quote === '"' || quote === "'") {
        const close = html.indexOf(quote, i + 2);
        attrs.push([attr, html.slice(i + 2, close)]);
        i = close + 1;
      } else {
        const valueEnd = html.slice(i + 1).search(/[\s>]/u) + i + 1;
        attrs.push([attr, html.slice(i + 1, valueEnd)]);
        i = valueEnd;
      }
    } else {
      attrs.push([attr, undefined]);
    }
  }
}

const formatTag = (name: string, attrs: [string, string | undefined][]) => {
  const parts = attrs
    .map(([attr, value]) => {
      if (value === undefined) {
        return attr;
      }
      const sorted =
        attr === "class"
          ? value.split(/\s+/u).filter(Boolean).toSorted().join(" ")
          : value;
      return `${attr}="${sorted}"`;
    })
    .toSorted();
  return `<${[name, ...parts].join(" ")}>`;
};

// One line per tag, comment or text run, so a line diff reads as a tag diff.
function normalize(html: string) {
  const lines: string[] = [];
  const open: string[] = [];
  const push = (text: string) => {
    lines.push(
      "  ".repeat(open.length) +
        text.replaceAll("\\", "\\\\").replaceAll("\n", String.raw`\n`)
    );
  };
  let i = 0;

  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i) + 3;
      push(html.slice(i, end));
      i = end;
    } else if (html.startsWith("<!", i)) {
      const end = html.indexOf(">", i) + 1;
      push(html.slice(i, end));
      i = end;
    } else if (html.startsWith("</", i)) {
      const end = html.indexOf(">", i);
      const name = html
        .slice(i + 2, end)
        .trim()
        .toLowerCase();
      const at = open.lastIndexOf(name);
      if (at !== -1) {
        open.length = at;
      }
      push(`</${name}>`);
      i = end + 1;
    } else if (html[i] === "<" && /[a-z]/iu.test(html[i + 1] ?? "")) {
      const { attrs, end, name, selfClosing } = parseTag(html, i);
      i = end;
      if (name === "script") {
        // Inline scripts carry router stream state and chunk URLs, not markup.
        i = html.indexOf(">", html.indexOf("</script", i)) + 1;
        continue;
      }
      // Hashed chunk names change between builds of the same source.
      if (
        name === "link" &&
        new Map(attrs).get("href")?.startsWith("/assets/") === true
      ) {
        continue;
      }
      push(formatTag(name, attrs));
      if (!selfClosing && !voidTags.has(name)) {
        open.push(name);
      }
      if (textTags.has(name)) {
        const close = html.indexOf(`</${name}`, i);
        if (close > i) {
          push(html.slice(i, close));
        }
        i = close;
      }
    } else {
      const next = html.indexOf("<", i + 1);
      const end = next === -1 ? html.length : next;
      push(html.slice(i, end));
      i = end;
    }
  }

  return `${lines.join("\n")}\n`;
}

async function pages(dir: string) {
  const files = await readdir(dir, { recursive: true });
  const html = files.filter((file) => file.endsWith(".html"));
  return new Map(
    await Promise.all(
      html.map(
        async (file) =>
          [
            file,
            normalize(await readFile(path.join(dir, file), "utf-8")),
          ] as const
      )
    )
  );
}

async function write(dir: string, normalized: Map<string, string>) {
  await Promise.all(
    [...normalized].map(async ([file, text]) => {
      await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
      await writeFile(path.join(dir, file), text);
    })
  );
}

const [dirA, dirB] = process.argv.slice(2);
if (!dirA || !dirB) {
  console.error(
    "Usage: node apps/site/scripts/diff-prerender.ts <dirA> <dirB>"
  );
  process.exit(2);
}

const missing = [dirA, dirB].filter((dir) => !existsSync(dir));
if (missing.length > 0) {
  console.error(`Not found: ${missing.join(", ")}`);
  process.exit(2);
}

const [a, b] = await Promise.all([pages(dirA), pages(dirB)]);
const tmp = await mkdtemp(path.join(tmpdir(), "diff-prerender-"));
await Promise.all([
  write(path.join(tmp, "a"), a),
  write(path.join(tmp, "b"), b),
]);

const git = spawnSync(
  "git",
  ["diff", "--no-index", "--no-color", "--no-prefix", "-U3", "a", "b"],
  { cwd: tmp, stdio: "inherit" }
);
await rm(tmp, { force: true, recursive: true });

const names = new Set([...a.keys(), ...b.keys()]);
const differing = [...names].filter((name) => a.get(name) !== b.get(name));
console.log(`\n${differing.length} of ${names.size} pages differ.`);
process.exitCode = git.status === 0 || git.status === 1 ? git.status : 2;
