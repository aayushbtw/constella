---
title: Installation
description: Add components with the shadcn CLI, then let your bundler compile StyleX.
---

## With an agent

Paste this into your coding agent. It adapts the steps below to your project.

```text
Set up the components from https://constella.aayush.cv in this project. They install with the shadcn CLI and are styled with StyleX, not Tailwind.

1. In components.json, add "registries": { "@constella": "https://constella.aayush.cv/r/{name}.json" }. If there's no components.json, write one by hand with "style": "base-nova", "tsx": true, "rsc": false, empty "tailwind" fields ("config": "", "css": "", "baseColor": "neutral") and aliases for components, ui, lib, utils and hooks under "@/". Don't run shadcn init: it sets up Tailwind.
2. Run: npx shadcn@latest add @constella/button
3. Add StyleX's compiler to the bundler, before the React plugin: @stylexjs/unplugin/vite for Vite, or see https://github.com/facebook/stylex/tree/main/packages/%40stylexjs/unplugin. Pass the project's "@/*" alias as `aliases`, matching tsconfig.json paths.
4. In dev, load /virtual:stylex.css and import("virtual:stylex:runtime") from the HTML shell.
5. Dark mode is a `dark` class on <html>. Reuse the project's existing theme toggle if it has one.
6. Load Inter and Geist Mono (@fontsource-variable/inter, @fontsource-variable/geist-mono), or put the project's fonts first in --font-sans and --font-mono in theme.stylex.ts.

Then render a Button and check it's styled in dev and in a production build.
```

## Manual

### Add the registry

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

### Add components

The first one also brings the tokens, colors and StyleX.

<!-- ::install name="button" -->

### Configure Vite

Add StyleX's plugin before React's, and point `@/*` at your source. For other bundlers, see [StyleX's unplugin](https://github.com/facebook/stylex/tree/main/packages/%40stylexjs/unplugin).

```ts
import path from "node:path";

import stylex from "@stylexjs/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex({
      aliases: { "@/*": [path.join(import.meta.dirname, "src/*")] },
    }),
    react(),
  ],
});
```

**Set the same alias in `tsconfig.json`.** StyleX and TypeScript resolve imports separately, so both need it.

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

In dev, StyleX serves its CSS separately. Load it in `index.html`:

```html
<link rel="stylesheet" href="/virtual:stylex.css" />
<script type="module">
  import("virtual:stylex:runtime");
</script>
```

### Import components

```tsx
import { Button } from "@/components/ui/button";

export function App() {
  return <Button>Get started</Button>;
}
```

### Fonts

Constella sets the page in `--font-sans` and code in `--font-mono`, and components inherit them. The theme names Inter and Geist Mono there but doesn't ship them: load them (for example `@fontsource-variable/inter` and `@fontsource-variable/geist-mono`), or put your own first in `theme.stylex.ts`.

### Dark mode

Add a `dark` class to `<html>`. next-themes and shadcn's theme setup already do this.

### RTL

Set `dir="rtl"` on `<html>` and wrap the app in Base UI's [`DirectionProvider`](https://base-ui.com/react/utils/direction-provider). Add `data-rtl-flip` to an icon that points along the line, like an arrow or a chevron, so it turns with the text.

```tsx
<Button aria-label="Next" size="icon">
  <ArrowRightIcon data-rtl-flip />
</Button>
```
