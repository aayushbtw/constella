import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerPreset,
  DateRangePickerPresets,
  DateRangePickerTrigger,
} from "./date-range-picker";
import type { DateRange } from "./date-range-picker";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const lastWeek: DateRange = ["2026-06-12", "2026-06-18"];

function Report({
  defaultValue = lastWeek,
  keepMounted = false,
  label = "Report period",
  onValueChange,
}: {
  defaultValue?: DateRange | null;
  keepMounted?: boolean;
  label?: string;
  onValueChange?: (value: DateRange | null) => void;
}) {
  return (
    <DateRangePicker
      defaultValue={defaultValue}
      max="2026-06-18"
      onValueChange={onValueChange}
      today="2026-06-18"
    >
      <DateRangePickerTrigger aria-label={label} />
      <DateRangePickerContent keepMounted={keepMounted}>
        <DateRangePickerPresets>
          <DateRangePickerPreset value={["2026-06-01", "2026-06-18"]}>
            This month
          </DateRangePickerPreset>
          <DateRangePickerPreset value={["2026-05-01", "2026-05-31"]}>
            Last month
          </DateRangePickerPreset>
        </DateRangePickerPresets>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

const trigger = () => screen.getByRole("button", { name: /^Report period/u });

test("the trigger shows the range, or the placeholder while there's none, and an aria-label keeps the dates in its name", () => {
  const { unmount } = render(<Report />);
  expect(trigger().textContent).toBe("Jun 12 – 18, 2026");
  expect(trigger().getAttribute("aria-label")).toBe(
    "Report period, Jun 12 – 18, 2026"
  );
  unmount();

  render(<Report defaultValue={null} />);
  expect(trigger().textContent).toBe("Pick a date range");
  expect(trigger().getAttribute("aria-label")).toBe(
    "Report period, Pick a date range"
  );
});

test("without an aria-label, the trigger keeps ui-sdk's name with the dates spelled out", () => {
  render(
    <DateRangePicker defaultValue={["2026-06-12", "2026-06-18"]}>
      <DateRangePickerTrigger />
    </DateRangePicker>
  );
  expect(
    screen.getByRole("button", {
      name: "Choose dates, Friday, June 12, 2026 to Thursday, June 18, 2026",
    }).textContent
  ).toBe("Jun 12 – 18, 2026");
});

test("an agent opens the picker, sees every preset and both arrows, presses a preset and sets a range", async () => {
  const onValueChange = vi.fn<(value: DateRange | null) => void>();
  render(<Report onValueChange={onValueChange} />);

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Report period" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  await screen.findByRole("dialog");
  expect(screen.queryByRole("gridcell", { name: /May 31/u })).toBeNull();

  const components = entries();
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const picker = components.find((entry) => entry.component === "date-picker");
  expect(picker?.buttons).toEqual(
    expect.arrayContaining([
      "This month",
      "Last month",
      "Previous month",
      "Next month",
    ])
  );

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Last month"], ref: picker?.ref ?? "" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(onValueChange).toHaveBeenLastCalledWith(
    ["2026-05-01", "2026-05-31"],
    expect.anything()
  );
  expect(trigger().textContent).toBe("May 1 – 31, 2026");

  const set = await agent.act({
    steps: [
      {
        action: "setValue",
        args: [["2026-06-02", "2026-06-04"]],
        ref: "Report period",
      },
    ],
  });
  expect(set.ok, set.error?.message).toBe(true);
  expect(trigger().textContent).toBe("Jun 2 – 4, 2026");
});

test("a pointer picks two days, the later one first, and the picker reports one ordered range and closes with the popover's exit", async () => {
  const onValueChange = vi.fn<(value: DateRange | null) => void>();
  render(<Report keepMounted onValueChange={onValueChange} />);
  fireEvent.click(trigger());
  const content = await screen.findByRole("dialog");

  fireEvent.click(screen.getByRole("gridcell", { name: /June 10,/u }));
  expect(onValueChange).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toBe(content);
  fireEvent.click(screen.getByRole("gridcell", { name: /June 5,/u }));

  expect(onValueChange.mock.calls.map(([value]) => value)).toEqual([
    ["2026-06-05", "2026-06-10"],
  ]);
  await waitFor(() => {
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
  expect(content.dataset).not.toHaveProperty("skipMotion");
});

test("a preset past max can't be pressed", async () => {
  render(
    <DateRangePicker max="2026-06-18" today="2026-06-18">
      <DateRangePickerTrigger aria-label="Report period" />
      <DateRangePickerContent>
        <DateRangePickerPresets>
          <DateRangePickerPreset value={["2026-06-15", "2026-06-25"]}>
            Next week
          </DateRangePickerPreset>
        </DateRangePickerPresets>
      </DateRangePickerContent>
    </DateRangePicker>
  );
  fireEvent.click(trigger());
  await screen.findByRole("dialog");
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: "Next week" })
      .disabled
  ).toBe(true);
});
