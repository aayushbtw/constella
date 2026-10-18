import { createFileRoute } from "@tanstack/react-router";

import { DocsLayout } from "~/components/docs/layout";
import { blocksGroups } from "~/lib/nav";
import { getBlocks } from "~/server/blocks";

export const Route = createFileRoute("/_site/blocks")({
  loader: async () => await getBlocks(),
  component: Blocks,
});

function Blocks() {
  return (
    <DocsLayout name="Blocks" groups={blocksGroups(Route.useLoaderData())} />
  );
}
