import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { TraceReasoningDemo } from "./trace";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  // jsdom runs requestAnimationFrame on setInterval, which would count as the demo's timer.
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) =>
    setTimeout(frame, 16)
  );
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    removeEventListener: () => {},
  }));
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const runAgain = () =>
  screen.getByRole<HTMLButtonElement>("button", { name: "Run again" });

test("the clock stops ticking at the end of the run, and Run again restarts it", () => {
  render(<TraceReasoningDemo />);
  expect(runAgain().disabled).toBe(true);
  expect(vi.getTimerCount()).toBe(1);

  advance(5000);
  expect(runAgain().disabled).toBe(false);
  expect(screen.getByText("Thought for 3s")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);

  fireEvent.click(runAgain());
  expect(runAgain().disabled).toBe(true);
  expect(screen.getByText("Thinking")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(1);
  advance(5000);
  expect(screen.getByText("Thought for 3s")).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);
});

test("unmounting mid-run clears the timer", () => {
  const { unmount } = render(<TraceReasoningDemo />);
  advance(300);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
