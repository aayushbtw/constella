import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import { Citation, Citations } from "./citation";
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

test("a citation's pill opens the shared card with a link to each source", async () => {
  vi.useFakeTimers();
  render(
    <Citations>
      <Citation sources={[withoutLogo, second]} />
    </Citations>
  );
  const pill = screen.getByRole("link", { name: /Acme Journal/u });
  expect(pill.dataset.slot).toBe("hover-card-trigger");

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

test("an agent finds the citation's card by its pill", () => {
  render(
    <Citations>
      <Citation sources={[withoutLogo, second]} />
    </Citations>
  );

  const card = agent
    .snapshot()
    .find((entry) => entry.component === "hover-card");
  expect(card?.label).toContain("Acme Journal");
});
