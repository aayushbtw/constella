import { useState } from "react";

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/primitives/segmented-control";
import { DemoRow } from "~/components/demos/frame";

type Range = "day" | "week" | "month";

function SegmentedControlDemo() {
  const [range, setRange] = useState<Range>("week");
  return (
    <DemoRow>
      <SegmentedControl
        aria-label="Range"
        onValueChange={setRange}
        value={range}
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>
    </DemoRow>
  );
}

function SegmentedControlDisabledDemo() {
  const [view, setView] = useState("list");
  return (
    <DemoRow>
      <SegmentedControl aria-label="View" onValueChange={setView} value={view}>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="board">Board</SegmentedControlItem>
        <SegmentedControlItem disabled value="calendar">
          Calendar
        </SegmentedControlItem>
      </SegmentedControl>
    </DemoRow>
  );
}

export { SegmentedControlDemo, SegmentedControlDisabledDemo };
