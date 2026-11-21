import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vite-plus/test";

import { SwapText } from "@/components/primitives/swap-text";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: false,
    media: query,
    removeEventListener: () => {},
  }));
  return () => {
    vi.unstubAllGlobals();
  };
});

function root() {
  const element = document.querySelector("[data-slot='swap-text']");
  if (element === null) {
    throw new Error("no swap text");
  }
  return element;
}

test("base.css hands Torph's unlayered root rule back to the component's layer", () => {
  const css = readFileSync(
    `${import.meta.dirname}/../../lib/constella/base.css`,
    "utf-8"
  ).replaceAll(/^@import .*$/gmu, "");
  document.head.append(
    Object.assign(document.createElement("style"), { textContent: css })
  );
  render(<SwapText>Follow</SwapText>);

  const rules = [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule && root().matches(rule.selectorText)
    );
  const torph = rules.find((rule) => rule.selectorText === "[torph-root]");
  const handBack = rules.find((rule) =>
    rule.selectorText.startsWith('[data-slot="swap-text"]')
  );

  const torphProperties = [...(torph?.style ?? [])];
  expect(torphProperties).toContain("display");
  expect(
    torphProperties.filter(
      (name) => handBack?.style.getPropertyValue(name) !== "revert-layer"
    )
  ).toEqual([]);
});
