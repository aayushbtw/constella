import { act, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import { Suggestion, Suggestions } from "./suggestions";
import type { SuggestionProps } from "./suggestions";

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

type OnPick = NonNullable<SuggestionProps["onClick"]>;

function Row({ onPick }: { onPick?: OnPick }) {
  return (
    <Suggestions aria-label="Suggestions">
      {suggestions.map((suggestion) => (
        <Suggestion key={suggestion} onClick={onPick} suggestion={suggestion} />
      ))}
    </Suggestions>
  );
}

// ui-sdk 0.1.0-beta.13 lists every scroll area unnamed and with no actions.
test("an agent finds every suggestion by name and picks each as the agent, and sees only the row's scroll area besides", async () => {
  const onPick = vi.fn<OnPick>();
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
  expect(onPick.mock.calls.map(([text, { source }]) => [text, source])).toEqual(
    suggestions.map((text) => [text, "agent"])
  );
});

test("an agent's press waits for a Promise from onClick, and the suggestion is pending until it settles", async () => {
  const { promise, resolve } = Promise.withResolvers<null>();
  const onPick = vi.fn<OnPick>(async () => await promise);
  render(<Row onPick={onPick} />);
  const suggestion = screen.getByRole("button", {
    name: "Draft a reply to Alex",
  });

  let settled = false;
  const acting = agent
    .act({ steps: [{ action: "press", ref: "Draft a reply to Alex" }] })
    .then((result) => {
      settled = true;
      return result;
    });
  await vi.waitFor(() => {
    expect(suggestion.dataset.pending).toBeDefined();
  });
  expect(settled).toBe(false);

  await act(async () => {
    resolve(null);
    await promise;
  });
  const result = await acting;
  expect(result.ok, result.error?.message).toBe(true);
  expect(suggestion.dataset.pending).toBeUndefined();
  expect(onPick.mock.calls.map(([text, { source }]) => [text, source])).toEqual(
    [["Draft a reply to Alex", "agent"]]
  );
});
