import { renderHtml } from "@tanstack/markdown";
import { expect, test } from "vite-plus/test";

import { ambiguousIn } from "../../scripts/agent-names.ts";
import { parsePage } from "./parse-page.ts";

const copyLabels = (body: string) =>
  [...renderHtml(parsePage(body)).matchAll(/(?<= label=")[^"]*/gu)].map(
    ([label]) => label
  );

const fence = (lang: string, code = "x") => `\`\`\`${lang}\n${code}\n\`\`\`\n`;

test("a language used once names its block by the language alone", () => {
  expect(copyLabels(`${fence("tsx")}\n${fence("bash")}`)).toEqual([
    "Copy code, tsx",
    "Copy code, bash",
  ]);
});

test("a repeated language numbers each of its blocks in page order", () => {
  const body = [
    fence("tsx"),
    "- item\n\n  ```tsx\n  y\n  ```\n",
    "> ```css\n> z\n> ```\n",
    '<!-- ::start:demo name="x" -->',
    fence("tsx"),
    "<!-- ::end:demo -->",
  ].join("\n");
  expect(copyLabels(body)).toEqual([
    "Copy code, tsx, 1",
    "Copy code, tsx, 2",
    "Copy code, css",
    "Copy code, tsx, 3",
  ]);
});

test("a block with no language, plaintext or text is named text", () => {
  expect(copyLabels(fence(""))).toEqual(["Copy code, text"]);
  expect(
    copyLabels(`${fence("")}\n${fence("plaintext")}\n${fence("text")}`)
  ).toEqual(["Copy code, text, 1", "Copy code, text, 2", "Copy code, text, 3"]);
});

const sources = import.meta.glob<string>("../../content/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});
const pages = Object.entries(sources).map(([path, source]) => ({
  body: source.replace(/^---\n[\s\S]*?\n---\n/u, ""),
  path,
}));

test.each(pages)("every copy button on $path has its own name", ({ body }) => {
  const named = copyLabels(body).map((label) => ({
    actions: ["press"],
    component: "button",
    label,
  }));
  expect(ambiguousIn(named)).toEqual([]);
});

test("the content folder has pages with code", () => {
  const total = pages.flatMap(({ body }) => copyLabels(body)).length;
  expect(total).toBeGreaterThan(100);
});
