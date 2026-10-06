import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { getComponent } from "~/server/components";
import { seo } from "~/site/seo";

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
      draft={metadata.draft}
      title={metadata.title}
    >
      <Prose body={body} />
    </DocsPage>
  );
}
