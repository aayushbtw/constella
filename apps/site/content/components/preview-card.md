---
title: Preview Card
description: Previews what's behind a link while the pointer rests on it.
draft: true
---

<!-- ::demo name="preview-card" -->

```tsx
<PreviewCard>
  <PreviewCardTrigger href="https://nextjs.org">@nextjs</PreviewCardTrigger>
  <PreviewCardContent>
    The React Framework – created and maintained by @vercel.
  </PreviewCardContent>
</PreviewCard>
```

## Installation

<!-- ::install name="preview-card" -->

## Usage

```tsx
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
```

The trigger is a link, so keyboard and touch users reach the same page without the preview. Keep what matters out of the card alone.

```tsx
<PreviewCard>
  <PreviewCardTrigger href="/docs">Docs</PreviewCardTrigger>
  <PreviewCardContent>Guides and references.</PreviewCardContent>
</PreviewCard>
```

## Composition

```
PreviewCard
├── PreviewCardTrigger
└── PreviewCardContent
```

## API Reference

| Part | Adds |
| --- | --- |
| `PreviewCardContent` | Renders the portal, positioner and popup; takes `side`, `align` and their offsets |

`PreviewCardContent` takes `sx`, applied last. shadcn calls this Hover Card. For the rest, see [Base UI Preview Card](https://base-ui.com/react/components/preview-card).
