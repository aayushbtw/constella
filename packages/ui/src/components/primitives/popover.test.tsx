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

// Button's open style keys on `[aria-haspopup][data-open]` (styles.ts `popupOpen`).
test("placement reaches the content, and the open trigger carries what the open style keys on", async () => {
  render(<Dimensions />);
  const trigger = screen.getByRole("button", { name: "Open popover" });
  expect(trigger.matches("[aria-haspopup][data-open]")).toBe(false);

  fireEvent.click(trigger);

  const content = await screen.findByRole("dialog", { name: "Dimensions" });
  expect(content.dataset).toMatchObject({ align: "start", side: "top" });
  expect(trigger.matches("[aria-haspopup][data-open]")).toBe(true);
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

// ui-sdk reads a change's source only from trusted events, so the keyboard path is checked in a browser.
test("focus leaving closes it with no exit motion, after a click opened it with one", async () => {
  render(
    <>
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent keepMounted>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </Popover>
      <button type="button">Elsewhere</button>
    </>
  );
  fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
  const content = await screen.findByRole("dialog", { name: "Dimensions" });
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(false);

  screen.getByRole("button", { name: "Done" }).focus();
  screen.getByRole("button", { name: "Elsewhere" }).focus();

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(true);
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
