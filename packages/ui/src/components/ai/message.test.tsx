import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import { Button } from "@/components/primitives/button";
import { CopyButton } from "@/components/primitives/copy-button";

import { Message, MessageActions, MessageContent } from "./message";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function stubClipboard() {
  const writeText = vi.fn<(text: string) => void>();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });
  return writeText;
}

const reply = "Constella is a component library on ui-sdk and StyleX.";

function Conversation({
  onRate,
  onRetry,
}: {
  onRate?: () => void;
  onRetry?: () => void;
}) {
  return (
    <>
      <Message from="user">
        <MessageContent>What is Constella?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>{reply}</MessageContent>
        <MessageActions>
          <CopyButton value={reply} />
          <Button
            aria-label="Good answer"
            onClick={onRate}
            size="icon-sm"
            variant="ghost"
          >
            +
          </Button>
          <Button
            aria-label="Retry"
            onClick={onRetry}
            size="icon-sm"
            variant="ghost"
          >
            R
          </Button>
        </MessageActions>
      </Message>
    </>
  );
}

test("an agent finds a reply's actions by name, and the messages add nothing else", () => {
  render(<Conversation />);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries().map((entry) => `${entry.component} ${entry.label}`)).toEqual(
    ["button Copy", "button Good answer", "button Retry"]
  );
});

test("an agent copies, rates and retries a reply", async () => {
  const writeText = stubClipboard();
  const onRate = vi.fn<() => void>();
  const onRetry = vi.fn<() => void>();
  render(<Conversation onRate={onRate} onRetry={onRetry} />);

  const result = await agent.act({
    steps: [
      { action: "press", ref: "Copy" },
      { action: "press", ref: "Good answer" },
      { action: "press", ref: "Retry" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([[reply]]);
  expect(onRate).toHaveBeenCalledOnce();
  expect(onRetry).toHaveBeenCalledOnce();
});
