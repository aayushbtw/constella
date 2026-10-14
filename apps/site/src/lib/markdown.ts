import { config } from "./config.ts";
import { frameworks } from "./frameworks.ts";

/** `slug` is the page's path without the leading slash. */
function markdownPath(slug: string) {
  return `/${slug}/index.md`;
}

function markdownUrl(slug: string) {
  return new URL(markdownPath(slug), config.url).href;
}

/** The page index agents start from, as https://llmstxt.org describes. */
const llmsUrl = new URL("/llms.txt", config.url).href;

const frameworkLinks = frameworks
  .map(
    ({ slug, title }) =>
      `- [${title}](${markdownUrl(`docs/installation/${slug}`)})`
  )
  .join("\n");

function agentMarkdown(body: string) {
  return body
    .replaceAll(
      /\]\(\/(?<path>[^)#\s.]+)(?<hash>#[^)]*)?\)/gu,
      (_link, path: string, hash = "") => `](${markdownUrl(path)}${hash})`
    )
    .replaceAll(
      /<!-- ::install name="(?<name>[^"]+)" -->/gu,
      `\`\`\`bash\nnpx shadcn@latest add ${config.registry}/$<name>\n\`\`\``
    )
    .replaceAll("<!-- ::frameworks -->", frameworkLinks)
    .replaceAll(/<!-- ::demo [^>]*-->\n+/gu, "");
}

function markdownNotFound(pathname: string) {
  return new Response(
    `# Page not found\n\nThere's no page at \`${pathname}\`. Every page of the ${config.name} docs is listed at ${llmsUrl}.\n`,
    {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
      status: 404,
    }
  );
}

export { agentMarkdown, llmsUrl, markdownNotFound, markdownPath, markdownUrl };
