// type-scale: a font size is a step of the scale. A plain one comes from `typeStyles`, which
// pairs it with its line height; raw `fontSizes` only where the size changes by condition.

import { defineRule } from "vite-plus/lint/plugins";
import type { ESTree } from "vite-plus/lint/plugins";

import { keyName, styleKeys } from "../stylex.ts";

// `inherit` and `em` sizes follow the parent's step instead of picking one.
const relative = /^(?:inherit|[\d.]+em)$/u;

function tokenKey(node: ESTree.Node, object: string) {
  if (
    node.type === "MemberExpression" &&
    node.object.type === "Identifier" &&
    node.object.name === object &&
    node.property.type === "Identifier"
  ) {
    return node.property.name;
  }
  return null;
}

export const typeScale = defineRule({
  meta: {
    messages: {
      raw: "Use a `fontSizes` step, not a raw size.",
      pair: "Set `lineHeight: lineHeights.{{step}}` beside `fontSizes.{{step}}`.",
      shared:
        "Put `typeStyles.{{step}}` before this style instead of setting `fontSizes.{{step}}`.",
    },
    type: "problem",
  },
  create: (context) => ({
    Property(node) {
      if (keyName(node) !== "fontSize" || styleKeys(node).length === 0) {
        return;
      }
      const { value } = node;
      if (value.type === "Literal") {
        if (!relative.test(String(value.value))) {
          context.report({ messageId: "raw", node: value });
        }
        return;
      }
      const step = tokenKey(value, "fontSizes");
      if (step === null || node.parent.type !== "ObjectExpression") {
        return;
      }
      // Only `typeStyles` itself names a style after its step; a pseudo-element can't take it.
      const keys = styleKeys(node);
      if (keys.some((key) => key.startsWith("::"))) {
        return;
      }
      if (keys[0] !== step) {
        context.report({ data: { step }, messageId: "shared", node: value });
        return;
      }
      const lineHeight = node.parent.properties.find(
        (property) =>
          property.type === "Property" && keyName(property) === "lineHeight"
      );
      if (
        lineHeight?.type !== "Property" ||
        tokenKey(lineHeight.value, "lineHeights") !== step
      ) {
        context.report({ data: { step }, messageId: "pair", node: value });
      }
    },
  }),
});
