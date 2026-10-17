---
title: Design system
description: The colors, type, space and motion every component is built from.
order: 1
---

## Color

Every color is a step on a [Radix Colors](https://www.radix-ui.com/colors) scale. Components ask for a role, never a step, so every role flips with the theme. A role is a family and a slot: `accentSolid`, `accentOnSolid`, `dangerSubtle`.

### Surfaces

<!-- ::demo name="color-surfaces" -->

### Text

<!-- ::demo name="color-text" -->

### Border

<!-- ::demo name="color-border" -->

### Fill

Translucent, so they read the same on any surface; `fillOpaque` hides what's under it.

<!-- ::demo name="color-fill" -->

### Accent

<!-- ::demo name="color-accent" -->

### Inverted

<!-- ::demo name="color-inverted" -->

### Status

<!-- ::demo name="color-status" -->

**Keep body text neutral on a status tint.** The `Text` color marks the icon or label that carries the meaning.

## Typography

Components set size and weight and inherit the font family, which `base.css` sets on the page from the theme. The theme names [Inter](https://rsms.me/inter/) for text and [Geist Mono](https://vercel.com/font) for code and figures, in `--font-sans` and `--font-mono`; load them, or put yours first. Every size shares one line height, `lineHeights.row`, so a row of mixed sizes still centers in a control.

### Font Families

<!-- ::demo name="font-families" -->

### Sizes

<!-- ::demo name="font-sizes" -->

### Weights

<!-- ::demo name="font-weights" -->

Anything that changes in place (counts, timers, prices, table columns) sets `fontVariantNumeric: "tabular-nums"`, so digits don't shift.

## Layout

### Space

A 4px grid, with 2px for hairline gaps.

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

`sm` for controls, `md` for surfaces, `full` for pills. Nested corners are concentric: `md` around `sm` at `space.xxs`.

<!-- ::demo name="layout-radii" -->

### Size

Controls take a fixed height, so a button and an input in one row line up.

<!-- ::demo name="layout-sizes" -->

| Token        | Value | For                                |
| ------------ | ----- | ---------------------------------- |
| `controlXxs` | 20px  | Inline controls                    |
| `icon`       | 16px  | Icons beside `sm` text             |
| `iconSm`     | 14px  | Icons beside `xs` text             |
| `iconXs`     | 12px  | Icons beside `xxs` text            |
| `hitArea`    | 40px  | The smallest target a pointer gets |

### Shadow

<!-- ::demo name="shadows" -->

## Motion

Under `media.reducedMotion`, fades stay and movement goes: things that travel land at once.

### Easing

Each curve over `durations.move`. Slow it down to see the shape.

<!-- ::demo name="motion-easing" -->

| Token       | For                                               |
| ----------- | ------------------------------------------------- |
| `out`       | Entrances and presses                             |
| `inOut`     | Things traveling across the screen                |
| `overshoot` | A small mark landing: a switch thumb, a radio dot |
| `layout`    | A surface growing or shrinking to fit             |
| `crossfade` | One state replacing another in place              |

Color changes on hover use the CSS keyword `ease`. Nothing uses `ease-in`.

### Duration

Interface motion stays under 300ms. A spinner is the exception.

| Token       | Value | For                                     |
| ----------- | ----- | --------------------------------------- |
| `hover`     | 150ms | Color changes on hover                  |
| `press`     | 160ms | Scale on `:active`                      |
| `popover`   | 180ms | Small surfaces that open from a trigger |
| `move`      | 250ms | Indicators and thumbs that travel       |
| `layout`    | 300ms | A surface growing or shrinking to fit   |
| `crossfade` | 300ms | Cross-fades between states              |
| `spin`      | 1s    | One turn of a spinner                   |

### Press

Pressables scale down on `:active`, on `easings.out` over `durations.press`. The smaller the target, the bigger the give.

| Token  | Value         | For             |
| ------ | ------------- | --------------- |
| `icon` | `scale(0.95)` | Icon buttons    |
| `link` | `scale(0.97)` | Buttons         |
| `row`  | `scale(0.99)` | Full-width rows |
