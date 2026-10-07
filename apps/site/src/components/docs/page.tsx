import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, space } from "@/lib/tokens.stylex";
import { Outline } from "~/components/docs/outline";
import type { Heading } from "~/components/docs/outline";
import { layout } from "~/lib/tokens.stylex";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    // Centered in the space between sidebar and outline.
    marginInline: "auto",
    maxWidth: layout.content,
    minWidth: 0,
    width: "100%",
    paddingBottom: layout.pageBottom,
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

// Two siblings, so each takes its own column of the docs layout's grid.
function DocsPage({
  children,
  description,
  headings,
  title,
}: {
  children: ReactNode;
  description: string;
  headings: Heading[];
  title: string;
}) {
  return (
    <>
      <main {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.header)}>
          <h1>{title}</h1>
          <p {...stylex.props(styles.description)}>{description}</p>
        </header>
        {children}
      </main>
      <Outline headings={headings} />
    </>
  );
}

export { DocsPage };
