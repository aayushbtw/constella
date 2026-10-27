---
title: Calendar
description: A month grid for picking a day or a range of days.
---

<!-- ::demo name="calendar" -->

```tsx
<Calendar mode="single" onSelect={setDay} selected={day} />
```

## Installation

<!-- ::install name="calendar" -->

## Usage

```tsx
import { Calendar } from "@/components/primitives/calendar";
```

```tsx
<Calendar mode="single" onSelect={setDay} selected={day} />
```

## Mode

Use `mode="single"` for one day, `"multiple"` for several, or `"range"` for a start and an end. Each takes `selected` and `onSelect`.

## Range

Set `mode="range"` and `numberOfMonths={2}` to pick a span across two months. The ends are solid and the days between sit in a band.

<!-- ::demo name="calendar-range" -->

```tsx
<Calendar
  mode="range"
  numberOfMonths={2}
  onSelect={setRange}
  selected={range}
/>
```

## Time Zone

Pass `timeZone` to read days in a zone other than the browser's, such as `"UTC"`. Days are then that zone's, whatever the viewer's clock says.

```tsx
<Calendar mode="single" timeZone="UTC" />
```

## Disabled

Pass `disabled` a matcher, such as `{ after: today }`, to block days. Use `startMonth` and `endMonth` to stop the arrows at a month.

```tsx
<Calendar disabled={{ after: today }} endMonth={today} mode="single" />
```

## API Reference

`Calendar` is [react-day-picker](https://daypicker.dev)'s `DayPicker` in Constella's look, and every `DayPicker` prop passes through. It adds `sx`, applied to the root. `showOutsideDays` defaults to `false`.
