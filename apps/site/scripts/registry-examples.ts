// Adds a `<name>-demo` example per component page to the registry `shadcn build` wrote,
// so shadcn's MCP server can hand agents each component's usage snippets.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { registrySchema, registryItemSchema } from "shadcn/schema";
import type { RegistryItem } from "shadcn/schema";
import { markdown } from "tomekit/content";

const out = path.join(import.meta.dirname, "../public/r");
const prefix = "docs/components/";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-|-$/gu, "");

function sections(body: string) {
  const found = new Map<string, string[]>();
  let h2 = "";
  let key = "preview";
  let block: string[] | undefined;

  for (const line of body.split("\n")) {
    if (block) {
      if (line === "```") {
        found.set(key, [...(found.get(key) ?? []), block.join("\n")]);
        block = undefined;
      } else {
        block.push(line);
      }
    } else if (/^```(?:tsx|jsx)$/u.test(line)) {
      block = [];
    } else if (line.startsWith("## ")) {
      h2 = slugify(line.slice(3));
      key = h2;
    } else if (line.startsWith("### ")) {
      key = `${h2}-${slugify(line.slice(4))}`;
    }
  }

  return found;
}

const registryPath = path.join(out, "registry.json");
const registry = registrySchema.parse(
  JSON.parse(await readFile(registryPath, "utf-8"))
);
const components = new Set(registry.items.map(({ name }) => name));

const examples = markdown
  .documents()
  .filter(({ slug }) => slug.startsWith(prefix))
  .map(({ body, metadata, slug }): RegistryItem => {
    const name = slug.slice(prefix.length);
    const url = new URL(`/${slug}/index.md`, registry.homepage).href;

    if (!components.has(name)) {
      throw new Error(
        `${slug} documents "${name}", which isn't in the registry`
      );
    }

    return registryItemSchema.parse({
      name: `${name}-demo`,
      type: "registry:example",
      title: `${metadata.title} examples`,
      description: `Usage snippets from the ${metadata.title} docs, one file per section. Read them; don't add them: they aren't standalone modules. Full page: ${url}`,
      registryDependencies: [
        new URL(`/r/${name}.json`, registry.homepage).href,
      ],
      files: [...sections(body)].map(([section, blocks]) => ({
        path: `examples/${name}/${section}.tsx`,
        type: "registry:example",
        // Load-bearing: an agent reading the file must know it won't compile alone.
        content: `// Snippet from ${url}, not a standalone module.\n\n${blocks.join("\n\n")}\n`,
      })),
    });
  });

await Promise.all(
  examples.map(async (item) => {
    await writeFile(
      path.join(out, `${item.name}.json`),
      `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2)}\n`
    );
  })
);

// The index lists files without their content, as `shadcn build` writes it.
const index = {
  ...registry,
  items: [
    ...registry.items.filter(({ type }) => type !== "registry:example"),
    ...examples.map(({ files = [], ...item }) => ({
      ...item,
      files: files.map(({ path: file, type }) => ({ path: file, type })),
    })),
  ],
};

await writeFile(registryPath, `${JSON.stringify(index, null, 2)}\n`);
