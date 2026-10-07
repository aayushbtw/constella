// no-raw-colors: styles use `colors` tokens, never the raw palette.

import { defineRule } from "vite-plus/lint/plugins";

import { styleKeys } from "../stylex.ts";

const rawColor =
  /var\(--(?:gray|red|amber|blue|green|black|white)-|#[\da-f]{3,8}\b/iu;

export const noRawColors = defineRule({
  meta: {
    messages: { raw: "Use a `colors` token, not a raw color." },
    type: "problem",
  },
  create: (context) => ({
    Literal(node) {
      if (rawColor.test(node.raw ?? "") && styleKeys(node).length > 0) {
        context.report({ messageId: "raw", node });
      }
    },
    TemplateElement(node) {
      if (rawColor.test(node.value.raw) && styleKeys(node).length > 0) {
        context.report({ messageId: "raw", node });
      }
    },
  }),
});
