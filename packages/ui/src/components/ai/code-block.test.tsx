import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import { CopyButton } from "@/components/primitives/copy-button";
import { Toggle } from "@/components/primitives/toggle";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "./code-block";

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

const route = `export async function POST(request: Request) {
  return streamText({ messages: await request.json() });
}`;
const install = "pnpm add ai @ai-sdk/react zod";
const lint = "$ pnpm lint\n✖ 2 problems (1 error, 1 warning)";

function Blocks() {
  const [wrap, setWrap] = useState(true);
  return (
    <>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CopyButton aria-label="Copy code" value={route} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>{route}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockContent>{install}</CodeBlockContent>
        <CodeBlockActions>
          <CopyButton aria-label="Copy command" value={install} />
        </CodeBlockActions>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <CodeBlockActions>
            <Toggle
              aria-label="Wrap lines"
              onPressedChange={setWrap}
              pressed={wrap}
              size="icon-sm"
            >
              W
            </Toggle>
            <CopyButton aria-label="Copy output" value={lint} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{lint}</CodeBlockContent>
      </CodeBlock>
    </>
  );
}

test("an agent sees each block's controls by name and none of its code", () => {
  render(<Blocks />);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(
    entries()
      .map((entry) => `${entry.component} ${entry.label}`)
      .toSorted()
  ).toEqual([
    "button Copy code",
    "button Copy command",
    "button Copy output",
    "toggle Wrap lines",
  ]);
});

const wrapsOutput = () =>
  screen.getByText(/pnpm lint/u).closest("pre")?.dataset.wrap !== undefined;

test("an agent copies code and turns off line wrap", async () => {
  const writeText = stubClipboard();
  render(<Blocks />);
  expect(wrapsOutput()).toBe(true);

  const result = await agent.act({
    steps: [
      { action: "press", ref: "Copy code" },
      { action: "press", ref: "Copy command" },
      { action: "setPressed", args: [false], ref: "Wrap lines" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([[route], [install]]);
  expect(wrapsOutput()).toBe(false);
});

test("a block with no actions adds nothing to the snapshot", () => {
  render(
    <CodeBlock>
      <CodeBlockContent>{install}</CodeBlockContent>
    </CodeBlock>
  );

  expect(entries()).toEqual([]);
});
