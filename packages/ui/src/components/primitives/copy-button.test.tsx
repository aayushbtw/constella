import { fireEvent, render, screen } from "@testing-library/react";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import { CopyButton } from "./copy-button";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });
}

async function heard(text: string, role: "alert" | "status") {
  await vi.waitFor(() => {
    expect(
      screen.getAllByRole(role).map((region) => region.textContent)
    ).toContain(text);
  });
}

test("a refused copy is announced at once and never reported as copied", async () => {
  stubClipboard(
    vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValue(
        new DOMException("Write permission denied.", "NotAllowedError")
      )
  );
  render(<CopyButton value="secret" />);

  fireEvent.click(screen.getByRole("button", { name: "Copy" }));

  await heard("Couldn't copy", "alert");
  expect(
    screen.queryAllByRole("status").map((region) => region.textContent)
  ).not.toContain("Copied");
});

test("a copy is announced politely, and the button keeps its name", async () => {
  const writeText = vi.fn<(text: string) => Promise<void>>(async () => {});
  stubClipboard(writeText);
  render(<CopyButton value="npx constella add button" />);

  fireEvent.click(screen.getByRole("button", { name: "Copy" }));

  await heard("Copied", "status");
  expect(writeText).toHaveBeenCalledWith("npx constella add button");
  expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
});
