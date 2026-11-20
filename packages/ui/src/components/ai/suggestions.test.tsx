import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import { Suggestion, Suggestions } from "./suggestions";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const suggestions = [
  "Summarize this week's sales",
  "What changed since last month?",
  "Where are we behind plan?",
  "Draft a reply to Alex",
  "Find invoices due this week",
];

function Row({ onPick }: { onPick?: (text: string) => void }) {
  return (
    <Suggestions aria-label="Suggestions">
      {suggestions.map((suggestion) => (
        <Suggestion key={suggestion} onClick={onPick} suggestion={suggestion} />
      ))}
    </Suggestions>
  );
}

test("an agent finds every suggestion by name and picks each, and sees only the row's scroll area besides", async () => {
  const onPick = vi.fn<(text: string) => void>();
  render(<Row onPick={onPick} />);

  expect(
    entries()
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(suggestions);
  expect(
    entries()
      .filter((entry) => entry.label === undefined)
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([{ actions: [], component: "scroll-area" }]);

  const result = await agent.act({
    steps: suggestions.map((suggestion) => ({
      action: "press",
      ref: suggestion,
    })),
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onPick.mock.calls).toEqual(suggestions.map((text) => [text]));
});

// ui-sdk 0.1.0-beta.13 lists every scroll area with no actions.
test.fails("every snapshot entry is named", () => {
  render(<Row />);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
});
