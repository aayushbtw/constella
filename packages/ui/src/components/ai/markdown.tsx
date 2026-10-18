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
  sx?: stylex.StyleXStyles;
};

type Props<T extends keyof React.JSX.IntrinsicElements> =
  MarkdownComponentProps<T>;

const styles = stylex.create({
  root: {
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    minWidth: 0,
    overflowWrap: "break-word",
  },
  p: { marginBlockEnd: 0, marginBlockStart: 0 },
  heading: {
    fontWeight: fontWeights.semibold,
    marginBlockEnd: 0,
    marginBlockStart: { default: space.xs, ":first-child": 0 },
    textWrap: "balance",
  },
  strong: { fontWeight: fontWeights.semibold },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingInlineStart: space.lg,
  },
  quote: {
    borderInlineStartColor: colors.border,
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
    borderBlockStartColor: colors.borderSubtle,
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
    <blockquote {...props} {...stylex.props(styles.quote)} />
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
    <div
      data-slot="markdown"
      {...stylex.props([typeStyles.textLg, styles.root], sx)}
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
