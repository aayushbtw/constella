---
title: Design system
description: Color, typography, layout, and motion tokens used across Constella components.
order: 1
---

## Color

Every color token maps to a step on a [Radix Colors](https://www.radix-ui.com/colors) scale. Components reference semantic role tokens rather than raw scale steps, so colors update automatically when the theme or color mode changes. Each role token combines a family name and a slot name, such as `accentSolid`, `accentOnSolid`, and `dangerSubtle`.

### Surfaces

<!-- ::demo name="color-surfaces" -->

### Text

<!-- ::demo name="color-text" -->

### Border

<!-- ::demo name="color-border" -->

### Fill

Fill tokens are translucent so they maintain consistent contrast over any surface. Use `fillOpaque` when an element must hide what is behind it.

<!-- ::demo name="color-fill" -->

### Accent

<!-- ::demo name="color-accent" -->

### Inverted

<!-- ::demo name="color-inverted" -->

### Status

<!-- ::demo name="color-status" -->

**Keep body text neutral on a status tint.** Use the matching status `Text` token only for the icon or label that conveys the status.

## Typography

Components set font size and font weight while inheriting the font family that `base.css` applies from the theme. The default theme configures `--font-sans` with [Inter](https://rsms.me/inter/) and `--font-mono` with [Geist Mono](https://vercel.com/font). Load those fonts in your app or prepend your own font families to those variables. Every font size token has a paired line height token with the same name, such as `fontSizes.textSm` and `lineHeights.textSm`. [Text](/docs/components/text), [Heading](/docs/components/heading), and [Caption](/docs/components/caption) apply both tokens together.

### Font families

<!-- ::demo name="font-families" -->

### Sizes

Heading sizes range from 1 (largest) to 6 (smallest). Body text sizes step around `base`, which is the default reading size. Form controls and buttons use `sm`.

<!-- ::demo name="font-sizes" -->

### Weights

<!-- ::demo name="font-weights" -->

Numeric values that update in place, such as counts, timers, prices, and table columns, use `fontVariantNumeric: "tabular-nums"` so digits stay aligned.

## Layout

### Space

Spacing follows a 4px grid, with a 2px step for hairline gaps.

| Token  | Value |
| ------ | ----- |
| `xxxs` | 2px   |
| `xxs`  | 4px   |
| `xs`   | 8px   |
| `sm`   | 12px  |
| `md`   | 16px  |
| `lg`   | 24px  |
| `xl`   | 48px  |

### Radius

Use `sm` for controls, `md` for surfaces, and `full` for pills. Nested corners stay concentric when an outer `md` radius wraps an inner `sm` radius with `space.xxs` padding.

<!-- ::demo name="layout-radii" -->

### Size

Controls use fixed heights so adjacent buttons and inputs align on the same row.

<!-- ::demo name="layout-sizes" -->

| Token        | Value | Usage                              |
| ------------ | ----- | ---------------------------------- |
| `controlXxs` | 20px  | Inline controls                    |
| `icon`       | 16px  | Icons beside `sm` text             |
| `iconSm`     | 14px  | Icons beside `xs` text             |
| `iconXs`     | 12px  | Icons beside `xxs` text            |
| `hitArea`    | 40px  | Minimum interactive pointer target |

### Shadow

<!-- ::demo name="shadows" -->

## Motion

Under `media.reducedMotion`, opacity fades remain enabled and positional transitions are disabled. Elements that normally move appear in their final position immediately.

### Easing

The preview below runs each easing curve over `durations.move`. Use the speed control to inspect the curve shape.

<!-- ::demo name="motion-easing" -->

| Token       | Usage                                                 |
| ----------- | ----------------------------------------------------- |
| `out`       | Entrances and press feedback                          |
| `inOut`     | Elements traveling across the viewport                |
| `overshoot` | Small indicators such as switch thumbs and radio dots |
| `layout`    | Surfaces growing or shrinking to fit content          |
| `crossfade` | One state replacing another in place                  |

Hover color transitions use the CSS `ease` keyword. Components do not use `ease-in`.

### Duration

Interface transitions stay at or under 300ms. Spinners are the only exception.

| Token       | Value | Usage                                 |
| ----------- | ----- | ------------------------------------- |
| `hover`     | 150ms | Hover color transitions               |
| `press`     | 160ms | Scale transitions on `:active`        |
| `popover`   | 180ms | Small surfaces opening from a trigger |
| `move`      | 250ms | Traveling indicators and thumbs       |
| `layout`    | 300ms | Surfaces growing or shrinking to fit  |
| `crossfade` | 300ms | Crossfades between states             |
| `spin`      | 1s    | Full rotation of a spinner            |

### Press

Interactive controls scale down on `:active` using `easings.out` over `durations.press`. Smaller targets use a larger scale reduction.

| Token  | Value         | Usage           |
| ------ | ------------- | --------------- |
| `icon` | `scale(0.95)` | Icon buttons    |
| `link` | `scale(0.97)` | Buttons         |
| `row`  | `scale(0.99)` | Full-width rows |
