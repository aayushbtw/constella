import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import {
  Approval,
  ApprovalCancel,
  ApprovalConfirm,
  ApprovalContent,
  ApprovalField,
  ApprovalFieldLabel,
  ApprovalFields,
  ApprovalFieldValue,
  ApprovalFooter,
  ApprovalHeader,
  ApprovalTitle,
} from "./approval";

let approve = false;
const agent = createAgent({
  allow: (step) => step.confirm === undefined || approve,
});

const sentence =
  "Sends “Q3 forecast, revised” to alex@acme.com and sam@acme.com";

function SendMail({
  onCancel,
  onSend,
}: {
  onCancel?: () => void;
  onSend?: () => void;
}) {
  return (
    <Approval>
      <ApprovalHeader>
        <ApprovalTitle>Send mail</ApprovalTitle>
      </ApprovalHeader>
      <ApprovalContent>
        <ApprovalFields>
          <ApprovalField>
            <ApprovalFieldLabel>Subject</ApprovalFieldLabel>
            <ApprovalFieldValue>Q3 forecast, revised</ApprovalFieldValue>
          </ApprovalField>
        </ApprovalFields>
      </ApprovalContent>
      <ApprovalFooter>
        <ApprovalCancel onClick={onCancel}>Cancel</ApprovalCancel>
        <ApprovalConfirm data-agent-confirm={sentence} onClick={onSend}>
          Send mail
        </ApprovalConfirm>
      </ApprovalFooter>
    </Approval>
  );
}

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

test("an agent finds Cancel and Send mail by name, and Send mail asks the person", () => {
  render(<SendMail />);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries().map((entry) => entry.label);
  for (const label of ["Cancel", "Send mail"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
  expect(entries().find((entry) => entry.label === "Send mail")?.confirm).toBe(
    sentence
  );
});

test("an agent's press on Send mail is refused until the person allows it", async () => {
  const onSend = vi.fn<() => void>();
  render(<SendMail onSend={onSend} />);
  const send = { steps: [{ action: "press", ref: "Send mail" }] };

  approve = false;
  const refused = await agent.act(send);
  expect(refused.ok).toBe(false);
  expect(onSend).not.toHaveBeenCalled();

  approve = true;
  try {
    const result = await agent.act(send);
    expect(result.ok, result.error?.message).toBe(true);
    expect(onSend).toHaveBeenCalledOnce();
  } finally {
    approve = false;
  }
});

test("an agent can press Cancel without asking", async () => {
  const onCancel = vi.fn<() => void>();
  render(<SendMail onCancel={onCancel} />);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Cancel" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onCancel).toHaveBeenCalledOnce();
});

test("ApprovalConfirm asks the person even without a sentence of its own", () => {
  render(<ApprovalConfirm>Send mail</ApprovalConfirm>);

  const button = screen.getByRole("button", { name: "Send mail" });
  expect(button.dataset.agentConfirm).toBe("Allows this tool call");
  expect(button.dataset.slot).toBe("approval-confirm");
});
