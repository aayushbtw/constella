import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { DialogProps } from "@ui-sdk/react/dialog";
import { expect, test } from "vite-plus/test";

import { Button } from "./button";
import {
  createDialogController,
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";

const agent = createAgent();

function EditProfile({
  onOpenChange,
}: {
  onOpenChange?: DialogProps["onOpenChange"];
}) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogCloseButton />
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <Input defaultValue="Alex Smith" />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function open() {
  const trigger = screen.getByRole("button", { name: "Edit profile" });
  fireEvent.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "Profile" });
  return { dialog, trigger };
}

test("the trigger opens a sized dialog its title names and its description describes", async () => {
  render(<EditProfile />);
  const { dialog, trigger } = await open();

  expect(trigger.dataset.slot).toBe("dialog-trigger");
  expect(dialog.dataset).toMatchObject({ size: "sm", slot: "dialog-content" });
  expect(dialog.getAttribute("aria-describedby")).toBe(
    screen.getByText("Make changes to your profile here.").id
  );
});

test("DialogContent puts a backdrop beside the dialog", async () => {
  render(<EditProfile />);
  const { dialog } = await open();

  const backdrop = dialog.parentElement?.querySelector(
    ":scope > [data-slot='dialog-backdrop']"
  );
  expect(backdrop).toBeTruthy();
});

test("the close button keeps its slot as the dialog's direct child, so the header's `:has(> …)` matches", async () => {
  render(<EditProfile />);
  const { dialog } = await open();

  const close = screen.getByRole("button", { name: "Close" });
  expect(close.dataset.slot).toBe("dialog-close-button");
  expect(close.querySelector("svg")).not.toBeNull();
  expect(close.parentElement).toBe(dialog);
  expect(dialog.matches(":has(> [data-slot='dialog-close-button'])")).toBe(
    true
  );
});

test("the close button's children replace its icon and keep its name", async () => {
  render(
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Profile</DialogTitle>
        <DialogCloseButton>
          <svg aria-hidden data-testid="custom" />
        </DialogCloseButton>
      </DialogContent>
    </Dialog>
  );
  await screen.findByRole("dialog", { name: "Profile" });

  const close = screen.getByRole("button", { name: "Close" });
  expect(close.querySelectorAll("svg")).toHaveLength(1);
  expect(close.contains(screen.getByTestId("custom"))).toBe(true);
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

test("the content reads the payload of the trigger that opened it, and a Close's value comes back as returnValue", async () => {
  const controller = createDialogController<{ name: string }>();
  const closed: unknown[] = [];
  render(
    <>
      {["Acme", "Globex"].map((name) => (
        <DialogTrigger controller={controller} key={name} payload={{ name }}>
          Remind {name}
        </DialogTrigger>
      ))}
      <Dialog
        controller={controller}
        onOpenChange={(next, details) => {
          if (!next) {
            closed.push(details.returnValue);
          }
        }}
      >
        <DialogContent<{ name: string }>>
          {(state) => (
            <>
              <DialogTitle>Remind {state.payload?.name}</DialogTitle>
              <DialogClose value="send">Send</DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );

  fireEvent.click(screen.getByRole("button", { name: "Remind Globex" }));
  await screen.findByRole("dialog", { name: "Remind Globex" });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(closed).toEqual(["send"]);
});

test("a dialog opened from another marks the one behind so it can step back", async () => {
  render(
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Account</DialogTitle>
        <Dialog>
          <DialogTrigger>Change password</DialogTrigger>
          <DialogContent>
            <DialogTitle>New password</DialogTitle>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
  const outer = await screen.findByRole("dialog", { name: "Account" });
  fireEvent.click(screen.getByRole("button", { name: "Change password" }));
  const inner = await screen.findByRole("dialog", { name: "New password" });

  await waitFor(() => {
    expect(Object.hasOwn(outer.dataset, "nestedOpen")).toBe(true);
  });
  expect(outer.style.getPropertyValue("--dialog-stack")).toBe("1");
  expect(inner.style.getPropertyValue("--dialog-stack")).toBe("0");
});

test("an agent finds the dialog by its trigger, then names every control inside", async () => {
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
    steps: [{ action: "press", args: ["Cancel"], ref: "Profile" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

test("an agent's open reaches onOpenChange as the agent's, and a cancel keeps the dialog closed", async () => {
  const seen: [boolean, string][] = [];
  render(
    <EditProfile
      onOpenChange={(next, details) => {
        seen.push([next, details.source]);
        details.cancel();
      }}
    />
  );

  const result = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Edit profile" }],
  });
  expect(result.ok).toBe(false);
  expect(result.error?.message).toContain("didn't take");
  expect(seen).toEqual([[true, "agent"]]);
  expect(screen.queryByRole("dialog")).toBeNull();
});
