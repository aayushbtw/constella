import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { seo } from "~/lib/seo";
import { getBlock } from "~/server/blocks";

export const Route = createFileRoute("/blocks/$slug")({
  loader: async ({ params }) => await getBlock({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData?.metadata.title,
      description: loaderData?.metadata.description,
    }),
  }),
  component: BlockPage,
});

function BlockPage() {
  const { body, metadata } = Route.useLoaderData();

  return (
    <DocsPage
      description={metadata.description}
      headings={metadata.headings}
      title={metadata.title}
    >
      <Prose body={body} />
    </DocsPage>
  );
}
