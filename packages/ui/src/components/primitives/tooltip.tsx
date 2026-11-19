"use client";

import * as stylex from "@stylexjs/stylex";
import {
  TooltipContent as TooltipContentPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "@ui-sdk/react/tooltip";
import type { TooltipProps } from "@ui-sdk/react/tooltip";
import { createContext, use, useMemo } from "react";
import type { ComponentProps } from "react";

import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { popupReset, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  motion,
  offsets,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

// ui-sdk holds `data-starting-style` a frame on an instant open, and `data-instant` while closing, which still fades.
const offstage =
  ":is([data-starting-style], [data-ending-style]):not([data-instant][data-open], [data-skip-motion])";
const instant = ":is([data-instant][data-open], [data-skip-motion])";

const styles = stylex.create({
  content: {
    alignItems: "center",
    backgroundColor: colors.invertedSolid,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.invertedOnSolid,
    display: "flex",
    fontWeight: fontWeights.medium,
    gap: space.xs,
    maxWidth: `min(${sizes.tooltip}, var(--available-width))`,
    opacity: { default: 1, [offstage]: 0 },
    paddingBlock: space.xxs,
    paddingInlineEnd: {
      default: space.xs,
      ":has(> [data-slot^='kbd']:last-child)": space.xxs,
    },
    paddingInlineStart: space.xs,
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.hover,
      [instant]: "0s",
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
});

const TooltipContext = createContext<{ skip: boolean }>({ skip: false });

function Tooltip({
  delay = Number.parseFloat(durations.tooltipDelay),
  onOpenChange,
  ...props
}: TooltipProps) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  const context = useMemo(() => ({ skip }), [skip]);
  return (
    <TooltipContext value={context}>
      <TooltipPrimitive
        delay={delay}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipContext>
  );
}

function TooltipTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof TooltipTriggerPrimitive>>) {
  return <TooltipTriggerPrimitive {...props} {...stylex.props(sx)} />;
}

function TooltipContent({
  sideOffset = Number(offsets.tooltip),
  sx,
  ...props
}: Styled<ComponentProps<typeof TooltipContentPrimitive>>) {
  const { skip } = use(TooltipContext);
  return (
    <TooltipContentPrimitive
      data-skip-motion={skip || undefined}
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(
        [typeStyles.captionLg, popupReset.base, styles.content],
        sx
      )}
    />
  );
}

export { Tooltip, TooltipContent, TooltipTrigger };
