import { createFileRoute } from "@tanstack/react-router";

import { markdownResponse } from "~/server/markdown";

export const Route = createFileRoute("/(text)/docs_/components/$slug/index.md")(
  {
    server: {
      handlers: {
        GET: ({ params }) => markdownResponse(`docs/components/${params.slug}`),
      },
    },
  }
);
