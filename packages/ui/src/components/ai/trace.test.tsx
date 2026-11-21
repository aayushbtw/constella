import { setTimeout as wait } from "node:timers/promises";

import { act, render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

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
import type { TraceState } from "./trace";

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

function heard() {
  const said: { role: string | null; text: string }[] = [];
  const observer = new MutationObserver((records) => {
    for (const { target } of records) {
      const element = target instanceof Element ? target : target.parentElement;
      const region = element?.closest("[data-ui-sdk-announcer]") ?? null;
      const text = region?.textContent ?? "";
      if (region !== null && text !== "") {
        said.push({ role: region.getAttribute("role"), text });
      }
    }
  });
  observer.observe(document.body, {
    characterData: true,
    childList: true,
    subtree: true,
  });
  onTestFinished(() => {
    observer.disconnect();
  });
  return said;
}

// announce() fills its region after a beat.
async function quiet() {
  await act(async () => {
    await wait(200);
  });
}

function Running({
  label,
  state,
}: {
  label: string;
  state: TraceState | undefined;
}) {
  return (
    <Trace>
      <TraceStep state={state}>
        <TraceLine>
          <TraceMarker>
            <span>icon</span>
          </TraceMarker>
          <TraceTitle>{label}</TraceTitle>
          <TraceSubject>tests</TraceSubject>
        </TraceLine>
      </TraceStep>
    </Trace>
  );
}

test("a step that finishes is announced once, politely, by its line", async () => {
  const said = heard();
  const { rerender } = render(<Running label="Running" state="running" />);

  rerender(<Running label="Ran" state={undefined} />);
  await quiet();
  rerender(<Running label="Ran" state={undefined} />);
  await quiet();

  expect(said).toEqual([{ role: "status", text: "Ran tests, done" }]);
});

test("a step that fails is announced at once", async () => {
  const said = heard();
  const { rerender } = render(<Running label="Running" state="running" />);

  rerender(<Running label="Failed to run" state="error" />);
  await quiet();

  expect(said).toEqual([{ role: "alert", text: "Failed to run tests" }]);
});

test("mounting, starting and re-rendering a step announce nothing", async () => {
  const said = heard();
  const { rerender } = render(<Running label="Run" state="pending" />);

  rerender(<Running label="Running" state="pending" />);
  rerender(<Running label="Running" state="running" />);
  rerender(<Running label="Still running" state="running" />);
  await quiet();

  expect(said).toEqual([]);
});

test("steps that mount done or failed announce nothing", async () => {
  const said = heard();

  render(<Run />);
  render(<Running label="Failed to run" state="error" />);
  await quiet();

  expect(said).toEqual([]);
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
