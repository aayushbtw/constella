import { createFileRoute } from "@tanstack/react-router";

import { DocsLayout } from "~/components/docs/layout";
import { getBlocks } from "~/server/blocks";

export const Route = createFileRoute("/blocks")({
  loader: async () => await getBlocks(),
  component: Blocks,
});

function Blocks() {
  const blocks = Route.useLoaderData();

  return (
    <DocsLayout
      name="Blocks"
      groups={[{ items: blocks, label: "Blocks", to: "/blocks/$slug" }]}
    />
  );
}
