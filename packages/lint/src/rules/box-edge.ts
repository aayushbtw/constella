// box-edge: a box's border is `border`; `borderSubtle` is for dividers.

import { defineRule } from "vite-plus/lint/plugins";

import { styleKeys } from "../stylex.ts";

const boxColors = new Set([
  "borderBlockColor",
  "borderColor",
  "borderInlineColor",
]);

export const boxEdge = defineRule({
  meta: {
    messages: {
      edge: "A box's edge is `colors.border`. `borderSubtle` is for dividers.",
    },
    type: "problem",
  },
  create: (context) => ({
    MemberExpression(node) {
      if (
        node.object.type === "Identifier" &&
        node.object.name === "colors" &&
        node.property.type === "Identifier" &&
        node.property.name === "borderSubtle" &&
        styleKeys(node).some((key) => boxColors.has(key))
      ) {
        context.report({ messageId: "edge", node });
      }
    },
  }),
});
