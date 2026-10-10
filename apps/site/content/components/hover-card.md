---
title: Hover Card
description: Previews what's behind a link while the pointer rests on it.
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

## Handle

Use `createHoverCardHandle` for one card that several triggers share, like mentions in a sentence. Pass it to `HoverCard` and each trigger as `handle`, with the trigger's data as `payload`. Moving from one trigger to the next, the card glides over and cross-fades to the new content, growing to its height.

<!-- ::demo name="hover-card-triggers" -->

```tsx
const mentions = createHoverCardHandle<Profile>();

<HoverCardTrigger handle={mentions} payload={profile}>
  {profile.handle}
</HoverCardTrigger>

<HoverCard handle={mentions}>
  {({ payload }) => (
    <HoverCardContent>
      <ProfileCard profile={payload} />
    </HoverCardContent>
  )}
</HoverCard>
```

## Side

Use the `side` prop on `HoverCardContent` to place the card. It flips to the other side when there's no room.

<!-- ::demo name="hover-card-side" -->

```tsx
<HoverCardContent side="right">…</HoverCardContent>
```

## API Reference

| Part | Adds |
| --- | --- |
| `HoverCardContent` | Renders the portal, positioner, popup and viewport; takes `side`, `align` and their offsets |
| `HoverCardTrigger` | `delay` (600ms) and `closeDelay` (300ms) default to `durations.hoverCardDelay` and `hoverCardCloseDelay`; `handle`, `payload` |
| `createHoverCardHandle` | A handle shared by `HoverCard` and its triggers |

`HoverCardContent` takes `sx`, applied last. Base UI calls this Preview Card. For the rest, see [Base UI Preview Card](https://base-ui.com/react/components/preview-card).
