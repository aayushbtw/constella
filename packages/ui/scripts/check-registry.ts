import { glob, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { registrySchema } from "shadcn/schema";
import { parse } from "yaml";
import { z } from "zod";

import { resolvePin, workspaceSchema } from "./pins.ts";

const root = path.join(import.meta.dirname, "..");
const repo = path.join(root, "../..");
// shadcn expects the app to provide React.
const provided = new Set(["react", "react-dom"]);

const registry = registrySchema.parse(
  JSON.parse(await readFile(path.join(root, "registry.json"), "utf-8"))
);

const workspace = workspaceSchema.parse(
  parse(await readFile(path.join(repo, "pnpm-workspace.yaml"), "utf-8"))
);

const manifestSchema = z.object({
  dependencies: z.record(z.string(), z.string()).default({}),
  devDependencies: z.record(z.string(), z.string()).default({}),
  peerDependencies: z.record(z.string(), z.string()).default({}),
  peerDependenciesMeta: z
    .record(z.string(), z.object({ optional: z.boolean().optional() }))
    .default({}),
});

const readManifest = async (dir: string) =>
  manifestSchema.parse(
    JSON.parse(await readFile(path.join(dir, "package.json"), "utf-8"))
  );

const errors: string[] = [];

const { dependencies } = await readManifest(root);
const pins = new Map(
  Object.entries(dependencies).map(([name, range]) => {
    const pin = resolvePin(workspace, name, range);
    if ("error" in pin) {
      errors.push(pin.error);
    }
    return [name, pin] as const;
  })
);

const requiredPeers = new Map(
  await Promise.all(
    [...pins.keys()].map(async (name) => {
      const { peerDependencies, peerDependenciesMeta } = await readManifest(
        path.join(root, "node_modules", name)
      );
      const peers = Object.keys(peerDependencies).filter(
        (peer) => peerDependenciesMeta[peer]?.optional !== true
      );
      return [name, peers] as const;
    })
  )
);

const owners = new Map<string, string[]>();
for (const { name, files = [] } of registry.items) {
  for (const file of files) {
    owners.set(file.path, [...(owners.get(file.path) ?? []), name]);
  }
}

for await (const file of glob(
  ["package.json", ...workspace.packages.map((dir) => `${dir}/package.json`)],
  { cwd: repo }
)) {
  const manifest = await readManifest(path.join(repo, path.dirname(file)));
  for (const [name, range] of [
    ...Object.entries(manifest.dependencies),
    ...Object.entries(manifest.devDependencies),
  ]) {
    if (
      workspace.catalog[name] !== undefined &&
      !range.startsWith("catalog:")
    ) {
      errors.push(`${file} pins ${name}@${range}; use catalog:`);
    }
  }
}

const sources = await readdir(path.join(root, "src"), { recursive: true });
const shipped = (entry: string) =>
  /\.(?:tsx?|css)$/u.test(entry) && !/\.test\.tsx?$/u.test(entry);
for (const file of sources.filter(shipped)) {
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
      `${item} needs ${missing.join(", ")} but doesn't list it in ${kind}`
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

  const needed = new Set(
    [...packages]
      .flatMap((name) => [name, ...(requiredPeers.get(name) ?? [])])
      .filter((name) => !provided.has(name))
  );

  const declared = new Set<string>();
  for (const dep of item.dependencies ?? []) {
    const at = dep.indexOf("@", 1);
    const name = at === -1 ? dep : dep.slice(0, at);
    const range = at === -1 ? undefined : dep.slice(at + 1);
    const pin = pins.get(name);
    declared.add(name);
    if (pin === undefined) {
      errors.push(`${item.name} lists ${name}, which package.json doesn't`);
    } else if (
      !("error" in pin) &&
      (range === undefined ? /^\d/u.test(pin.range) : range !== pin.range)
    ) {
      errors.push(
        `${item.name} lists ${dep}, but ${pin.source} has ${name}@${pin.range}`
      );
    }
  }

  compare(item.name, "dependencies", declared, needed);
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
