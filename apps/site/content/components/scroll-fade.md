---
title: Scroll Fade
description: Fades a scroller's edges while there's more content past them.
---

<!-- ::demo name="scroll-fade" -->

```tsx
<ScrollArea viewportSx={scrollFade.y}>{tags}</ScrollArea>
```

## Installation

<!-- ::install name="scroll-fade" -->

## Usage

```tsx
import { scrollFade } from "@/lib/scroll-fade";
```

```tsx
<div {...stylex.props(styles.list, scrollFade.y)}>{items}</div>
```

Pass it to the element that scrolls. An edge fades in as content scrolls past it and is gone at either end, so a list at rest is never dimmed. Browsers without scroll-driven animations fade both edges all the time.

| Style | Fades |
| --- | --- |
| `scrollFade.y` | The top and bottom edges |
| `scrollFade.x` | The start and end edges |
| `scrollFade.source` + `scrollFade.xEndAround` | The right edge, drawn by an ancestor of a left-to-right scroller: `source` on the scroller, `xEndAround` on the ancestor, so what the ancestor places beside the scroller stays unmasked |

## Scroll Area

Pass it to a [Scroll Area](/docs/components/scroll-area)'s `viewportSx`, since its viewport is what scrolls.

<!-- ::demo name="scroll-fade-horizontal" -->

```tsx
<ScrollArea viewportSx={scrollFade.x}>
  {tiles}
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

## Message Scroller

Pass it to a [Message Scroller](/docs/components/message-scroller)'s `MessageScrollerViewport` to fade a conversation under its header and above the composer.

```tsx
<MessageScrollerViewport sx={scrollFade.y}>{messages}</MessageScrollerViewport>
```

## API Reference

| Export | Is |
| --- | --- |
| `scrollFade` | StyleX styles, `x` and `y`, for the `sx` of the element that scrolls |
