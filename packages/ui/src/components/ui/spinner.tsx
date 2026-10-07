"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type SpinnerProps = Omit<ComponentProps<"output">, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

// A badge sets its icons at `iconXs`, so its spinner steps down with them.
const inBadge = ":where([data-slot='badge'] *)";
const badgeSpinner = `calc(${sizes.iconXs} - ${space.xxxs})`;

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });

const styles = stylex.create({
  // A step smaller than an icon, centered in an icon's box, so the two swap in place.
  spinner: {
    animationDuration: durations.spin,
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
    borderColor: colors.fillStrong,
    borderRadius: radii.full,
    borderStyle: "solid",
    borderTopColor: "currentColor",
    borderWidth: strokes.spinner,
    boxSizing: "border-box",
    display: "inline-block",
    flexShrink: 0,
    height: { default: sizes.iconSm, [inBadge]: badgeSpinner },
    margin: {
      default: `calc((${sizes.icon} - ${sizes.iconSm}) / 2)`,
      [inBadge]: `calc((${sizes.iconXs} - ${badgeSpinner}) / 2)`,
    },
    width: { default: sizes.iconSm, [inBadge]: badgeSpinner },
  },
});

function Spinner({ sx, ...props }: SpinnerProps) {
  return (
    <output
      aria-label="Loading"
      data-slot="spinner"
      {...props}
      {...stylex.props(styles.spinner, sx)}
    />
  );
}

export { Spinner };
export type { SpinnerProps };
