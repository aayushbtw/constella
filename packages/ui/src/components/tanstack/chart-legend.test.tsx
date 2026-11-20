import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { ChartLegendContent } from "./chart-legend";

const agent = createAgent();

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

function Legend() {
  const [shown, setShown] = useState(["desktop", "mobile", "tablet"]);
  return (
    <>
      <ChartLegendContent
        aria-label="Series"
        config={{
          desktop: { label: "Desktop" },
          mobile: { label: "Mobile" },
          tablet: { label: "Tablet" },
        }}
        onValueChange={setShown}
        value={shown}
      />
      <output>{shown.join(",")}</output>
    </>
  );
}

test("an agent finds the legend and each series by name, and hides one", async () => {
  render(<Legend />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries.map((entry) => entry.label);
  for (const label of ["Series", "Desktop", "Mobile", "Tablet"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [{ action: "setPressed", args: [false], ref: "Desktop" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole("button", { name: "Desktop" }).matches("[data-pressed]")
  ).toBe(false);
  expect(screen.getByRole("status").textContent).toBe("mobile,tablet");
});
