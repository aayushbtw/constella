---
title: Heading
description: A heading whose rank in the outline and size are set apart.
section: Typography
---

<!-- ::demo name="heading" -->

```tsx
<Caption>Billing</Caption>
<Heading level={3} size={4}>
  Upgrade to Pro
</Heading>
<Text color="secondary">
  Unlimited projects, priority support and a 30-day history.
</Text>
```

## Installation

<!-- ::install name="heading" -->

## Usage

```tsx
import { Heading } from "@/components/typography/heading";
```

```tsx
<Heading level={2}>Settings</Heading>
```

## Size

Use the `level` prop for the tag. The size follows it unless you set `size`, so a page can keep its outline and still pick how big each heading looks.

<!-- ::demo name="heading-size" -->

```tsx
<Heading level={3} size={1}>Heading 1</Heading>
<Heading level={3} size={6}>Heading 6</Heading>
```

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` |
| `size` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `level` |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"semibold"` |
| `color` | as [Text](/docs/components/text) | `"primary"` |
| `render` | `ReactElement \| function` | `<h{level}>` |
| `sx` | `Sx`, applied last | - |
