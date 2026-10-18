import { existsSync, readFileSync, readdirSync } from "node:fs";

interface Page {
  /** The h2s, in order. */
  headings: string[];
  /** Exported parts named as headings: `AvatarGroupCount` is "Group Count". Empty on a guide. */
  parts: string[];
  /** The h2s a writer chooses, between the fixed ones. */
  sections: string[];
  /** The component's folder in `packages/ui/src/components`. Unset on a guide or a lib page. */
  folder?: Folder;
  /** The frontmatter `section`. */
  section?: string;
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

const folders = ["primitives", "typography", "ai", "tanstack"] as const;

type Folder = (typeof folders)[number];

const folderSections = {
  primitives: undefined,
  typography: "Typography",
  ai: "AI",
  tanstack: "TanStack",
} satisfies Record<Folder, string | undefined>;

const slugOf = (title: string) => title.toLowerCase().replaceAll(" ", "-");

const componentUrl = (folder: Folder, slug: string) =>
  new URL(
    `../../../../../packages/ui/src/components/${folder}/${slug}.tsx`,
    import.meta.url
  );

function componentFolder(title: string) {
  return folders.find((folder) =>
    existsSync(componentUrl(folder, slugOf(title)))
  );
}

function parts(title: string, folder: Folder | undefined) {
  const slug = slugOf(title);
  // A page can document a lib file, like Scroll Fade, which has no parts.
  const source = readFileSync(
    folder
      ? componentUrl(folder, slug)
      : new URL(
          `../../../../../packages/ui/src/lib/constella/${slug}.ts`,
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

export {
  componentFolder,
  components,
  definePageRule,
  folderSections,
  headings,
  parts,
  startsWith,
};
export type { Folder, Page, PageRule };
