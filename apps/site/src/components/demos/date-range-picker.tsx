import { useState } from "react";

import { DateRangePicker } from "@/components/primitives/date-range-picker";
import type {
  DateRangePreset,
  DayRange,
} from "@/components/primitives/date-range-picker";
import { DemoRow } from "~/components/demos/frame";

const day = (date: Date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);

const presetsFor = (today: Date): DateRangePreset[] => [
  { label: "Last 7 days", range: { from: day(today, -6), to: day(today) } },
  { label: "Last 30 days", range: { from: day(today, -29), to: day(today) } },
  {
    label: "This month",
    range: {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: day(today),
    },
  },
  {
    label: "Last month",
    range: {
      from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      to: new Date(today.getFullYear(), today.getMonth(), 0),
    },
  },
];

const today = day(new Date());
const presets = presetsFor(today);

function DateRangePickerDemo() {
  const [value, setValue] = useState<DayRange>({
    from: day(today, -6),
    to: today,
  });
  return (
    <DemoRow>
      <DateRangePicker
        disabled={{ after: today }}
        endMonth={today}
        onValueChange={setValue}
        value={value}
      />
    </DemoRow>
  );
}

function DateRangePickerPresetsDemo() {
  const [value, setValue] = useState<DayRange>(presets[0].range);
  return (
    <DemoRow>
      <DateRangePicker
        disabled={{ after: today }}
        endMonth={today}
        onValueChange={setValue}
        presets={presets}
        value={value}
      />
    </DemoRow>
  );
}

export { DateRangePickerDemo, DateRangePickerPresetsDemo };
