import { createFileRoute } from "@tanstack/react-router";

import { llmsFullTxt } from "~/server/markdown";

export const Route = createFileRoute("/(text)/llms-full.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsFullTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
