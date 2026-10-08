---
title: Hover Card
description: Previews what's behind a link while the pointer rests on it.
draft: true
---

<!-- ::demo name="hover-card" -->

```tsx
<HoverCard>
  <HoverCardTrigger href="https://nextjs.org">@nextjs</HoverCardTrigger>
  <HoverCardContent>
    The React Framework – created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>
```

## Installation

<!-- ::install name="hover-card" -->

## Usage

```tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
```

The trigger is a link, so keyboard and touch users reach the same page without the preview. Keep what matters out of the card alone.

```tsx
<HoverCard>
  <HoverCardTrigger href="/docs">Docs</HoverCardTrigger>
  <HoverCardContent>Guides and references.</HoverCardContent>
</HoverCard>
```

## Composition

```
HoverCard
├── HoverCardTrigger
└── HoverCardContent
```

## API Reference

| Part | Adds |
| --- | --- |
| `HoverCardContent` | Renders the portal, positioner and popup; takes `side`, `align` and their offsets |

`HoverCardContent` takes `sx`, applied last. Base UI calls this Preview Card. For the rest, see [Base UI Preview Card](https://base-ui.com/react/components/preview-card).
