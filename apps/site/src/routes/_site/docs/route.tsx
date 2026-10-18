import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { DocsLayout } from "~/components/docs/layout";
import { docsGroups } from "~/lib/nav";

export const Route = createFileRoute("/_site/docs")({
  component: Docs,
});

function Docs() {
  const groups = docsGroups(useLoaderData({ from: "__root__" }));

  return <DocsLayout name="Docs" groups={groups} />;
}
