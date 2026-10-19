import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { DocsLayout } from "~/components/docs/layout";
import { blocksGroups } from "~/lib/nav";

export const Route = createFileRoute("/_site/blocks")({
  component: Blocks,
});

function Blocks() {
  const { blocks } = useLoaderData({ from: "__root__" });

  return <DocsLayout name="Blocks" groups={blocksGroups(blocks)} />;
}
