import { act, render } from "@testing-library/react";
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
