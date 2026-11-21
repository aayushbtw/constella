import { readFileSync } from "node:fs";

import { render, screen } from "@testing-library/react";
import { beforeAll, expect, test } from "vite-plus/test";

import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/primitives/command";
import {
  Slider,
  SliderControl,
  SliderThumb,
  SliderTrack,
} from "@/components/primitives/slider";

// The ui-css project loads no CSS files, and jsdom can't fetch the color imports.
const base = readFileSync(
  `${import.meta.dirname}/base.css`,
  "utf-8"
).replaceAll(/^@import .*$/gmu, "");

beforeAll(() => {
  document.head.append(
    Object.assign(document.createElement("style"), { textContent: base })
  );
});

function* cssRules(list: CSSRuleList): Generator<CSSRule> {
  for (const rule of list) {
    yield rule;
    if (rule instanceof CSSGroupingRule) {
      yield* cssRules(rule.cssRules);
    }
  }
}

function ringed(control: HTMLElement | undefined, slot: string) {
  const box = control?.closest(`[data-slot='${slot}']`);
  if (box === null || box === undefined) {
    throw new Error(`no ${slot} around the control`);
  }
  return [...document.styleSheets]
    .flatMap((sheet) => [...cssRules(sheet.cssRules)])
    .some(
      (rule) =>
        rule instanceof CSSStyleRule &&
        rule.style.outline.includes("--focus-ring") &&
        box.matches(rule.selectorText)
    );
}

test("a slider thumb draws the ring while its input has keyboard focus", () => {
  render(
    <Slider aria-label="Volume" defaultValue={40}>
      <SliderControl />
    </Slider>
  );
  const input = screen.getByRole("slider");
  expect(ringed(input, "slider-thumb")).toBe(false);

  input.focus();
  expect(ringed(input, "slider-thumb")).toBe(true);
});

test("a range slider rings only the focused thumb", () => {
  render(
    <Slider defaultValue={[20, 80]}>
      <SliderControl>
        <SliderTrack>
          <SliderThumb aria-label="Minimum price" index={0} />
          <SliderThumb aria-label="Maximum price" index={1} />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
  const [first, second] = screen.getAllByRole("slider");
  second?.focus();

  expect([
    ringed(first, "slider-thumb"),
    ringed(second, "slider-thumb"),
  ]).toEqual([false, true]);
});

test("a command's search field rings its whole box while focused", () => {
  render(
    <Command aria-label="Commands">
      <CommandInput placeholder="Search" />
      <CommandList />
    </Command>
  );
  const input = screen.getByRole("combobox");
  expect(ringed(input, "input-group")).toBe(false);

  input.focus();
  expect(ringed(input, "input-group")).toBe(true);
});
