// meta.name is the rule namespace: constella/box-edge.

import { definePlugin } from "vite-plus/lint/plugins";

import { boxEdge } from "./rules/box-edge.ts";
import { noFocusStyle } from "./rules/no-focus-style.ts";
import { noRawColors } from "./rules/no-raw-colors.ts";
import { noShorthandMix } from "./rules/no-shorthand-mix.ts";
import { noShorthand } from "./rules/no-shorthand.ts";

export const rules = {
  "box-edge": boxEdge,
  "no-focus-style": noFocusStyle,
  "no-raw-colors": noRawColors,
  "no-shorthand": noShorthand,
  "no-shorthand-mix": noShorthandMix,
};

export const plugin = definePlugin({
  meta: { name: "constella" },
  rules,
});
