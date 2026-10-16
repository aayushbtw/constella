import * as stylex from "@stylexjs/stylex";
import { Markdown } from "@tanstack/markdown/react";
import type {
  MarkdownComponents,
  MarkdownProps,
} from "@tanstack/markdown/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
} from "@/components/ui/code-block";
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
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  radii,
  space,
} from "@/lib/constella/tokens.stylex";
import { demos, isDemo } from "~/components/demos";
import { CodeLines } from "~/components/docs/code-tokens";
import { Frameworks } from "~/components/docs/frameworks";
import { Install } from "~/components/docs/install";
import { layout, shadows } from "~/lib/tokens.stylex";

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
    marginBlockStart: {
      default: `calc(${space.xl} + ${space.md})`,
      ":first-child": 0,
    },
    scrollMarginTop: layout.pageTop,
  },
  h3: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
    marginBlockEnd: space.xs,
    // Room enough that a subsection reads as a break after a table.
    marginBlockStart: `calc(${space.lg} + ${space.sm})`,
    scrollMarginTop: layout.pageTop,
  },
  a: {
    color: colors.textPrimary,
    textDecorationColor: {
      default: colors.edge,
      [media.hover]: {
        default: colors.edge,
        ":hover": colors.textPrimary,
      },
      ":active": colors.textPrimary,
    },
    textDecorationLine: "underline",
    textUnderlineOffset: 3,
  },
  code: {
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    boxShadow: shadows.card,
    color: colors.textPrimary,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xs,
    paddingBlock: 1,
    paddingInlineEnd: 3,
    paddingInlineStart: 3,
  },
  // Docs cells hold sentences, so they wrap instead of scrolling the table sideways.
  // Body text reads as the prose around it; headers keep the table's own textPrimary.
  table: {
    color: colors.textSecondary,
  },
  wrap: {
    whiteSpace: "normal",
  },
  top: {
    verticalAlign: "top",
  },
  strong: {
    fontWeight: fontWeights.semibold,
  },
  // A thin frame on the page, holding the preview and any controls under it.
  demo: {
    ...flow,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.inset,
    paddingBlock: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
  },
});

// Only a fenced block's `code` carries a `language-*` class; it renders the whole Code Block, so `pre` passes through.
// No highlighter: its HTML can't hold CodeBlockLines, which keep line numbers beside the code.
function Code({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) {
  const lang =
    className?.startsWith("language-") === true
      ? className.slice("language-".length)
      : undefined;
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- the renderer passes a fence's source as a string
  if (lang === undefined || typeof children !== "string") {
    return (
      <code {...props} {...stylex.props(styles.code)}>
        {children}
      </code>
    );
  }
  return (
    <CodeBlock sx={styles.p}>
      <CodeBlockContent
        lineNumbers={lang !== "text" && children.trimEnd().includes("\n")}
        wrap={lang === "text"}
      >
        <CodeLines code={children} lang={lang} />
      </CodeBlockContent>
      <CodeBlockActions>
        <CopyButton aria-label="Copy code" value={children.trimEnd()} />
      </CodeBlockActions>
    </CodeBlock>
  );
}

function Demo({ name }: { name?: string }) {
  if (name === undefined || !isDemo(name)) {
    throw new Error(`No demo registered as "${name}"`);
  }

  const Component = demos[name];

  return (
    <div data-slot="demo" {...stylex.props(styles.demo)}>
      <Component />
    </div>
  );
}

function MarkdownInstall({ name }: { name?: string }) {
  return (
    <div {...stylex.props(styles.p)}>
      <Install name={name} />
    </div>
  );
}

function MarkdownFrameworks() {
  return (
    <div {...stylex.props(styles.p)}>
      <Frameworks />
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
  "md-frameworks": MarkdownFrameworks,
  "md-install": MarkdownInstall,
  p: (props) => <p {...props} {...stylex.props(styles.p)} />,
  pre: ({ children }: ComponentPropsWithoutRef<"pre">): ReactNode => children,
  strong: (props) => <strong {...props} {...stylex.props(styles.strong)} />,
  table: (props) => (
    <div {...stylex.props(styles.p)}>
      <Table {...props} interactive={false} sx={styles.table} />
    </div>
  ),
  tbody: (props) => <TableBody {...props} />,
  td: (props) => <TableCell {...props} sx={[styles.wrap, styles.top]} />,
  th: (props) => <TableHead {...props} sx={styles.wrap} />,
  thead: (props) => <TableHeader {...props} />,
  tr: (props) => <TableRow {...props} />,
} satisfies MarkdownComponents;

function Prose({ body }: { body: MarkdownProps["children"] }) {
  return (
    <div {...stylex.props(styles.prose)}>
      <Markdown components={components}>{body}</Markdown>
    </div>
  );
}

export { Prose };
