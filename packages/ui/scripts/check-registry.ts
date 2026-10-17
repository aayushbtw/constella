// Fails when an item's imports don't match the dependencies it declares, or a
// file in src belongs to no item, so `shadcn add` never installs a broken item.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { registrySchema } from "shadcn/schema";

const root = path.join(import.meta.dirname, "..");
// shadcn expects the app to provide React.
const provided = new Set(["react", "react-dom"]);

const registry = registrySchema.parse(
  JSON.parse(await readFile(path.join(root, "registry.json"), "utf-8"))
);

const owners = new Map<string, string[]>();
for (const { name, files = [] } of registry.items) {
  for (const file of files) {
    owners.set(file.path, [...(owners.get(file.path) ?? []), name]);
  }
}

const errors: string[] = [];

const sources = await readdir(path.join(root, "src"), { recursive: true });
for (const file of sources.filter((entry) => /\.(?:tsx?|css)$/u.test(entry))) {
  const owned = owners.get(`src/${file}`) ?? [];
  if (owned.length !== 1) {
    errors.push(
      `src/${file} is in ${owned.length ? owned.join(", ") : "no item"}`
    );
  }
}

const ownerOf = (file: string) =>
  ["", ".ts", ".tsx", ".css"]
    .map((ext) => owners.get(`${file}${ext}`)?.[0])
    .find(Boolean);

const packageName = (specifier: string) =>
  specifier
    .split("/")
    .slice(0, specifier.startsWith("@") ? 2 : 1)
    .join("/");

function compare(
  item: string,
  kind: string,
  declared: Set<string>,
  used: Set<string>
) {
  const missing = [...used].filter((name) => !declared.has(name));
  const unused = [...declared].filter((name) => !used.has(name));
  if (missing.length) {
    errors.push(
      `${item} imports ${missing.join(", ")} but doesn't list it in ${kind}`
    );
  }
  if (unused.length) {
    errors.push(
      `${item} lists ${unused.join(", ")} in ${kind} but doesn't import it`
    );
  }
}

const contents = new Map(
  await Promise.all(
    [...owners.keys()].map(
      async (file) =>
        [file, await readFile(path.join(root, file), "utf-8")] as const
    )
  )
);

for (const item of registry.items) {
  const packages = new Set<string>();
  const items = new Set<string>();

  for (const { path: file } of item.files ?? []) {
    for (const match of (contents.get(file) ?? "").matchAll(
      /(?:from|import)\s*\(?\s*["'](?<specifier>[^"']+)["']/gu
    )) {
      const specifier = match.groups?.specifier ?? "";
      let target: string | undefined;
      if (specifier.startsWith("@/")) {
        target = `src/${specifier.slice(2)}`;
      } else if (specifier.startsWith(".")) {
        target = path.join(path.dirname(file), specifier);
      }

      if (target === undefined) {
        packages.add(packageName(specifier));
        continue;
      }
      const owner = ownerOf(target);
      if (owner === undefined) {
        errors.push(`${file} imports ${specifier}, which no item ships`);
      } else if (owner !== item.name) {
        items.add(owner);
      }
    }
  }

  compare(
    item.name,
    "dependencies",
    new Set(item.dependencies),
    new Set([...packages].filter((name) => !provided.has(name)))
  );
  compare(
    item.name,
    "registryDependencies",
    new Set(
      item.registryDependencies?.map((url) =>
        url.startsWith(`${registry.homepage}/r/`)
          ? path.basename(url, ".json")
          : url
      )
    ),
    items
  );
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
