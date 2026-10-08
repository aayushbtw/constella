---
title: Theming
description: Bring your brand color, gray, corners and density. A theme is CSS variables, so there's nothing to install.
order: 2
---

A theme is a block of CSS variables scoped to a `data-theme` value on `<html>`. Components read only tokens, and tokens read these variables, so every component follows the theme in light and dark.

## Theme builder

Pick an accent and the rest, then copy the CSS. The page wears the theme while you build it.

<!-- ::demo name="theme-builder" -->

The accent becomes two 12-step scales, light and dark, matched to the nearest [Radix Colors](https://www.radix-ui.com/colors) scales. A near-gray accent stays monochrome: the solid fill is the gray ink, as in the default theme.

## Usage

Paste the CSS into your global stylesheet, then set the theme on `<html>`.

```tsx
<html data-theme="brand" lang="en">
  <body>{children}</body>
</html>
```

Ship as many themes as you like and switch between them by changing the attribute. Dark mode is still the `.dark` class, so every theme works in both.

```ts
document.documentElement.dataset.theme = "midnight";
```

**Set the theme on `<html>`, not a subtree.** Popups render in a portal at the end of `<body>`, so they only see a theme set on the root.

## Variables

A theme sets these. Edit any of them by hand; the builder only writes them for you.

| Variable | Default | For |
| --- | --- | --- |
| `--accent-1` … `--accent-12` | none | The accent scale; `-a1` … `-a12` alpha |
| `--accent-contrast` | none | Text on step 9 |
| `--accent-solid` | `--gray-12` | Primary buttons, checked controls |
| `--on-accent` | `--gray-1` | Text and icons on `--accent-solid` |
| `--focus-ring` | `--gray-a8` | The focus outline |
| `--gray-1` … `--gray-12` | Radix gray | Text, fills and edges; `-a1` … `-a12` |
| `--radius-xs`, `-chip`, `-sm`, `-md` | 4, 6, 8, 12px | Corners |
| `--size-control-xxs` … `-lg` | 20 … 36px | Control heights |
| `--space-xs` … `--space-xl` | 8 … 48px | Spacing; `xxxs` and `xxs` stay fixed |

Keep nested corners concentric when setting radii by hand: `md` is `sm` plus 4px, and `xs` is `sm` minus 4px.

## Status colors

Danger, success, warning and info stay red, green, amber and blue in every theme, so they mean the same thing in any product. **Avoid an accent close to a status hue.** A red primary button reads as destructive.
