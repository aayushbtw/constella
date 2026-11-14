import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { Toggle } from "./toggle";

const agent = createAgent();

test("a press sets what the pressed style keys on, and disabled is the native attribute", () => {
  render(
    <>
      <Toggle aria-label="Toggle bold" size="icon" variant="outline" />
      <Toggle aria-label="Toggle italic" disabled />
    </>
  );
  const bold = screen.getByRole("button", { name: "Toggle bold" });
  expect(bold.dataset).toMatchObject({
    size: "icon",
    slot: "toggle",
    variant: "outline",
  });
  expect(bold.matches("[data-pressed]")).toBe(false);

  fireEvent.click(bold);

  expect(bold.matches("[data-pressed]")).toBe(true);
  expect(bold.getAttribute("aria-pressed")).toBe("true");

  const italic = screen.getByRole("button", { name: "Toggle italic" });
  expect(italic.matches(":disabled")).toBe(true);
  fireEvent.click(italic);
  expect(italic.getAttribute("aria-pressed")).toBe("false");
});

function Wrap() {
  const [wrap, setWrap] = useState(false);
  return (
    <>
      <Toggle
        aria-label="Wrap lines"
        onPressedChange={setWrap}
        pressed={wrap}
      />
      <output>{wrap ? "wrapped" : "unwrapped"}</output>
    </>
  );
}

test("a controlled toggle reports each press", () => {
  render(<Wrap />);
  fireEvent.click(screen.getByRole("button", { name: "Wrap lines" }));
  expect(screen.getByText("wrapped")).toBeTruthy();
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
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries.map((entry) => entry.label);
  expect(labels).toEqual(expect.arrayContaining(["Toggle bold", "Underline"]));

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
