// no-focus-style: focus is drawn once, globally, so every control shows it the same way.

import { defineRule } from "vite-plus/lint/plugins";

import { keyName, styleKeys } from "../stylex.ts";

export const noFocusStyle = defineRule({
  meta: {
    messages: {
      focus:
        "Focus is drawn once, in base.css. Don't style `{{name}}` in a component.",
    },
    type: "problem",
  },
  create: (context) => ({
    Property(node) {
      const name = keyName(node);
      if (name?.startsWith("outline") === true && styleKeys(node).length > 0) {
        context.report({ data: { name }, messageId: "focus", node: node.key });
      }
    },
  }),
});
