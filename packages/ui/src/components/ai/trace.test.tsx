import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceLine,
  TraceMarker,
  TraceStep,
  TraceStepContent,
  TraceStepTrigger,
  TraceSubject,
  TraceTitle,
} from "./trace";

const onOpenChange = vi.fn<() => void>();

function Step({ open }: { open: boolean }) {
  return (
    <TraceStep onOpenChange={onOpenChange} open={open}>
      <TraceStepTrigger>
        <TraceTitle>Read</TraceTitle>
        <TraceSubject>Swedish orders</TraceSubject>
      </TraceStepTrigger>
      <TraceStepContent>Rows 1 to 40</TraceStepContent>
    </TraceStep>
  );
}

const panel = (root: ParentNode) =>
  root.querySelector("[data-slot='collapsible-panel']");

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function Run() {
  return (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceTitle>Worked</TraceTitle>
        <TraceDescription>12s</TraceDescription>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          <TraceStep defaultOpen={false}>
            <TraceStepTrigger>
              <TraceMarker>
                <span aria-hidden />
              </TraceMarker>
              <TraceTitle>Read</TraceTitle>
              <TraceSubject>Swedish orders</TraceSubject>
            </TraceStepTrigger>
            <TraceStepContent>Rows 1 to 40</TraceStepContent>
          </TraceStep>
          <TraceStep>
            <TraceStepTrigger>
              <TraceMarker>
                <span aria-hidden />
              </TraceMarker>
              <TraceTitle>Searched the web</TraceTitle>
              <TraceDescription>2 searches</TraceDescription>
            </TraceStepTrigger>
            <TraceStepContent>Two queries</TraceStepContent>
          </TraceStep>
          <TraceStep>
            <TraceStepTrigger>
              <TraceMarker>
                <span aria-hidden />
              </TraceMarker>
              <TraceTitle>Edited</TraceTitle>
              <TraceSubject>package.json</TraceSubject>
              <TraceDescription>+1 −1</TraceDescription>
            </TraceStepTrigger>
            <TraceStepContent>One line changed</TraceStepContent>
          </TraceStep>
          <TraceStep>
            <TraceLine>
              <TraceMarker>
                <span aria-hidden />
              </TraceMarker>
              <TraceTitle>Ran pnpm install</TraceTitle>
            </TraceLine>
          </TraceStep>
          <TraceStep>
            <TraceLine>
              <TraceMarker>
                <span aria-hidden />
              </TraceMarker>
              <TraceTitle>Ran pnpm build</TraceTitle>
            </TraceLine>
          </TraceStep>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  );
}

test("a step the app opens and shuts renders, and follows its open prop", () => {
  const { container, rerender } = render(<Step open={false} />);

  expect(panel(container)?.hasAttribute("hidden")).toBe(true);

  rerender(<Step open />);

  expect(panel(container)?.hasAttribute("hidden")).toBe(false);
});

test("a step's title and subject read as separate words in its text", () => {
  const { container } = render(
    <TraceStep>
      <TraceStepTrigger>
        <TraceTitle>Read</TraceTitle>
        <TraceSubject>Swedish orders</TraceSubject>
      </TraceStepTrigger>
    </TraceStep>
  );

  expect(container.textContent).toBe("Read Swedish orders");
  expect(
    renderToString(
      <TraceStep>
        <TraceStepTrigger>
          <TraceTitle>Read</TraceTitle>
          <TraceSubject>Swedish orders</TraceSubject>
        </TraceStepTrigger>
      </TraceStep>
    )
  ).toContain("</span> <span");
});

test("an agent finds the run and each step by the words a person reads", () => {
  render(<Run />);

  const labels = entries().map((entry) => entry.label);
  for (const label of [
    "Worked 12s",
    "Read Swedish orders",
    "Searched the web 2 searches",
    "Edited package.json +1 −1",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
});

// ui-sdk 0.1.0-beta.13 names a Collapsible only from a trigger, a label part or an accessible name on its root; a step with no trigger has none.
test("the only unnamed entries are the collapsibles of steps with no trigger", () => {
  render(<Run />);

  expect(
    entries()
      .filter((entry) => entry.label === undefined)
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([
    { actions: ["setOpen", "press"], component: "collapsible" },
    { actions: ["setOpen", "press"], component: "collapsible" },
  ]);
});

test("an agent opens a shut step and shuts the run by name", async () => {
  const { container } = render(<Run />);
  const panels = () =>
    container.querySelectorAll<HTMLElement>("[data-slot='collapsible-panel']");
  const runPanel = () => panels()[0];
  const stepPanel = () => panels()[1];

  expect(stepPanel()?.hasAttribute("hidden")).toBe(true);

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Read Swedish orders" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  expect(stepPanel()?.hasAttribute("hidden")).toBe(false);

  const shut = await agent.act({
    steps: [{ action: "setOpen", args: [false], ref: "Worked" }],
  });
  expect(shut.ok, shut.error?.message).toBe(true);
  expect(runPanel()?.hasAttribute("hidden")).toBe(true);
});
