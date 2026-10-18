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

Use the `size` prop: `base` for reading, `sm` for text inside controls and dense UI, `lg` for chat and long-form answers. Without it, text takes its parent's size, so it fits the part it sits in.

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

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "base" \| "lg"` | inherited |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | inherited |
| `color` | `"primary" \| "secondary" \| "muted" \| "danger" \| "success" \| "warning" \| "info"` | inherited |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `StyleXStyles`, applied last | - |
