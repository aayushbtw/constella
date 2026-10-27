import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/primitives/calendar";
import { DemoRow } from "~/components/demos/frame";

function CalendarDemo() {
  const [day, setDay] = useState<Date | undefined>(() => new Date());
  return (
    <DemoRow>
      <Calendar mode="single" onSelect={setDay} selected={day} />
    </DemoRow>
  );
}

function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const to = new Date();
    return {
      from: new Date(to.getFullYear(), to.getMonth(), to.getDate() - 6),
      to,
    };
  });
  return (
    <DemoRow>
      <Calendar
        mode="range"
        numberOfMonths={2}
        onSelect={setRange}
        selected={range}
      />
    </DemoRow>
  );
}

export { CalendarDemo, CalendarRangeDemo };
