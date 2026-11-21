import { z } from "zod";

const versions = z.record(z.string(), z.string());

const workspaceSchema = z.object({
  packages: z.array(z.string()).default([]),
  catalog: versions.default({}),
  catalogs: z.record(z.string(), versions).default({}),
});
type Workspace = z.infer<typeof workspaceSchema>;

type Pin = { range: string; source: string } | { error: string };

const catalogPrefix = "catalog:";

function resolvePin(workspace: Workspace, name: string, range: string): Pin {
  if (!range.startsWith(catalogPrefix)) {
    return { range, source: "package.json" };
  }
  const catalog = range.slice(catalogPrefix.length) || "default";
  const isDefault = catalog === "default";
  const source = isDefault
    ? "the default catalog in pnpm-workspace.yaml"
    : `catalog "${catalog}" in pnpm-workspace.yaml`;
  const pins = isDefault
    ? { ...workspace.catalogs.default, ...workspace.catalog }
    : workspace.catalogs[catalog];
  if (pins === undefined) {
    return {
      error: `package.json has ${name}@${range}, but pnpm-workspace.yaml has no catalog "${catalog}"`,
    };
  }
  const pinned = pins[name];
  if (pinned === undefined) {
    return {
      error: `package.json has ${name}@${range}, which ${source} doesn't pin`,
    };
  }
  return { range: pinned, source };
}

export { resolvePin, workspaceSchema };
export type { Pin, Workspace };
