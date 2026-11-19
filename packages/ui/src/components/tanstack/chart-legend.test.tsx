import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import { ChartLegendContent } from "./chart-legend";

test("a legend item marks itself, and a press hides or shows its series", () => {
  render(
    <ChartLegendContent
      aria-label="Series"
      config={{ desktop: { label: "Desktop" }, mobile: { label: "Mobile" } }}
      defaultValue={["desktop", "mobile"]}
    />
  );
  const desktop = screen.getByRole("button", { name: "Desktop" });
  const mobile = screen.getByRole("button", { name: "Mobile" });
  expect(desktop.matches("[data-chart-legend-item][data-pressed]")).toBe(true);

  fireEvent.click(desktop);
  expect(desktop.matches("[data-chart-legend-item]")).toBe(true);
  expect(desktop.matches("[data-pressed]")).toBe(false);
  expect(mobile.matches("[data-pressed]")).toBe(true);

  fireEvent.click(desktop);
  expect(desktop.matches("[data-pressed]")).toBe(true);
  expect(mobile.matches("[data-pressed]")).toBe(true);
});
