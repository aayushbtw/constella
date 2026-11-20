---
title: Calendar
description: A month grid for picking a day, several days or a range of days.
---

<!-- ::demo name="calendar" -->

```tsx
<Calendar aria-label="Due date" defaultValue="2026-06-18" />
```

## Installation

<!-- ::install name="calendar" -->

## Usage

```tsx
import { Calendar } from "@/components/primitives/calendar";
```

```tsx
<Calendar aria-label="Due date" defaultValue="2026-06-18" />
```

## Composition

```
Calendar
└── CalendarMonths
    ├── CalendarPrevious
    ├── CalendarHeading
    ├── CalendarNext
    └── CalendarGrid
        ├── CalendarWeekdays
        │   └── CalendarWeekday
        └── CalendarWeeks
            └── CalendarDay
```

An empty `Calendar` renders `CalendarMonths`, which renders the parts below it. Write the parts out to change one, such as a `CalendarDay` with a price under its number.

## Mode

Use the `mode` prop to pick one day, several days or a range. Values are ISO date strings, with no time or time zone.

| `mode`               | Value                                    |
| -------------------- | ---------------------------------------- |
| `"single"` (default) | `"2026-06-18"` or `null`                 |
| `"multiple"`         | `["2026-06-10", "2026-06-18"]`, sorted   |
| `"range"`            | `["2026-06-12", "2026-06-18"]` or `null` |

## Range

Set `mode="range"` and `months={2}` to pick a span across two months. The first press picks the start, and the second picks the end. Moving the pointer or focus between them previews the range.

<!-- ::demo name="calendar-range" -->

```tsx
<Calendar
  aria-label="Trip dates"
  defaultValue={["2026-06-12", "2026-06-18"]}
  mode="range"
  months={2}
/>
```

## Min and Max

Use `min` and `max` to stop picking at a date. The arrows stop at their months.

```tsx
<Calendar aria-label="Due date" max="2026-06-18" />
```

## Unavailable

Pass `unavailable` the days that can't be picked, such as booked days. They stay focusable, so a screen reader still reads them.

| Matcher | Blocks |
| --- | --- |
| `"2026-06-10"` | One day |
| `{ from: "2026-06-20", to: "2026-06-23" }` | The days from one date to another |
| `{ weekday: [0, 6] }` | Weekends. `0` is Sunday |
| `{ before: "2026-06-01" }` | Every day before a date |
| `{ after: "2026-06-30" }` | Every day after a date |
| `(date) => boolean` | Every day the function returns `true` for |

```tsx
<Calendar aria-label="Delivery date" unavailable={[{ weekday: [0, 6] }]} />
```

## Today

Pass `today` on a page rendered on the server, so the server and the browser mark the same day. Without it, the calendar reads today in the browser, in `timeZone` if you set one.

```tsx
<Calendar aria-label="Due date" today="2026-06-18" timeZone="UTC" />
```

## API Reference

`Calendar` has `role="group"`. Name it with `aria-label`, so screen readers and agents can find it. Every part takes `sx`, applied last.

### Calendar

Takes every prop of [UI SDK Calendar](https://ui-sdk.dev/docs/components/calendar), plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `showOutsideDays` | `boolean` | `false` | Shows the days of the months before and after at the grid's edges. |
| `children` | `ReactNode` | `<CalendarMonths months={months} />` | The parts to render. |

### CalendarMonths

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `months` | `number` | `1` | How many grids it renders side by side. Match the `months` prop on `Calendar`. |

### CalendarGrid

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `offset` | `number` | `0` | Which of the months shown it is, from `0`. |
| `children` | `ReactNode` | `CalendarWeekdays` and `CalendarWeeks` | The grid's rows, after its caption. |

`CalendarWeekdays` takes a function of the column's index, and `CalendarWeeks` a function of each cell, as on ui-sdk. `CalendarDay` takes `value`, the day's ISO date. For the rest, see [UI SDK Calendar](https://ui-sdk.dev/docs/components/calendar).
