import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import { Calendar } from "./calendar";
import type { CalendarValue } from "./calendar";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const selectedDays = () =>
  screen
    .queryAllByRole("gridcell", { selected: true })
    .map((day) => day.getAttribute("aria-label"));

test("an agent finds the calendar by its label, sets a range and turns the month, and the grids show it", async () => {
  render(
    <Calendar
      aria-label="Trip dates"
      mode="range"
      months={2}
      today="2026-06-18"
    />
  );

  const components = entries();
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const calendar = components.find((entry) => entry.label === "Trip dates");
  expect(calendar?.actions).toEqual(
    expect.arrayContaining(["setValue", "previous", "next"])
  );

  const result = await agent.act({
    steps: [
      {
        action: "setValue",
        args: [["2026-06-29", "2026-07-02"]],
        ref: "Trip dates",
      },
      { action: "next", ref: "Trip dates" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getAllByRole("grid").map((grid) => grid.getAttribute("aria-label"))
  ).toEqual(["July 2026", "August 2026"]);
  expect(
    [...document.querySelectorAll("caption")].map(
      (caption) => caption.textContent
    )
  ).toEqual(["July 2026", "August 2026"]);
  expect(selectedDays()).toEqual([
    "Wednesday, July 1, 2026",
    "Thursday, July 2, 2026",
  ]);
  expect(
    screen.getByRole("gridcell", { name: "Thursday, July 2, 2026" }).dataset
  ).toHaveProperty("rangeEnd");
});

test("a day outside its month shows nowhere, and a month shown twice doesn't repeat its days", () => {
  render(
    <Calendar
      aria-label="Trip dates"
      defaultMonth="2026-06"
      months={2}
      today="2026-06-18"
    />
  );
  expect(screen.queryByRole("gridcell", { name: /May 31/u })).toBeNull();
  expect(screen.getAllByRole("gridcell", { name: /June 30/u })).toHaveLength(1);
  expect(screen.getAllByRole("gridcell", { name: /July 1,/u })).toHaveLength(1);
});

test("a pressed day reaches onValueChange as an ISO date, and a day past max can't be picked", () => {
  const onValueChange = vi.fn<(value: CalendarValue) => void>();
  render(
    <Calendar
      aria-label="Due date"
      max="2026-06-18"
      onValueChange={onValueChange}
      today="2026-06-18"
    />
  );
  fireEvent.click(screen.getByRole("gridcell", { name: /June 10,/u }));
  fireEvent.click(screen.getByRole("gridcell", { name: /June 25,/u }));
  expect(onValueChange.mock.calls.map(([value]) => value)).toEqual([
    "2026-06-10",
  ]);
  expect(selectedDays()).toEqual(["Wednesday, June 10, 2026"]);
  expect(
    screen
      .getByRole("gridcell", { name: /June 25,/u })
      .getAttribute("aria-disabled")
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: "Next month" }).dataset
  ).toHaveProperty("disabled");
});
