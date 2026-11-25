---
title: Next.js
description: Install Constella in a Next.js app.
---

## With an agent

Paste this prompt into your coding agent to adapt the installation steps to your project.

```text
Set up Constella components from https://constella.aayush.cv in this Next.js app by following https://constella.aayush.cv/docs/installation/next. The components install through the shadcn CLI and use StyleX instead of Tailwind.

1. In components.json, add "registries": { "@constella": "https://constella.aayush.cv/r/{name}.json" }. If components.json does not exist, create it with "style": "base-nova", "tsx": true, "rsc": true, empty "tailwind" fields ("config": "", "css": "", "baseColor": "neutral"), and aliases for components, ui, lib, utils, and hooks under "@/". Do not run shadcn init because it configures Tailwind.
2. Run npx shadcn@latest add @constella/button.
3. Install @stylexjs/babel-plugin, @stylexjs/postcss-plugin, and autoprefixer as dev dependencies. Create babel.config.js with the next/babel preset and @stylexjs/babel-plugin using aliases that match the "@/*" path in tsconfig.json. Create postcss.config.js with @stylexjs/postcss-plugin reusing those Babel plugins and an include glob covering the app source files.
4. At the top of app/globals.css (or src/app/globals.css), add @layer ui-sdk; followed by a relative @import of lib/constella/base.css (for example, "../lib/constella/base.css"). End the file with @stylex;.
5. Enable dark mode by toggling the dark class on <html>. Reuse the existing theme toggle (such as next-themes with attribute="class") if the project already has one.
6. Load Inter and Geist Mono with next/font or @fontsource-variable/inter and @fontsource-variable/geist-mono, or put the project's own fonts first in --font-sans and --font-mono inside theme.stylex.ts.

Render a Button and verify that its styles load in both development and production builds.
```

## Add the registry

Add `registries` to your `components.json` file. If the file does not exist, create it with the following configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "tsx": true,
  "rsc": true,
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

Configure the `@/*` path alias in `tsconfig.json`. StyleX and TypeScript resolve imports separately, so you will configure the same alias for StyleX in the next step. These steps assume your app uses a `src` directory. If your project does not use one, remove `src/` from every path in this guide.

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Configure StyleX

Install the StyleX Babel and PostCSS plugins along with Autoprefixer:

```bash
npm install -D @stylexjs/babel-plugin @stylexjs/postcss-plugin autoprefixer
```

Create `babel.config.js` in the project root:

```js
const path = require("path");

module.exports = {
  presets: ["next/babel"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV !== "production",
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        aliases: { "@/*": [path.join(__dirname, "src/*")] },
        unstable_moduleResolution: { type: "commonJS" },
      },
    ],
  ],
};
```

Create `postcss.config.js` in the project root to reuse the Babel plugins:

```js
const babelConfig = require("./babel.config");

module.exports = {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: babelConfig.plugins,
      },
    },
    autoprefixer: {},
  },
};
```

Update `src/app/globals.css`, which your root layout already imports. Declare `@layer ui-sdk;` first so runtime component styles stay below your own styles. Import `base.css` next to load the theme, preflight, and focus ring, and end the file with `@stylex;` so StyleX can output its compiled CSS:

```css
@layer ui-sdk;
@import "../lib/constella/base.css";

/* Your own global styles. */

@stylex;
```

**Use Next.js 16.0.3 or later with Turbopack.** Earlier versions only load `babel.config.js` when using Webpack.

## Import components

Import a component and render it in a page to verify your setup:

```tsx
import { Button } from "@/components/primitives/button";

export default function Page() {
  return <Button>Get started</Button>;
}
```

Next, configure [fonts](/docs/installation#fonts), [dark mode](/docs/installation#dark-mode), and [RTL](/docs/installation#rtl) if your app requires it.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Components have no styles anywhere | The StyleX compiler did not process your component files | Verify that `globals.css` contains `@stylex;` and that `include` in `postcss.config.js` matches your `src` directory |
| Missing colors, missing focus rings, and default browser margins | `base.css` is not imported | Add `@import "../lib/constella/base.css";` at the top of `globals.css` |
