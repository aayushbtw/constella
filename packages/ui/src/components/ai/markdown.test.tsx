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
  ).toEqual(["Copy code"]);
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

// ui-sdk 0.1.0-beta.13 lists every scroll area with no actions.
test.fails("every snapshot entry is named", () => {
  render(<Markdown>{answer}</Markdown>);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
});
