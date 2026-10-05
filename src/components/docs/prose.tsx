import * as stylex from "@stylexjs/stylex";
import { Markdown } from "@tanstack/markdown/react";
import type {
  MarkdownComponents,
  MarkdownProps,
} from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef } from "react";

import { demos, isDemo } from "@/components/demos";
import { Install } from "@/components/docs/install";
import { config } from "@/lib/config";
import { highlightCode } from "@/lib/highlight";
import {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  media,
  radii,
  shadows,
  space,
} from "@/lib/tokens.stylex";

const flow = {
  marginBlockEnd: { default: space.md, ":last-child": 0 },
} as const;

const styles = stylex.create({
  prose: {
    color: colors.textSecondary,
    minWidth: 0,
    overflowWrap: "break-word",
  },
  p: flow,
  h2: {
    color: colors.textPrimary,
    lineHeight: lineHeights.row,
    marginBlockEnd: space.sm,
    marginBlockStart: { default: space.xl, ":first-child": 0 },
  },
  h3: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
    marginBlockEnd: space.xs,
    marginBlockStart: space.lg,
  },
  a: {
    color: colors.textPrimary,
    textDecorationColor: {
      default: colors.edgeStrong,
      [media.hover]: {
        default: colors.edgeStrong,
        ":hover": colors.textPrimary,
      },
    },
    textDecorationLine: "underline",
    textUnderlineOffset: 3,
  },
  code: {
    backgroundColor: colors.fillSubtle,
    borderRadius: radii.xs,
    boxShadow: shadows.card,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    paddingBlock: 1,
    paddingInline: 3,
  },
  pre: {
    ...flow,
    backgroundColor: colors.fillSubtle,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    color: colors.textPrimary,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.code,
    overflowX: "auto",
    paddingBlock: space.sm,
    paddingInline: space.md,
    scrollbarWidth: "none",
    tabSize: 2,
  },
  preCode: {
    display: "inline-block",
    fontFamily: fonts.mono,
    minWidth: "100%",
  },
  table: {
    ...flow,
    borderCollapse: "collapse",
    fontSize: fontSizes.sm,
    width: "100%",
  },
  cell: {
    boxShadow: shadows.rule,
    paddingBlock: space.xs,
    paddingInlineEnd: space.md,
    textAlign: "start",
  },
  th: {
    color: colors.textPrimary,
    fontWeight: 500,
  },
  demo: {
    ...flow,
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    padding: space.xxs,
  },
  stage: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    display: "flex",
    justifyContent: "center",
    minHeight: 280,
    paddingBlock: space.xl,
    paddingInline: space.md,
  },
});

// Only a fenced block's `code` carries a `language-*` class.
function Code({ className, ...props }: ComponentPropsWithoutRef<"code">) {
  const inPre = className?.startsWith("language-") ?? false;

  return (
    <code {...props} {...stylex.props(inPre ? styles.preCode : styles.code)} />
  );
}

function Demo({ name }: { name?: string }) {
  if (name === undefined || !isDemo(name)) {
    throw new Error(`No demo registered as "${name}"`);
  }

  const Component = demos[name];

  return (
    <div {...stylex.props(styles.demo)}>
      <div {...stylex.props(styles.stage)}>
        <Component />
      </div>
    </div>
  );
}

function MarkdownInstall({ name }: { name?: string }) {
  return (
    <div {...stylex.props(styles.p)}>
      <Install name={name} url={config.siteUrl} />
    </div>
  );
}

const components = {
  a: ({ children, ...props }) => (
    <a {...props} {...stylex.props(styles.a)}>
      {children}
    </a>
  ),
  code: Code,
  h2: ({ children, ...props }) => (
    <h2 {...props} {...stylex.props(styles.h2)}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} {...stylex.props(styles.h3)}>
      {children}
    </h3>
  ),
  "md-demo": Demo,
  "md-install": MarkdownInstall,
  p: (props) => <p {...props} {...stylex.props(styles.p)} />,
  // Replacing the class keeps `data-lang`, which the highlight theme keys on.
  pre: (props) => <pre {...props} {...stylex.props(styles.pre)} />,
  table: (props) => <table {...props} {...stylex.props(styles.table)} />,
  td: (props) => <td {...props} {...stylex.props(styles.cell)} />,
  th: (props) => <th {...props} {...stylex.props(styles.cell, styles.th)} />,
} satisfies MarkdownComponents;

function Prose({ body }: { body: MarkdownProps["children"] }) {
  return (
    <div {...stylex.props(styles.prose)}>
      <Markdown components={components} highlighter={highlightCode}>
        {body}
      </Markdown>
    </div>
  );
}

export { Prose };
