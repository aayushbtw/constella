import { createFileRoute } from "@tanstack/react-router";

import { llmsTxt } from "~/server/markdown";

// Its own route: /blocks/$slug would take `index.md` as a slug. The blocks
// index lists pages, so its Markdown is the page index.
export const Route = createFileRoute("/(text)/blocks_/index.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
});
