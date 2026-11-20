"use client";

import * as stylex from "@stylexjs/stylex";
import {
  SegmentedControlIndicator,
  SegmentedControlItem as SegmentedControlItemPrimitive,
  SegmentedControl as SegmentedControlPrimitive,
} from "@ui-sdk/react/segmented-control";
import type { ComponentProps, ReactNode } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type SegmentedControlProps<Value extends string = string> = Styled<
  Omit<ComponentProps<typeof SegmentedControlPrimitive<Value>>, "children">
> & {
  children?: ReactNode;
};

const vertical = ":is([data-orientation='vertical'])";

const pickedBeforePillPlaced =
  ":is([data-checked]):not([data-slot='segmented-control-indicator'][style*='--segmented-control-indicator-width'] ~ *)";

const pickedByKeyboard =
  ":is([data-slot='segmented-control']:has(:focus-visible) > *)";

const firstPlacement = ":is([data-activation-direction='none'])";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    isolation: "isolate",
    position: "relative",
    width: "fit-content",
  },
  // Reads like a tab: the pill behind it, not its own fill, marks the pick.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [pickedBeforePillPlaced]: colors.fill,
    },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: {
      default: colors.textSecondary,
      ":is([data-checked])": colors.textPrimary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover:not([data-disabled])": colors.textPrimary,
        ":is([data-checked])": colors.textPrimary,
      },
    },
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    fontWeight: fontWeights.semimedium,
    height: sizes.controlSm,
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    paddingInline: space.sm,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    zIndex: 1,
  },
  // ui-sdk measures `--segmented-control-indicator-left` from the physical left, so the pill anchors there too.
  indicator: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: "var(--segmented-control-indicator-height)",
    left: 0,
    position: "absolute",
    top: 0,
    transform:
      "translate(var(--segmented-control-indicator-left), var(--segmented-control-indicator-top))",
    transitionDuration: {
      default: durations.move,
      [firstPlacement]: "0s",
      [pickedByKeyboard]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform, width, height",
    transitionTimingFunction: easings.inOut,
    width: "var(--segmented-control-indicator-width)",
  },
});

/** One pick among a few, marked by a pill that slides to it, as a tab's does. */
function SegmentedControl<Value extends string = string>({
  children,
  sx,
  ...props
}: SegmentedControlProps<Value>) {
  return (
    <SegmentedControlPrimitive<Value>
      {...props}
      {...stylex.props([typeStyles.textSm, styles.root], sx)}
    >
      <SegmentedControlIndicator {...stylex.props(styles.indicator)} />
      {children}
    </SegmentedControlPrimitive>
  );
}

function SegmentedControlItem({
  sx,
  ...props
}: Styled<ComponentProps<typeof SegmentedControlItemPrimitive>>) {
  return (
    <SegmentedControlItemPrimitive
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
export type { SegmentedControlProps };
