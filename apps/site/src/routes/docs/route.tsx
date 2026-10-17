import { createFileRoute } from "@tanstack/react-router";

import { DocsLayout } from "~/components/docs/layout";
import { getComponents } from "~/server/components";
import { getDocs } from "~/server/docs";

export const Route = createFileRoute("/docs")({
  loader: async () => {
    const [docs, components] = await Promise.all([getDocs(), getComponents()]);

    return { components, docs };
  },
  component: Docs,
});

const sectionItems = (
  components: Awaited<ReturnType<typeof getComponents>>,
  section?: string
) => components.filter((component) => component.section === section);

function Docs() {
  const { components, docs } = Route.useLoaderData();

  return (
    <DocsLayout
      name="Docs"
      groups={[
        { items: docs, label: "Getting started", to: "/docs/$slug" },
        {
          items: sectionItems(components, "Typography"),
          label: "Typography",
          to: "/docs/components/$slug",
        },
        {
          items: sectionItems(components),
          label: "Primitives",
          to: "/docs/components/$slug",
        },
        {
          items: sectionItems(components, "AI"),
          label: "AI",
          to: "/docs/components/$slug",
        },
        {
          items: sectionItems(components, "TanStack"),
          label: "TanStack",
          to: "/docs/components/$slug",
        },
      ]}
    />
  );
}
