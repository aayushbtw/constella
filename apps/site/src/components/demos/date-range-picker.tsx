import { addDays, endOfMonth, startOfMonth } from "@ui-sdk/react/date";
import { useState } from "react";

import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerPreset,
  DateRangePickerPresets,
  DateRangePickerTrigger,
} from "@/components/primitives/date-range-picker";
import type { DateRange } from "@/components/primitives/date-range-picker";
import { DemoRow } from "~/components/demos/frame";

// Fixed, as the page is prerendered and a live date would differ from the build's on hydration.
const today = "2026-06-18";
const lastMonth = addDays(startOfMonth(today), -1);
const defaultMonth = lastMonth.slice(0, 7);

const presets: { label: string; range: DateRange }[] = [
  { label: "Last 7 days", range: [addDays(today, -6), today] },
  { label: "Last 30 days", range: [addDays(today, -29), today] },
  { label: "This month", range: [startOfMonth(today), today] },
  {
    label: "Last month",
    range: [startOfMonth(lastMonth), endOfMonth(lastMonth)],
  },
];

function DateRangePickerDemo() {
  const [value, setValue] = useState<DateRange | null>([
    addDays(today, -6),
    today,
  ]);
  return (
    <DemoRow>
      <DateRangePicker
        defaultMonth={defaultMonth}
        max={today}
        onValueChange={setValue}
        today={today}
        value={value}
      >
        <DateRangePickerTrigger aria-label="Billing period" />
        <DateRangePickerContent>
          <DateRangePickerCalendar />
        </DateRangePickerContent>
      </DateRangePicker>
    </DemoRow>
  );
}

function DateRangePickerPresetsDemo() {
  const [value, setValue] = useState<DateRange | null>(presets[0].range);
  return (
    <DemoRow>
      <DateRangePicker
        defaultMonth={defaultMonth}
        max={today}
        onValueChange={setValue}
        today={today}
        value={value}
      >
        <DateRangePickerTrigger aria-label="Report period" />
        <DateRangePickerContent>
          <DateRangePickerPresets>
            {presets.map((preset) => (
              <DateRangePickerPreset key={preset.label} value={preset.range}>
                {preset.label}
              </DateRangePickerPreset>
            ))}
          </DateRangePickerPresets>
          <DateRangePickerCalendar />
        </DateRangePickerContent>
      </DateRangePicker>
    </DemoRow>
  );
}

export { DateRangePickerDemo, DateRangePickerPresetsDemo };
