import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Toggle } from "./toggle";

const agent = createAgent();

test("it mirrors its options as data attributes", () => {
  render(<Toggle aria-label="Toggle bold" size="icon" variant="outline" />);
  expect(
    screen.getByRole("button", { name: "Toggle bold" }).dataset
  ).toMatchObject({ size: "icon", slot: "toggle", variant: "outline" });
});

test("a press sets what the pressed style keys on, and disabled is the native attribute", () => {
  render(
    <>
      <Toggle aria-label="Toggle bold" />
      <Toggle aria-label="Toggle italic" disabled />
    </>
  );
  const bold = screen.getByRole("button", { name: "Toggle bold" });
  expect(bold.matches("[data-pressed]")).toBe(false);

  fireEvent.click(bold);

  expect(bold.matches("[data-pressed]")).toBe(true);
  expect(
    screen.getByRole("button", { name: "Toggle italic" }).matches(":disabled")
  ).toBe(true);
});

test("an agent finds every toggle by name and presses it", async () => {
  render(
    <>
      <Toggle aria-label="Toggle bold" size="icon" />
      <Toggle defaultPressed variant="outline">
        Underline
      </Toggle>
    </>
  );

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  const labels = entries.map((entry) => entry.label);
  expect(labels).toEqual(["Toggle bold", "Underline"]);

  const result = await agent.act({
    steps: [
      { action: "toggle", args: [], ref: "Toggle bold" },
      { action: "toggle", args: [], ref: "Underline" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen
      .getByRole("button", { name: "Toggle bold" })
      .getAttribute("aria-pressed")
  ).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Underline" })
      .getAttribute("aria-pressed")
  ).toBe("false");
});
