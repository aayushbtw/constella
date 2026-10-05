import { createFileRoute } from "@tanstack/react-router";

import { DocsPage } from "~/components/docs/page";
import { Prose } from "~/components/docs/prose";
import { getComponent } from "~/server/components";
import { config } from "~/site/config";

export const Route = createFileRoute("/components/$slug")({
  loader: async ({ params }) => await getComponent({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.metadata.title} · ${config.name}` },
      { content: loaderData?.metadata.description, name: "description" },
    ],
  }),
  component: ComponentPage,
});

function ComponentPage() {
  const { body, metadata } = Route.useLoaderData();

  return (
    <DocsPage
      description={metadata.description}
      status={metadata.status}
      title={metadata.title}
    >
      <Prose body={body} />
    </DocsPage>
  );
}
