import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineConfig, directory } from "tomekit";
import { z } from "zod";

// Without a `tagName`, every comment component renders as the same element and
// the components map can't tell `demo` from `install`.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [commentComponentsExtension({ transformComponent })];

export default defineConfig({
  collections: {
    components: {
      loader: directory("content/components"),
      schema: z.strictObject({
        description: z.string(),
        title: z.string(),
      }),
      transform: ({ body }) => ({
        body: parseMarkdown(body, { extensions, headingIds: true }),
      }),
    },
  },
});
