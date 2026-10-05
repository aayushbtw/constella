import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, layout, space } from "@/lib/tokens.stylex";

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
});

function DocsPage({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <h1>{title}</h1>
        <p {...stylex.props(styles.description)}>{description}</p>
      </header>
      {children}
    </main>
  );
}

export { DocsPage };
