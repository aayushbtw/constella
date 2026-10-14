"use client";

import * as stylex from "@stylexjs/stylex";
import { streamingMarkdownExtension } from "@tanstack/markdown/extensions/streaming";
import { Markdown as MarkdownPrimitive } from "@tanstack/markdown/react";
import type {
  MarkdownComponentProps,
  MarkdownComponents,
  MarkdownProps as MarkdownPrimitiveProps,
} from "@tanstack/markdown/react";
import { useRef } from "react";

import { CopyButton } from "@/components/ui/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type MarkdownProps = Omit<MarkdownPrimitiveProps, "extensions"> & {
  extensions?: MarkdownPrimitiveProps["extensions"];
  /** While the answer is still arriving: unclosed fences, lists and emphasis render as if closed. */
  streaming?: boolean;
  sx?: stylex.StyleXStyles;
};

type Props<T extends keyof React.JSX.IntrinsicElements> =
  MarkdownComponentProps<T>;

const styles = stylex.create({
  root: {
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.md,
    gap: space.md,
    lineHeight: lineHeights.prose,
    minWidth: 0,
    overflowWrap: "break-word",
  },
  p: { marginBlockEnd: 0, marginBlockStart: 0 },
  heading: {
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.prose,
    marginBlockEnd: 0,
    marginBlockStart: { default: space.xs, ":first-child": 0 },
    textWrap: "balance",
  },
  h1: { fontSize: fontSizes.lg },
  h2: { fontSize: fontSizes.md },
  strong: { fontWeight: fontWeights.semibold },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: space.lg,
  },
  link: {
    color: colors.textPrimary,
    textDecorationColor: colors.textMuted,
    textDecorationLine: "underline",
    textUnderlineOffset: space.xxs,
  },
  code: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    fontFamily: fonts.mono,
    fontSize: "0.875em",
    fontVariantLigatures: "none",
    paddingBlockStart: space.xxxs,
    paddingBlockEnd: space.xxxs,
    paddingInlineStart: space.xxs,
    paddingInlineEnd: space.xxs,
  },
  codeBlock: {
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    position: "relative",
  },
  pre: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.text,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    overflowX: "auto",
    paddingBlockStart: space.sm,
    paddingBlockEnd: space.sm,
    paddingInlineEnd: `calc(${space.xs} + ${sizes.controlSm} + ${space.xs})`,
    paddingInlineStart: space.md,
    tabSize: 2,
  },
  preCode: {
    display: "inline-block",
    fontVariantLigatures: "none",
    minWidth: "100%",
  },
  // Centered on the first line.
  copy: {
    insetBlockStart: `calc(${space.sm} + (${lineHeights.text} - ${sizes.controlSm}) / 2)`,
    insetInlineEnd: space.xs,
    position: "absolute",
  },
  quote: {
    borderInlineStartColor: colors.edge,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: `calc(2 * ${strokes.border})`,
    color: colors.textSecondary,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    marginInlineStart: 0,
    marginInlineEnd: 0,
    paddingInlineStart: space.md,
  },
  rule: {
    borderBlockEndWidth: 0,
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    borderInlineStartWidth: 0,
    borderInlineEndWidth: 0,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    width: "100%",
  },
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
});

// A GFM column's alignment arrives only as an inline style on each cell.
const alignStyles = {
  center: styles.center,
  left: styles.start,
  right: styles.end,
} as const;

function alignOf(style: Props<"td">["style"]) {
  const align = style?.textAlign;
  return align === "left" || align === "center" || align === "right"
    ? alignStyles[align]
    : undefined;
}

// Only a fenced block's `code` carries a `language-*` class.
function Code({ className, ...props }: Props<"code">) {
  const inPre = className?.startsWith("language-") ?? false;
  return (
    <code {...props} {...stylex.props(inPre ? styles.preCode : styles.code)} />
  );
}

function CodeBlock(props: Props<"pre">) {
  const pre = useRef<HTMLPreElement>(null);
  return (
    <div data-slot="markdown-code-block" {...stylex.props(styles.codeBlock)}>
      {/* Replacing the class keeps `data-lang`, which a highlight theme keys on. */}
      <pre ref={pre} {...props} {...stylex.props(styles.pre)} />
      <CopyButton
        aria-label="Copy code"
        sx={styles.copy}
        value={() => pre.current?.textContent?.trimEnd() ?? ""}
      />
    </div>
  );
}

// An answer sits under the page's own headings, so its outline starts two levels down.
const components = {
  a: ({ children, ...props }: Props<"a">) => (
    <a
      {...props}
      rel="noopener noreferrer"
      target="_blank"
      {...stylex.props(styles.link)}
    >
      {children}
    </a>
  ),
  blockquote: (props: Props<"blockquote">) => (
    <blockquote {...props} {...stylex.props(styles.quote)} />
  ),
  code: Code,
  h1: ({ children, ...props }: Props<"h1">) => (
    <h3 {...props} {...stylex.props(styles.heading, styles.h1)}>
      {children}
    </h3>
  ),
  h2: ({ children, ...props }: Props<"h2">) => (
    <h4 {...props} {...stylex.props(styles.heading, styles.h2)}>
      {children}
    </h4>
  ),
  h3: ({ children, ...props }: Props<"h3">) => (
    <h5 {...props} {...stylex.props(styles.heading, styles.h2)}>
      {children}
    </h5>
  ),
  h4: ({ children, ...props }: Props<"h4">) => (
    <h6 {...props} {...stylex.props(styles.heading, styles.h2)}>
      {children}
    </h6>
  ),
  hr: (props: Props<"hr">) => <hr {...props} {...stylex.props(styles.rule)} />,
  ol: (props: Props<"ol">) => <ol {...props} {...stylex.props(styles.list)} />,
  p: (props: Props<"p">) => <p {...props} {...stylex.props(styles.p)} />,
  pre: CodeBlock,
  strong: (props: Props<"strong">) => (
    <strong {...props} {...stylex.props(styles.strong)} />
  ),
  table: (props: Props<"table">) => <Table {...props} />,
  tbody: (props: Props<"tbody">) => <TableBody {...props} />,
  td: ({ style, ...props }: Props<"td">) => (
    <TableCell {...props} sx={alignOf(style)} />
  ),
  th: ({ style, ...props }: Props<"th">) => (
    <TableHead {...props} sx={alignOf(style)} />
  ),
  thead: (props: Props<"thead">) => <TableHeader {...props} />,
  tr: (props: Props<"tr">) => <TableRow {...props} />,
  ul: (props: Props<"ul">) => <ul {...props} {...stylex.props(styles.list)} />,
} satisfies MarkdownComponents;

const noExtensions: NonNullable<MarkdownProps["extensions"]> = [];
const streamingExtensions = [streamingMarkdownExtension()];

/** An answer's markdown: prose, lists, quotes, tables on `Table`, and code blocks with a copy button. */
function Markdown({
  components: own,
  extensions = noExtensions,
  streaming = false,
  sx,
  ...props
}: MarkdownProps) {
  return (
    <div data-slot="markdown" {...stylex.props(styles.root, sx)}>
      <MarkdownPrimitive
        components={{ ...components, ...own }}
        extensions={
          streaming ? [...streamingExtensions, ...extensions] : extensions
        }
        {...props}
      />
    </div>
  );
}

export { Markdown };
export type { MarkdownProps };
