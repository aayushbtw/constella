// no-shorthand-mix: StyleX lets a longhand beat its shorthand whatever their order, so a file sets each edge one way.

import { defineRule } from "vite-plus/lint/plugins";
import type { ESTree } from "vite-plus/lint/plugins";

import { keyName } from "../stylex.ts";

const sides = {
  "": ["bs", "be", "is", "ie"],
  Block: ["bs", "be"],
  BlockEnd: ["be"],
  BlockStart: ["bs"],
  Bottom: ["be"],
  Inline: ["is", "ie"],
  InlineEnd: ["ie"],
  InlineStart: ["is"],
  Left: ["is"],
  Right: ["ie"],
  Top: ["bs"],
};

// Each property's edges, so two properties conflict when they share some but not all.
const edges = new Map<string, string[]>();
for (const [side, atoms] of Object.entries(sides)) {
  for (const box of ["margin", "padding", "scrollMargin", "scrollPadding"]) {
    edges.set(
      box + side,
      atoms.map((atom) => `${box}:${atom}`)
    );
  }
  edges.set(
    side === "" || side.startsWith("Block") || side.startsWith("Inline")
      ? `inset${side}`
      : side.toLowerCase(),
    atoms.map((atom) => `inset:${atom}`)
  );
  for (const part of ["", "Width", "Color", "Style"]) {
    const subs = part === "" ? ["Width", "Color", "Style"] : [part];
    edges.set(
      `border${side}${part}`,
      subs.flatMap((sub) => atoms.map((atom) => `border${sub}:${atom}`))
    );
  }
}
edges.set("borderRadius", ["ss", "se", "es", "ee"]);
for (const [corner, physical, logical] of [
  ["ss", "TopLeft", "StartStart"],
  ["se", "TopRight", "StartEnd"],
  ["es", "BottomLeft", "EndStart"],
  ["ee", "BottomRight", "EndEnd"],
]) {
  edges.set(`border${physical}Radius`, [corner]);
  edges.set(`border${logical}Radius`, [corner]);
}

export const noShorthandMix = defineRule({
  meta: {
    messages: {
      mix: "`{{shorthand}}` and `{{longhand}}` both set an edge, and StyleX lets the longhand win whatever the order. Use longhands.",
    },
    type: "problem",
  },
  create: (context) => {
    let stylex = false;
    const found = new Map<string, ESTree.Node[]>();
    return {
      ImportDeclaration(node) {
        stylex ||= node.source.value === "@stylexjs/stylex";
      },
      Property(node) {
        const name = keyName(node);
        if (
          name !== null &&
          !node.computed &&
          edges.has(name) &&
          node.parent.type === "ObjectExpression"
        ) {
          found.set(name, [...(found.get(name) ?? []), node.key]);
        }
      },
      "Program:exit"() {
        if (!stylex) {
          return;
        }
        for (const shorthand of found.keys()) {
          const covers = new Set(edges.get(shorthand));
          const longhand = [...found.keys()].find((other) => {
            const otherEdges = edges.get(other) ?? [];
            return (
              otherEdges.length < covers.size &&
              otherEdges.some((edge) => covers.has(edge))
            );
          });
          if (longhand !== undefined) {
            for (const node of found.get(shorthand) ?? []) {
              context.report({
                data: { longhand, shorthand },
                messageId: "mix",
                node,
              });
            }
          }
        }
      },
    };
  },
});
