---
title: Scroll Area
description: A scrolling region with a slim scrollbar that shows while it's in use.
draft: true
---

<!-- ::demo name="scroll-area" -->

```tsx
<ScrollArea sx={styles.tags}>
  <div>
    {tags.map((tag) => (
      <div key={tag}>{tag}</div>
    ))}
  </div>
</ScrollArea>
```

## Installation

<!-- ::install name="scroll-area" -->

## Usage

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";
```

Give it a height with `sx`; its content scrolls inside.

```tsx
<ScrollArea sx={styles.box}>{content}</ScrollArea>
```

## Composition

```
ScrollArea
└── ScrollBar
```

## Scroll Bar

`ScrollArea` brings a vertical scrollbar. Add a `ScrollBar` with `orientation="horizontal"` for content that scrolls sideways.

<!-- ::demo name="scroll-area-horizontal" -->

```tsx
<ScrollArea sx={styles.gallery}>
  <div {...stylex.props(styles.row)}>{tiles}</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

Add both for content wider and taller than the area, like a wide table. The corner between them stays clear.

<!-- ::demo name="scroll-area-both" -->

```tsx
<ScrollArea sx={styles.sheet}>
  <table>…</table>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

## API Reference

| Part         | Adds                                                        |
| ------------ | ----------------------------------------------------------- |
| `ScrollArea` | Renders the viewport, a vertical `ScrollBar` and the corner |
| `ScrollBar`  | Shows while the area is hovered or scrolling                |

Every part takes `sx`, applied last. For the rest, see [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area).
