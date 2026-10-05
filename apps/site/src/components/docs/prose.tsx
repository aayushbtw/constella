import * as stylex from "@stylexjs/stylex";
import { Markdown } from "@tanstack/markdown/react";
import type {
  MarkdownComponents,
  MarkdownProps,
} from "@tanstack/markdown/react";
import { useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import {
  colors,
  fontSizes,
  lineHeights,
  media,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";
import { demos, isDemo } from "~/components/demos";
import { CopyButton } from "~/components/docs/copy-button";
import { Install } from "~/components/docs/install";
import { config } from "~/site/config";
import { highlightCode } from "~/site/highlight";
import {
  fonts,
  layout,
  lineHeights as siteLineHeights,
  shadows,
  surfaces,
} from "~/site/tokens.stylex";

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
    scrollMarginTop: layout.pageTop,
  },
  h3: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
    marginBlockEnd: space.xs,
    marginBlockStart: space.lg,
    scrollMarginTop: layout.pageTop,
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
  codeBlock: {
    ...flow,
    backgroundColor: colors.fillSubtle,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    position: "relative",
  },
  pre: {
    color: colors.textPrimary,
    fontSize: fontSizes.xs,
    lineHeight: siteLineHeights.code,
    overflowX: "auto",
    paddingBlock: space.sm,
    paddingInlineEnd: `calc(${space.xs} + ${sizes.controlXs} + ${space.xs})`,
    // Numbered lines carry this padding themselves (code.css).
    paddingInlineStart: { default: space.md, ":has(.th-line)": 0 },
    scrollbarWidth: "none",
    tabSize: 2,
  },
  // Centered on the first line.
  copy: {
    insetBlockStart: `calc(${space.sm} + (${siteLineHeights.code} - ${sizes.controlXs}) / 2)`,
    insetInlineEnd: space.xs,
    position: "absolute",
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
  // A thin frame on the page, holding the preview.
  demo: {
    ...flow,
    borderRadius: radii.md,
    boxShadow: shadows.inset,
    padding: space.xxs,
  },
  stage: {
    alignItems: "center",
    backgroundColor: surfaces.stage,
    borderRadius: radii.sm,
    boxShadow: shadows.inset,
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
    <div data-slot="demo" {...stylex.props(styles.demo)}>
      <div {...stylex.props(styles.stage)}>
        <Component />
      </div>
    </div>
  );
}

function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const pre = useRef<HTMLPreElement>(null);

  return (
    <div data-slot="code-block" {...stylex.props(styles.codeBlock)}>
      {/* Replacing the class keeps `data-lang`, which the highlight theme keys on. */}
      <pre ref={pre} {...props} {...stylex.props(styles.pre)} />
      <CopyButton
        label="Copy code"
        sx={styles.copy}
        // Line numbers are pseudo-elements, so the text holds only the code.
        text={() => pre.current?.textContent?.trimEnd() ?? ""}
      />
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
  pre: CodeBlock,
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
