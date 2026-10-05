import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Sidebar } from "~/components/docs/sidebar";
import { getComponents } from "~/server/components";
import { getDocs } from "~/server/docs";
import { layout, media } from "~/site/tokens.stylex";

export const Route = createFileRoute("/docs")({
  loader: async () => {
    const [docs, components] = await Promise.all([
      getDocs(),
      getComponents(),
    ]);

    return { components, docs };
  },
  component: DocsLayout,
});

const styles = stylex.create({
  layout: {
    columnGap: layout.sectionGap,
    display: "grid",
    gridTemplateColumns: {
      default: `minmax(0, ${layout.content})`,
      [media.sidebar]: `${layout.sidebar} minmax(0, 1fr)`,
      [media.outline]: `${layout.sidebar} minmax(0, 1fr) ${layout.outline}`,
    },
    justifyContent: "center",
    marginInline: "auto",
    maxWidth: {
      default: `calc(${layout.content} + 2 * ${layout.gutter})`,
      [media.sidebar]: layout.shell,
    },
    paddingInline: {
      default: layout.gutter,
      [media.sidebar]: layout.gutterWide,
    },
  },
});

function DocsLayout() {
  const { components, docs } = Route.useLoaderData();

  return (
    <div {...stylex.props(styles.layout)}>
      <Sidebar
        groups={[
          { items: docs, label: "Getting started", to: "/docs/$slug" },
          {
            items: components,
            label: "Components",
            to: "/docs/components/$slug",
          },
        ]}
      />
      <Outlet />
    </div>
  );
}
