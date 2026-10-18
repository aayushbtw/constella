import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { seo } from "~/lib/seo";
import { getDoc } from "~/server/docs";

export const Route = createFileRoute("/_site/docs/$slug")({
  loader: async ({ params }) => await getDoc({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData?.metadata.title,
      description: loaderData?.metadata.description,
    }),
  }),
  component: DocPage,
});

function DocPage() {
  const { body, markdown, metadata } = Route.useLoaderData();

  return (
    <DocsPage
      description={metadata.description}
      headings={metadata.headings}
      markdown={markdown}
      title={metadata.title}
    >
      <Prose body={body} />
    </DocsPage>
  );
}
