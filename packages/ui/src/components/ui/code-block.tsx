import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";

const codeBlockVariants = ["default", "danger"] as const;
const codeBlockSizes = ["sm", "default"] as const;
const codeBlockLineVariants = [
  "default",
  "added",
  "removed",
  "highlighted",
] as const;

type CodeBlockVariant = (typeof codeBlockVariants)[number];
type CodeBlockSize = (typeof codeBlockSizes)[number];
type CodeBlockLineVariant = (typeof codeBlockLineVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const small = ":is([data-slot='code-block'][data-size='sm'] *)";
const danger = ":is([data-slot='code-block'][data-variant='danger'] *)";
const numbered = ":is([data-numbered] *)";
const wrapped = ":is([data-wrap] *)";
const onBlock = ":is([data-slot='code-block'] > *)";
const besideFloating =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-actions']) > *)";
const underHeader =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-header']) > *)";
const overFooter =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-footer']) > *)";

const padInline = { default: space.md, [small]: space.sm };
const padBlock = { default: space.sm, [small]: space.xs };
const centerOnFirstLine = (pad: string) =>
  `calc(${pad} + (${lineHeights.text} - ${sizes.controlSm}) / 2)`;
const clearActions = `calc(${space.xs} + ${sizes.controlSm} + ${space.xs})`;
const bleed = {
  default: `calc(-1 * ${space.md})`,
  [small]: `calc(-1 * ${space.sm})`,
};

const styles = stylex.create({
  block: {
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.xs,
    minWidth: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  sm: { fontSize: fontSizes.xxs },
  danger: { backgroundColor: colors.dangerFillSubtle, color: colors.danger },
  header: {
    alignItems: "center",
    color: { default: colors.textSecondary, [danger]: colors.danger },
    display: "flex",
    flexShrink: 0,
    gap: space.xs,
    minHeight: sizes.controlSm,
    minWidth: 0,
    paddingBlockStart: { default: space.xs, [small]: space.xxs },
    paddingInlineEnd: space.xs,
    paddingInlineStart: padInline,
  },
  title: {
    color: { default: colors.textPrimary, [danger]: colors.danger },
    fontFamily: fonts.sans,
    fontWeight: fontWeights.medium,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: space.xxs,
    marginInlineStart: "auto",
    insetBlockStart: {
      default: null,
      [onBlock]: centerOnFirstLine(space.sm),
      [`${onBlock}${small}`]: centerOnFirstLine(space.xs),
    },
    // Physical, since the code under it is always left to right.
    right: { default: null, [onBlock]: space.xs },
    position: { default: null, [onBlock]: "absolute" },
  },
  content: {
    flexGrow: 1,
    fontFamily: fonts.mono,
    fontSize: "inherit",
    fontVariantLigatures: "none",
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    minHeight: 0,
    minWidth: 0,
    overflow: "auto",
    // Paired with `small`, so each outranks it; alone they'd tie and lose.
    paddingBlockEnd: {
      ...padBlock,
      [overFooter]: space.xxs,
      [`${overFooter}${small}`]: space.xxs,
    },
    paddingBlockStart: {
      ...padBlock,
      [underHeader]: space.xxs,
      [`${underHeader}${small}`]: space.xxs,
    },
    paddingInlineEnd: {
      default: space.md,
      [small]: space.sm,
      [besideFloating]: clearActions,
      [`${besideFloating}${small}`]: clearActions,
    },
    paddingInlineStart: padInline,
    tabSize: 2,
    textAlign: "start",
  },
  start: (line: number) => ({ counterReset: `line ${line}` }),
  wrap: {
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  },
  code: {
    // A grid only when numbered: it would split highlighted tokens into rows.
    display: { default: "block", [numbered]: "grid" },
    fontFamily: "inherit",
    gridTemplateColumns: { default: null, [numbered]: "auto 1fr" },
    minWidth: "100%",
    width: { default: "max-content", [wrapped]: "auto" },
  },
  line: {
    counterIncrement: { default: null, [numbered]: "line" },
    display: { default: "block", [numbered]: "grid" },
    columnGap: space.sm,
    gridColumn: { default: null, [numbered]: "span 2" },
    gridTemplateColumns: { default: null, [numbered]: "subgrid" },
    marginInlineEnd: bleed,
    marginInlineStart: bleed,
    minHeight: lineHeights.text,
    paddingInlineEnd: padInline,
    paddingInlineStart: padInline,
    position: "relative",
    "::before": {
      color: colors.textMuted,
      content: { default: null, [numbered]: "counter(line) / ''" },
      minWidth: space.lg,
      textAlign: "end",
      userSelect: "none",
    },
    "::after": {
      insetBlockStart: 0,
      insetInlineStart: space.xxs,
      position: "absolute",
      userSelect: "none",
    },
  },
  lineContent: { minWidth: 0 },
  added: {
    backgroundColor: colors.successFillSubtle,
    "::after": { color: colors.success, content: "'+'" },
  },
  removed: {
    backgroundColor: colors.dangerFillSubtle,
    "::after": { color: colors.danger, content: "'−'" },
  },
  highlighted: { backgroundColor: colors.fill },
  footer: {
    alignItems: "center",
    color: { default: colors.textSecondary, [danger]: colors.danger },
    display: "flex",
    flexShrink: 0,
    fontFamily: fonts.sans,
    gap: space.xs,
    minWidth: 0,
    paddingBlockEnd: padBlock,
    paddingInlineEnd: padInline,
    paddingInlineStart: padInline,
  },
});

const variantStyles = {
  danger: styles.danger,
  default: null,
} satisfies Record<CodeBlockVariant, stylex.StyleXStyles>;

const lineVariantStyles = {
  added: styles.added,
  default: null,
  highlighted: styles.highlighted,
  removed: styles.removed,
} satisfies Record<CodeBlockLineVariant, stylex.StyleXStyles>;

/** A tray of code. The app highlights it; the block lays it out. */
function CodeBlock({
  size = "default",
  sx,
  variant = "default",
  ...props
}: Styled<ComponentProps<"div">> & {
  size?: CodeBlockSize;
  variant?: CodeBlockVariant;
}) {
  return (
    <div
      data-size={size}
      data-slot="code-block"
      data-variant={variant}
      {...props}
      {...stylex.props(
        styles.block,
        size === "sm" && styles.sm,
        variantStyles[variant],
        sx
      )}
    />
  );
}

function CodeBlockHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="code-block-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

/** The file name or language, cut short on one line. */
function CodeBlockTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="code-block-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

/** Buttons for the code: at the header's end, or floating on the first line when the block holds them itself. */
function CodeBlockActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="code-block-actions"
      {...props}
      {...stylex.props(styles.actions, sx)}
    />
  );
}

/** The code, scrolling on its own and always left to right. A string with `lineNumbers` splits into lines. */
function CodeBlockContent({
  children,
  lineNumbers = false,
  startLine = 1,
  sx,
  wrap = false,
  ...props
}: Styled<ComponentProps<"pre">> & {
  lineNumbers?: boolean;
  startLine?: number;
  wrap?: boolean;
}) {
  return (
    <pre
      data-numbered={lineNumbers || undefined}
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      dir="ltr"
      {...props}
      {...stylex.props(
        styles.content,
        styles.start(startLine - 1),
        wrap && styles.wrap,
        sx
      )}
    >
      <code data-slot="code-block-code" {...stylex.props(styles.code)}>
        {/* oxlint-disable-next-line anti-slop/no-runtime-typeof -- `children` is documented as plain text or lines */}
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/u, "")
              .split("\n")
              .map((line, index) => (
                // oxlint-disable-next-line react/no-array-index-key -- a line's place is its identity
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  );
}

/** One line, to mark it added, removed or highlighted. */
function CodeBlockLine({
  children,
  sx,
  variant = "default",
  ...props
}: Styled<ComponentProps<"span">> & {
  children?: ReactNode;
  variant?: CodeBlockLineVariant;
}) {
  // An empty line holds a newline, so a copied selection keeps it.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    children === false ||
    (Array.isArray(children) && children.length === 0);
  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.line, lineVariantStyles[variant], sx)}
    >
      <span {...stylex.props(styles.lineContent)}>
        {empty ? "\n" : children}
      </span>
    </span>
  );
}

function CodeBlockFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="code-block-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  codeBlockLineVariants,
  codeBlockSizes,
  CodeBlockTitle,
  codeBlockVariants,
};
export type { CodeBlockLineVariant, CodeBlockSize, CodeBlockVariant };
