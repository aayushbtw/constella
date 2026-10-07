import type { ESTree } from "vite-plus/lint/plugins";

function isStylexCreate(node: ESTree.Node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "stylex" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "create"
  );
}

// `raw` keeps a string key's quotes; numeric keys never name a style.
export function keyName(property: Pick<ESTree.ObjectProperty, "key">) {
  if (property.key.type === "Identifier") {
    return property.key.name;
  }
  if (property.key.type === "Literal") {
    return property.key.raw?.slice(1, -1) ?? null;
  }
  return null;
}

// The style keys from `node` up to its `stylex.create`, innermost first; empty outside one.
export function styleKeys(node: ESTree.Node) {
  const keys: string[] = [];
  for (let current = node.parent; current; current = current.parent) {
    if (isStylexCreate(current)) {
      return keys;
    }
    if (current.type === "Property") {
      keys.push(keyName(current) ?? "");
    }
  }
  return [];
}
