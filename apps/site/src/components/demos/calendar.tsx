import { addDays } from "@ui-sdk/react/date";

import { Calendar } from "@/components/primitives/calendar";
import { DemoRow } from "~/components/demos/frame";

// Fixed, as the page is prerendered and a live date would differ from the build's on hydration.
const today = "2026-06-18";

function CalendarDemo() {
  return (
    <DemoRow>
      <Calendar aria-label="Due date" defaultValue={today} today={today} />
    </DemoRow>
  );
}

function CalendarRangeDemo() {
  return (
    <DemoRow>
      <Calendar
        aria-label="Trip dates"
        defaultValue={[addDays(today, -6), today]}
        mode="range"
        months={2}
        today={today}
      />
    </DemoRow>
  );
}

export { CalendarDemo, CalendarRangeDemo };
