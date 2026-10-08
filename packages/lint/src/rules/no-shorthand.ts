// no-shorthand: a four-side shorthand loses to any longhand it meets, in this file or one merged in through sx.

import { defineRule } from "vite-plus/lint/plugins";

import { keyName, styleKeys } from "../stylex.ts";

const longhands = new Map([
  ["border", "`borderBlock*` and `borderInline*`"],
  ["borderColor", "`borderBlockColor` and `borderInlineColor`"],
  ["borderRadius", "the four `border*Radius` corners"],
  ["borderStyle", "`borderBlockStyle` and `borderInlineStyle`"],
  ["borderWidth", "`borderBlockWidth` and `borderInlineWidth`"],
  ["inset", "`insetBlock` and `insetInline`"],
  ["margin", "`marginBlock` and `marginInline`"],
  ["padding", "`paddingBlock` and `paddingInline`"],
]);

export const noShorthand = defineRule({
  meta: {
    messages: {
      shorthand:
        "`{{shorthand}}` loses to any longhand merged with it, whatever the order. Use {{longhands}}.",
    },
    type: "problem",
  },
  create: (context) => ({
    Property(node) {
      const name = keyName(node);
      if (
        name !== null &&
        !node.computed &&
        longhands.has(name) &&
        styleKeys(node).length > 0
      ) {
        context.report({
          data: { longhands: longhands.get(name), shorthand: name },
          messageId: "shorthand",
          node: node.key,
        });
      }
    },
  }),
});
