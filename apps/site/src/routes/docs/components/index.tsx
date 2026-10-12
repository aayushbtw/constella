import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { getComponents } from "~/server/components";

// Until components have an index page, it opens the first one in the Components section.
export const Route = createFileRoute("/docs/components/")({
  beforeLoad: async () => {
    const components = await getComponents();
    const first = components.find(({ section }) => section === undefined);

    if (first === undefined) {
      throw notFound();
    }

    throw redirect({
      params: { slug: first.slug },
      replace: true,
      to: "/docs/components/$slug",
    });
  },
});
