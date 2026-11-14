import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import { Button } from "./button";
import { Dialog, DialogTrigger } from "./dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const popupOpen = ":is([data-popup-open], :where([aria-haspopup])[data-open])";

const slot = (name: string) =>
  screen.getByRole("button", { name }).dataset.slot;

test("renders a button named by its slot, with its options mirrored", () => {
  render(
    <Button color="danger" corners="rounded" size="sm" variant="outline">
      Delete
    </Button>
  );

  const button = screen.getByRole("button", { name: "Delete" });
  expect(button.getAttribute("type")).toBe("button");
  expect(button.dataset).toMatchObject({
    color: "danger",
    corners: "rounded",
    size: "sm",
    slot: "button",
    variant: "outline",
  });
});

test("a part built on it, or a trigger rendered as it, keeps its own slot", () => {
  render(
    <>
      <Button data-slot="sidebar-trigger">Toggle</Button>
      <Dialog>
        <DialogTrigger render={<Button />}>Dialog</DialogTrigger>
      </Dialog>
      <Popover>
        <PopoverTrigger render={<Button />}>Popover</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>
      {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the button renders its children into the link */}
      <Button data-slot="copy-button" render={<a href="/copy" />}>
        Copy
      </Button>
    </>
  );

  expect(slot("Toggle")).toBe("sidebar-trigger");
  expect(slot("Dialog")).toBe("dialog-trigger");
  expect(slot("Popover")).toBe("popover-trigger");
  expect(screen.getByRole("link", { name: "Copy" }).dataset.slot).toBe(
    "copy-button"
  );
});

test("disabled can't be pressed and leaves the tab order", () => {
  const onClick = vi.fn();
  render(
    <Button disabled onClick={onClick}>
      Save
    </Button>
  );

  const button = screen.getByRole("button", { name: "Save" });
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
  expect(button.matches(":disabled")).toBe(true);
});

test("render swaps the element and keeps it a link", () => {
  render(
    // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the button renders its children into the link
    <Button render={<a href="/settings" />} variant="outline">
      Settings
    </Button>
  );

  const link = screen.getByRole("link", { name: "Settings" });
  expect(link.dataset).toMatchObject({ slot: "button", variant: "outline" });
});

test("as a ui-sdk trigger, the open trigger matches the open style", async () => {
  render(
    <Popover>
      <PopoverTrigger render={<Button />}>Open</PopoverTrigger>
      <PopoverContent>Body</PopoverContent>
    </Popover>
  );
  const trigger = screen.getByRole("button", { name: "Open" });
  expect(trigger.matches(popupOpen)).toBe(false);

  fireEvent.click(trigger);

  await screen.findByRole("dialog");
  expect(trigger.matches(popupOpen)).toBe(true);
});

test("as a Base UI trigger, the open trigger matches the open style", async () => {
  render(
    <Dialog>
      <DialogTrigger render={<Button />}>Open</DialogTrigger>
    </Dialog>
  );
  const trigger = screen.getByRole("button", { name: "Open" });
  expect(trigger.matches(popupOpen)).toBe(false);

  fireEvent.click(trigger);

  await vi.waitFor(() => {
    expect(trigger.matches(popupOpen)).toBe(true);
  });
});

test("an agent can find and press every button", async () => {
  const agent = createAgent();
  const onSave = vi.fn();
  render(
    <>
      <Button onClick={onSave}>Save</Button>
      <Button aria-label="Search" size="icon" />
    </>
  );

  const labels = agent
    .snapshot()
    .filter((entry) => entry.component === "button")
    .map((entry) => entry.label);
  expect(labels).toEqual(["Save", "Search"]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Save" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onSave).toHaveBeenCalledOnce();
});
