import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Meter, MeterLabel, MeterValue } from "./meter";

const agent = createAgent();

const fillOf = (meter: HTMLElement) =>
  meter.querySelectorAll<SVGElement>("[data-slot='meter-ring'] circle")[1]
    ?.style.cssText;

function Seats({ value }: { value: number }) {
  return (
    <Meter format={(seats) => `${seats} of 10`} max={10} value={value}>
      <MeterLabel>Seats</MeterLabel>
      <MeterValue />
    </Meter>
  );
}

test("a meter is named by its label, reads its value, and fills its bar to it", () => {
  render(
    <Meter color="warning" value={24}>
      <MeterLabel>Storage</MeterLabel>
      <MeterValue />
    </Meter>
  );
  const storage = screen.getByRole("meter", { name: "Storage" });

  expect(storage.getAttribute("aria-valuenow")).toBe("24");
  expect(storage.getAttribute("aria-valuetext")).toBe("24%");
  expect(screen.getByText("24%").getAttribute("aria-hidden")).toBe("true");
  expect(storage.dataset).toMatchObject({ color: "warning", variant: "bar" });
  expect(
    storage.querySelector<HTMLElement>("[data-slot='meter-indicator']")?.style
      .width
  ).toBe("24%");
});

test("format writes both the visible value and what screen readers hear, and follows a new value", () => {
  const { rerender } = render(<Seats value={7} />);
  const seats = screen.getByRole("meter", { name: "Seats" });

  expect(screen.getByText("7 of 10").dataset.slot).toBe("meter-value");
  expect(seats.getAttribute("aria-valuetext")).toBe("7 of 10");

  rerender(<Seats value={9} />);

  expect(screen.getByText("9 of 10").dataset.slot).toBe("meter-value");
  expect(seats.getAttribute("aria-valuetext")).toBe("9 of 10");
});

test("a ring fills to the value before its children, with no bar", () => {
  render(
    <>
      <Meter color="danger" max={10} value={7} variant="ring">
        <MeterLabel>Seats</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter max={10} value={0} variant="ring">
        <MeterLabel>Guests</MeterLabel>
        <MeterValue />
      </Meter>
    </>
  );
  const seats = screen.getByRole("meter", { name: "Seats" });
  const guests = screen.getByRole("meter", { name: "Guests" });

  expect(seats.dataset).toMatchObject({ color: "danger", variant: "ring" });
  expect(
    [...seats.querySelectorAll<HTMLElement | SVGElement>(":scope > *")].map(
      (child) => child.dataset.slot
    )
  ).toEqual(["meter-ring", "meter-label", "meter-value"]);
  expect(seats.querySelector("[data-slot='meter-track']")).toBeNull();
  expect(fillOf(seats)).toMatch(/:\s*70 100;/u);
  expect(fillOf(guests)).toMatch(/:\s*0 100;/u);
});

test("an agent reads each meter by its label", () => {
  render(
    <>
      <Seats value={7} />
      <Meter value={24}>
        <MeterLabel>Storage</MeterLabel>
      </Meter>
    </>
  );

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(
    components.map(({ component, label, value }) => ({
      component,
      label,
      value,
    }))
  ).toEqual([
    { component: "meter", label: "Seats", value: 7 },
    { component: "meter", label: "Storage", value: 24 },
  ]);
});
