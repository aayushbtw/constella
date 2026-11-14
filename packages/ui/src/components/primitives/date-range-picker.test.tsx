import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import { DateRangePicker } from "./date-range-picker";

const range = { from: new Date(2026, 4, 4), to: new Date(2026, 4, 10) };

// ui-sdk reads a change's source only from trusted events, so the keyboard open, which focuses the first preset, is checked in a browser.
test("a pointer open focuses the content, so no preset wears a focus ring", async () => {
  render(
    <DateRangePicker
      onValueChange={() => {}}
      presets={[{ label: "This week", range }]}
      value={range}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: /2026/u }));

  const content = await screen.findByRole("dialog");
  expect(document.activeElement).toBe(content);
});
