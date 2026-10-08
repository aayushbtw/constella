---
title: Swap Text
description: Cross-fades one label into another in place.
draft: true
---

<!-- ::demo name="swap-text" -->

```tsx
<Button onClick={() => setFollowing(!following)} variant="outline">
  <SwapText>{following ? "Following" : "Follow"}</SwapText>
</Button>
```

## Installation

<!-- ::install name="swap-text" -->

## Usage

```tsx
import { SwapText } from "@/components/ui/swap-text";
```

```tsx
<SwapText>{status}</SwapText>
```

When its text changes, the old copy fades out, blurred, under the new one fading in. The layout takes the new text's width at once.

## API Reference

| Part       | Adds                           |
| ---------- | ------------------------------ |
| `SwapText` | `children`: the text, a string |

`SwapText` takes `sx`, applied last, and renders a `span`.
