import { createFileRoute } from "@tanstack/react-router";

import { llmsTxt } from "~/server/markdown";

// Its own route: /docs/components/$slug would take `index.md` as a slug. The
// components index lists pages, so its Markdown is the page index.
export const Route = createFileRoute("/docs_/components/index.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
});
