---
title: Next.js
description: Install Constella in a Next.js app.
---

## With an agent

Paste this into your coding agent. It adapts the steps below to your project.

```text
Set up the components from https://constella.aayush.cv in this Next.js app, following https://constella.aayush.cv/docs/installation/next. They install with the shadcn CLI and are styled with StyleX, not Tailwind.

1. In components.json, add "registries": { "@constella": "https://constella.aayush.cv/r/{name}.json" }. If there's no components.json, write one by hand with "style": "base-nova", "tsx": true, "rsc": true, empty "tailwind" fields ("config": "", "css": "", "baseColor": "neutral") and aliases for components, ui, lib, utils and hooks under "@/". Don't run shadcn init. It sets up Tailwind.
2. Run: npx shadcn@latest add @constella/button
3. Install @stylexjs/babel-plugin, @stylexjs/postcss-plugin and autoprefixer. Add babel.config.js with the next/babel preset and @stylexjs/babel-plugin (aliases matching tsconfig.json's "@/*" path), and postcss.config.js with @stylexjs/postcss-plugin reusing those Babel plugins, its include covering the app's source.
4. End app/globals.css (or src/app/globals.css) with @stylex;
5. Dark mode is a `dark` class on <html>. Reuse the project's existing theme toggle (next-themes with attribute="class") if it has one.
6. Load Inter and Geist Mono (next/font or @fontsource-variable/inter, @fontsource-variable/geist-mono), or put the project's fonts first in --font-sans and --font-mono in theme.stylex.ts.

Then render a Button and check it's styled in dev and in a production build.
```

## Add the registry

Add `registries` to your `components.json`. If you don't have one, create it:

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

**Don't run `shadcn init`.** It sets up Tailwind, which these components don't use.

## Add components

The first one also adds StyleX and `src/lib/constella`: the tokens, the CSS they read, and `theme.stylex.ts`, the file you edit to [theme](/docs/theming) Constella.

<!-- ::install name="button" -->

Set the `@/*` alias in `tsconfig.json`. StyleX's config below needs the same one, since StyleX and TypeScript resolve imports separately. The steps assume a `src` folder; without one, drop `src/` from every path.

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Configure StyleX

Install StyleX's Babel and PostCSS plugins:

```bash
npm install -D @stylexjs/babel-plugin @stylexjs/postcss-plugin autoprefixer
```

Add `babel.config.js` to the project root:

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

Add `postcss.config.js` beside it, reusing the Babel plugins:

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

End `src/app/globals.css` with the directive StyleX replaces with its CSS. The root layout already imports this file.

```css
@stylex;
```

**Use Next.js 16.0.3 or later with Turbopack.** Earlier versions only pick up `babel.config.js` with Webpack.

## Import components

```tsx
import { Button } from "@/components/primitives/button";

export default function Page() {
  return <Button>Get started</Button>;
}
```

Then set up [fonts](/docs/installation#fonts), [dark mode](/docs/installation#dark-mode) and, if you need it, [RTL](/docs/installation#rtl).

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Unstyled everywhere | The compiler never ran on your components | Check `@stylex;` is in `globals.css` and `include` covers `src` |
