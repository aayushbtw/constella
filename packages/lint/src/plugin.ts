// meta.name is the rule namespace: constella/box-edge.

import { definePlugin } from "vite-plus/lint/plugins";

import { boxEdge } from "./rules/box-edge.ts";
import { noFocusStyle } from "./rules/no-focus-style.ts";
import { noRawColors } from "./rules/no-raw-colors.ts";

export const rules = {
  "box-edge": boxEdge,
  "no-focus-style": noFocusStyle,
  "no-raw-colors": noRawColors,
};

export const plugin = definePlugin({
  meta: { name: "constella" },
  rules,
});
