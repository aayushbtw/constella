import { render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentTitle,
  AttachmentTrigger,
} from "./attachment";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function expectNamed(labels: string[]) {
  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const found = entries().map((entry) => entry.label);
  for (const label of labels) {
    expect(found, `${label} is missing from the snapshot`).toContain(label);
  }
}

test("an agent finds and presses a standalone trigger and an action by name", async () => {
  const onOpen = vi.fn<() => void>();
  const onRemove = vi.fn<() => void>();
  render(
    <Attachment>
      <AttachmentTrigger aria-label="Open q3-report.pdf" onClick={onOpen} />
      <AttachmentContent>
        <AttachmentTitle>q3-report.pdf</AttachmentTitle>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove q3-report.pdf" onClick={onRemove}>
          x
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );

  expectNamed(["Open q3-report.pdf", "Remove q3-report.pdf"]);

  const result = await agent.act({
    steps: [
      { action: "press", ref: "Open q3-report.pdf" },
      { action: "press", ref: "Remove q3-report.pdf" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onOpen).toHaveBeenCalledOnce();
  expect(onRemove).toHaveBeenCalledOnce();

  const trigger = screen.getByRole("button", { name: "Open q3-report.pdf" });
  expect(trigger.dataset.slot).toBe("attachment-trigger");
  expect(trigger.dataset.slot).toMatch(/-trigger$/u);
});

test("an agent opens a Dialog through the trigger it renders", async () => {
  render(
    <Dialog>
      <Attachment>
        <AttachmentTrigger
          aria-label="Preview q3-report.pdf"
          render={<DialogTrigger />}
        />
        <AttachmentContent>
          <AttachmentTitle>q3-report.pdf</AttachmentTitle>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove q3-report.pdf">
            x
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <DialogContent>
        <DialogTitle>q3-report.pdf</DialogTitle>
      </DialogContent>
    </Dialog>
  );

  expectNamed(["Preview q3-report.pdf", "Remove q3-report.pdf"]);

  const trigger = screen.getByRole("button", { name: "Preview q3-report.pdf" });
  expect(trigger.dataset.slot).toMatch(/-trigger$/u);
  expect(trigger.getAttribute("type")).toBe("button");

  const result = await agent.act({
    steps: [{ action: "press", ref: "Preview q3-report.pdf" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.getByRole("dialog", { name: "q3-report.pdf" })).toBeTruthy();
  });
});

test("a trigger rendered as a link keeps its href", () => {
  render(
    <Attachment>
      <AttachmentTrigger
        aria-label="Open q3-report.pdf"
        // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the trigger's aria-label names it
        render={<a href="/files/q3.pdf" />}
      />
    </Attachment>
  );

  expect(
    screen
      .getByRole("link", { name: "Open q3-report.pdf" })
      .getAttribute("href")
  ).toBe("/files/q3.pdf");
});
