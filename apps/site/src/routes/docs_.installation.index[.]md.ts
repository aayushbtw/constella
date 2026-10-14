import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

// Its own route: /docs/installation/$slug would take `index.md` as a slug.
export const Route = createFileRoute("/docs_/installation/index.md")({
  server: {
    handlers: {
      GET: () => markdownResponse("docs/installation"),
    },
  },
});
