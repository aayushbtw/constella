---
title: Theming
description: Bring your brand color, gray, corners and density. A theme is CSS variables, so there's nothing to install.
order: 2
---

A theme is a block of CSS variables scoped to a `data-theme` value on `<html>`. Components read only tokens, and tokens read these variables, so every component follows the theme in light and dark.

## Theme builder

Pick a theme, then change its accent, radius and sizing if you like, and copy the CSS. The page wears the theme while you build it.

<!-- ::demo name="theme-builder" -->

The accent becomes two 12-step scales, light and dark, matched to the nearest [Radix Colors](https://www.radix-ui.com/colors) scales. A near-gray accent stays monochrome: the solid fill is the gray ink, as in Polaris.

## Themes

Themes are named after stars, each hinting at its color. A theme sets colors only: its grays and a default accent. Radius and sizing are yours to pick on top.

| Theme     | Grays | Accent | Note                                   |
| --------- | ----- | ------ | -------------------------------------- |
| `polaris` | Gray  | Ink    | The default; ships in `base.css`       |
| `vega`    | Slate | Indigo | A blue-white star                      |
| `antares` | Sand  | Orange | A red supergiant, kept clear of danger |

Polaris needs no CSS. Set `data-theme="polaris"` or nothing at all; the builder writes only what you change from it.

## Usage

Paste the CSS into your global stylesheet, then set the theme on `<html>`.

```tsx
<html data-theme="vega" lang="en">
  <body>{children}</body>
</html>
```

Ship as many themes as you like and switch between them by changing the attribute. Dark mode is still the `.dark` class, so every theme works in both.

```ts
document.documentElement.dataset.theme = "antares";
```

**Set the theme on `<html>`, not a subtree.** Popups render in a portal at the end of `<body>`, so they only see a theme set on the root.

## Variables

### Roles

Every color a component uses is a role, and every role is a variable valued by a scale step. Override one by hand to change just that role, in light and dark.

```css
:root[data-theme="vega"] {
  --edge: var(--gray-a7);
}
```

| Variable | Default | For |
| --- | --- | --- |
| `--background` | `--gray-1` | The page |
| `--raised` | white; `--gray-2` in dark | Popovers, menus, dialogs, toasts |
| `--text-primary` | `--gray-12` | Content |
| `--text-secondary` | `--gray-11` | Supporting copy |
| `--text-muted` | `--gray-10` | Labels and hints |
| `--fill-subtle`, `--fill`, `--fill-strong` | `--gray-a2`, `-a3`, `-a4` | Hover, selected, pressed |
| `--fill-opaque` | `--gray-3` | A fill nothing shows through |
| `--edge-subtle`, `--edge` | `--gray-a4`, `-a6` | Dividers, control borders |
| `--accent-solid` | `--gray-12` | Primary buttons, checked controls |
| `--on-accent` | `--gray-1` | Text and icons on the accent |
| `--inverted`, `--on-inverted` | `--gray-12`, `--gray-1` | Tooltips |
| `--focus-ring` | `--gray-a8` | The focus outline |
| `--selection` | `--gray-a5` | Selected text |
| `--overlay` | `--black-a5` | Behind a dialog |

### Scales

The builder writes these, and the roles read them: `--gray-1` … `--gray-12` and `--gray-a1` … `--gray-a12`, the same for `--accent`, and `--accent-contrast` for text on accent step 9.

### Shape and density

| Variable | Default | For |
| --- | --- | --- |
| `--radius` | 8px | Controls; menus and cards derive theirs from it |
| `--size-control-xxs` … `-lg` | 20 … 36px | Control heights |
| `--space-xs` … `--space-xl` | 8 … 48px | Spacing; `xxxs` and `xxs` stay fixed |

The other corners follow `--radius` so nested ones stay concentric: `md` is `--radius` plus up to 4px, `xs` is 4px less, and all reach 0 together.

## Status colors

Danger, success, warning and info stay red, green, amber and blue in every theme, so they mean the same thing in any product. **Avoid an accent close to a status hue.** A red primary button reads as destructive.
