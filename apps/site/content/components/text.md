---
title: Text
description: Body copy on the type scale.
section: Typography
---

<!-- ::demo name="text" -->

```tsx
<Text weight="medium">Weekly digest</Text>
<Text color="secondary">
  A summary of what changed in your projects, sent every Monday.
</Text>
```

## Installation

<!-- ::install name="text" -->

## Usage

```tsx
import { Text } from "@/components/typography/text";
```

```tsx
<Text>Manage your account and billing.</Text>
```

## Size

Use the `size` prop: `base` for reading and chat, `sm` for text inside controls and dense UI, `lg` for a side panel's title. Without it, text takes its parent's size, so it fits the part it sits in.

<!-- ::demo name="text-size" -->

```tsx
<Text size="lg">The quick brown fox jumps over the lazy dog.</Text>
<Text size="base">The quick brown fox jumps over the lazy dog.</Text>
<Text size="sm">The quick brown fox jumps over the lazy dog.</Text>
```

## Weight

Use the `weight` prop. Without it, text takes its parent's weight. [Heading](/docs/components/heading) and [Caption](/docs/components/caption) take it too.

<!-- ::demo name="text-weight" -->

```tsx
<Text weight="regular">Regular</Text>
<Text weight="semimedium">Semimedium</Text>
<Text weight="medium">Medium</Text>
<Text weight="semibold">Semibold</Text>
```

## Color

Use the `color` prop. Without it, text inherits its parent's color.

<!-- ::demo name="text-color" -->

```tsx
<Text color="secondary">secondary</Text>
<Text color="danger">danger</Text>
```

## Truncate

Use the `truncate` prop to keep one line ending in an ellipsis (`true`), or to clamp to `2` or `3` lines.

**Pass `truncate` inside a `nowrap` parent like a table cell.** Text wraps `pretty`, which turns wrapping back on there.

<!-- ::demo name="text-truncate" -->

```tsx
<Text truncate weight="medium">
  Quarterly planning notes for the design systems team
</Text>
<Text color="secondary" truncate={2}>
  Review the token audit, agree on the motion scale and pick the next three
  components to build, then share the plan with every team.
</Text>
```

## Tabular Nums

Use the `tabularNums` prop for numbers that change in place or line up in a column, so every digit takes the same width.

<!-- ::demo name="text-tabular-nums" -->

```tsx
<Text>$1,111.11</Text>
<Text tabularNums>$1,111.11</Text>
```

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "base" \| "lg"` | inherited |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | inherited |
| `color` | `"primary" \| "secondary" \| "muted" \| "danger" \| "success" \| "warning" \| "info"` | inherited |
| `truncate` | `boolean \| 1 \| 2 \| 3` | `false` |
| `tabularNums` | `boolean` | `false` |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `StyleXStyles`, applied last | - |
