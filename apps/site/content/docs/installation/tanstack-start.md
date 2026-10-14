---
title: TanStack Start
description: Install Constella in a TanStack Start app.
---

## With an agent

Paste this into your coding agent. It adapts the steps below to your project.

```text
Set up the components from https://constella.aayush.cv in this TanStack Start app, following https://constella.aayush.cv/docs/installation/tanstack-start. They install with the shadcn CLI and are styled with StyleX, not Tailwind.

1. In components.json, add "registries": { "@constella": "https://constella.aayush.cv/r/{name}.json" }. If there's no components.json, write one by hand with "style": "base-nova", "tsx": true, "rsc": false, empty "tailwind" fields ("config": "", "css": "", "baseColor": "neutral") and aliases for components, ui, lib, utils and hooks under "@/". Don't run shadcn init. It sets up Tailwind.
2. Run: npx shadcn@latest add @constella/button
3. Install @stylexjs/unplugin and add @stylexjs/unplugin/vite to vite.config.ts before the other plugins, with aliases matching tsconfig.json's "@/*" path, cssInjectionTarget matching the stylesheet the root route links, and enableDebugDataProp: false.
4. In dev, render <link href="/virtual:stylex.css" rel="stylesheet" /> in the root route's <head> and import("virtual:stylex:runtime") in an effect.
5. Dark mode is a `dark` class on <html>. Reuse the project's existing theme toggle if it has one.
6. Load Inter and Geist Mono (@fontsource-variable/inter, @fontsource-variable/geist-mono), or put the project's fonts first in --font-sans and --font-mono in theme.stylex.ts.

Then render a Button and check it's styled in dev and in a production build.
```

## Add the registry

Add `registries` to your `components.json`. If you don't have one, create it:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "tsx": true,
  "rsc": false,
  "tailwind": { "config": "", "css": "", "baseColor": "neutral" },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  },
  "registries": {
    "@constella": "https://constella.aayush.cv/r/{name}.json"
  }
}
```

**Don't run `shadcn init`.** It sets up Tailwind, which these components don't use.

## Add components

The first one also adds StyleX and `src/lib`: the tokens, the CSS they read, and `theme.stylex.ts`, the file you edit to [theme](/docs/theming) Constella.

<!-- ::install name="button" -->

Set the `@/*` alias in `tsconfig.json`. StyleX's config below needs the same one, since StyleX and TypeScript resolve imports separately.

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Configure Vite

Install StyleX's Vite plugin:

```bash
npm install -D @stylexjs/unplugin
```

Add it before the other plugins in `vite.config.ts`:

```ts
import path from "node:path";

import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex({
      aliases: { "@/*": [path.join(import.meta.dirname, "src/*")] },
      // The stylesheet your root route links; StyleX appends to it in builds.
      cssInjectionTarget: (file) => path.basename(file).startsWith("styles-"),
      enableDebugDataProp: false,
    }),
    // Keep the rest of your plugins and options.
    tanstackStart(),
    viteReact(),
  ],
});
```

**Set `cssInjectionTarget`.** Without it, StyleX can pick a different CSS chunk in the client and server builds, and the stylesheet the HTML links has no styles. It matches `src/styles.css`, which builds to `styles-[hash].css`; change the prefix if yours has another name. `enableDebugDataProp: false` stops a hydration mismatch on `data-style-src`.

## Load styles in dev

In dev, StyleX serves its CSS separately. Load it in `src/routes/__root.tsx`:

```tsx
import { useEffect } from "react";

function loadStyleXRuntime() {
  if (import.meta.env.DEV) {
    void import("virtual:stylex:runtime");
  }
}

function DevStyleX() {
  useEffect(loadStyleXRuntime, []);

  return import.meta.env.DEV ? (
    <link href="/virtual:stylex.css" rel="stylesheet" />
  ) : null;
}
```

Then render `<DevStyleX />` in the root's `<head>`, after `<HeadContent />`.

## Import components

```tsx
import { Button } from "@/components/ui/button";

export function App() {
  return <Button>Get started</Button>;
}
```

Then set up [fonts](/docs/installation#fonts), [dark mode](/docs/installation#dark-mode) and, if you need it, [RTL](/docs/installation#rtl).

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Unstyled in dev, styled in a build | StyleX's dev CSS isn't loaded | Render `<DevStyleX />` in the root's `<head>` |
| Styled in dev, unstyled in a build | StyleX appended to a CSS chunk the HTML doesn't link | Point `cssInjectionTarget` at your root stylesheet |
