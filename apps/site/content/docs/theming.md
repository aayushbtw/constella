---
title: Theming
description: Pick a theme, then bring your accent, corners and density. A theme is one StyleX file you own.
order: 2
---

A theme is `theme.stylex.ts`: one file of variables you own. Components read only tokens, and tokens read these variables, so every component follows the theme in light and dark.

## Theme builder

Pick a theme, then change its accent, radius and sizing if you like, and copy the file. The page wears the theme while you build it.

<!-- ::demo name="theme-builder" -->

Accents are [Radix Colors](https://www.radix-ui.com/colors) scales by name, so they're tuned for light and dark already, and the file imports them from `@radix-ui/colors`, which comes with Constella. Ink is the monochrome accent: the solid fill is the gray ink, as in Polaris. Amber, yellow, lime, mint and sky take dark text on their solid fill.

## Themes

Themes are named after stars, each hinting at its color. A theme sets colors only: its grays and a default accent. Radius and sizing are yours to pick on top.

| Theme     | Grays | Accent | Note                                    |
| --------- | ----- | ------ | --------------------------------------- |
| `polaris` | Gray  | Ink    | The default; ships as `theme.stylex.ts` |
| `vega`    | Slate | Indigo | A blue-white star                       |
| `antares` | Sand  | Orange | A red supergiant, kept clear of danger  |

Polaris is the `theme.stylex.ts` Constella installs.

## Usage

Constella installs `lib/theme.stylex.ts` with Polaris in it. To theme your app, replace it with the builder's file, or edit it by hand: it's yours, and nothing else in the system needs changing.

```ts
// lib/theme.stylex.ts
import "@radix-ui/colors/indigo.css";
import "@radix-ui/colors/indigo-dark.css";
import "@radix-ui/colors/indigo-alpha.css";
import "@radix-ui/colors/indigo-dark-alpha.css";
import * as stylex from "@stylexjs/stylex";

export const theme = stylex.defineVars({
  "--accent-9": "var(--indigo-9)",
  // …
  "--radius": "12px",
});
```

Dark mode is still the `.dark` class on `<html>`: Radix's dark scales switch on it, so every theme works in both.

### More than one theme

To let people switch themes at runtime, keep your default in `theme.stylex.ts` and make each other one a `createTheme` of it, applied to `<html>`. It only lists what differs.

```tsx
import * as stylex from "@stylexjs/stylex";
import { theme } from "@/lib/theme.stylex";

const vega = stylex.createTheme(theme, {
  "--accent-9": "var(--indigo-9)",
  // …
});

<html {...stylex.props(vega)} lang="en">
```

**Apply a theme to `<html>`, not a subtree.** Popups render in a portal at the end of `<body>`, so they only see a theme set on the root.

## Variables

Everything in `theme.stylex.ts`. Variables keep their literal names, so `base.css` can read them.

### Scales

`--neutral-1` … `--neutral-12` and `--neutral-a1` … `--neutral-a12`, the same for `--accent`, and `--accent-contrast` for text on accent step 9. Each step points at a Radix scale by name; import that scale's four files at the top.

### Roles

What components ask for. Each is a scale step, so changing one changes only that role, in light and dark.

| Variable | Default | For |
| --- | --- | --- |
| `--background` | `--neutral-1` | The page |
| `--sidebar` | `--neutral-2` | The sidebar, a step off the page |
| `--text-primary` | `--neutral-12` | Content |
| `--text-secondary` | `--neutral-11` | Supporting copy |
| `--fill-subtle`, `--fill`, `--fill-strong` | `--neutral-a2`, `-a3`, `-a4` | Hover, selected (a row, the current nav item), pressed |
| `--fill-opaque` | `--neutral-3` | A fill nothing shows through: avatars, tracks, user messages |
| `--edge-subtle`, `--edge` | `--neutral-a4`, `-a6` | Dividers, control borders |
| `--accent-solid` | `--neutral-12` | Primary buttons, checked controls |
| `--on-accent` | `--neutral-1` | Text and icons on the accent |
| `--inverted`, `--on-inverted` | `--neutral-12`, `--neutral-1` | Tooltips |
| `--focus-ring` | `--neutral-a8` | The focus outline |
| `--selection` | `--neutral-a5` | Selected text |
| `--overlay` | `--black-a5` | Behind a dialog |

Muted text and raised surfaces differ between light and dark, so `base.css` sets them from the scales.

### Shape and density

| Variable | Default | For |
| --- | --- | --- |
| `--radius` | 8px | Controls; menus and cards derive theirs from it |
| `--size-control-xxs` … `-lg` | 20 … 36px | Control heights |
| `--space-xs` … `--space-xl` | 8 … 48px | Spacing; `xxxs` and `xxs` stay fixed |

The other corners step from `--radius` by `min(--radius, 4px)`, so each nests concentrically in the next and all reach 0 together:

| Corner | Value            | At 8px |
| ------ | ---------------- | ------ |
| `xs`   | radius − step    | 4px    |
| `sm`   | radius           | 8px    |
| `md`   | radius + step    | 12px   |
| `lg`   | radius + 2 steps | 16px   |
| `xl`   | radius + 3 steps | 20px   |

## Status colors

Danger, success, warning and info stay red, green, amber and blue in every theme, so they mean the same thing in any product. **Avoid an accent close to a status hue.** A red primary button reads as destructive.
