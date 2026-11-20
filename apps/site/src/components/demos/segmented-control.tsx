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
        onValueChange={(next) => {
          if (next !== null) {
            setRange(next);
          }
        }}
        value={range}
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
      </SegmentedControl>
    </DemoRow>
  );
}

function SegmentedControlVerticalDemo() {
  return (
    <DemoRow>
      <SegmentedControl
        aria-label="Vertical alignment"
        defaultValue="middle"
        orientation="vertical"
      >
        <SegmentedControlItem value="top">Top</SegmentedControlItem>
        <SegmentedControlItem value="middle">Middle</SegmentedControlItem>
        <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
      </SegmentedControl>
    </DemoRow>
  );
}

function SegmentedControlDisabledDemo() {
  return (
    <DemoRow>
      <SegmentedControl aria-label="View" defaultValue="list">
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="board">Board</SegmentedControlItem>
        <SegmentedControlItem disabled value="calendar">
          Calendar
        </SegmentedControlItem>
      </SegmentedControl>
    </DemoRow>
  );
}

export {
  SegmentedControlDemo,
  SegmentedControlDisabledDemo,
  SegmentedControlVerticalDemo,
};
