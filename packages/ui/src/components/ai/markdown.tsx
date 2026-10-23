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

import {
  CodeBlock as CodeBlockRoot,
  CodeBlockActions,
  CodeBlockContent,
} from "@/components/ai/code-block";
import { CopyButton } from "@/components/primitives/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { Code } from "@/components/typography/code";
import { Link } from "@/components/typography/link";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type MarkdownProps = Omit<MarkdownPrimitiveProps, "extensions"> & {
  extensions?: MarkdownPrimitiveProps["extensions"];
  /** While the answer is still arriving: unclosed fences, lists and emphasis render as if closed. */
  streaming?: boolean;
  sx?: Sx;
};

type Props<T extends keyof React.JSX.IntrinsicElements> =
  MarkdownComponentProps<T>;

const styles = stylex.create({
  root: {
    color: colors.textPrimary,
    minWidth: 0,
    overflowWrap: "break-word",
  },
  // Blocks space by collapsing margins, so the root stays a block box, not flex or grid.
  block: {
    marginBlockEnd: { default: "1em", ":last-child": 0 },
    marginBlockStart: 0,
  },
  heading: {
    fontWeight: fontWeights.semibold,
    marginBlockEnd: { default: "0.5em", ":last-child": 0 },
    marginBlockStart: { default: "1.5em", ":first-child": 0 },
    textWrap: "balance",
  },
  strong: { fontWeight: fontWeights.semibold },
  list: { paddingInlineStart: "1.25em" },
  // Its padding, not the list's, sets the marker's distance from the text.
  item: {
    marginBlockEnd: "0.5em",
    marginBlockStart: "0.5em",
    paddingInlineStart: "0.25em",
    "::marker": { color: colors.textSecondary },
  },
  quote: {
    borderInlineStartColor: colors.border,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: `calc(2 * ${strokes.border})`,
    color: colors.textSecondary,
    marginInlineStart: 0,
    marginInlineEnd: 0,
    paddingInlineStart: "1em",
  },
  rule: {
    borderBlockEndWidth: 0,
    borderBlockStartColor: colors.borderSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    borderInlineStartWidth: 0,
    borderInlineEndWidth: 0,
    marginBlockEnd: { default: "1em", ":last-child": 0 },
    marginBlockStart: { default: "1em", ":first-child": 0 },
    width: "100%",
  },
  // The table has no box, so its text lines up with the prose.
  cell: {
    paddingInlineEnd: { default: space.xs, ":last-child": 0 },
    paddingInlineStart: { default: space.xs, ":first-child": 0 },
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

// Only a fenced block's `code` carries a `language-*` class. CodeBlockContent renders that `code`, so the highlighted markup goes in a span.
function MarkdownCode({ className, ...props }: Props<"code">) {
  if (className?.startsWith("language-") ?? false) {
    return <span {...props} />;
  }
  return <Code {...props} />;
}

function CodeBlock({ className: _className, ...props }: Props<"pre">) {
  const pre = useRef<HTMLPreElement>(null);
  return (
    // The margin goes on a wrapper: `sx` takes only space tokens, and here 1em is the prose's.
    <div {...stylex.props(styles.block)}>
      <CodeBlockRoot>
        {/* Dropping the class keeps `data-lang`, which a highlight theme keys on. */}
        <CodeBlockContent ref={pre} {...props} />
        <CodeBlockActions>
          <CopyButton
            aria-label="Copy code"
            value={() => pre.current?.textContent?.trimEnd() ?? ""}
          />
        </CodeBlockActions>
      </CodeBlockRoot>
    </div>
  );
}

// An answer sits under the page's own headings, so its outline starts two levels down.
const components = {
  a: ({ children, ...props }: Props<"a">) => (
    <Link {...props} rel="noopener noreferrer" target="_blank">
      {children}
    </Link>
  ),
  blockquote: (props: Props<"blockquote">) => (
    <blockquote {...props} {...stylex.props(styles.block, styles.quote)} />
  ),
  code: MarkdownCode,
  h1: ({ children, ...props }: Props<"h1">) => (
    <h3 {...props} {...stylex.props(styles.heading, typeStyles.heading6)}>
      {children}
    </h3>
  ),
  h2: ({ children, ...props }: Props<"h2">) => (
    <h4 {...props} {...stylex.props(styles.heading, typeStyles.textLg)}>
      {children}
    </h4>
  ),
  h3: ({ children, ...props }: Props<"h3">) => (
    <h5 {...props} {...stylex.props(styles.heading, typeStyles.textLg)}>
      {children}
    </h5>
  ),
  h4: ({ children, ...props }: Props<"h4">) => (
    <h6 {...props} {...stylex.props(styles.heading, typeStyles.textLg)}>
      {children}
    </h6>
  ),
  hr: (props: Props<"hr">) => <hr {...props} {...stylex.props(styles.rule)} />,
  li: (props: Props<"li">) => <li {...props} {...stylex.props(styles.item)} />,
  ol: (props: Props<"ol">) => (
    <ol {...props} {...stylex.props(styles.block, styles.list)} />
  ),
  p: (props: Props<"p">) => <p {...props} {...stylex.props(styles.block)} />,
  pre: CodeBlock,
  strong: (props: Props<"strong">) => (
    <strong {...props} {...stylex.props(styles.strong)} />
  ),
  // A margin on the table would stay inside its scroll container.
  table: (props: Props<"table">) => (
    <div {...stylex.props(styles.block)}>
      <Table {...props} />
    </div>
  ),
  tbody: (props: Props<"tbody">) => <TableBody {...props} />,
  td: ({ style, ...props }: Props<"td">) => (
    <TableCell {...props} sx={[styles.cell, alignOf(style)]} />
  ),
  th: ({ style, ...props }: Props<"th">) => (
    <TableHead {...props} sx={[styles.cell, alignOf(style)]} />
  ),
  thead: (props: Props<"thead">) => <TableHeader {...props} />,
  tr: (props: Props<"tr">) => <TableRow {...props} />,
  ul: (props: Props<"ul">) => (
    <ul {...props} {...stylex.props(styles.block, styles.list)} />
  ),
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
    <div
      data-slot="markdown"
      {...stylex.props([typeStyles.textBase, styles.root], sx)}
    >
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
