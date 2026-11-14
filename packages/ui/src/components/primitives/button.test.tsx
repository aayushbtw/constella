import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import { Button } from "./button";
import { Dialog, DialogTrigger } from "./dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const slot = (name: string) =>
  screen.getByRole("button", { name }).dataset.slot;

test("mirrors its options as data attributes", () => {
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

test("disabled can't be pressed or focused", () => {
  const onClick = vi.fn();
  render(
    <Button disabled onClick={onClick}>
      Save
    </Button>
  );

  const button = screen.getByRole("button", { name: "Save" });
  fireEvent.click(button);
  button.focus();
  expect(onClick).not.toHaveBeenCalled();
  expect(document.activeElement).not.toBe(button);
});

test("a render function with a slot gets the state and keeps the slot", () => {
  render(
    <Button
      data-slot="copy-button"
      disabled
      render={(props, state) => (
        <button type="button" {...props}>
          {state.disabled ? "Unavailable" : "Copy"}
        </button>
      )}
    />
  );

  expect(slot("Unavailable")).toBe("copy-button");
});

test("a Promise from onClick keeps it pending and unpressable until it settles", async () => {
  const { promise, resolve } = Promise.withResolvers<null>();
  const onClick = vi.fn(async () => await promise);
  render(<Button onClick={onClick}>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });

  fireEvent.click(button);
  await vi.waitFor(() => {
    expect(button.dataset.pending).toBeDefined();
  });
  expect(button.getAttribute("aria-busy")).toBe("true");
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledOnce();

  await act(async () => {
    resolve(null);
    await promise;
  });
  expect(button.dataset.pending).toBeUndefined();
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
