import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { space } from "@/lib/constella/tokens.stylex";
import { Outline } from "~/components/docs/outline";
import type { Heading as OutlineHeading } from "~/components/docs/outline";
import { PageActions } from "~/components/docs/page-actions";
import { layout, media } from "~/lib/tokens.stylex";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    // Centered in the space between sidebar and outline; full width without them.
    marginInline: "auto",
    maxWidth: { default: "none", [media.sidebar]: layout.content },
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
});

// Two siblings, so each takes its own column of the docs layout's grid.
function DocsPage({
  children,
  description,
  headings,
  markdown,
  title,
}: {
  children: ReactNode;
  description: string;
  headings: OutlineHeading[];
  markdown: string;
  title: string;
}) {
  return (
    <>
      <main {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.header)}>
          <Heading level={1} size={6}>
            {title}
          </Heading>
          <Text color="secondary">{description}</Text>
          <PageActions markdown={markdown} />
        </header>
        {children}
      </main>
      <Outline headings={headings} />
    </>
  );
}

export { DocsPage };
