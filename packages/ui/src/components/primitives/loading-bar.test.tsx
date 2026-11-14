import { act, cleanup, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import { LoadingBar } from "./loading-bar";

const agent = createAgent();
const loadingDelay = Number.parseFloat(durations.loadingDelay);

let reducedMotion = false;
const animate = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  reducedMotion = false;
  animate.mockClear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    removeEventListener: () => {},
  }));
  Element.prototype.animate = animate;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(Element.prototype, "animate");
});

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function runAll() {
  act(() => {
    vi.runAllTimers();
  });
}

function showBar() {
  const view = render(<LoadingBar aria-label="Loading page" loading />);
  advance(loadingDelay);
  return view;
}

test("a load that ends within the delay never shows a bar", () => {
  const { rerender } = render(<LoadingBar aria-label="Loading page" loading />);
  advance(loadingDelay - 1);
  rerender(<LoadingBar aria-label="Loading page" loading={false} />);
  runAll();

  expect(screen.queryByRole("progressbar")).toBeNull();
});

test("past the delay, a named bar with no value shows", () => {
  showBar();
  const bar = screen.getByRole("progressbar", { name: "Loading page" });

  expect(bar.hasAttribute("aria-valuenow")).toBe(false);
  expect(bar.dataset.state).toBe("shown");
});

test("when loading ends, the bar finishes, then goes", () => {
  const { rerender } = showBar();
  rerender(<LoadingBar aria-label="Loading page" loading={false} />);
  advance(0);

  expect(screen.getByRole("progressbar").dataset.state).toBe("finishing");

  runAll();

  expect(screen.queryByRole("progressbar")).toBeNull();
});

test("loading again while finishing returns the same bar to shown", () => {
  const { rerender } = showBar();
  const bar = screen.getByRole("progressbar");
  rerender(<LoadingBar aria-label="Loading page" loading={false} />);
  advance(0);
  rerender(<LoadingBar aria-label="Loading page" loading />);
  advance(0);

  expect(screen.getByRole("progressbar")).toBe(bar);
  expect(bar.dataset.state).toBe("shown");
});

test("the bar animates its fill, unless reduced motion is on", () => {
  showBar();

  expect(animate).toHaveBeenCalled();

  cleanup();
  animate.mockClear();
  reducedMotion = true;
  const { rerender } = showBar();
  rerender(<LoadingBar aria-label="Loading page" loading={false} />);
  advance(0);

  expect(animate).not.toHaveBeenCalled();
});

test("an agent sees the shown bar by its name", () => {
  showBar();

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(components.map((entry) => entry.label)).toEqual(["Loading page"]);
});
