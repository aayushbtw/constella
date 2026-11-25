---
title: Toggle Group
description: A set of toggles where one or several can be on.
---

<!-- ::demo name="toggle-group" -->

```tsx
<ToggleGroup
  aria-label="Text formatting"
  defaultValue={["bold"]}
  multiple
  size="icon"
  variant="outline"
>
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
```

```tsx
<ToggleGroup>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>
```

Without `multiple`, one item is on at a time. Name the group with `aria-label`, like "Text formatting", so screen readers and agents can tell groups apart.

## Composition

```
ToggleGroup
└── ToggleGroupItem
```

## Multiple

Without `multiple`, one item is on at a time, like an alignment. With it, any can be, like text styles.

<!-- ::demo name="toggle-group-multiple" -->

```tsx
<ToggleGroup aria-label="Alignment" defaultValue={["left"]}>…</ToggleGroup>
<ToggleGroup aria-label="Text formatting" defaultValue={["bold", "italic"]} multiple>
  …
</ToggleGroup>
```

## Spacing

Use the `spacing` prop to set the gap. At `0` the items join into one row, as in a [Button Group](/docs/components/button-group).

<!-- ::demo name="toggle-group-spacing" -->

| Spacing | Gap    |
| ------- | ------ |
| `0`     | Joined |
| `1`     | 4px    |
| `2`     | 8px    |

```tsx
<ToggleGroup
  aria-label="Filter"
  defaultValue={["all"]}
  spacing={0}
  variant="outline"
>
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
</ToggleGroup>
```

### With Icon

Put an icon before an item's label, marked `data-icon="inline-start"`, for a segmented view switcher.

<!-- ::demo name="toggle-group-with-icon" -->

```tsx
<ToggleGroupItem value="grid">
  <HugeiconsIcon data-icon="inline-start" icon={GridViewIcon} />
  Grid
</ToggleGroupItem>
```

## Orientation

Use `orientation="vertical"` to stack the items. Arrow keys follow the axis.

<!-- ::demo name="toggle-group-vertical" -->

```tsx
<ToggleGroup
  aria-label="Filter"
  orientation="vertical"
  spacing={0}
  variant="outline"
>
  …
</ToggleGroup>
```

## Size

Use the `size` prop on `ToggleGroup`; every item takes it.

<!-- ::demo name="toggle-group-size" -->

```tsx
<ToggleGroup size="icon-sm">…</ToggleGroup>
```

## Disabled

Add `disabled` to a `ToggleGroupItem` to turn one off, or to `ToggleGroup` for all of them. A disabled item ignores presses, but the arrow keys still reach it.

<!-- ::demo name="toggle-group-disabled" -->

```tsx
<ToggleGroupItem disabled value="archived">
  Archived
</ToggleGroupItem>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ToggleGroup` | `variant` and `size`, passed to every item; `spacing`: `0`, `1` or `2` |

Every part takes `sx`, applied last. For the rest, see [UI SDK Toggle Group](https://ui-sdk.dev/docs/react/components/toggle#group).
