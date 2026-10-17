---
title: Typography
description: Text, Heading and Caption, set on the type scale.
---

<!-- ::demo name="typography" -->

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

<!-- ::install name="typography" -->

## Usage

```tsx
import { Caption, Heading, Text } from "@/components/ui/typography";
```

```tsx
<Heading level={2}>Settings</Heading>
<Text>Manage your account and billing.</Text>
```

## Composition

Three components that sit side by side, not nested:

```
Heading
Text
Caption
```

## Heading

Use the `level` prop for the tag. The size follows it unless you set `size`, so a page can keep its outline and still pick how big each heading looks.

### Size

<!-- ::demo name="heading-size" -->

```tsx
<Heading level={3} size={1}>Heading 1</Heading>
<Heading level={3} size={6}>Heading 6</Heading>
```

## Text

### Size

Use the `size` prop: `base` for reading, `sm` for text inside controls and dense UI, `lg` for chat and long-form answers.

<!-- ::demo name="text-size" -->

```tsx
<Text size="lg">The quick brown fox jumps over the lazy dog.</Text>
<Text>The quick brown fox jumps over the lazy dog.</Text>
<Text size="sm">The quick brown fox jumps over the lazy dog.</Text>
```

### Weight

Use the `weight` prop. `Text`, `Heading` and `Caption` all take it.

<!-- ::demo name="text-weight" -->

```tsx
<Text weight="regular">Regular</Text>
<Text weight="semimedium">Semimedium</Text>
<Text weight="medium">Medium</Text>
<Text weight="semibold">Semibold</Text>
```

### Color

Use the `color` prop. `Text` and `Caption` both take it.

<!-- ::demo name="text-color" -->

```tsx
<Text color="secondary">secondary</Text>
<Text color="danger">danger</Text>
```

## Caption

For metadata under a title, timestamps and small labels. Muted by default.

<!-- ::demo name="caption" -->

```tsx
<Text weight="medium">Invoice #1042</Text>
<Caption>Paid on March 3 by Alex Smith</Caption>
```

## API Reference

### Text

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "base" \| "lg"` | `"base"` |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"regular"` |
| `color` | `"primary" \| "secondary" \| "muted" \| "danger" \| "success" \| "warning" \| "info"` | inherited |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `StyleXStyles`, applied last | - |

### Heading

| Prop | Type | Default |
| --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` |
| `size` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `level` |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"semibold"` |
| `color` | as `Text` | `"primary"` |
| `render` | `ReactElement \| function` | `<h{level}>` |
| `sx` | `StyleXStyles`, applied last | - |

### Caption

| Prop | Type | Default |
| --- | --- | --- |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"regular"` |
| `color` | as `Text` | `"muted"` |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `StyleXStyles`, applied last | - |
