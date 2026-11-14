import * as stylex from "@stylexjs/stylex";
import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vite-plus/test";

import { CodeBlock, CodeBlockContent } from "@/components/ai/code-block";

import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";

const agent = createAgent();

const hidden = stylex.create({ native: { scrollbarWidth: "none" } });
const hiddenClass = stylex.props(hidden.native).className ?? "";

function orientations(container: HTMLElement) {
  return [
    ...container.querySelectorAll<HTMLElement>(
      "[data-slot='scroll-area-scrollbar']"
    ),
  ].map((bar) => bar.dataset.orientation);
}

test("viewportRef and viewportSx reach the element that scrolls, around the children", () => {
  const viewport = createRef<HTMLDivElement>();
  render(
    <ScrollArea viewportRef={viewport} viewportSx={hidden.native}>
      <p>Release notes</p>
    </ScrollArea>
  );

  expect(viewport.current?.dataset.slot).toBe("scroll-area-viewport");
  expect(viewport.current?.classList.contains(hiddenClass)).toBe(true);
  expect(screen.getByText("Release notes").parentElement).toBe(
    viewport.current
  );
});

test("the scrollbar prop picks one axis, or none with the native bars hidden", () => {
  const vertical = render(<ScrollArea>Tags</ScrollArea>);
  expect(orientations(vertical.container)).toEqual(["vertical"]);
  expect(
    vertical.container
      .querySelector("[data-slot='scroll-area-viewport']")
      ?.classList.contains(hiddenClass)
  ).toBe(false);
  vertical.unmount();

  const horizontal = render(
    <ScrollArea scrollbar="horizontal">Gallery</ScrollArea>
  );
  expect(orientations(horizontal.container)).toEqual(["horizontal"]);
  horizontal.unmount();

  const none = render(<ScrollArea scrollbar="none">Sidebar</ScrollArea>);
  expect(orientations(none.container)).toEqual([]);
  expect(
    none.container
      .querySelector("[data-slot='scroll-area-viewport']")
      ?.classList.contains(hiddenClass)
  ).toBe(true);
});

test("a ScrollBar child adds the other axis", () => {
  const { container } = render(
    <ScrollArea>
      <table />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  expect(new Set(orientations(container))).toEqual(
    new Set(["horizontal", "vertical"])
  );
});

test("a code block's pre is the viewport, its ref reaches it, and its root sits right in the block", () => {
  const pre = createRef<HTMLPreElement>();
  const { container } = render(
    <CodeBlock>
      <CodeBlockContent ref={pre}>pnpm add ai</CodeBlockContent>
    </CodeBlock>
  );
  const block = container.querySelector("[data-slot='code-block']");
  const root = pre.current?.closest("[data-slot='scroll-area']");

  expect(pre.current?.dataset.slot).toBe("scroll-area-viewport");
  expect(root?.parentElement).toBe(block);
  expect(root?.getAttribute("dir")).toBe("ltr");
  expect(orientations(container)).toEqual(["horizontal"]);
});

test("server markup leaves the viewport without data-at-start, so it scrolls before hydration", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(
    <ScrollArea scrollbar="horizontal">Gallery</ScrollArea>
  );
  const viewport = server.querySelector<HTMLElement>(
    "[data-slot='scroll-area-viewport']"
  );

  expect(viewport).not.toBeNull();
  expect(viewport?.dataset.atStart).toBeUndefined();
});

function SuggestionRow() {
  return (
    <ScrollArea scrollbar="horizontal">
      <Button>Summarize</Button>
      <Button>Translate</Button>
      <Button>Explain code</Button>
    </ScrollArea>
  );
}

function onPage() {
  return agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
}

test("an agent finds every control in a scroll area by name, and nothing it could act on besides", () => {
  render(<SuggestionRow />);
  const entries = onPage();

  expect(
    entries
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(["Summarize", "Translate", "Explain code"]);
  expect(
    entries
      .filter((entry) => entry.component !== "button")
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([{ actions: [], component: "scroll-area" }]);
});

// ui-sdk 0.1.0-beta.1 lists every scroll area as a `scroll-area` entry with no actions, unnamed unless its root has an `aria-label`.
test.fails("every snapshot entry is named", () => {
  render(<SuggestionRow />);

  for (const entry of onPage()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
});
