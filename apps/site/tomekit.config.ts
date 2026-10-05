import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { collectMarkdownHeadings } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineCollection, defineConfig, directory } from "tomekit";
import { z } from "zod";

// Without a `tagName`, every comment component renders as the same element and
// the components map can't tell `demo` from `install`.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [commentComponentsExtension({ transformComponent })];

function pages(path: string) {
  return defineCollection({
    loader: directory(path),
    schema: z.strictObject({
      description: z.string(),
      // Until a page has had its full pass. Built in dev only.
      draft: z.boolean().default(false),
      title: z.string(),
    }),
    transform: ({ body, metadata }, { dev, skip }) => {
      if (metadata.draft && !dev) {
        return skip("draft");
      }

      const document = parseMarkdown(body, { extensions, headingIds: true });

      return {
        body: document,
        metadata: {
          ...metadata,
          headings: collectMarkdownHeadings(document)
            .filter(({ level }) => level <= 3)
            .map(({ id, level, text }) => ({ id, level, text })),
        },
      };
    },
  });
}

export default defineConfig({
  collections: {
    components: pages("content/components"),
    docs: pages("content/docs"),
  },
});
