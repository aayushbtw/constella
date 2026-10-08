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

// A badge sets its icons at `iconXs` (`iconSm` at lg), so its spinner steps down with them.
const inBadge = ":where([data-slot='badge']:not([data-size='lg']) *)";
const inLgBadge = ":where([data-slot='badge'][data-size='lg'] *)";
const badgeSpinner = `calc(${sizes.iconXs} - ${space.xxxs})`;
const lgBadgeSpinner = `calc(${sizes.iconSm} - ${space.xxxs})`;

// An outline badge keeps its text neutral, so its spinner carries the status.
const inStatus = (status: string) =>
  `:where([data-slot='badge'][data-variant='outline'][data-status='${status}'] *)`;

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });

const styles = stylex.create({
  // A step smaller than an icon, centered in an icon's box, so the two swap in place.
  spinner: {
    animationDuration: durations.spin,
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
    borderBlockEndColor: colors.fillStrong,
    borderBlockStartColor: "currentColor",
    borderInlineEndColor: colors.fillStrong,
    borderInlineStartColor: colors.fillStrong,
    borderRadius: radii.full,
    borderStyle: "solid",
    borderWidth: strokes.spinner,
    boxSizing: "border-box",
    color: {
      default: null,
      [inStatus("success")]: colors.success,
      [inStatus("info")]: colors.info,
      [inStatus("warning")]: colors.warning,
      [inStatus("danger")]: colors.danger,
    },
    display: "inline-block",
    flexShrink: 0,
    height: {
      default: sizes.iconSm,
      [inBadge]: badgeSpinner,
      [inLgBadge]: lgBadgeSpinner,
    },
    margin: {
      default: `calc((${sizes.icon} - ${sizes.iconSm}) / 2)`,
      [inBadge]: `calc((${sizes.iconXs} - ${badgeSpinner}) / 2)`,
      [inLgBadge]: `calc((${sizes.iconSm} - ${lgBadgeSpinner}) / 2)`,
    },
    width: {
      default: sizes.iconSm,
      [inBadge]: badgeSpinner,
      [inLgBadge]: lgBadgeSpinner,
    },
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
