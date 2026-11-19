import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Button } from "./button";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  sheetSides,
} from "./sheet";

const agent = createAgent();

function EditProfile({
  showCloseButton,
  side,
}: {
  showCloseButton?: boolean;
  side?: (typeof sheetSides)[number];
}) {
  return (
    <Sheet side={side}>
      <SheetTrigger render={<Button variant="outline" />}>
        Edit profile
      </SheetTrigger>
      <SheetContent showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Field>
            <FieldLabel>Display name</FieldLabel>
            <Input defaultValue="Alex Smith" />
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

async function open() {
  const trigger = screen.getByRole("button", { name: "Edit profile" });
  fireEvent.click(trigger);
  const sheet = await screen.findByRole("dialog", { name: "Profile" });
  return { sheet, trigger };
}

test("the trigger opens a sheet its title names and its description describes", async () => {
  render(<EditProfile />);
  const { sheet, trigger } = await open();

  expect(trigger.dataset.slot).toBe("drawer-trigger");
  expect(sheet.dataset.slot).toBe("drawer-content");
  expect(sheet.getAttribute("aria-describedby")).toBe(
    screen.getByText("Make changes to your profile here.").id
  );
});

test("it comes from the right by default", async () => {
  render(<EditProfile />);
  const { sheet } = await open();

  expect(sheet.dataset.side).toBe("right");
});

test.each(sheetSides)(
  '`side="%s"` on the root is the edge it comes from',
  async (side) => {
    render(<EditProfile side={side} />);
    const { sheet } = await open();

    expect(sheet.dataset.side).toBe(side);
  }
);

test("the close button keeps its slot as the sheet's direct child, so the header's `:has(> …)` matches", async () => {
  render(<EditProfile />);
  const { sheet } = await open();

  const close = screen.getByRole("button", { name: "Close" });
  expect(close.dataset.slot).toBe("dialog-close-button");
  expect(close.parentElement).toBe(sheet);
});

test("`showCloseButton={false}` leaves the close button out", async () => {
  render(<EditProfile showCloseButton={false} />);
  await open();

  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});

test.each(["Close", "Cancel"])(
  "%s closes it and returns focus to the trigger",
  async (name) => {
    render(<EditProfile />);
    const { trigger } = await open();
    fireEvent.click(screen.getByRole("button", { name }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(document.activeElement).toBe(trigger);
  }
);

test("a drag that starts in the body doesn't move the sheet, so its text stays selectable", async () => {
  render(<EditProfile />);
  await open();

  const body = screen
    .getByLabelText("Display name")
    .closest<HTMLElement>("[data-slot='sheet-body']");
  expect(body?.dataset.drawerNoDrag).toBe("");
});

test("an agent finds the sheet by its trigger, then names every control inside", async () => {
  render(<EditProfile />);

  const closed = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(closed.map((entry) => entry.label)).toContain("Edit profile");

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Edit profile" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
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
  for (const label of ["Profile", "Display name", "Close", "Cancel"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Close"], ref: "Profile" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
