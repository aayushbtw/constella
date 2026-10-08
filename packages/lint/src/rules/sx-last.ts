// sx-last: a part that takes `sx` merges it last, so the caller's styles win; `no-unused-vars` catches a dropped one.

import { defineRule } from "vite-plus/lint/plugins";
import type { ESTree } from "vite-plus/lint/plugins";

// The styles `node` sits in, when it's an `sx` array or `stylex.props` call.
function styleList(node: ESTree.Node) {
  if (node.type === "ArrayExpression") {
    return node.elements;
  }
  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "stylex" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "props"
  ) {
    return node.arguments;
  }
  return null;
}

export const sxLast = defineRule({
  meta: {
    messages: {
      last: "Merge `sx` last, so the caller's styles win.",
    },
    type: "problem",
  },
  create: (context) => ({
    Identifier(node) {
      if (node.name !== "sx") {
        return;
      }
      const list = styleList(node.parent);
      if (list !== null && list.at(-1) !== node) {
        context.report({ messageId: "last", node });
      }
    },
  }),
});
