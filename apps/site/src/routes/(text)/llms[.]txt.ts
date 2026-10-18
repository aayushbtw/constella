import { createFileRoute } from "@tanstack/react-router";

import { llmsTxt } from "~/server/markdown";

export const Route = createFileRoute("/(text)/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
