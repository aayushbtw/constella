---
title: Shimmer
description: A slow sweep of light across text still being worked on.
draft: true
---

<!-- ::demo name="shimmer" -->

```tsx
<Shimmer>Thinking…</Shimmer>
```

## Installation

<!-- ::install name="shimmer" -->

## Usage

```tsx
import { Shimmer } from "@/components/ui/shimmer";
```

```tsx
<Shimmer>Generating response…</Shimmer>
```

It sweeps primary text across the text's own color, so set it on muted text. Under reduced motion the text stays still. Once the work is done, render the text without it.

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

| Prop | Type                         |
| ---- | ---------------------------- |
| `sx` | `StyleXStyles`, applied last |
