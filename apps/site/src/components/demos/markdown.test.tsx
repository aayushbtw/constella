import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { MarkdownStreamingDemo } from "./markdown";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  // jsdom runs requestAnimationFrame on setInterval, which would count as the demo's timer.
  vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) =>
    setTimeout(frame, 16)
  );
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

const streamAgain = () =>
  screen.getByRole<HTMLButtonElement>("button", { name: "Stream again" });

test("streaming stops ticking at the end of the answer, and Stream again restarts it", () => {
  render(<MarkdownStreamingDemo />);
  expect(streamAgain().disabled).toBe(true);
  expect(vi.getTimerCount()).toBe(1);

  advance(10_000);
  expect(streamAgain().disabled).toBe(false);
  expect(screen.getByText(/Accounts that signed in/u)).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);

  fireEvent.click(streamAgain());
  expect(streamAgain().disabled).toBe(true);
  expect(screen.queryByText(/Accounts that signed in/u)).toBeNull();
  expect(vi.getTimerCount()).toBe(1);
  advance(10_000);
  expect(screen.getByText(/Accounts that signed in/u)).toBeTruthy();
  expect(vi.getTimerCount()).toBe(0);
});

test("unmounting mid-stream clears the timer", () => {
  const { unmount } = render(<MarkdownStreamingDemo />);
  advance(90);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
