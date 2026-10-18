---
title: Shimmer
description: A slow sweep of light across text still being worked on.
section: AI
---

<!-- ::demo name="shimmer" -->

```tsx
<Text color="muted">
  <Shimmer>Thinking…</Shimmer>
</Text>
```

## Installation

<!-- ::install name="shimmer" -->

## Usage

```tsx
import { Shimmer } from "@/components/ai/shimmer";
import { Text } from "@/components/typography/text";
```

```tsx
<Text color="muted">
  <Shimmer>Generating response…</Shimmer>
</Text>
```

It takes the font and color of the text around it. **On primary text the sweep doesn't show**, since the sweep is primary text. Put it in secondary or muted text, such as a [Text](/docs/components/text) with `color="muted"`. Under reduced motion the text stays still. Once the work is done, render the text without it.

## Marker

Put it in a [Marker](/docs/components/marker) for a status line in a conversation.

```tsx
<Marker render={<output />}>
  <MarkerContent>
    <Shimmer>Searching the web…</Shimmer>
  </MarkerContent>
</Marker>
```

## API Reference

### Shimmer

Takes every prop of `<span>`, plus:

| Prop | Type |
| --- | --- |
| `render` | `ReactElement \| function`; see [Base UI useRender](https://base-ui.com/react/utils/use-render) |
| `sx` | `StyleXStyles`, applied last |
