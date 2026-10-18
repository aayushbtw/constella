# Setup and Theming

## Contents

- Install
- Configure StyleX
- Verify
- Theming
- Dark mode, fonts, RTL

---

## Install

Follow the page for the project's framework, not the shadcn default: https://constella.aayush.cv/docs/installation/index.md lists them (Next.js, TanStack Start). Another Vite or Babel setup follows the closest page.

**Never run `shadcn init`.** It sets up Tailwind, which these components don't use. Write `components.json` by hand:

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

Set `"rsc": false` outside a React Server Components framework. Then:

```bash
npx shadcn@latest add @constella/button
```

The first component also adds StyleX, `lib/constella/` (the tokens, the CSS they read, `theme.stylex.ts`) and the component's group folder. Components land under `@/components/<group>/` where `<group>` is `primitives`, `typography`, `ai` or `tanstack`, matching the docs section.

---

## Configure StyleX

StyleX needs a compiler step, and each framework wires it differently. Read the framework page; don't improvise.

| Framework | Compiler | Entry |
| --- | --- | --- |
| Next.js 16.0.3+ (Turbopack) | `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin` | End `globals.css` with `@stylex;` |
| TanStack Start (Vite) | `@stylexjs/unplugin/vite`, first in `plugins` | Set `cssInjectionTarget`; load `virtual:stylex.css` in dev |

- **Keep the `@/*` alias in step.** StyleX and TypeScript resolve imports separately, so `tsconfig.json`'s `paths` and StyleX's `aliases` must both name `@/*`.
- Without a `src` folder, drop `src/` from every path in the config.

---

## Verify

Render a `Button` and check it's styled in dev **and** in a production build.

| Symptom | Likely cause |
| --- | --- |
| Unstyled everywhere | The compiler never ran on the components: `@stylex;` missing, or `include` doesn't cover the source |
| Unstyled in dev, styled in a build | Dev CSS not loaded (TanStack Start: render `<DevStyleX />`) |
| Styled in dev, unstyled in a build | StyleX appended to a CSS chunk the HTML doesn't link: point `cssInjectionTarget` at the root stylesheet |
| `@/lib/constella/...` fails to resolve | The alias is in one config and not the other |

The framework page's Troubleshooting table has the full list.

---

## Theming

A theme is `lib/constella/theme.stylex.ts`: one file of variables you own. Components read only tokens and tokens read these variables, so every component follows the theme, in light and dark.

- Edit the file by hand, or replace it with the output of the theme builder at https://constella.aayush.cv/docs/theming/index.md. Nothing else needs changing.
- **Never edit `tokens.stylex.ts`.** It is the system. Never hardcode a color in a component to match a brand; change the theme.
- Accents are [Radix Colors](https://www.radix-ui.com/colors) scales by name. Import the scale's four CSS files at the top of the theme (`indigo.css`, `indigo-dark.css`, `indigo-alpha.css`, `indigo-dark-alpha.css`) and point `--accent-1` … `--accent-12` and `--accent-a1` … at it.
- Themes set colors only. Radius (`--radius`), control heights (`--size-control-*`) and spacing (`--space-*`) are set on top.
- Avoid an accent close to a status hue: a red primary reads as destructive. Danger, success, warning and info stay red, green, amber and blue in every theme.

**Switching themes at runtime:** keep the default in `theme.stylex.ts` and make each other a `stylex.createTheme(theme, { ... })` listing only what differs, applied to `<html>`.

```tsx
const vega = stylex.createTheme(theme, { "--accent-9": "var(--indigo-9)" });

<html {...stylex.props(vega)} lang="en">
```

**Apply a theme to `<html>`, not a subtree.** Popups render in a portal at the end of `<body>`, so they only see a theme set on the root.

---

## Dark mode, fonts, RTL

- **Dark mode** is a `dark` class on `<html>`. next-themes (`attribute="class"`) and shadcn's theme setup already do this, so reuse the app's existing toggle. Components never branch on the theme.
- **Fonts.** The page is set in `--font-sans` and code in `--font-mono`. The theme names Inter and Geist Mono but doesn't ship them: load them (`@fontsource-variable/inter`, `@fontsource-variable/geist-mono`), or put your own first in `theme.stylex.ts`.
- **RTL.** Set `dir="rtl"` on `<html>` **and** wrap the app in Base UI's `DirectionProvider`, since Base UI places popups and thumbs by its own direction. Add `data-rtl-flip` to icons that point along the line.
