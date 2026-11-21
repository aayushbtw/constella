import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import { Citation, Citations, CitationSource } from "./citation";
import type { Source } from "./citation";

const agent = createAgent();

const withoutLogo: Source = {
  name: "Acme Journal",
  title: "A headline",
  url: "https://acme.example/story",
};
const withLogo: Source = { ...withoutLogo, icon: "/logos/acme.png" };

function Cited({ source }: { source: Source }) {
  return (
    <Citations>
      <Citation sources={[source]} />
    </Citations>
  );
}

const globe = (root: ParentNode) =>
  root.querySelector("[data-slot='avatar-fallback'] svg");

afterEach(() => {
  if (vi.isFakeTimers()) {
    vi.runOnlyPendingTimers();
  }
  vi.useRealTimers();
});

test("a citation's logo is fetched without a referrer and holds the globe back while it loads", async () => {
  vi.useFakeTimers();
  const { container } = render(<Cited source={withLogo} />);

  expect(container.querySelector("img")?.getAttribute("referrerpolicy")).toBe(
    "no-referrer"
  );
  expect(globe(container)).toBeNull();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(
      Number.parseFloat(durations.fallbackDelay)
    );
  });

  expect(globe(container)).not.toBeNull();
});

test("a citation's server markup holds no globe while its logo loads", () => {
  const html = renderToString(<Cited source={withLogo} />);

  expect(html).toContain("<img");
  expect(html).not.toContain("<svg");
});

test("a citation's server pill is still drawn as a badge", () => {
  const html = renderToString(<Cited source={withoutLogo} />);

  expect(html).toMatch(/<a[^>]*data-badge=""/u);
});

test("a citation without a logo shows the globe at once", () => {
  const { container } = render(<Cited source={withoutLogo} />);

  expect(globe(container)).not.toBeNull();
});

test("an agent doesn't see a citation's logo", () => {
  render(
    <>
      <Cited source={withLogo} />
      <Cited source={withoutLogo} />
    </>
  );

  expect(agent.snapshot().some((entry) => entry.component === "avatar")).toBe(
    false
  );
});

const second: Source = {
  name: "Beta Times",
  title: "Another headline",
  url: "https://beta.example/story",
};

test("sources listed outside the card are links an agent can press", () => {
  render(
    <>
      <CitationSource source={withoutLogo} />
      <CitationSource source={second} />
    </>
  );

  const links = screen.getAllByRole("link");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    withoutLogo.url,
    second.url,
  ]);
  expect(links.every((link) => link.dataset.slot === "citation-source")).toBe(
    true
  );
  const pressable = agent
    .snapshot()
    .filter(
      (entry) => entry.offPage !== true && entry.actions.includes("press")
    );
  expect(pressable.map((entry) => entry.label)).toEqual([
    "Acme Journal, A headline",
    "Beta Times, Another headline",
  ]);
});

test("a citation's pill opens the shared card with a link to each source", async () => {
  vi.useFakeTimers();
  render(
    <Citations>
      <Citation sources={[withoutLogo, second]} />
    </Citations>
  );
  const pill = screen.getByRole("link", { name: /Acme Journal/u });
  expect(pill.dataset.slot).toBe("hover-card-trigger");
  expect(pill.dataset.badge).toBe("");

  fireEvent.pointerEnter(pill, { pointerType: "mouse" });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(
      Number.parseFloat(durations.hoverCardDelay)
    );
  });

  const card = document.querySelector("[data-slot='hover-card-content']");
  const links = [...(card?.querySelectorAll("a") ?? [])];
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    withoutLogo.url,
    second.url,
  ]);
});

test("a citation passes its other props to the trigger link, which still opens the card", async () => {
  vi.useFakeTimers();
  const onClick = vi.fn((event: { preventDefault: () => void }) => {
    event.preventDefault();
  });
  render(
    <Citations>
      <Citation aria-describedby="note" onClick={onClick} sources={[second]} />
    </Citations>
  );
  const pill = screen.getByRole("link", { name: /Beta Times/u });
  expect(pill.getAttribute("aria-describedby")).toContain("note");

  fireEvent.click(pill);
  expect(onClick).toHaveBeenCalledTimes(1);

  fireEvent.pointerEnter(pill, { pointerType: "mouse" });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(
      Number.parseFloat(durations.hoverCardDelay)
    );
  });
  expect(
    document.querySelector<HTMLAnchorElement>(
      "[data-slot='hover-card-content'] a"
    )?.dataset.slot
  ).toBe("citation-source");
});

const hoverCard = () =>
  agent
    .snapshot()
    .find(
      (entry) => entry.offPage !== true && entry.component === "hover-card"
    );

function TwoPills({ label }: { label?: string }) {
  return (
    <Citations aria-label={label}>
      <Citation sources={[withoutLogo]} />
      <Citation sources={[second]} />
    </Citations>
  );
}

test("an agent finds a one-pill card by its pill, not the card's name", () => {
  render(
    <Citations>
      <Citation sources={[withoutLogo, second]} />
    </Citations>
  );

  expect(hoverCard()?.label).toContain("Acme Journal");
  expect(hoverCard()?.label).not.toContain("Sources");
});

test("an agent finds a card shared by several pills as Sources", () => {
  render(<TwoPills />);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(hoverCard()?.label).toBe("Sources");
});

test("each answer's citations can name their card", () => {
  render(<TwoPills label="Sources for answer 2" />);

  expect(hoverCard()?.label).toBe("Sources for answer 2");
});

test("the shared card stays in the page, hidden, while closed", () => {
  render(<TwoPills />);

  const card = document.querySelector("[data-slot='hover-card-content']");
  expect(card).not.toBeNull();
  expect(card?.hasAttribute("hidden")).toBe(true);
});

test("the shared card's server markup is there but hidden", () => {
  const html = renderToString(<Cited source={withoutLogo} />);

  expect(html).toMatch(
    /<div[^>]*aria-label="Sources"[^>]*data-slot="hover-card-content"[^>]*hidden=""/u
  );
});

test("an agent opens the shared card, which is empty until a pill picks its sources", async () => {
  render(<TwoPills />);

  const result = await agent.act({
    steps: [{ ref: "Sources", action: "setOpen", args: [true] }],
  });

  expect(result.ok, result.error?.message).toBe(true);
  const card = document.querySelector("[data-slot='hover-card-content']");
  expect(card?.hasAttribute("hidden")).toBe(false);
  expect(card?.querySelectorAll("a")).toHaveLength(0);
});
