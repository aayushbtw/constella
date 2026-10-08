---
title: Toggle Group
description: A set of toggles where one or several can be on.
draft: true
---

<!-- ::demo name="toggle-group" -->

```tsx
<ToggleGroup defaultValue={["bold"]} multiple size="icon" variant="outline">
  <ToggleGroupItem aria-label="Toggle bold" value="bold">
    <HugeiconsIcon icon={TextBoldIcon} />
  </ToggleGroupItem>
  <ToggleGroupItem aria-label="Toggle italic" value="italic">
    <HugeiconsIcon icon={TextItalicIcon} />
  </ToggleGroupItem>
</ToggleGroup>
```

## Installation

<!-- ::install name="toggle-group" -->

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
```

```tsx
<ToggleGroup>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>
```

Without `multiple`, one item is on at a time.

## Composition

```
ToggleGroup
└── ToggleGroupItem
```

## Spacing

Use the `spacing` prop to set the gap. At `0` the items join into one segmented control, as in a [Button Group](/docs/components/button-group).

<!-- ::demo name="toggle-group-spacing" -->

| Spacing | Gap    |
| ------- | ------ |
| `0`     | Joined |
| `1`     | 4px    |
| `2`     | 8px    |

```tsx
<ToggleGroup defaultValue={["all"]} spacing={0} variant="outline">
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
</ToggleGroup>
```

## Size

Use the `size` prop on `ToggleGroup`; every item takes it.

<!-- ::demo name="toggle-group-size" -->

```tsx
<ToggleGroup size="icon-sm">…</ToggleGroup>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ToggleGroup` | `variant` and `size`, passed to every item; `spacing`: `0`, `1` or `2` |

Every part takes `sx`, applied last. For the rest, see [Base UI Toggle Group](https://base-ui.com/react/components/toggle-group).
