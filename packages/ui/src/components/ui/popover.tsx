"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  layers,
  lineHeights,
  media,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type PopoverContentProps = Styled<PopoverPrimitive.Popup.Props> &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

const offstage = ":is([data-starting-style], [data-ending-style])";

// shadcn's padding and gap, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  positioner: {
    zIndex: layers.popover,
  },
  // Select's surface and motion, so every popup opens the same way.
  popup: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    boxShadow: shadows.popover,
    boxSizing: "border-box",
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: px10,
    maxWidth: "var(--available-width)",
    opacity: { default: 1, [offstage]: 0 },
    padding: px10,
    transform: { default: "none", [offstage]: "scale(0.96)" },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: durations.popover,
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: sizes.popover,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    margin: 0,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    margin: 0,
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
  // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("4px")` is NaN
  sideOffset = Number.parseFloat(space.xxs),
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
          {...stylex.props(styles.popup, sx)}
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
      {...stylex.props(styles.title, sx)}
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
      {...stylex.props(styles.description, sx)}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
export type { PopoverContentProps };
