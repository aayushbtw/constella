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

Use the `size` prop: `base` for reading, `sm` for text inside controls and dense UI, `lg` for chat and long-form answers.

<!-- ::demo name="text-size" -->

```tsx
<Text size="lg">The quick brown fox jumps over the lazy dog.</Text>
<Text>The quick brown fox jumps over the lazy dog.</Text>
<Text size="sm">The quick brown fox jumps over the lazy dog.</Text>
```

## Weight

Use the `weight` prop. [Heading](/docs/components/heading) and [Caption](/docs/components/caption) take it too.

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
| `size` | `"sm" \| "base" \| "lg"` | `"base"` |
| `weight` | `"regular" \| "semimedium" \| "medium" \| "semibold"` | `"regular"` |
| `color` | `"primary" \| "secondary" \| "muted" \| "danger" \| "success" \| "warning" \| "info"` | inherited |
| `render` | `ReactElement \| function` | `<p>` |
| `sx` | `StyleXStyles`, applied last | - |
