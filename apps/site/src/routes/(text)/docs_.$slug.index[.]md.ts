import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

export const Route = createFileRoute("/(text)/docs_/$slug/index.md")({
  server: {
    handlers: {
      GET: ({ params }) => markdownResponse(`docs/${params.slug}`),
    },
  },
});
