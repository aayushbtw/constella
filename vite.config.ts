import ultraciteFmt from "ultracite/oxfmt";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";
import { defineConfig } from "vite-plus";

export default defineConfig({
  defaultPackage: "./apps/site",
  fmt: {
    ...ultraciteFmt,
    ignorePatterns: [
      ...(ultraciteFmt.ignorePatterns ?? []),
      "**/routeTree.gen.ts",
      ".agents/skills/**",
    ],
  },
  lint: {
    extends: [core, react, tanstack, antiSlop],
    ignorePatterns: [...(core.ignorePatterns ?? [])],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      // Hoisting lets a route's `component:` sit above the component it names.
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],
      // Base UI's checkbox is a span with a hidden input, so the label wraps it rather than pointing at it.
      "jsx-a11y/label-has-associated-control": [
        "error",
        { controlComponents: ["Checkbox", "Switch"], depth: 3 },
      ],
      "no-use-before-define": ["error", { functions: false }],
      "react/function-component-definition": [
        "error",
        { namedComponents: "function-declaration" },
      ],
      // `throw redirect(...)` and `throw notFound()` are how TanStack Router exits a loader.
      "typescript/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              name: "Redirect",
              package: "@tanstack/router-core",
            },
            {
              from: "package",
              name: "NotFoundError",
              package: "@tanstack/router-core",
            },
          ],
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
});
