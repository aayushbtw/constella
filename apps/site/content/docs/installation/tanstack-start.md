---
title: TanStack Start
description: Install Constella in a TanStack Start app.
---

## With an agent

Paste this prompt into your coding agent to adapt the installation steps to your project.

```text
Set up Constella components from https://constella.aayush.cv in this TanStack Start app by following https://constella.aayush.cv/docs/installation/tanstack-start. The components install through the shadcn CLI and use StyleX instead of Tailwind.

1. In components.json, add "registries": { "@constella": "https://constella.aayush.cv/r/{name}.json" }. If components.json does not exist, create it with "style": "base-nova", "tsx": true, "rsc": false, empty "tailwind" fields ("config": "", "css": "", "baseColor": "neutral"), and aliases for components, ui, lib, utils, and hooks under "@/". Do not run shadcn init because it configures Tailwind.
2. Run npx shadcn@latest add @constella/button.
3. Install @stylexjs/unplugin as a dev dependency and add @stylexjs/unplugin/vite before the other plugins in vite.config.ts. Configure aliases matching the "@/*" path in tsconfig.json, set cssInjectionTarget to match the stylesheet linked by the root route, and set enableDebugDataProp to false.
4. In development, render <link href="/virtual:stylex.css" rel="stylesheet" /> in the root route <head> and call import("virtual:stylex:runtime") inside a useEffect hook.
5. At the top of the stylesheet linked by the root route (src/styles.css), add @layer ui-sdk; followed by @import "./lib/constella/base.css";.
6. Enable dark mode by toggling the dark class on <html>. Reuse the existing theme toggle if the project already has one.
7. Load Inter and Geist Mono with @fontsource-variable/inter and @fontsource-variable/geist-mono, or put the project's own fonts first in --font-sans and --font-mono inside theme.stylex.ts.

Render a Button and verify that its styles load in both development and production builds.
```

## Add the registry

Add `registries` to your `components.json` file. If the file does not exist, create it with the following configuration:

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

**Do not run `shadcn init`.** It configures Tailwind, which Constella components do not use.

## Add components

Install your first component with the shadcn CLI. The first installation also adds StyleX and creates `src/lib/constella`, which contains the design tokens, the base CSS file, and `theme.stylex.ts` for [theming](/docs/theming) Constella.

<!-- ::install name="button" -->

Configure the `@/*` path alias in `tsconfig.json`. StyleX and TypeScript resolve imports separately, so you will configure the same alias in Vite in the next step.

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Configure Vite

Install the StyleX Vite plugin:

```bash
npm install -D @stylexjs/unplugin
```

Add the plugin before your other plugins in `vite.config.ts`:

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

**Set `cssInjectionTarget` in the StyleX plugin options.** Without it, StyleX can pick different CSS chunks in the client and server builds, leaving the linked stylesheet without styles. The example matches `src/styles.css`, which compiles to `styles-[hash].css`. Change the prefix if your root stylesheet has a different name. Setting `enableDebugDataProp: false` prevents hydration mismatches on `data-style-src`.

## Import the base styles

Constella stores its theme, preflight, and focus ring in `src/lib/constella/base.css`. Declare `@layer ui-sdk;` at the top of `src/styles.css` so runtime component styles stay below your own styles. Import `base.css` immediately after it so the base styles apply at first paint:

```css
@layer ui-sdk;
@import "./lib/constella/base.css";
```

## Load styles in dev

During development, StyleX serves its compiled CSS separately. Add a helper component in `src/routes/__root.tsx` to load the virtual stylesheet and runtime:

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

Render `<DevStyleX />` inside the root route's `<head>` element after `<HeadContent />`.

## Import components

Import a component and render it to verify your setup:

```tsx
import { Button } from "@/components/primitives/button";

export function App() {
  return <Button>Get started</Button>;
}
```

Next, configure [fonts](/docs/installation#fonts), [dark mode](/docs/installation#dark-mode), and [RTL](/docs/installation#rtl) if your app requires it.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Components have no styles in development, but styles work in production builds | The StyleX development stylesheet is not loaded | Render `<DevStyleX />` in the root route's `<head>` |
| Missing colors, missing focus rings, and default browser margins | `base.css` is not imported | Add `@import "./lib/constella/base.css";` at the top of `src/styles.css` |
| Components have styles in development, but have no styles in production builds | StyleX injected CSS into a chunk that the HTML does not link | Point `cssInjectionTarget` in `vite.config.ts` to your root stylesheet |
