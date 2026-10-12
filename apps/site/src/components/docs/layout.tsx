import * as stylex from "@stylexjs/stylex";
import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "~/components/docs/sidebar";
import type { SidebarGroup } from "~/components/docs/sidebar";
import { layout, media } from "~/lib/tokens.stylex";

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

function DocsLayout({
  groups,
  name,
}: {
  groups: SidebarGroup[];
  name: string;
}) {
  return (
    <div {...stylex.props(styles.layout)}>
      <Sidebar groups={groups} name={name} />
      <Outlet />
    </div>
  );
}

export { DocsLayout };
