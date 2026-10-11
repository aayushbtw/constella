"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const open = ":is([data-panel-open] > *)";
const instant = ":is([data-collapsible-instant] > *)";
const rtl = ":is([dir='rtl'] *)";
// Under the trigger's icon, stopping `space.xxs` short of it.
const reach = `calc((${sizes.controlSm} - ${sizes.icon}) / 2 - ${space.xxs})`;
const rail = {
  backgroundColor: colors.edge,
  content: "''",
  insetInlineStart: `calc(${sizes.icon} / 2 - ${strokes.border} / 2)`,
  position: "absolute",
  width: strokes.border,
} as const;

const styles = stylex.create({
  // Copied in reasoning.tsx and tool-steps.tsx, so each installs alone; change both.
  trigger: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: {
      default: colors.textSecondary,
      [media.hover]: { default: null, ":hover": colors.textPrimary },
    },
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.controlSm,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    // The rail's start, under the icon, while the panel below is open.
    "::after": {
      ...rail,
      content: { default: "none", ":is([data-panel-open])": "''" },
      height: reach,
      insetBlockEnd: 0,
    },
  },
  // Turns a quarter as the thinking opens; snaps when the keyboard opened it.
  chevron: {
    color: {
      default: colors.textMuted,
      [media.hover]: { default: null, ":is(:hover > *)": colors.textPrimary },
    },
    display: "flex",
    flexShrink: 0,
    transform: {
      default: "none",
      [open]: "rotate(90deg)",
      [rtl]: "scaleX(-1)",
      [`${open}${rtl}`]: "scaleX(-1) rotate(90deg)",
    },
    transitionDuration: {
      default: durations.move,
      [instant]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "color, transform",
    transitionTimingFunction: easings.out,
  },
  // Lined up with the trigger's label, a rail under its icon.
  content: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    paddingBlockStart: space.xxs,
    paddingInlineStart: `calc(${sizes.icon} + ${space.xs})`,
    position: "relative",
    "::before": { ...rail, insetBlockEnd: 0, insetBlockStart: 0 },
  },
});

/** The model's thinking before it answers, closed to one line. */
function Reasoning({
  sx,
  ...props
}: Styled<ComponentProps<typeof Collapsible>>) {
  return <Collapsible data-slot="reasoning" {...props} {...stylex.props(sx)} />;
}

/** The line that opens it; pass its label ("Thinking", "Thought for 4s"). */
function ReasoningTrigger({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleTrigger>> & {
  children?: ReactNode;
}) {
  return (
    <CollapsibleTrigger
      data-slot="reasoning-trigger"
      {...props}
      {...stylex.props(styles.trigger, sx)}
    >
      {children}
      <span {...stylex.props(styles.chevron)}>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowRight01Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      </span>
    </CollapsibleTrigger>
  );
}

function ReasoningContent({
  children,
  ...props
}: ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent data-slot="reasoning-content" {...props}>
      <div {...stylex.props(styles.content)}>{children}</div>
    </CollapsibleContent>
  );
}

export { Reasoning, ReasoningContent, ReasoningTrigger };
