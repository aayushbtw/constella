import { createFileRoute, redirect } from "@tanstack/react-router";

// Until /docs has its own page, it opens Installation.
export const Route = createFileRoute("/docs/")({
  beforeLoad: () => {
    throw redirect({
      params: { slug: "installation" },
      replace: true,
      to: "/docs/$slug",
    });
  },
});
