import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { afterEach, expect, test } from "vite-plus/test";

import { SegmentedControl, SegmentedControlItem } from "./segmented-control";
import type { SegmentedControlProps } from "./segmented-control";

const agent = createAgent();

afterEach(() => {
  document.documentElement.removeAttribute("dir");
});

const radio = (name: string) => screen.getByRole("radio", { name });
const isChecked = (name: string) => radio(name).matches("[data-checked]");
const indicator = () =>
  screen
    .getByRole("radiogroup")
    .querySelector<HTMLElement>("[data-slot='segmented-control-indicator']");
const indicatorLeft = () =>
  indicator()?.style.getPropertyValue("--segmented-control-indicator-left");

function Ranges(props: Omit<SegmentedControlProps, "children">) {
  return (
    <SegmentedControl aria-label="Range" {...props}>
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem disabled value="month">
        Month
      </SegmentedControlItem>
      <SegmentedControlItem value="year">Year</SegmentedControlItem>
    </SegmentedControl>
  );
}

function Controlled() {
  const [range, setRange] = useState<"day" | "week">("day");
  return (
    <>
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
      </SegmentedControl>
      <output>{range}</output>
    </>
  );
}

test("the pill renders first, before the items, so the fallback fill can find it", () => {
  render(<Ranges defaultValue="week" />);
  const group = screen.getByRole("radiogroup", { name: "Range" });
  expect(group.dataset.slot).toBe("segmented-control");
  expect(group.firstElementChild).toBe(indicator());
  expect(radio("Week").dataset.slot).toBe("segmented-control-item");
});

test("placed without sliding: the pill carries the width the fallback fill reads, with no direction yet", async () => {
  render(<Ranges defaultValue="week" />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(
    indicator()?.style.getPropertyValue("--segmented-control-indicator-width")
  ).not.toBe("");
  expect(indicator()?.dataset.activationDirection).toBe("none");
});

test("a controlled control reports the pick, and pressing the pick keeps it", () => {
  render(<Controlled />);
  fireEvent.click(radio("Week"));
  expect(screen.getByRole("status").textContent).toBe("week");
  expect(isChecked("Week")).toBe(true);
  expect(isChecked("Day")).toBe(false);

  fireEvent.click(radio("Week"));
  expect(isChecked("Week")).toBe(true);
});

test("a disabled item can't be picked", () => {
  render(<Ranges defaultValue="week" />);
  expect(radio("Month").matches("[data-disabled]")).toBe(true);
  fireEvent.click(radio("Month"));
  expect(isChecked("Month")).toBe(false);
  expect(isChecked("Week")).toBe(true);
});

test("a disabled control marks every item, which the styles read", () => {
  render(<Ranges defaultValue="week" disabled />);
  for (const name of ["Day", "Week", "Month", "Year"]) {
    expect(radio(name).matches("[data-disabled]")).toBe(true);
  }
  fireEvent.click(radio("Day"));
  expect(isChecked("Week")).toBe(true);
});

test("the control is one tab stop, and arrows pick, skipping a disabled item", () => {
  render(<Ranges defaultValue="week" />);
  const stops = screen
    .getAllByRole("radio")
    .filter((item) => item.matches("[tabindex='0']"));
  expect(stops).toEqual([radio("Week")]);

  act(() => {
    radio("Week").focus();
  });
  fireEvent.keyDown(radio("Week"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(radio("Year"));
  expect(isChecked("Year")).toBe(true);
});

test("right to left, ArrowLeft moves forward", () => {
  document.documentElement.dir = "rtl";
  render(<Ranges defaultValue="day" />);
  act(() => {
    radio("Day").focus();
  });
  fireEvent.keyDown(radio("Day"), { key: "ArrowLeft" });
  expect(isChecked("Week")).toBe(true);
});

test("the pill follows the pick when the page's direction flips after load", async () => {
  render(<Ranges defaultValue="week" />);
  Object.defineProperty(radio("Week"), "offsetLeft", {
    get: () => (document.documentElement.dir === "rtl" ? 120 : 40),
  });
  await act(async () => {
    await Promise.resolve();
  });
  expect(indicatorLeft()).toBe("40px");

  await act(async () => {
    document.documentElement.dir = "rtl";
    await Promise.resolve();
  });
  expect(indicatorLeft()).toBe("120px");
});

test("an agent finds the control by name and picks an item", async () => {
  render(<Ranges defaultValue="week" />);
  const labels = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more")
    .map((entry) => entry.label);
  expect(labels).toEqual(["Range"]);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["year"], ref: "Range" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(isChecked("Year")).toBe(true);
});
