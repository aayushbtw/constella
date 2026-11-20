import { act, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { AgentAction } from "@ui-sdk/react/agent";
import { afterEach, expect, test, vi } from "vite-plus/test";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/primitives/alert-dialog";
import { Button } from "@/components/primitives/button";
import {
  createDropdownMenuController,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Field, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";
import { Switch } from "@/components/primitives/switch";

let approve = false;
const asked: AgentAction[] = [];
const agent = createAgent({
  allow: (step) => {
    asked.push(step);
    return step.confirm === undefined || approve;
  },
});

afterEach(() => {
  approve = false;
  asked.length = 0;
});

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function Settings() {
  return (
    <>
      <Label>
        <Switch />
        Airplane mode
      </Label>
      <Label>
        <Switch defaultChecked />
        Weekly digest
      </Label>
    </>
  );
}

test("an agent can find and change every setting", async () => {
  render(<Settings />);

  const components = entries();
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = components.map((entry) => entry.label);
  for (const label of ["Airplane mode", "Weekly digest"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [
      { action: "setChecked", args: [true], ref: "Airplane mode" },
      { action: "setChecked", args: [false], ref: "Weekly digest" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen
      .getByRole("switch", { name: "Airplane mode" })
      .getAttribute("aria-checked")
  ).toBe("true");
  expect(
    screen
      .getByRole("switch", { name: "Weekly digest" })
      .getAttribute("aria-checked")
  ).toBe("false");
});

const charge = "Charges $20 to your card for 1,000 credits";

test("a marked Button tells the agent it needs a person, and runs only once allowed", async () => {
  const buy = vi.fn<() => void>();
  render(
    <Button data-agent-confirm={charge} onClick={buy}>
      Buy credits
    </Button>
  );
  expect(
    entries().find((entry) => entry.label === "Buy credits")?.confirm
  ).toBe(charge);
  const press = { steps: [{ action: "press", ref: "Buy credits" }] };

  const refused = await agent.act(press);
  expect(refused.ok, "the charge ran without a person").toBe(false);
  expect(refused.error?.message).toContain(charge);
  expect(buy).not.toHaveBeenCalled();

  approve = true;
  const result = await agent.act(press);
  expect(result.ok, result.error?.message).toBe(true);
  expect(buy).toHaveBeenCalledOnce();
});

function DeleteChat({
  onDelete,
  onCancel,
}: {
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Delete chat
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            color="danger"
            data-agent-confirm="Deletes the chat and its messages"
            onClick={onDelete}
          >
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

test("an alert dialog's marked action is refused and closes the dialog, while Cancel runs without asking", async () => {
  const onDelete = vi.fn<() => void>();
  const onCancel = vi.fn<() => void>();
  render(<DeleteChat onCancel={onCancel} onDelete={onDelete} />);
  const remove = {
    steps: [{ action: "press", args: ["Delete forever"], ref: "Delete chat" }],
  };

  const refused = await agent.act(remove);
  expect(refused.ok, "the delete ran without a person").toBe(false);
  expect(refused.error?.message).toContain("Deletes the chat and its messages");
  expect(onDelete).not.toHaveBeenCalled();
  expect(screen.queryByRole("alertdialog")).toBeNull();

  const cancelled = await agent.act({
    steps: [{ action: "press", args: ["Cancel"], ref: "Delete chat" }],
  });
  expect(cancelled.ok, cancelled.error?.message).toBe(true);
  expect(onCancel).toHaveBeenCalledOnce();
  await waitFor(() => {
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  approve = true;
  const removed = await agent.act(remove);
  expect(removed.ok, removed.error?.message).toBe(true);
  expect(onDelete).toHaveBeenCalledOnce();
});

interface Doc {
  name: string;
}

const controller = createDropdownMenuController<Doc>();

function Documents({ onDelete }: { onDelete: (name: string) => void }) {
  return (
    <>
      {["Roadmap", "Budget"].map((name) => (
        <DropdownMenuTrigger
          controller={controller}
          key={name}
          payload={{ name }}
          render={
            <Button
              aria-label={`More for ${name}`}
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          …
        </DropdownMenuTrigger>
      ))}
      <DropdownMenu controller={controller}>
        <DropdownMenuContent<Doc>>
          {({ payload }) => (
            <DropdownMenuItem
              color="danger"
              data-agent-confirm={
                payload ? `Deletes ${payload.name}` : "Deletes this document"
              }
              onSelect={() => {
                if (payload) {
                  onDelete(payload.name);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

test("a marked item in a menu shared by rows asks with the opening row's sentence", async () => {
  const onDelete = vi.fn<(name: string) => void>();
  render(<Documents onDelete={onDelete} />);
  const opened = await agent.act({
    steps: [{ action: "press", ref: "More for Budget" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  const remove = {
    steps: [{ action: "press", args: ["Delete"], ref: "More for Budget" }],
  };

  const refused = await agent.act(remove);
  expect(refused.ok, "the delete ran without a person").toBe(false);
  expect(asked.at(-1)?.confirm).toBe("Deletes Budget");
  expect(onDelete).not.toHaveBeenCalled();

  approve = true;
  const removed = await agent.act(remove);
  expect(removed.ok, removed.error?.message).toBe(true);
  expect(onDelete.mock.calls).toEqual([["Budget"]]);
});

function Secrets() {
  return (
    <>
      <Field data-agent-secret>
        <FieldLabel>Tax ID</FieldLabel>
        <Input />
      </Field>
      <Input aria-label="Recovery email" data-agent-secret />
    </>
  );
}

test.each([
  ["Tax ID", "123-45-6789"],
  ["Recovery email", "me@hidden.dev"],
])(
  "an agent fills the secret %s but never reads it back",
  async (label, raw) => {
    render(<Secrets />);

    let result: Awaited<ReturnType<typeof agent.act>> | undefined;
    await act(async () => {
      result = await agent.act({
        steps: [{ action: "setValue", args: [raw], ref: label }],
      });
    });
    expect(result?.ok, result?.error?.message).toBe(true);
    expect(screen.getByLabelText<HTMLInputElement>(label).value).toBe(raw);

    const entry = entries().find(
      (candidate) =>
        candidate.component === "input" && candidate.label === label
    );
    expect(entry?.value).toBe("[redacted]");
    expect(JSON.stringify(result)).not.toContain(raw);
    expect(JSON.stringify(agent.snapshot())).not.toContain(raw);
  }
);

test("an agent can't see or press anything in a hidden region", async () => {
  const reveal = vi.fn<() => void>();
  render(
    <section data-agent-hidden>
      <Button onClick={reveal}>Show recovery codes</Button>
    </section>
  );

  expect(entries().map((entry) => entry.label)).not.toContain(
    "Show recovery codes"
  );
  expect(await agent.query({ text: "Show recovery codes" })).toEqual([]);

  const pressed = await agent.act({
    steps: [{ action: "press", ref: "Show recovery codes" }],
  });
  expect(pressed.ok).toBe(false);
  expect(reveal).not.toHaveBeenCalled();
});
