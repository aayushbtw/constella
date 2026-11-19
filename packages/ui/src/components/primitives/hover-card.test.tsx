import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./hover-card";
import type { HoverCardController } from "./hover-card";

const agent = createAgent();

afterEach(() => {
  if (vi.isFakeTimers()) {
    vi.runOnlyPendingTimers();
  }
  vi.useRealTimers();
});

function Profile() {
  return (
    <HoverCard>
      <HoverCardTrigger href="https://acme.com">@acme</HoverCardTrigger>
      <HoverCardContent>Tools for teams that ship.</HoverCardContent>
    </HoverCard>
  );
}

interface Person {
  bio: string;
  name: string;
}

const people: Person[] = [
  { bio: "Building shadcn/ui.", name: "shadcn" },
  { bio: "Design engineer.", name: "emil" },
];

function Mentions({ controller }: { controller: HoverCardController<Person> }) {
  return (
    <>
      {people.map((person) => (
        <HoverCardTrigger
          controller={controller}
          href={`https://github.com/${person.name}`}
          key={person.name}
          payload={person}
        >
          {person.name}
        </HoverCardTrigger>
      ))}
      <HoverCard controller={controller}>
        <HoverCardContent<Person>>
          {({ payload }) => <a href={`#${payload?.name}`}>{payload?.bio}</a>}
        </HoverCardContent>
      </HoverCard>
    </>
  );
}

const content = () =>
  document.querySelector<HTMLElement>("[data-slot='hover-card-content']");

function tabTo(element: HTMLElement) {
  fireEvent.keyDown(document.activeElement ?? document.body, { key: "Tab" });
  act(() => {
    element.focus();
  });
}

async function wait(time: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(time);
  });
}

test("it opens and closes on the token delays", async () => {
  vi.useFakeTimers();
  render(<Profile />);
  const trigger = screen.getByRole("link", { name: "@acme" });

  fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
  await wait(Number.parseFloat(durations.hoverCardDelay) - 1);
  expect(content()).toBeNull();
  await wait(1);
  expect(screen.getByText("Tools for teams that ship.")).toBeTruthy();
  expect(Object.hasOwn(trigger.dataset, "open")).toBe(true);

  fireEvent.pointerLeave(trigger, {
    clientX: 500,
    clientY: 500,
    pointerType: "mouse",
  });
  await wait(Number.parseFloat(durations.hoverCardCloseDelay) - 1);
  expect(Object.hasOwn(trigger.dataset, "open")).toBe(true);
  await wait(1);
  expect(Object.hasOwn(trigger.dataset, "open")).toBe(false);
});

test("a shared card shows the payload of the trigger that opened it", async () => {
  vi.useFakeTimers();
  const controller = createHoverCardController<Person>();
  render(<Mentions controller={controller} />);

  fireEvent.pointerEnter(screen.getByRole("link", { name: "emil" }), {
    pointerType: "mouse",
  });
  await wait(Number.parseFloat(durations.hoverCardDelay));

  expect(screen.getByText("Design engineer.")).toBeTruthy();
  expect(controller.getPayload()).toBe(people[1]);
});

test("the open card glides to a new trigger for one move, and doesn't on its first open", async () => {
  vi.useFakeTimers();
  const controller = createHoverCardController<Person>();
  render(<Mentions controller={controller} />);

  act(() => {
    void controller.open({ payload: people[0] });
  });
  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(false);

  fireEvent.pointerEnter(screen.getByRole("link", { name: "emil" }), {
    pointerType: "mouse",
  });
  expect(screen.getByText("Design engineer.")).toBeTruthy();
  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(true);

  await wait(Number.parseFloat(durations.move) - 1);
  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(true);

  await wait(1);
  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(false);
});

test("focus leaving the open card for the next trigger moves the card at once", async () => {
  vi.useFakeTimers();
  const controller = createHoverCardController<Person>();
  render(<Mentions controller={controller} />);
  const emil = screen.getByRole("link", { name: "emil" });

  tabTo(screen.getByRole("link", { name: "shadcn" }));
  await wait(Number.parseFloat(durations.hoverCardDelay) - 1);
  expect(content()).toBeNull();
  await wait(1);
  tabTo(screen.getByRole("link", { name: "Building shadcn/ui." }));
  tabTo(emil);
  await wait(0);

  expect(screen.getByText("Design engineer.")).toBeTruthy();
  expect(Object.hasOwn(emil.dataset, "open")).toBe(true);
});

test("closing mid-move drops the glide", () => {
  vi.useFakeTimers();
  const controller = createHoverCardController<Person>();
  render(<Mentions controller={controller} />);
  act(() => {
    void controller.open({ payload: people[0] });
  });
  act(() => {
    void controller.open({ payload: people[1] });
  });
  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(true);

  act(() => {
    controller.close();
  });

  expect(Object.hasOwn(content()?.dataset ?? {}, "moving")).toBe(false);
});

test("the server markup keeps the trigger a link", () => {
  const html = renderToString(<Profile />);

  expect(html).toMatch(/<a[^>]*href="https:\/\/acme.com"/u);
  expect(html).toContain("@acme");
});

test("a trigger's payload is checked against its controller", () => {
  const controller = createHoverCardController<Person>();
  render(
    <>
      {/* @ts-expect-error a string isn't a Person */}
      <HoverCardTrigger controller={controller} href="/" payload="shadcn">
        shadcn
      </HoverCardTrigger>
      <HoverCardTrigger href="/" payload="anything">
        anything
      </HoverCardTrigger>
    </>
  );
  expect(screen.getAllByRole("link")).toHaveLength(2);
});

test("an agent finds the card by its trigger and opens it", async () => {
  render(<Profile />);

  const closed = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of closed) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(closed.map((entry) => entry.label)).toContain("@acme");

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "@acme" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  expect(screen.getByText("Tools for teams that ship.")).toBeTruthy();
});
