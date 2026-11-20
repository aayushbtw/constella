---
title: Segmented Control
description: One pick among a few, marked by a pill that slides to it.
---

<!-- ::demo name="segmented-control" -->

```tsx
<SegmentedControl aria-label="Range" defaultValue="week">
  <SegmentedControlItem value="day">Day</SegmentedControlItem>
  <SegmentedControlItem value="week">Week</SegmentedControlItem>
  <SegmentedControlItem value="month">Month</SegmentedControlItem>
</SegmentedControl>
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
<SegmentedControl aria-label="View" defaultValue="a">
  <SegmentedControlItem value="a">A</SegmentedControlItem>
  <SegmentedControlItem value="b">B</SegmentedControlItem>
</SegmentedControl>
```

Name it with `aria-label`, or put it in a [Field](/docs/components/field) whose label names it. Nothing starts picked without `value` or `defaultValue`; once one is, clicking it keeps it. Arrow keys move the pick. Use [Tabs](/docs/components/tabs) to switch panels, and a [Toggle Group](/docs/components/toggle-group) when none or several can be on.

## Composition

```
SegmentedControl
└── SegmentedControlItem
```

## Orientation

Set `orientation="vertical"` to stack the items. Arrow keys on both axes move the pick.

<!-- ::demo name="segmented-control-vertical" -->

```tsx
<SegmentedControl
  aria-label="Vertical alignment"
  defaultValue="middle"
  orientation="vertical"
>
  <SegmentedControlItem value="top">Top</SegmentedControlItem>
  <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
  <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
</SegmentedControl>
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

`SegmentedControl` renders the pill that slides to the picked item. `onValueChange` gets `null` only when a form reset or a controller clears the pick.

Every part takes `sx`, applied last. For the rest, see [UI SDK Segmented Control](https://ui-sdk.dev/docs/components/segmented-control).
