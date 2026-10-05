import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import {
  colors,
  fonts,
  fontSizes,
  layout,
  lineHeights,
  radii,
  shadows,
  space,
} from "@/lib/tokens.stylex";

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
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  heading: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  preview: {
    alignItems: "center",
    borderRadius: radii.md,
    boxShadow: shadows.card,
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
    minHeight: 200,
    padding: space.lg,
  },
  code: {
    backgroundColor: colors.fillSubtle,
    borderRadius: radii.md,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.code,
    overflowX: "auto",
    padding: space.md,
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

function DocsSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.heading)}>{title}</h2>
      {children}
    </section>
  );
}

function DocsPreview({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.preview)}>{children}</div>;
}

function DocsCode({ children }: { children: string }) {
  return (
    <pre {...stylex.props(styles.code)}>
      <code>{children.trim()}</code>
    </pre>
  );
}

export { DocsCode, DocsPage, DocsPreview, DocsSection };
