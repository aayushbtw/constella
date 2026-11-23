---
title: Swap Icon
description: Cross-fades one icon into another in place.
---

<!-- ::demo name="swap-icon" -->

```tsx
<SwapIcon value={playing ? "pause" : "play"}>
  <SwapIconItem value="play">
    <HugeiconsIcon icon={PlayIcon} />
  </SwapIconItem>
  <SwapIconItem value="pause">
    <HugeiconsIcon icon={PauseIcon} />
  </SwapIconItem>
</SwapIcon>
```

## Installation

<!-- ::install name="swap-icon" -->

## Usage

```tsx
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
```

`SwapIcon` shows the item whose `value` matches its own. Every item stays mounted in one cell, so a swap is a crossfade with a little scale and blur, and a quick change back reverses mid-way.

When a control swaps whole elements, like Send for Stop in [Prompt Input](/docs/components/prompt-input), the new element mounts a new `SwapIcon`. Pass it `from`, the item the old one showed, so the icon still cross-fades.

## Composition

```
SwapIcon
└── SwapIconItem
```

## API Reference

| Part | Adds |
| --- | --- |
| `SwapIcon` | `value`: the item to show; `from`: the item to cross-fade from when it mounts |
| `SwapIconItem` | `value`: its name |

Every part takes `sx`, applied last, and renders a `span`.
