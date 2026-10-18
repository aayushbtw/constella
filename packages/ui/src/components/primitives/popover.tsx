"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  layers,
  media,
  motion,
  offsets,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type PopoverContentProps = Styled<PopoverPrimitive.Popup.Props> &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

const offstage = ":is([data-starting-style], [data-ending-style])";
const closing = ":is([data-ending-style]):not([data-instant])";
const instant = ":is([data-instant])";

// shadcn's padding and gap, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  positioner: {
    zIndex: layers.popover,
  },
  // Select's surface and motion (below), so every popup opens the same way.
  surface: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    gap: px10,
    maxWidth: "var(--available-width)",
    paddingBlock: px10,
    paddingInline: px10,
    width: sizes.popover,
  },
  motion: {
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
      [instant]: "0s",
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
  },
  title: {
    fontWeight: fontWeights.medium,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "pretty",
  },
});

function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function PopoverContent({
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          {...props}
          {...stylex.props(
            [typeStyles.textSm, styles.surface],
            styles.motion,
            sx
          )}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="popover-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function PopoverTitle({ sx, ...props }: Styled<PopoverPrimitive.Title.Props>) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.title], sx)}
    />
  );
}

function PopoverDescription({
  sx,
  ...props
}: Styled<PopoverPrimitive.Description.Props>) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.description], sx)}
    />
  );
}

/** The positioner's layer, the popup's surface and its motion, for a part that draws its own popup. */
const popoverStyles = {
  motion: styles.motion,
  positioner: styles.positioner,
  surface: [typeStyles.textSm, styles.surface],
};

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  popoverStyles,
  PopoverTitle,
  PopoverTrigger,
};
export type { PopoverContentProps };
