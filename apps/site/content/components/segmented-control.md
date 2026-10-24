---
title: Segmented Control
description: One pick among a few, marked by a pill that slides to it.
---

<!-- ::demo name="segmented-control" -->

```tsx
const [range, setRange] = useState<"day" | "week" | "month">("week");

<SegmentedControl aria-label="Range" onValueChange={setRange} value={range}>
  <SegmentedControlItem value="day">Day</SegmentedControlItem>
  <SegmentedControlItem value="week">Week</SegmentedControlItem>
  <SegmentedControlItem value="month">Month</SegmentedControlItem>
</SegmentedControl>;
```

## Installation

<!-- ::install name="segmented-control" -->

## Usage

```tsx
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/primitives/segmented-control";
```

```tsx
<SegmentedControl onValueChange={setValue} value={value}>
  <SegmentedControlItem value="a">A</SegmentedControlItem>
  <SegmentedControlItem value="b">B</SegmentedControlItem>
</SegmentedControl>
```

It's always controlled, and one item is always on: clicking the picked item keeps it. Use [Tabs](/docs/components/tabs) to switch panels, and a [Toggle Group](/docs/components/toggle-group) when none or several can be on.

## Composition

```
SegmentedControl
└── SegmentedControlItem
```

## Disabled

Add `disabled` to a `SegmentedControlItem` to turn one off, or to `SegmentedControl` for all of them.

<!-- ::demo name="segmented-control-disabled" -->

```tsx
<SegmentedControlItem disabled value="calendar">
  Calendar
</SegmentedControlItem>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SegmentedControl` | `value` and `onValueChange` take one value, not an array, and are required |

Every part takes `sx`, applied last. For the rest, see [Base UI Toggle Group](https://base-ui.com/react/components/toggle-group).
