import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import { scrollFade } from "@/lib/constella/scroll-fade";
import { typeStyles } from "@/lib/constella/styles";
import {
  codeBlockVars,
  colors,
  fonts,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

const codeBlockStatuses = ["danger"] as const;
const codeBlockSizes = ["sm", "default"] as const;
const codeBlockLineVariants = [
  "default",
  "added",
  "removed",
  "highlighted",
] as const;

type CodeBlockStatus = (typeof codeBlockStatuses)[number];
type CodeBlockSize = (typeof codeBlockSizes)[number];
type CodeBlockLineVariant = (typeof codeBlockLineVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const danger = ":is([data-slot='code-block'][data-status='danger'] *)";
const numbered = ":is([data-numbered] *)";
const numberedSelf = ":is([data-numbered])";
const marks =
  "pre:not([data-numbered]):has([data-variant='added'], [data-variant='removed'])";
const marked = `:is(${marks} *)`;
const markedSelf = `:is(${marks})`;
const wrapped = ":is([data-wrap] *)";
const onBlock = ":is([data-slot='code-block'] > *)";
const besideFloating =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-actions']) > * > *)";
const underHeader =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-header']) > *)";
const overFooter =
  ":is([data-slot='code-block']:has(> [data-slot='code-block-footer']) > *)";

const pad = codeBlockVars.padInline;
// The header icon's column: line numbers and diff marks sit in it, so code starts under the title.
const gutter = `calc(${pad} + ${sizes.icon} + ${space.xs})`;
const clearActions = `calc(${space.xs} + ${sizes.controlSm} + ${space.xs})`;

const styles = stylex.create({
  block: {
    [codeBlockVars.padBlock]: space.sm,
    [codeBlockVars.padInline]: space.md,
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  sm: {
    [codeBlockVars.padBlock]: space.xs,
    [codeBlockVars.padInline]: space.sm,
  },
  danger: { backgroundColor: colors.dangerSubtle, color: colors.dangerText },
  header: {
    alignItems: "center",
    color: { default: colors.textSecondary, [danger]: colors.dangerText },
    display: "flex",
    flexShrink: 0,
    gap: space.xs,
    minHeight: sizes.controlSm,
    minWidth: 0,
    paddingBlockStart: `calc(${codeBlockVars.padBlock} - ${space.xxs})`,
    paddingInlineEnd: space.xs,
    paddingInlineStart: pad,
  },
  title: {
    color: { default: colors.textPrimary, [danger]: colors.dangerText },
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
    // Centered on the first line.
    insetBlockStart: {
      default: null,
      [onBlock]: `calc(${codeBlockVars.padBlock} + (${lineHeights.textSm} - ${sizes.controlSm}) / 2)`,
    },
    // Physical, since the code under it is always left to right.
    right: { default: null, [onBlock]: space.xs },
    position: { default: null, [onBlock]: "absolute" },
  },
  // The numbers' containing block, outside the scroller.
  content: {
    flexGrow: 1,
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    lineHeight: lineHeights.textSm,
    minHeight: 0,
    minWidth: 0,
    paddingBlockEnd: {
      default: codeBlockVars.padBlock,
      [overFooter]: space.xxs,
    },
    paddingBlockStart: {
      default: codeBlockVars.padBlock,
      [underHeader]: space.xxs,
    },
    position: "relative",
  },
  // Never a containing block (no position, transform, filter, contain, container-type or will-change), or it would scroll and clip the numbers.
  pre: {
    fontFamily: "inherit",
    fontSize: "inherit",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    // The numbers' column sits beside the scroller, never over it: code under a cover shows through at fractional scroll offsets.
    marginInlineStart: {
      default: 0,
      [numberedSelf]: gutter,
      [markedSelf]: gutter,
    },
    minWidth: 0,
    overflow: "auto",
    // The scroll fade shows there's more, as in Suggestions.
    scrollbarWidth: "none",
    paddingInlineEnd: { default: pad, [besideFloating]: clearActions },
    paddingInlineStart: { default: pad, [numberedSelf]: 0, [markedSelf]: 0 },
    tabSize: 2,
    textAlign: "start",
  },
  start: (line: number) => ({ counterReset: `line ${line}` }),
  wrap: {
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  },
  code: {
    display: "block",
    fontFamily: "inherit",
    minWidth: "100%",
    width: { default: "max-content", [wrapped]: "auto" },
  },
  // Not positioned, so its number and mark place against the content, outside the scroller.
  line: {
    counterIncrement: { default: null, [numbered]: "line" },
    display: "block",
    marginInlineEnd: `calc(-1 * ${pad})`,
    marginInlineStart: {
      default: `calc(-1 * ${pad})`,
      [numbered]: 0,
      [marked]: 0,
    },
    minHeight: lineHeights.textSm,
    paddingInlineEnd: pad,
    paddingInlineStart: { default: pad, [numbered]: 0, [marked]: 0 },
    // Its block position is the line's own; only its inline position is set.
    "::before": {
      boxSizing: "border-box",
      color: colors.textMuted,
      content: { default: null, [numbered]: "counter(line) / ''" },
      insetInlineStart: 0,
      paddingInlineEnd: space.xs,
      paddingInlineStart: pad,
      position: "absolute",
      textAlign: "end",
      userSelect: "none",
      width: gutter,
    },
    // The diff mark: beside a number, or alone in the gutter, filled like its line.
    "::after": {
      boxSizing: "border-box",
      insetInlineStart: { default: space.xxs, [marked]: 0 },
      paddingInlineEnd: { default: null, [marked]: space.xs },
      paddingInlineStart: { default: null, [marked]: pad },
      position: "absolute",
      textAlign: "end",
      userSelect: "none",
      width: { default: null, [marked]: gutter },
    },
  },
  added: {
    backgroundColor: colors.successSubtle,
    "::after": {
      backgroundColor: colors.successSubtle,
      color: colors.successText,
      content: "'+'",
    },
    "::before": { backgroundColor: colors.successSubtle },
  },
  removed: {
    backgroundColor: colors.dangerSubtle,
    "::after": {
      backgroundColor: colors.dangerSubtle,
      color: colors.dangerText,
      content: "'−'",
    },
    "::before": { backgroundColor: colors.dangerSubtle },
  },
  highlighted: {
    backgroundColor: colors.fill,
    "::before": { backgroundColor: colors.fill },
  },
  footer: {
    alignItems: "center",
    color: { default: colors.textSecondary, [danger]: colors.dangerText },
    display: "flex",
    flexShrink: 0,
    fontFamily: fonts.sans,
    gap: space.xs,
    minWidth: 0,
    paddingBlockEnd: codeBlockVars.padBlock,
    paddingInlineEnd: pad,
    paddingInlineStart: pad,
  },
});

const statusStyles = {
  danger: styles.danger,
} satisfies Record<CodeBlockStatus, stylex.StyleXStyles>;

const lineVariantStyles = {
  added: styles.added,
  default: null,
  highlighted: styles.highlighted,
  removed: styles.removed,
} satisfies Record<CodeBlockLineVariant, stylex.StyleXStyles>;

/** A tray of code. The app highlights it; the block lays it out. */
function CodeBlock({
  size = "default",
  status,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & {
  size?: CodeBlockSize;
  status?: CodeBlockStatus;
}) {
  return (
    <div
      data-size={size}
      data-slot="code-block"
      data-status={status}
      {...props}
      {...stylex.props(
        [typeStyles.textSm, styles.block],
        size === "sm" && [typeStyles.captionLg, styles.sm],
        status && statusStyles[status],
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
function CodeBlockTitle({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.title, sx)),
    render,
    state: { slot: "code-block-title" },
  });
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

/** The code, scrolling sideways on its own (never down) and always left to right. A string with `lineNumbers` splits into lines; `sx` styles the wrapper, `ref` and the rest reach the `pre`. */
function CodeBlockContent({
  children,
  lineNumbers = false,
  startLine = 1,
  sx,
  wrap = false,
  ...props
}: Omit<ComponentProps<"pre">, "className" | "style"> & {
  lineNumbers?: boolean;
  startLine?: number;
  sx?: stylex.StyleXStyles;
  wrap?: boolean;
}) {
  return (
    <div
      data-slot="code-block-content"
      dir="ltr"
      {...stylex.props(styles.content, scrollFade.xEndAround, sx)}
    >
      <pre
        data-numbered={lineNumbers || undefined}
        data-wrap={wrap || undefined}
        {...props}
        {...stylex.props(
          styles.pre,
          scrollFade.source,
          styles.start(startLine - 1),
          wrap && styles.wrap
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
    </div>
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
      <span>{empty ? "\n" : children}</span>
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
  codeBlockStatuses,
};
export type { CodeBlockLineVariant, CodeBlockSize, CodeBlockStatus };
