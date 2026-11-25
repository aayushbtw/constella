---
title: Theming
description: Configure colors, radius, density, and surface depth in theme.stylex.ts, or switch themes at runtime with StyleX.
order: 2
---

A Constella theme is defined in `theme.stylex.ts`, a local StyleX variable file in your project. Components reference semantic tokens that resolve to these variables, so changes to `theme.stylex.ts` update every component in both light and dark modes.

## Theme builder

Select a preset theme below, adjust the accent color, border radius, sizing, and depth, and copy the generated `theme.stylex.ts` file. Changes apply live to this page.

<!-- ::demo name="theme-builder" -->

Accent options use named [Radix Colors](https://www.radix-ui.com/colors) scales imported from `@radix-ui/colors`, which is installed with Constella. Each scale includes light and dark steps. Ink is the monochrome accent used in Polaris, where the solid fill uses the neutral ink step. Amber, yellow, lime, mint, and sky pair dark text with their solid fill.

## Themes

Built-in presets configure only color variables (the neutral gray scale and the default accent scale). Radius, sizing, and depth are configured independently.

| Theme     | Grays | Accent | Note                                          |
| --------- | ----- | ------ | --------------------------------------------- |
| `polaris` | Gray  | Ink    | Default preset installed as `theme.stylex.ts` |
| `vega`    | Slate | Indigo | Cool neutral palette with an indigo accent    |
| `antares` | Sand  | Orange | Warm neutral palette with an orange accent    |

Constella installs the `polaris` preset as your default `theme.stylex.ts`.

## Usage

Constella installs `lib/constella/theme.stylex.ts` with the Polaris variables. Replace that file with output from the theme builder or edit its variables directly. No other files need to be modified.

```ts
// lib/constella/theme.stylex.ts
import "@radix-ui/colors/indigo.css";
import "@radix-ui/colors/indigo-dark.css";
import "@radix-ui/colors/indigo-alpha.css";
import "@radix-ui/colors/indigo-dark-alpha.css";
import * as stylex from "@stylexjs/stylex";

export const theme = stylex.defineVars({
  "--accent-9": "var(--indigo-9)",
  // ...
  "--radius": "12px",
});
```

Dark mode is controlled by adding the `.dark` class to `<html>`. Radix dark scales activate under `.dark`, so every theme supports both light and dark modes.

### Multiple themes

To support runtime theme switching, keep your default theme in `theme.stylex.ts` and define each alternate theme with `stylex.createTheme`. Only list the variables that differ from the default, then apply the theme to `<html>`.

```tsx
import * as stylex from "@stylexjs/stylex";
import { theme } from "@/lib/constella/theme.stylex";

const vega = stylex.createTheme(theme, {
  "--accent-9": "var(--indigo-9)",
  // ...
});

<html {...stylex.props(vega)} lang="en">
```

**Apply themes to `<html>`, not to a subtree.** Toasts render where `<Toaster />` is mounted near the document root, so a theme applied to a nested subtree will not reach them.

## Variables

This section lists all CSS variables defined in `theme.stylex.ts`. Variables use literal names so `base.css` can reference them directly.

### Scales

Scale variables include `--neutral-1` through `--neutral-12`, `--neutral-a1` through `--neutral-a12`, `--accent-1` through `--accent-12`, `--accent-a1` through `--accent-a12`, and `--accent-contrast` for text on accent step 9. Each variable maps to a named Radix scale step. Import the four CSS files for any Radix scale you reference at the top of `theme.stylex.ts`.

### Roles

Role variables map semantic component roles to scale steps. Updating a role variable changes only that role in both light and dark modes.

| Variable | Default | Usage |
| --- | --- | --- |
| `--background` | `--neutral-1` | Page background |
| `--sidebar` | `--neutral-2` | Sidebar surface, one step off the page background |
| `--text-primary` | `--neutral-12` | Primary content text |
| `--text-secondary` | `--neutral-11` | Supporting text |
| `--text-muted` | Halfway from `--neutral-10` to `-11` | Metadata, placeholders, and counts |
| `--fill-subtle`, `--fill`, `--fill-strong` | `--neutral-a2`, `-a3`, `-a4` | Hover, selected row or nav item, and pressed states |
| `--fill-opaque` | `--neutral-3` | Opaque fills for avatars, tracks, and user messages |
| `--border-subtle`, `--border`, `--border-strong` | `--neutral-4`, `-6`, `-9` | Dividers and composer rings, control borders, and empty checkbox edges |
| `--accent-solid` | `--neutral-12` | Primary buttons and slider fills |
| `--accent-on-solid` | `--neutral-1` | Text and icons on solid accent fills |
| `--inverted-solid`, `--inverted-on-solid` | `--neutral-12`, `--neutral-1` | Inverted surfaces such as tooltips |
| `--focus-ring` | `--neutral-8` | Focus outline |
| `--selection` | `--neutral-a5` | Selected text highlight |
| `--overlay` | `--black-a5` | Backdrop behind dialogs |

`base.css` computes muted text and raised surface values from the scale variables because their formulas differ between light and dark modes.

### Shape and density

| Variable | Default | Usage |
| --- | --- | --- |
| `--radius` | 8px | Base control radius from which menus and cards derive their radii |
| `--size-control-xxs` through `-lg` | 20px through 36px | Control heights |
| `--space-xs` through `--space-xl` | 8px through 48px | Layout spacing (`xxxs` and `xxs` remain fixed) |

Other corner tokens step from `--radius` by `min(--radius, 4px)` so nested corners remain concentric and all corners reach `0` together:

| Corner | Value            | At 8px |
| ------ | ---------------- | ------ |
| `xs`   | radius - step    | 4px    |
| `sm`   | radius           | 8px    |
| `md`   | radius + step    | 12px   |
| `lg`   | radius + 2 steps | 16px   |
| `xl`   | radius + 3 steps | 20px   |

### Depth

Depth variables control drop shadows under controls and in-page surfaces. Floating surfaces (popovers, menus, select lists, dialogs, sheets, toasts, tooltips, and data table action bars) keep their shadows in both `raised` and `flat` modes.

| Variable | Raised | Applied to |
| --- | --- | --- |
| `--shadow-default` | Soft drop shadow | Fields, checkboxes, radios, select triggers, outline toggles, and switch thumbs |
| `--shadow-default-hover`, `--shadow-default-pressed` | Step up, step down | Hovered and pressed select triggers and outline toggles |
| `--shadow-default-ring` | Gray drop shadow | Slider thumbs under their ring |
| `--shadow-default-ring-subtle` | Near and far drop shadows | Composer under its ring |

Polaris uses `raised` by default. To switch to `flat`, set each shadow variable to `0 0 transparent` so in-page controls rely on borders, rings, and fills:

```ts
"--shadow-default": "0 0 transparent",
"--shadow-default-hover": "0 0 transparent",
"--shadow-default-pressed": "0 0 transparent",
"--shadow-default-ring": "0 0 transparent",
"--shadow-default-ring-subtle": "0 0 transparent",
```

Do not use `none`, because components combine these variables with other shadow layers where `none` is invalid CSS. Edge rings, invalid halos, and focus rings remain active in both depth modes.

## Status colors

Danger, success, warning, and info always map to red, green, amber, and blue across all themes so status meanings stay consistent. **Avoid choosing an accent color close to a status hue.** A red primary button can be mistaken for a destructive action.
