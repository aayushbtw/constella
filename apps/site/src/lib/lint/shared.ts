import { readFileSync, readdirSync } from "node:fs";

interface Page {
  /** The h2s, in order. */
  headings: string[];
  /** Exported parts named as headings: `AvatarGroupCount` is "Group Count". Empty on a guide. */
  parts: string[];
  /** The h2s a writer chooses, between the fixed ones. */
  sections: string[];
  body: string;
  title: string;
}

interface PageRule {
  description: string;
  check: (page: Page) => string[];
}

function definePageRule(rule: PageRule) {
  return rule;
}

const components = readdirSync(
  new URL("../../../content/components", import.meta.url)
).map((file) =>
  file
    .replace(/\.md$/u, "")
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
);

function headings(body: string) {
  let fenced = false;
  const found: string[] = [];

  for (const line of body.split("\n")) {
    if (line.startsWith("```")) {
      fenced = !fenced;
    } else if (!fenced && line.startsWith("## ")) {
      found.push(line.slice(3).trim());
    }
  }

  return found;
}

function parts(title: string) {
  const source = readFileSync(
    new URL(
      `../../../../../packages/ui/src/components/ui/${title.toLowerCase().replaceAll(" ", "-")}.tsx`,
      import.meta.url
    ),
    "utf-8"
  );
  const names =
    /^export \{(?<names>[^}]+)\}/mu.exec(source)?.groups?.names ?? "";
  const prefix = title.replaceAll(" ", "");

  return names
    .split(",")
    .map((name) => name.trim())
    .filter((name) => /^[A-Z]/u.test(name))
    .map((name) =>
      name
        .slice(name.startsWith(prefix) ? prefix.length : 0)
        .replaceAll(/(?<=.)(?=[A-Z])/gu, " ")
    );
}

function startsWith(heading: string, name: string) {
  return name !== "" && (heading === name || heading.startsWith(`${name} `));
}

export { components, definePageRule, headings, parts, startsWith };
export type { Page, PageRule };
