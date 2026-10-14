import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { collectMarkdownHeadings } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineCollection, defineConfig, directory } from "tomekit";
import type { LoadContext } from "tomekit";
import { z } from "zod";

import {
  checkBlockPage,
  checkComponentPage,
  checkGuidePage,
} from "./src/lib/lint/index.ts";
import { agentMarkdown, llmsUrl } from "./src/lib/markdown.ts";

// Without a `tagName`, every comment component renders as the same element and
// the components map can't tell `demo` from `install`.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [commentComponentsExtension({ transformComponent })];

function pages(path: string, check?: typeof checkComponentPage) {
  return defineCollection({
    loader: directory(path),
    schema: z.strictObject({
      description: z.string(),
      // Until a page has had its full pass. Built in dev only.
      draft: z.boolean().default(false),
      // The sidebar section for a page built on a library, or a chat part, in place of Components.
      section: z.enum(["AI", "TanStack"]).optional(),
      // Sidebar position within a section; ties sort by title.
      order: z.number().default(0),
      title: z.string(),
    }),
    transform: ({ body, metadata }, { dev, skip }) => {
      check?.(body, metadata.title);

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

const sources = [
  { path: "content/docs", prefix: "docs" },
  { path: "content/components", prefix: "docs/components" },
  { path: "content/blocks", prefix: "blocks" },
];

async function loadPages(context: LoadContext) {
  const loaded = await Promise.all(
    sources.map(async ({ path, prefix }) => {
      const { entries, issues = [] } = await directory(path).load(context);

      return {
        entries: entries.map((entry) => ({
          ...entry,
          slug: `${prefix}/${entry.slug}`,
        })),
        issues,
      };
    })
  );

  return {
    entries: loaded.flatMap(({ entries }) => entries),
    issues: loaded.flatMap(({ issues }) => issues),
  };
}

export default defineConfig({
  collections: {
    blocks: pages("content/blocks", checkBlockPage),
    components: pages("content/components", checkComponentPage),
    docs: pages("content/docs", checkGuidePage),
    // Every page as Markdown for agents, beside the parsed collections the pages render.
    markdown: defineCollection({
      loader: { load: loadPages },
      schema: z.object({
        description: z.string(),
        draft: z.boolean().default(false),
        order: z.number().default(0),
        section: z.enum(["AI", "TanStack"]).optional(),
        title: z.string(),
      }),
      transform: ({ body, metadata }, { dev, skip }) =>
        metadata.draft && !dev
          ? skip("draft")
          : {
              body: `# ${metadata.title}\n\n${metadata.description}\n\n> Every page: ${llmsUrl}\n\n${agentMarkdown(body).trimStart()}`,
            },
    }),
  },
});
