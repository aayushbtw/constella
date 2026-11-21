import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { ProgressValueDemo } from "./progress";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
});

afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

test("the uploads stop ticking once every file is done, and Upload again restarts them", () => {
  render(<ProgressValueDemo />);
  expect(vi.getTimerCount()).toBe(1);

  advance(5000);
  expect(screen.getAllByText("Done")).toHaveLength(3);
  expect(vi.getTimerCount()).toBe(0);

  fireEvent.click(screen.getByRole("button", { name: "Upload again" }));
  expect(screen.queryAllByText("Done")).toHaveLength(0);
  expect(vi.getTimerCount()).toBe(1);
  advance(200);
  expect(screen.getByText("0.9 MB of 8.4 MB")).toBeTruthy();
});

test("unmounting mid-upload clears the timer", () => {
  const { unmount } = render(<ProgressValueDemo />);
  advance(200);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
