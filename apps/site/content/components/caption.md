---
title: Caption
description: Small text for metadata, timestamps and labels.
section: Typography
---

<!-- ::demo name="caption" -->

```tsx
<Text weight="medium">Invoice #1042</Text>
<Caption>Paid on March 3 by Alex Smith</Caption>
```

## Installation

<!-- ::install name="caption" -->

## Usage

```tsx
import { Caption } from "@/components/typography/caption";
```

```tsx
<Caption>Paid on March 3 by Alex Smith</Caption>
```

## Size

Use the `size` prop. `lg` is the size of a badge or a keycap; `xs` is for a mark too small to read as a line, like a count on an icon.

<!-- ::demo name="caption-size" -->

```tsx
<Caption size="lg">Paid on March 3 by Alex Smith</Caption>
<Caption>Paid on March 3 by Alex Smith</Caption>
<Caption size="sm">Paid on March 3 by Alex Smith</Caption>
<Caption size="xs">Paid on March 3 by Alex Smith</Caption>
```

## Uppercase

Use the `uppercase` prop for a label over a group. It spaces the letters out, since capitals read cramped at their own spacing.

<!-- ::demo name="caption-case" -->

```tsx
<Caption>Billing</Caption>
<Caption uppercase>Billing</Caption>
```

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"xs" \| "sm" \| "base" \| "lg"` | `"base"` |
| `uppercase` | `boolean` | `false` |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"regular"` |
| `color` | as [Text](/docs/components/text) | `"muted"` |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `Sx`, applied last | - |
