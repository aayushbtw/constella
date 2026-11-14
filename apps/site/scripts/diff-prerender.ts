// Diffs the prerendered docs pages of two site builds, after normalizing what
// differs between two builds of the same source. See docs/ui-sdk-migration.md, Checks.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

interface Token {
  text: string;
  trail: string;
}

interface Edit extends Token {
  kind: " " | "-" | "+";
}

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
const context = 3;
const width = 200;

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

const label = (name: string, attrs: [string, string | undefined][]) => {
  const values = new Map(attrs);
  const id = values.get("id");
  const slot = values.get("data-slot");
  if (slot !== undefined) {
    return `${name}[data-slot=${slot}]`;
  }
  return id === undefined ? undefined : `${name}#${id}`;
};

// One token per tag, comment or text run, so a line diff reads as a tag diff.
function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  const open: { name: string; label?: string }[] = [];
  const push = (text: string) => {
    const trail = open.flatMap((element) =>
      element.label === undefined ? [] : [element.label]
    );
    tokens.push({ text, trail: trail.slice(-4).join(" > ") });
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
      const at = open.findLastIndex((element) => element.name === name);
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
      if (textTags.has(name)) {
        const close = html.indexOf(`</${name}`, i);
        if (close > i) {
          push(html.slice(i, close));
        }
        i = close;
      } else if (!selfClosing && !voidTags.has(name)) {
        open.push({ label: label(name, attrs), name });
      }
    } else {
      const next = html.indexOf("<", i + 1);
      const end = next === -1 ? html.length : next;
      push(html.slice(i, end).replaceAll("\n", String.raw`\n`));
      i = end;
    }
  }

  return tokens;
}

const empty: Token = { text: "", trail: "" };

const pick = (row: Int32Array, d: number, k: number) =>
  k === -d || (k !== d && (row[k - 1 + d] ?? 0) < (row[k + 1 + d] ?? 0))
    ? k + 1
    : k - 1;

// Myers' O(ND) search, keeping only the [-d, d] band of each step for the walk back.
function search(a: Token[], b: Token[]) {
  const max = a.length + b.length;
  const v = new Int32Array(2 * max + 2);
  const trace: Int32Array[] = [];

  for (let d = 0; d <= max; d += 1) {
    const row = v.slice(max - d, max + d + 1);
    trace.push(row);
    for (let k = -d; k <= d; k += 2) {
      const from = pick(row, d, k);
      let x = (v[max + from] ?? 0) + (from === k + 1 ? 0 : 1);
      let y = x - k;
      while (x < a.length && y < b.length && a[x]?.text === b[y]?.text) {
        x += 1;
        y += 1;
      }
      v[max + k] = x;
      if (x >= a.length && y >= b.length) {
        return trace;
      }
    }
  }

  return trace;
}

function diff(a: Token[], b: Token[]): Edit[] {
  const trace = search(a, b);
  const edits: Edit[] = [];
  let x = a.length;
  let y = b.length;

  for (let d = trace.length - 1; d > 0; d -= 1) {
    const row = trace[d] ?? new Int32Array();
    const from = pick(row, d, x - y);
    const fromX = row[from + d] ?? 0;
    while (x > fromX && y > fromX - from) {
      x -= 1;
      y -= 1;
      edits.push({ kind: " ", ...(a[x] ?? empty) });
    }
    if (x === fromX) {
      y -= 1;
      edits.push({ kind: "+", ...(b[y] ?? empty) });
    } else {
      x -= 1;
      edits.push({ kind: "-", ...(a[x] ?? empty) });
    }
  }
  while (x > 0) {
    x -= 1;
    edits.push({ kind: " ", ...(a[x] ?? empty) });
  }

  return edits.toReversed();
}

function hunks(edits: Edit[]) {
  const out: string[] = [];
  const changed = edits.flatMap((edit, at) => (edit.kind === " " ? [] : [at]));
  let at = 0;

  while (at < changed.length) {
    const first = changed[at] ?? 0;
    let last = first;
    while (
      at + 1 < changed.length &&
      (changed[at + 1] ?? 0) - last <= 2 * context
    ) {
      at += 1;
      last = changed[at] ?? last;
    }
    at += 1;
    out.push(`  @@ ${edits[first]?.trail || "(page root)"}`);
    for (const edit of edits.slice(
      Math.max(0, first - context),
      last + context + 1
    )) {
      // Changed lines print whole: the difference can sit past any cutoff.
      const text =
        edit.kind === " " && edit.text.length > width
          ? `${edit.text.slice(0, width)}…`
          : edit.text;
      out.push(`  ${edit.kind} ${text}`);
    }
  }

  return out;
}

async function pages(dir: string) {
  const files = await readdir(dir, { recursive: true });
  const html = files.filter((file) => file.endsWith(".html")).toSorted();
  return new Map(
    await Promise.all(
      html.map(
        async (file) =>
          [
            file,
            tokenize(await readFile(path.join(dir, file), "utf-8")),
          ] as const
      )
    )
  );
}

const [dirA, dirB] = process.argv.slice(2);
if (!dirA || !dirB) {
  console.error(
    "Usage: node apps/site/scripts/diff-prerender.ts <dirA> <dirB>"
  );
  process.exit(2);
}

const [a, b] = await Promise.all([pages(dirA), pages(dirB)]);
const names = [...new Set([...a.keys(), ...b.keys()])].toSorted();
let differing = 0;
let lines = 0;

for (const name of names) {
  const left = a.get(name);
  const right = b.get(name);
  if (!left || !right) {
    differing += 1;
    console.log(`≠ ${name}: only in ${left ? dirA : dirB}`);
    continue;
  }
  const edits = diff(left, right);
  const count = edits.filter((edit) => edit.kind !== " ").length;
  if (count === 0) {
    console.log(`= ${name}: identical`);
    continue;
  }
  differing += 1;
  lines += count;
  console.log(`≠ ${name}: ${count} lines differ`);
  console.log(hunks(edits).join("\n"));
}

console.log(
  `\n${differing} of ${names.length} pages differ, ${lines} lines in all.`
);
process.exitCode = differing === 0 ? 0 : 1;
