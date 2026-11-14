import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const agent = createAgent();

function Dimensions() {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      <PopoverContent align="start" side="top">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

test("the title names the content, the description describes it and placement reaches it", async () => {
  render(<Dimensions />);
  const trigger = screen.getByRole("button", { name: "Open popover" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(trigger);

  const content = await screen.findByRole("dialog", { name: "Dimensions" });
  const description = document.querySelector(
    `#${CSS.escape(content.getAttribute("aria-describedby") ?? "")}`
  );
  expect(description?.textContent).toBe("Set the dimensions for the layer.");
  expect(content.dataset).toMatchObject({ align: "start", side: "top" });
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(Object.hasOwn(trigger.dataset, "open")).toBe(true);
  expect(screen.getByText("Dimensions").tagName).toBe("H2");
});

test("Close closes it and returns focus to the trigger", async () => {
  render(<Dimensions />);
  const trigger = screen.getByRole("button", { name: "Open popover" });
  fireEvent.click(trigger);
  fireEvent.click(await screen.findByRole("button", { name: "Done" }));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(document.activeElement).toBe(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});

test("an agent finds the popover by its trigger and presses its controls", async () => {
  render(<Dimensions />);

  const closed = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of closed) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(closed.map((entry) => entry.label)).toContain("Open popover");

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Open popover" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  const open = agent.snapshot().find((entry) => entry.label === "Dimensions");
  expect(open).toMatchObject({ buttons: ["Done"], open: true });
  expect(screen.getByRole("dialog", { name: "Dimensions" })).toBeTruthy();

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Done"], ref: "Dimensions" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
