import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, fontSizes, space } from "@/lib/tokens.stylex";
import { layout } from "~/site/tokens.stylex";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    marginInline: "auto",
    maxWidth: layout.content,
    paddingBottom: layout.pageBottom,
    paddingInline: layout.gutter,
    paddingTop: layout.pageTop,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  description: {
    color: colors.textSecondary,
  },
  status: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
});

const statusLabels = { draft: "Draft", polished: "Polished" } as const;

function DocsPage({
  children,
  description,
  status,
  title,
}: {
  children: ReactNode;
  description: string;
  status: keyof typeof statusLabels;
  title: string;
}) {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.status)}>{statusLabels[status]}</p>
        <h1>{title}</h1>
        <p {...stylex.props(styles.description)}>{description}</p>
      </header>
      {children}
    </main>
  );
}

export { DocsPage, statusLabels };
