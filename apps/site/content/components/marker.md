---
title: Marker
description: A note in a conversation's flow, like a status, a system line, or a labeled break.
section: AI
---

<!-- ::demo name="marker" -->

```tsx
<Marker>
  <MarkerIcon>
    <InfoIcon />
  </MarkerIcon>
  <MarkerContent>Switched to a faster model for this chat.</MarkerContent>
</Marker>
```

## Installation

<!-- ::install name="marker" -->

## Usage

```tsx
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
```

```tsx
<Marker>
  <MarkerContent>Memory updated.</MarkerContent>
</Marker>
```

Place it between messages in a [Message Scroller](/docs/components/message-scroller).

## Composition

```
Marker
├── MarkerIcon
└── MarkerContent
```

## Variant

Use the `variant` prop to set it off from the thread.

<!-- ::demo name="marker-variants" -->

```tsx
<Marker>
  <MarkerContent>Memory updated.</MarkerContent>
</Marker>
<Marker variant="border">
  <MarkerContent>Context compacted to fit the window.</MarkerContent>
</Marker>
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>
```

| Variant     | Looks like                         |
| ----------- | ---------------------------------- |
| `default`   | A plain note                       |
| `border`    | A note over a hairline             |
| `separator` | A centered label between two rules |

## Link

Use the `render` prop to make it a link or a button.

<!-- ::demo name="marker-link" -->

```tsx
<Marker render={<a href="/chat/plan" />}>
  <MarkerContent>Branched from “Plan the launch”</MarkerContent>
  <MarkerIcon>
    <ArrowUpRightIcon />
  </MarkerIcon>
</Marker>
```

## Spinner

Render it as an `output` while work runs, so a screen reader announces each change, with a [Spinner](/docs/components/spinner) and a [Shimmer](/docs/components/shimmer) on the text.

<!-- ::demo name="marker-status" -->

```tsx
<Marker render={<output />}>
  <Spinner />
  <MarkerContent>
    <Shimmer>Searching the web…</Shimmer>
  </MarkerContent>
</Marker>
```

## API Reference

### Marker

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"default"`, `"border"`, `"separator"` | `"default"` |
| `render` | Base UI [`render`](https://base-ui.com/react/handbook/composition) |  |

`MarkerIcon` is hidden from screen readers. Every part takes `sx`, applied last; `Marker` renders a `div`, the others a `span`.
