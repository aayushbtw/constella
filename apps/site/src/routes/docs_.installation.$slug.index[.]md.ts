import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

export const Route = createFileRoute("/docs_/installation/$slug/index.md")({
  server: {
    handlers: {
      GET: ({ params }) => markdownResponse(`docs/installation/${params.slug}`),
    },
  },
});
