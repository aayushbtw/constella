import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import {
  Trace,
  TraceMarker,
  TraceStep,
  TraceStepTrigger,
  TraceTitle,
} from "@/components/ai/trace";

// jsdom applies no `(hover: hover)` rule, so read the block's own rules for each layer.
function hoverOpacities(element: Element) {
  return [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter(
      (rule): rule is CSSMediaRule =>
        rule instanceof CSSMediaRule && rule.conditionText === "(hover: hover)"
    )
    .flatMap((media) => [...media.cssRules])
    .filter(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        rule.style.opacity !== "" &&
        element.matches(rule.selectorText)
    )
    .map((rule) => rule.style.opacity);
}

function layers() {
  return [
    ...document.querySelectorAll("[data-slot='trace-marker'] > span"),
  ].map(hoverOpacities);
}

test("with a hover-capable pointer, keyboard focus on a step trigger swaps its icon for the chevron", () => {
  render(
    <Trace>
      <TraceStep>
        <TraceStepTrigger>
          <TraceMarker>
            <svg />
          </TraceMarker>
          <TraceTitle>Searched the web</TraceTitle>
        </TraceStepTrigger>
      </TraceStep>
    </Trace>
  );
  expect(layers()).toEqual([["1"], ["0"]]);

  screen.getByRole("button").focus();
  expect(layers()).toEqual([
    ["1", "0"],
    ["0", "1"],
  ]);
});
