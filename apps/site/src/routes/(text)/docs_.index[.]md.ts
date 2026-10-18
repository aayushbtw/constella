import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

// /docs opens Installation, so its Markdown is Installation's.
export const Route = createFileRoute("/(text)/docs_/index.md")({
  server: {
    handlers: {
      GET: () => markdownResponse("docs/installation"),
    },
  },
});
