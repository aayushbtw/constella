import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test } from "vite-plus/test";

import { createSkipMotion } from "@/lib/constella/motion";

interface Details {
  reason: string;
  source: string;
}

const [SkipMotion, useSkipMotion] = createSkipMotion();

function Part({ name }: { name: string }) {
  return (
    <div data-skip-motion={useSkipMotion() || undefined} data-testid={name} />
  );
}

function Root({
  children,
  details,
  inherit,
  name,
  onOpenChange,
  skips,
}: {
  children?: ReactNode;
  details: Details;
  inherit?: boolean;
  name: string;
  onOpenChange?: (open: boolean, details: Details) => void;
  skips?: (open: boolean, details: Details) => boolean;
}) {
  return (
    <SkipMotion inherit={inherit} onOpenChange={onOpenChange} skips={skips}>
      {({ onOpenChange: handleOpenChange, onOpenChangeComplete }) => (
        <>
          <button
            onClick={() => {
              handleOpenChange(true, details);
            }}
            type="button"
          >
            Open {name}
          </button>
          <button
            onClick={() => {
              onOpenChangeComplete(false);
            }}
            type="button"
          >
            Finish closing {name}
          </button>
          <Part name={name} />
          {children}
        </>
      )}
    </SkipMotion>
  );
}

const keyboard = { reason: "trigger-press", source: "keyboard" };
const mouse = { reason: "trigger-press", source: "mouse" };

function open(name: string) {
  fireEvent.click(screen.getByRole("button", { name: `Open ${name}` }));
}

function skipped(name: string) {
  return Object.hasOwn(screen.getByTestId(name).dataset, "skipMotion");
}

test("a keyboard open stamps the root's parts, and the change still reaches the caller", () => {
  const changes: [boolean, Details][] = [];
  render(
    <Root
      details={keyboard}
      name="menu"
      onOpenChange={(isOpen, details) => {
        changes.push([isOpen, details]);
      }}
    />
  );
  expect(skipped("menu")).toBe(false);

  open("menu");

  expect(skipped("menu")).toBe(true);
  expect(changes).toEqual([[true, keyboard]]);
});

test("a pointer open leaves the parts animated", () => {
  render(<Root details={mouse} name="menu" />);
  open("menu");
  expect(skipped("menu")).toBe(false);
});

test("a root's own skips decides", () => {
  render(
    <Root
      details={mouse}
      name="dialog"
      skips={(isOpen, details) => isOpen && details.source === "mouse"}
    />
  );
  open("dialog");
  expect(skipped("dialog")).toBe(true);
});

test("a nested root keeps its own skip unless it inherits", () => {
  render(
    <Root details={keyboard} name="menu">
      <Root details={mouse} inherit name="submenu" />
      <Root details={mouse} name="nested" />
    </Root>
  );
  open("menu");
  open("submenu");
  open("nested");

  expect(skipped("submenu")).toBe(true);
  expect(skipped("nested")).toBe(false);
});

test("a finished close clears the skip, so an open with no change details animates", () => {
  render(<Root details={keyboard} name="dialog" />);
  open("dialog");
  expect(skipped("dialog")).toBe(true);

  fireEvent.click(
    screen.getByRole("button", { name: "Finish closing dialog" })
  );

  expect(skipped("dialog")).toBe(false);
});
