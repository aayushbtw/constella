import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { seo } from "~/lib/seo";
import { getComponent } from "~/server/components";

export const Route = createFileRoute("/docs/components/$slug")({
  loader: async ({ params }) => await getComponent({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData?.metadata.title,
      description: loaderData?.metadata.description,
    }),
  }),
  component: ComponentPage,
});

function ComponentPage() {
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
