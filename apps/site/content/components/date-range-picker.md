---
title: Date Range Picker
description: A button showing a range of days, opening a calendar and optional presets.
---

<!-- ::demo name="date-range-picker" -->

```tsx
<DateRangePicker onValueChange={setValue} value={value} />
```

## Installation

<!-- ::install name="date-range-picker" -->

## Usage

```tsx
import { DateRangePicker } from "@/components/primitives/date-range-picker";
```

```tsx
const [value, setValue] = useState({ from: start, to: end });

<DateRangePicker onValueChange={setValue} value={value} />;
```

## Composition

```
DateRangePicker
├── Button
└── Popover
    ├── Button (each preset)
    └── Calendar
```

## Presets

Pass `presets` to list ranges beside the calendar. A preset whose range matches `value` is pressed. Picking one closes the picker.

<!-- ::demo name="date-range-picker-presets" -->

```tsx
const presets = [
  { label: "Last 7 days", range: { from: sevenDaysAgo, to: today } },
  { label: "Last 30 days", range: { from: thirtyDaysAgo, to: today } },
  { label: "This month", range: { from: startOfMonth, to: today } },
  {
    label: "Last month",
    range: { from: startOfLastMonth, to: endOfLastMonth },
  },
];

<DateRangePicker onValueChange={setValue} presets={presets} value={value} />;
```

## Time Zone

Pass `timeZone` to label and select days in that zone, such as `"UTC"`, instead of the browser's.

```tsx
<DateRangePicker onValueChange={setValue} timeZone="UTC" value={value} />
```

## Disabled

Use `disabled` to block days and `startMonth` or `endMonth` to limit how far the arrows go.

```tsx
<DateRangePicker
  disabled={{ after: today }}
  endMonth={today}
  onValueChange={setValue}
  value={value}
/>
```

## API Reference

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `{ from: Date; to: Date }` | The range shown on the button and in the calendar. |
| `onValueChange` | `(range: DayRange) => void` | Called with a complete range, after a preset or a second day is picked. |
| `presets` | `{ label; range }[]` | Ranges listed beside the calendar. |

It also takes `disabled`, `startMonth`, `endMonth`, `locale`, `timeZone` and `weekStartsOn` from [react-day-picker](https://daypicker.dev). The first day picked waits for a second to end the range.
