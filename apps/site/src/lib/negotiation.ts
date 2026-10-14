import { markdownNotFound } from "~/lib/markdown";

interface Fetcher {
  fetch: (request: Request) => Promise<Response> | Response;
}

interface Origins {
  app: Fetcher;
  assets: Fetcher;
}

function qualities(accept: string) {
  return new Map(
    accept.split(",").map((range) => {
      const [type = "", ...params] = range
        .split(";")
        .map((part) => part.trim().toLowerCase());
      const quality = params.find((param) => param.startsWith("q="));

      return [type, quality === undefined ? 1 : Number(quality.slice(2))];
    })
  );
}

/** Whether a client asked for Markdown by name, at least as much as HTML. `*\/*` alone still gets HTML. */
function prefersMarkdown(accept: string) {
  const ranges = qualities(accept);
  const markdown = ranges.get("text/markdown") ?? 0;
  const html =
    ranges.get("text/html") ?? ranges.get("text/*") ?? ranges.get("*/*") ?? 0;

  return markdown > 0 && markdown >= html;
}

function withVary(response: Response) {
  const varied = new Response(response.body, response);
  varied.headers.append("Vary", "Accept");

  return varied;
}

async function negotiate(request: Request, { app, assets }: Origins) {
  const url = new URL(request.url);
  const isPage = !/\.[^/]*$/u.test(url.pathname);
  const wantsMarkdown = prefersMarkdown(request.headers.get("Accept") ?? "");

  if (request.method !== "GET" && request.method !== "HEAD") {
    return await app.fetch(request);
  }

  if (isPage && wantsMarkdown) {
    const markdownUrl = new URL(
      `${url.pathname.replace(/\/$/u, "")}/index.md`,
      url
    );

    const markdown = await app.fetch(new Request(markdownUrl, request));

    // A path no Markdown route matches gets the router's own answer, not Markdown.
    return (markdown.headers.get("Content-Type") ?? "").startsWith(
      "text/markdown"
    )
      ? withVary(markdown)
      : withVary(markdownNotFound(url.pathname));
  }

  const asset = await assets.fetch(request);
  const response = asset.status === 404 ? await app.fetch(request) : asset;

  if (wantsMarkdown && response.status === 404) {
    return withVary(markdownNotFound(url.pathname));
  }

  return isPage ? withVary(response) : response;
}

export { negotiate };
export type { Fetcher };
