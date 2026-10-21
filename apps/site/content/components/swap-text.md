---
title: Swap Text
description: Morphs one label into another in place.
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
import { SwapText } from "@/components/primitives/swap-text";
```

```tsx
<SwapText>{status}</SwapText>
```

When its text changes, it morphs with [Torph](https://torph.lochie.me): letters the two share slide into place, the rest fade out and in, and the width eases to the new text's, so what follows it glides instead of jumping. A number rolls by place value (`9` to `10` rolls the ones and brings in the tens), but only when no letter touches it, so keep a unit outside: `<SwapText>{String(seconds)}</SwapText>s`, not `` `${seconds}s` ``. A line break in the text (`\n`) is a line break; it never wraps on its own. Under reduced motion it changes at once.

## API Reference

| Part | Adds |
| --- | --- |
| `SwapText` | `children`: the text, a string; a [Torph](https://torph.lochie.me) `TextMorph` on `crossfade` timing |

`SwapText` takes `sx`, applied last, and renders a `span`.
