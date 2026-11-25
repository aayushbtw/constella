---
title: Hover Card
description: Previews what's behind a link while the pointer rests on it or keyboard focus stays on it.
---

<!-- ::demo name="hover-card" -->

```tsx
<HoverCard>
  <HoverCardTrigger href="https://acme.com">@acme</HoverCardTrigger>
  <HoverCardContent>
    Tools for teams that ship. Built and run by Acme.
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
} from "@/components/primitives/hover-card";
```

The card opens after a delay when the pointer rests on the trigger or keyboard focus reaches it. A tap follows the link and never opens the card, so keep what matters on the page the link goes to.

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

## Controller

Use `createHoverCardController` for one card that several triggers share, like mentions in a sentence. Pass it to `HoverCard` and to each trigger as `controller`, with the trigger's data as `payload`. `HoverCardContent` takes a function of `{ payload }` as its children. Moving from one trigger to the next, the card glides over and shows the new content at once.

<!-- ::demo name="hover-card-triggers" -->

```tsx
const [mentions] = useState(() => createHoverCardController<Profile>());

<HoverCardTrigger controller={mentions} href={profile.href} payload={profile}>
  {profile.handle}
</HoverCardTrigger>

<HoverCard controller={mentions}>
  <HoverCardContent<Profile>>
    {({ payload }) =>
      payload === undefined ? null : <ProfileCard profile={payload} />
    }
  </HoverCardContent>
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
| `HoverCard` | `delay` (300ms) and `closeDelay` (300ms) default to `durations.hoverCardDelay` and `hoverCardCloseDelay`; `controller` |
| `HoverCardContent` | Renders in place, beside its trigger, in the browser's top layer; takes `side`, `align`, `sideOffset` (`offsets.popover`) and `alignOffset`; children may be a function of `{ payload }` |
| `HoverCardTrigger` | `controller`, and `payload` typed by the controller |
| `createHoverCardController` | A controller shared by `HoverCard` and its triggers |

`HoverCardTrigger` and `HoverCardContent` take `sx`. When another part renders the trigger, like a `Badge`, put `sx` on that part, the part that draws. For the rest, see [UI SDK Hover Card](https://ui-sdk.dev/docs/react/components/hover-card).
