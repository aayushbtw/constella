import { expect, test } from "vite-plus/test";

import { resolvePin, workspaceSchema } from "./pins.ts";

const workspace = workspaceSchema.parse({
  catalog: { "@ui-sdk/react": "0.1.0-beta.13" },
  catalogs: { react19: { react: "19.3.0" } },
});

test("a plain range comes from package.json", () => {
  expect(resolvePin(workspace, "zod", "^4.6.7")).toEqual({
    range: "^4.6.7",
    source: "package.json",
  });
});

test.each(["catalog:", "catalog:default"])(
  "%s reads the default catalog and names it",
  (range) => {
    expect(resolvePin(workspace, "@ui-sdk/react", range)).toEqual({
      range: "0.1.0-beta.13",
      source: "the default catalog in pnpm-workspace.yaml",
    });
  }
);

test("a named catalog pin reads catalogs.<name> and names it", () => {
  expect(resolvePin(workspace, "react", "catalog:react19")).toEqual({
    range: "19.3.0",
    source: 'catalog "react19" in pnpm-workspace.yaml',
  });
});

test("a catalog that doesn't exist is a readable error, not a throw", () => {
  expect(resolvePin(workspace, "react", "catalog:react18")).toEqual({
    error:
      'package.json has react@catalog:react18, but pnpm-workspace.yaml has no catalog "react18"',
  });
});

test("a catalog that doesn't pin the package is a readable error", () => {
  expect(resolvePin(workspace, "react-dom", "catalog:react19")).toEqual({
    error:
      'package.json has react-dom@catalog:react19, which catalog "react19" in pnpm-workspace.yaml doesn\'t pin',
  });
  expect(resolvePin(workspace, "react", "catalog:")).toEqual({
    error:
      "package.json has react@catalog:, which the default catalog in pnpm-workspace.yaml doesn't pin",
  });
});
