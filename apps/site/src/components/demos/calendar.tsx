import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/primitives/calendar";
import { DemoRow } from "~/components/demos/frame";

// Fixed, as the page is prerendered and a live date would differ from the build's on hydration.
const today = new Date(2026, 5, 18);

function CalendarDemo() {
  const [day, setDay] = useState<Date | undefined>(today);
  return (
    <DemoRow>
      <Calendar
        defaultMonth={today}
        mode="single"
        onSelect={setDay}
        selected={day}
        today={today}
      />
    </DemoRow>
  );
}

function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    to: today,
  });
  return (
    <DemoRow>
      <Calendar
        defaultMonth={today}
        mode="range"
        numberOfMonths={2}
        onSelect={setRange}
        selected={range}
        today={today}
      />
    </DemoRow>
  );
}

export { CalendarDemo, CalendarRangeDemo };
