import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

export const Route = createFileRoute("/(text)/blocks_/$slug/index.md")({
  server: {
    handlers: {
      GET: ({ params }) => markdownResponse(`blocks/${params.slug}`),
    },
  },
});
