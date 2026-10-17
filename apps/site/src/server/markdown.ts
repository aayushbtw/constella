import { markdown } from "tomekit/content";

import { config } from "~/lib/config";
import { markdownNotFound, markdownPath, markdownUrl } from "~/lib/markdown";

const markdownHeaders = { "Content-Type": "text/markdown; charset=utf-8" };

function markdownResponse(slug: string) {
  const page = markdown.get(slug);

  return page
    ? new Response(page.body, { headers: markdownHeaders })
    : markdownNotFound(markdownPath(slug));
}

type Page = ReturnType<typeof markdown.documents>[number];

const labels = [
  "Getting started",
  "Typography",
  "Primitives",
  "AI",
  "TanStack",
  "Blocks",
];

function labelOf({ metadata, slug }: Page) {
  if (slug.startsWith("blocks/")) {
    return "Blocks";
  }

  return slug.startsWith("docs/components/")
    ? (metadata.section ?? "Primitives")
    : "Getting started";
}

function sortedPages() {
  return markdown
    .documents()
    .toSorted(
      (a, b) =>
        a.metadata.order - b.metadata.order || a.slug.localeCompare(b.slug)
    );
}

function llmsTxt() {
  const pages = sortedPages();
  const sections = labels.flatMap((label) => {
    const links = pages
      .filter((page) => labelOf(page) === label)
      .map(
        ({ metadata, slug }) =>
          `- [${metadata.title}](${markdownUrl(slug)}): ${metadata.description}`
      );

    return links.length > 0 ? [[`## ${label}`, "", ...links].join("\n")] : [];
  });

  return [
    `# ${config.name}`,
    `> ${config.description} React components on Base UI, styled with StyleX (not Tailwind), installed with the shadcn CLI from the \`${config.registry}\` registry.`,
    [
      `Every page is Markdown at its URL plus \`/index.md\`. All of them in one file: ${
        new URL("/llms-full.txt", config.url).href
      }`,
      `- Agent skill: \`npx skills add ${new URL(config.repo).pathname.slice(1)}\``,
      `- Registry: ${config.url}/r/registry.json. With shadcn's MCP server, \`<name>-demo\` items hold each component's usage snippets.`,
    ].join("\n"),
    [
      "## When to use",
      "",
      "- A React app that wants shadcn-style components without Tailwind: StyleX, Base UI underneath.",
      "- Chat and AI interfaces: prompt input, messages, citations, suggestions, model picker.",
      "- Data views on TanStack: data table, chart, markdown.",
      "",
      "Not for: projects on Tailwind that want to stay on it (use shadcn/ui), or non-React apps.",
    ].join("\n"),
    ...sections,
  ].join("\n\n");
}

function llmsFullTxt() {
  return sortedPages()
    .map(({ body }) => body)
    .join("\n\n---\n\n");
}

export { llmsFullTxt, llmsTxt, markdownResponse };
