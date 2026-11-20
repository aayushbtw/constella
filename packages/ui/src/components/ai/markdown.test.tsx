import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import { Markdown } from "./markdown";

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

const answer = `Active users grew **12%** in March.

| Month    |  Users |
| :------- | -----: |
| February | 19,880 |
| March    | 22,270 |

\`\`\`ts
const users = await acme.metrics.activeUsers();
\`\`\`
`;

test("an agent finds Copy code by name and copies the block, and sees only the table's scroll area besides", async () => {
  const writeText = stubClipboard();
  render(<Markdown>{answer}</Markdown>);

  expect(
    entries()
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(["Copy code, ts"]);
  expect(
    entries()
      .filter((entry) => entry.label === undefined)
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([{ actions: [], component: "scroll-area" }]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([
    ["const users = await acme.metrics.activeUsers();"],
  ]);
});

const blocks = `\`\`\`ts
const users = 1;
\`\`\`

\`\`\`sh
vp install
\`\`\`

\`\`\`
plain text
\`\`\`
`;

test("each code block's copy button names its language, and an agent copies the one it names", async () => {
  const writeText = stubClipboard();
  render(<Markdown>{blocks}</Markdown>);

  expect(
    entries()
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(["Copy code, ts", "Copy code, sh", "Copy code"]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code, sh" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([["vp install"]]);
});

test("two blocks of the same language share a name, so a press by it is ambiguous", async () => {
  stubClipboard();
  render(
    <Markdown>
      {"```ts\nconst a = 1;\n```\n\n```ts\nconst b = 2;\n```\n"}
    </Markdown>
  );
  const refs = entries()
    .filter((entry) => entry.component === "button")
    .map((entry) => entry.ref);
  expect(refs).toHaveLength(2);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code, ts" }],
  });
  expect(result.ok).toBe(false);
  for (const ref of refs) {
    expect(result.error?.message).toContain(ref);
  }
});

// ui-sdk 0.1.0-beta.13 lists every scroll area with no actions.
test.fails("the table's scroll area has a name", () => {
  render(<Markdown>{answer}</Markdown>);

  expect(
    entries()
      .filter((entry) => entry.component === "scroll-area")
      .map((entry) => entry.label)
  ).toEqual([expect.any(String)]);
});
