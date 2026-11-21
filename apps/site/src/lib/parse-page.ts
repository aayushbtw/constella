import type {
  BlockNode,
  CodeBlockNode,
  ComponentNode,
  MarkdownDocument,
} from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { parseMarkdown } from "@tanstack/markdown/parser";

// Without a `tagName`, every comment component renders as the same element and
// the components map can't tell `demo` from `install`.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [commentComponentsExtension({ transformComponent })];

function mapCode(
  nodes: BlockNode[],
  replace: (node: CodeBlockNode) => BlockNode
): BlockNode[] {
  return nodes.map((node) => {
    switch (node.type) {
      case "code": {
        return replace(node);
      }
      case "blockquote":
      case "callout":
      case "component": {
        return { ...node, children: mapCode(node.children, replace) };
      }
      case "list": {
        return {
          ...node,
          items: node.items.map((item) => ({
            ...item,
            children: mapCode(item.children, replace),
          })),
        };
      }
      case "footnotes": {
        return {
          ...node,
          items: node.items.map((item) => ({
            ...item,
            children: mapCode(item.children, replace),
          })),
        };
      }
      case "heading":
      case "html":
      case "paragraph":
      case "table":
      case "thematicBreak": {
        return node;
      }
      default: {
        const exhaustive: never = node;
        return exhaustive;
      }
    }
  });
}

const rendererLangOf = (node: CodeBlockNode) => node.lang ?? "plaintext";
const wordOf = (lang: string) => (lang === "plaintext" ? "text" : lang);

function labelCodeBlocks(document: MarkdownDocument): MarkdownDocument {
  const totals = new Map<string, number>();
  mapCode(document.children, (node) => {
    const word = wordOf(rendererLangOf(node));
    totals.set(word, (totals.get(word) ?? 0) + 1);
    return node;
  });

  const seen = new Map<string, number>();
  const labelOf = (word: string) => {
    if (totals.get(word) === 1) {
      return `Copy code, ${word}`;
    }
    const count = (seen.get(word) ?? 0) + 1;
    seen.set(word, count);
    return `Copy code, ${word}, ${count}`;
  };

  return {
    ...document,
    children: mapCode(document.children, (node) => ({
      attributes: {},
      children: [],
      name: "code",
      properties: {
        code: node.value,
        label: labelOf(wordOf(rendererLangOf(node))),
        lang: rendererLangOf(node),
      },
      tagName: "md-code",
      type: "component",
    })),
  };
}

function parsePage(body: string) {
  return labelCodeBlocks(parseMarkdown(body, { extensions, headingIds: true }));
}

export { parsePage };
