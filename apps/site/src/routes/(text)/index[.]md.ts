import { createFileRoute } from "@tanstack/react-router";

import { llmsTxt } from "~/server/markdown";

// The home page is a showcase, so its Markdown is the page index.
export const Route = createFileRoute("/(text)/index.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
});
