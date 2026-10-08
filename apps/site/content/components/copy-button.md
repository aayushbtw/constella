---
title: Copy Button
description: Copies text, and shows a tick for a moment after.
draft: true
---

<!-- ::demo name="copy-button" -->

```tsx
<CopyButton value="pnpm dlx shadcn add card" />
```

## Installation

<!-- ::install name="copy-button" -->

## Usage

```tsx
import { CopyButton } from "@/components/ui/copy-button";
```

```tsx
<CopyButton value={code} />
```

The icon swaps to a tick with a [Swap Icon](/docs/components/swap-icon), holds for 1.5s, and swaps back. Its label says "Copied" meanwhile.

## Variant

`CopyButton` is a [Button](/docs/components/button): pass its `variant` and `size`. It's `ghost` at `icon-sm` by default.

<!-- ::demo name="copy-button-variant" -->

```tsx
<CopyButton value="Hello" variant="outline" />
```

## API Reference

| Part | Adds |
| --- | --- |
| `CopyButton` | `value`: the text to copy; a `Button`'s props but `children` and `onClick` |
