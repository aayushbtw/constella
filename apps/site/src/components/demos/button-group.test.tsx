import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { ButtonGroupInputGroupDemo, ButtonGroupTextDemo } from "./button-group";
import { InputGroupButtonDemo } from "./input-group";

const agent = createAgent();

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: false,
    media: query,
    removeEventListener: () => {},
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("voice mode flips once per click and disables the message input", () => {
  render(<ButtonGroupInputGroupDemo />);
  const voice = screen.getByRole("button", { name: "Voice mode" });
  const message = screen.getByRole("textbox", { name: "Message" });
  expect(voice.getAttribute("aria-pressed")).toBe("false");
  expect(message).toHaveProperty("disabled", false);

  fireEvent.click(voice);
  expect(voice.getAttribute("aria-pressed")).toBe("true");
  expect(message).toHaveProperty("disabled", true);

  fireEvent.click(voice);
  expect(voice.getAttribute("aria-pressed")).toBe("false");
  expect(message).toHaveProperty("disabled", false);
});

test("an agent sees voice mode as one toggle entry", () => {
  render(<ButtonGroupInputGroupDemo />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.label === "Voice mode");
  expect(entries.map((entry) => entry.component)).toEqual(["toggle"]);
});

test("favorite flips once per click", () => {
  render(<InputGroupButtonDemo />);
  const favorite = screen.getByRole("button", { name: "Favorite" });
  expect(favorite.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(favorite);
  expect(favorite.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(favorite);
  expect(favorite.getAttribute("aria-pressed")).toBe("false");
});

test("the https:// prefix labels the URL input", () => {
  render(<ButtonGroupTextDemo />);
  expect(screen.getByRole("textbox", { name: "https://" })).toBeDefined();
});
