import type { SidebarGroup } from "~/components/docs/sidebar";
import type { getBlocks } from "~/server/blocks";
import type { getComponents } from "~/server/components";
import type { getDocs } from "~/server/docs";

type Components = Awaited<ReturnType<typeof getComponents>>;

const sectionItems = (components: Components, section?: string) =>
  components.filter((component) => component.section === section);

function docsGroups({
  components,
  docs,
}: {
  components: Components;
  docs: Awaited<ReturnType<typeof getDocs>>;
}): SidebarGroup[] {
  return [
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
  ];
}

function blocksGroups(
  blocks: Awaited<ReturnType<typeof getBlocks>>
): SidebarGroup[] {
  return [{ items: blocks, label: "Blocks", to: "/blocks/$slug" }];
}

export { blocksGroups, docsGroups };
