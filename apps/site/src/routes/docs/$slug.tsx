import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { getDoc } from "~/server/docs";
import { config } from "~/site/config";

export const Route = createFileRoute("/docs/$slug")({
  loader: async ({ params }) => await getDoc({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.metadata.title} · ${config.name}` },
      { content: loaderData?.metadata.description, name: "description" },
    ],
  }),
  component: DocPage,
});

function DocPage() {
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
