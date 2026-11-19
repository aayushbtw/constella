import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { createConfirm } from "@ui-sdk/react/alert-dialog";
import { expect, test } from "vite-plus/test";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

const agent = createAgent();

function RevokeKey({ action }: { action?: () => Promise<void> }) {
  return (
    <AlertDialog pendingAnnouncement="Revoking key">
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Revoke API key
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this key?</AlertDialogTitle>
          <AlertDialogDescription>
            Apps using it stop working at once.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction action={action} color="danger">
            {(state) => (state.pending ? "Revoking" : "Revoke")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

async function open() {
  const trigger = screen.getByRole("button", { name: "Revoke API key" });
  fireEvent.click(trigger);
  const dialog = await screen.findByRole("alertdialog", {
    name: "Revoke this key?",
  });
  return { dialog, trigger };
}

function pressEscape() {
  fireEvent.keyDown(document.activeElement ?? document.body, {
    key: "Escape",
  });
}

async function expectClosed() {
  await waitFor(() => {
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
}

test("the trigger opens a sized alert dialog its title names and its description describes, beside a backdrop", async () => {
  render(<RevokeKey />);
  const { dialog } = await open();

  expect(dialog.dataset).toMatchObject({
    size: "sm",
    slot: "alert-dialog-content",
  });
  expect(dialog.getAttribute("aria-describedby")).toBe(
    screen.getByText("Apps using it stop working at once.").id
  );
  expect(
    dialog.parentElement?.querySelector(
      ":scope > [data-slot='alert-dialog-backdrop']"
    )
  ).toBeTruthy();
});

test("Cancel and Action are outline and primary Close parts", async () => {
  render(<RevokeKey />);
  await open();

  const cancel = screen.getByRole("button", { name: "Cancel" });
  const action = screen.getByRole("button", { name: "Revoke" });
  expect(cancel.dataset).toMatchObject({
    slot: "alert-dialog-close",
    variant: "outline",
  });
  expect(action.dataset).toMatchObject({
    color: "danger",
    slot: "alert-dialog-close",
    variant: "primary",
  });
});

test("opening focuses Cancel", async () => {
  render(<RevokeKey />);
  await open();

  await waitFor(() => {
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Cancel" })
    );
  });
});

test.each(["Cancel", "Revoke"])(
  "%s closes it and returns focus to the trigger",
  async (name) => {
    render(<RevokeKey />);
    const { trigger } = await open();
    fireEvent.click(screen.getByRole("button", { name }));

    await expectClosed();
    expect(document.activeElement).toBe(trigger);
  }
);

test("Escape closes it and returns focus to the trigger", async () => {
  render(<RevokeKey />);
  const { trigger } = await open();
  await waitFor(() => {
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Cancel" })
    );
  });
  pressEscape();

  await expectClosed();
  expect(document.activeElement).toBe(trigger);
});

test("a pending action marks Action, shows its pending label, refuses Cancel and Escape, and closes once it resolves", async () => {
  const work = Promise.withResolvers<null>();
  render(
    <RevokeKey
      action={async () => {
        await work.promise;
      }}
    />
  );
  const { dialog } = await open();
  fireEvent.click(screen.getByRole("button", { name: "Revoke" }));

  const action = await screen.findByRole("button", { name: "Revoking" });
  expect(Object.hasOwn(action.dataset, "pending")).toBe(true);
  expect(action.getAttribute("aria-busy")).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  pressEscape();
  await act(async () => {
    await Promise.resolve();
  });
  expect(Object.hasOwn(dialog.dataset, "open")).toBe(true);

  await act(async () => {
    work.resolve(null);
    await work.promise;
  });
  await expectClosed();
});

test("a rejected action keeps it open and clears pending, and a retry that resolves closes it", async () => {
  const attempts = [
    Promise.withResolvers<null>(),
    Promise.withResolvers<null>(),
  ];
  let attempt = 0;
  render(
    <RevokeKey
      action={async () => {
        const work = attempts[attempt];
        attempt += 1;
        await work.promise;
      }}
    />
  );
  const { dialog } = await open();
  fireEvent.click(screen.getByRole("button", { name: "Revoke" }));
  await screen.findByRole("button", { name: "Revoking" });

  await act(async () => {
    attempts[0].reject(new Error("Couldn't revoke the key."));
    await attempts[0].promise.catch(() => {});
  });
  const action = await screen.findByRole("button", { name: "Revoke" });
  expect(Object.hasOwn(action.dataset, "pending")).toBe(false);
  expect(Object.hasOwn(dialog.dataset, "open")).toBe(true);

  fireEvent.click(action);
  await screen.findByRole("button", { name: "Revoking" });
  await act(async () => {
    attempts[1].resolve(null);
    await attempts[1].promise;
  });
  await expectClosed();
});

test.each([
  ["Delete", true],
  ["Cancel", false],
  ["Escape", false],
] as const)(
  "createConfirm through `controller` resolves %s as %s",
  async (answer, expected) => {
    const confirm = createConfirm();
    render(
      <AlertDialog controller={confirm.controller}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    let result: Promise<boolean> = Promise.resolve(!expected);
    act(() => {
      result = confirm();
    });
    await screen.findByRole("alertdialog", { name: "Delete this project?" });
    if (answer === "Escape") {
      await waitFor(() => {
        expect(document.activeElement).toBe(
          screen.getByRole("button", { name: "Cancel" })
        );
      });
      pressEscape();
    } else {
      fireEvent.click(screen.getByRole("button", { name: answer }));
    }

    await expect(result).resolves.toBe(expected);
    await expectClosed();
  }
);

test("an alert dialog opened from a dialog steps the dialog back", async () => {
  render(
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Account</DialogTitle>
        <AlertDialog>
          <AlertDialogTrigger>Delete account</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
  const outer = await screen.findByRole("dialog", { name: "Account" });
  fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
  const inner = await screen.findByRole("alertdialog", {
    name: "Delete your account?",
  });

  await waitFor(() => {
    expect(outer.style.getPropertyValue("--dialog-stack")).toBe("1");
  });
  expect(inner.style.getPropertyValue("--dialog-stack")).toBe("0");
});

test("an agent opens it by its trigger, finds every control named, and presses the action", async () => {
  render(<RevokeKey />);

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Revoke API key" }],
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
  for (const label of ["Revoke this key?", "Cancel", "Revoke"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Revoke"], ref: "Revoke this key?" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await expectClosed();
});
