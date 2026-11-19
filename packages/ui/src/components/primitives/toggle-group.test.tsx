import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { afterEach, expect, test } from "vite-plus/test";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import type { ToggleGroupProps } from "./toggle-group";

const agent = createAgent();

afterEach(() => {
  document.documentElement.removeAttribute("dir");
});

const button = (name: string) => screen.getByRole("button", { name });
const isPressed = (name: string) => button(name).matches("[data-pressed]");

function Formatting(props: Omit<ToggleGroupProps, "children">) {
  return (
    <ToggleGroup aria-label="Formatting" {...props}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem disabled value="underline">
        Underline
      </ToggleGroupItem>
      <ToggleGroupItem value="strike">Strike</ToggleGroupItem>
    </ToggleGroup>
  );
}

test("the group and its items mirror its options as data attributes", () => {
  render(<Formatting size="sm" spacing={0} variant="outline" />);
  expect(
    screen.getByRole("group", { name: "Formatting" }).dataset
  ).toMatchObject({
    size: "sm",
    slot: "toggle-group",
    spacing: "0",
    variant: "outline",
  });
  expect(button("Bold").dataset).toMatchObject({
    size: "sm",
    slot: "toggle",
    variant: "outline",
  });
});

test("one pressed at a time: a press replaces the other, and a second press clears it", () => {
  render(<Formatting defaultValue={["bold"]} />);
  fireEvent.click(button("Italic"));
  expect(isPressed("Bold")).toBe(false);
  expect(isPressed("Italic")).toBe(true);

  fireEvent.click(button("Italic"));
  expect(isPressed("Italic")).toBe(false);
});

test("deselectable={false} keeps one pressed", () => {
  render(<Formatting defaultValue={["bold"]} deselectable={false} />);
  fireEvent.click(button("Bold"));
  expect(isPressed("Bold")).toBe(true);
});

test("multiple keeps every press", () => {
  render(<Formatting multiple />);
  fireEvent.click(button("Bold"));
  fireEvent.click(button("Italic"));
  expect(isPressed("Bold")).toBe(true);
  expect(isPressed("Italic")).toBe(true);
});

function Controlled() {
  const [value, setValue] = useState<("a" | "b")[]>(["a"]);
  return (
    <>
      <ToggleGroup
        aria-label="Letters"
        multiple
        onValueChange={setValue}
        value={value}
      >
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
      <output>{value.join(",")}</output>
    </>
  );
}

test("a controlled group reports its narrowed values", () => {
  render(<Controlled />);
  fireEvent.click(button("B"));
  expect(screen.getByRole("status").textContent).toBe("a,b");
  expect(isPressed("B")).toBe(true);
});

test("a disabled item stays reachable but ignores presses", () => {
  render(<Formatting multiple />);
  const underline = button("Underline");
  expect(underline.getAttribute("aria-disabled")).toBe("true");
  expect(underline.matches("[data-disabled]")).toBe(true);
  expect(underline.matches(":disabled")).toBe(false);

  fireEvent.click(underline);
  expect(isPressed("Underline")).toBe(false);

  button("Italic").focus();
  fireEvent.keyDown(button("Italic"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(underline);
});

test("a disabled group marks every item and presses nothing", () => {
  render(<Formatting disabled multiple />);
  for (const name of ["Bold", "Italic", "Underline", "Strike"]) {
    expect(button(name).matches("[data-disabled]")).toBe(true);
    fireEvent.click(button(name));
    expect(isPressed(name)).toBe(false);
  }
});

test("the group is one tab stop, and arrows move focus without pressing", () => {
  render(<Formatting multiple />);
  const stops = screen
    .getAllByRole("button")
    .filter((item) => item.tabIndex === 0);
  expect(stops).toEqual([button("Bold")]);

  button("Bold").focus();
  fireEvent.keyDown(button("Bold"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(button("Italic"));
  fireEvent.keyDown(button("Italic"), { key: "ArrowLeft" });
  expect(document.activeElement).toBe(button("Bold"));
  expect(isPressed("Bold")).toBe(false);
  expect(isPressed("Italic")).toBe(false);
});

test("right to left, ArrowLeft moves forward", () => {
  document.documentElement.dir = "rtl";
  render(<Formatting multiple />);
  button("Bold").focus();
  fireEvent.keyDown(button("Bold"), { key: "ArrowLeft" });
  expect(document.activeElement).toBe(button("Italic"));
});

test("a vertical group moves with ArrowDown", () => {
  render(<Formatting multiple orientation="vertical" />);
  button("Bold").focus();
  fireEvent.keyDown(button("Bold"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(button("Bold"));
  fireEvent.keyDown(button("Bold"), { key: "ArrowDown" });
  expect(document.activeElement).toBe(button("Italic"));
});

test("an agent finds the group and every toggle by name and presses one", async () => {
  render(<Formatting multiple />);
  const labels = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more")
    .map((entry) => entry.label);
  expect(labels).toEqual([
    "Bold",
    "Italic",
    "Underline",
    "Strike",
    "Formatting",
  ]);

  const result = await agent.act({
    steps: [{ action: "toggle", args: [], ref: "Italic" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(button("Italic").getAttribute("aria-pressed")).toBe("true");
});
