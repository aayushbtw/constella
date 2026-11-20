---
title: Date Range Picker
description: A button showing a range of days, opening a two-month calendar and optional presets.
---

<!-- ::demo name="date-range-picker" -->

```tsx
<DateRangePicker max={today} onValueChange={setValue} value={value}>
  <DateRangePickerTrigger aria-label="Billing period" />
  <DateRangePickerContent>
    <DateRangePickerCalendar />
  </DateRangePickerContent>
</DateRangePicker>
```

## Installation

<!-- ::install name="date-range-picker" -->

## Usage

```tsx
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from "@/components/primitives/date-range-picker";
import type { DateRange } from "@/components/primitives/date-range-picker";
```

```tsx
const [value, setValue] = useState<DateRange | null>([
  "2026-06-12",
  "2026-06-18",
]);

<DateRangePicker onValueChange={setValue} value={value}>
  <DateRangePickerTrigger aria-label="Billing period" />
  <DateRangePickerContent>
    <DateRangePickerCalendar />
  </DateRangePickerContent>
</DateRangePicker>;
```

The value is `[start, end]` as ISO date strings, or `null` before a range is picked. The first day picked waits for a second to end the range, and the second closes the picker.

## Composition

```
DateRangePicker
├── DateRangePickerTrigger
└── DateRangePickerContent
    ├── DateRangePickerPresets
    │   └── DateRangePickerPreset
    └── DateRangePickerCalendar
```

## Presets

Put a `DateRangePickerPreset` for each range in `DateRangePickerPresets`, beside the calendar. The preset whose range is the value shows a tick, and pressing one closes the picker. Compute relative ranges with the date helpers in `@ui-sdk/core/date`.

<!-- ::demo name="date-range-picker-presets" -->

```tsx
import { addDays, endOfMonth, startOfMonth } from "@ui-sdk/core/date";

const today = "2026-06-18";
const lastMonth = addDays(startOfMonth(today), -1);

<DateRangePickerContent>
  <DateRangePickerPresets>
    <DateRangePickerPreset value={[addDays(today, -6), today]}>
      Last 7 days
    </DateRangePickerPreset>
    <DateRangePickerPreset value={[addDays(today, -29), today]}>
      Last 30 days
    </DateRangePickerPreset>
    <DateRangePickerPreset value={[startOfMonth(today), today]}>
      This month
    </DateRangePickerPreset>
    <DateRangePickerPreset
      value={[startOfMonth(lastMonth), endOfMonth(lastMonth)]}
    >
      Last month
    </DateRangePickerPreset>
  </DateRangePickerPresets>
  <DateRangePickerCalendar />
</DateRangePickerContent>;
```

## Min and Max

Use `min` and `max` to stop picking at a date. A preset whose range goes past them is disabled. With `max` at today, set `defaultMonth` to the month before, so both months show days that can be picked.

```tsx
<DateRangePicker
  defaultMonth="2026-05"
  max="2026-06-18"
  onValueChange={setValue}
  value={value}
>
  {/* … */}
</DateRangePicker>
```

## Unavailable

Pass `unavailable` the days that can't start or end a range. It takes the same matchers as [Calendar](/docs/components/calendar). Add `allowUnavailable` to let a range run over them.

```tsx
<DateRangePicker
  onValueChange={setValue}
  unavailable={[{ weekday: [0, 6] }]}
  value={value}
>
  {/* … */}
</DateRangePicker>
```

## Today

Pass `today` on a page rendered on the server, so the server and the browser mark the same day. Without it, the picker reads today in the browser, in `timeZone` if you set one.

```tsx
<DateRangePicker onValueChange={setValue} today="2026-06-18" value={value}>
  {/* … */}
</DateRangePicker>
```

## API Reference

Every part takes `sx`, applied last.

### DateRangePicker

Takes every prop of [UI SDK Date Picker](https://ui-sdk.dev/docs/components/date-picker) except `mode` and `months`, which are `"range"` and `2`, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `DateRange \| null` |  | The range, as `[start, end]` ISO dates. |
| `defaultValue` | `DateRange \| null` |  | The range it starts with, when uncontrolled. |
| `onValueChange` | `(value: DateRange \| null, details) => void` |  | Called once both ends are picked, a preset is pressed, or the value is cleared. |
| `showOutsideDays` | `boolean` | `false` | Shows the days of the months before and after at the grids' edges. |

### DateRangePickerTrigger

A [Button](/docs/components/button) that opens the picker and shows the range, like `Jun 12 – 18, 2026`, in `locale`, or `en-US` without one.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"Pick a date range"` | The text while the value is `null`. |
| `aria-label` | `string` | "Choose dates" and the range, from ui-sdk | The trigger's name. The visible text follows it, so the dates stay in the name. |

### DateRangePickerContent

The popup, a row with the presets and the calendar. It takes `side`, `align` and their offsets, and `align` defaults to `"start"`.

### DateRangePickerPreset

| Prop    | Type        | Default | Description         |
| ------- | ----------- | ------- | ------------------- |
| `value` | `DateRange` |         | The range it picks. |

`DateRangePickerPresets` is a `div` around the presets. `DateRangePickerCalendar` is two months of [Calendar](/docs/components/calendar), with its parts. For the rest, see [UI SDK Date Picker](https://ui-sdk.dev/docs/components/date-picker).
