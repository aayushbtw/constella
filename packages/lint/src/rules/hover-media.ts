// hover-media: a hover state sits inside `media.hover`, so a tap on a touch screen doesn't leave it stuck.

import { defineRule } from "vite-plus/lint/plugins";
import type { ESTree } from "vite-plus/lint/plugins";

type Inits = Map<string, ESTree.Node>;
interface Keyed {
  computed: boolean;
  key: ESTree.Node;
}

const hoverQuery = "@media (hover: hover)";

function topLevelInits(program: ESTree.Program) {
  const inits: Inits = new Map();
  for (const statement of program.body) {
    const declaration =
      statement.type === "ExportNamedDeclaration"
        ? statement.declaration
        : statement;
    if (declaration?.type !== "VariableDeclaration") {
      continue;
    }
    for (const declarator of declaration.declarations) {
      if (declarator.id.type === "Identifier" && declarator.init) {
        inits.set(declarator.id.name, declarator.init);
      }
    }
  }
  return inits;
}

function knownText(
  node: ESTree.Node,
  inits: Inits,
  seen = new Set<string>()
): string {
  if (node.type === "Literal") {
    return String(node.value ?? "");
  }
  if (node.type === "TemplateLiteral") {
    return node.quasis
      .map(
        (quasi, index) =>
          quasi.value.raw +
          (index < node.expressions.length
            ? knownText(node.expressions[index], inits, seen)
            : "")
      )
      .join("");
  }
  if (node.type === "Identifier" && !seen.has(node.name)) {
    const init = inits.get(node.name);
    seen.add(node.name);
    return init ? knownText(init, inits, seen) : "";
  }
  return "";
}

// A plain `{ hovered: … }` key is a name, not the const it shares a name with.
function keyText(property: Keyed, inits: Inits) {
  if (property.computed || property.key.type === "Literal") {
    return knownText(property.key, inits);
  }
  return "";
}

function isHoverQuery(property: Keyed, inits: Inits) {
  const { key } = property;
  if (
    key.type === "MemberExpression" &&
    key.object.type === "Identifier" &&
    key.object.name === "media" &&
    key.property.type === "Identifier" &&
    key.property.name === "hover"
  ) {
    return true;
  }
  return keyText(property, inits) === hoverQuery;
}

function insideHoverQuery(node: ESTree.Node, inits: Inits) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === "Property" && isHoverQuery(current, inits)) {
      return true;
    }
  }
  return false;
}

export const hoverMedia = defineRule({
  meta: {
    messages: {
      hover:
        "Put this hover state inside `[media.hover]` (a highlight repeats its value on `:active`), so touch never sticks on hover.",
    },
    type: "problem",
  },
  create: (context) => {
    let inits: Inits = new Map();
    let usesStylex = false;
    return {
      Program(node) {
        inits = topLevelInits(node);
        usesStylex = node.body.some(
          (statement) =>
            statement.type === "ImportDeclaration" &&
            statement.source.value === "@stylexjs/stylex"
        );
      },
      Property(node) {
        if (
          !usesStylex ||
          node.parent.type === "ObjectPattern" ||
          !keyText(node, inits).includes(":hover") ||
          insideHoverQuery(node, inits)
        ) {
          return;
        }
        context.report({ messageId: "hover", node: node.key });
      },
    };
  },
});
