"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  opacities,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

// A segment a third the track's width, crossing it while the amount is unknown.
const sweep = stylex.keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(300%)" },
});
const breathe = stylex.keyframes({
  "50%": { opacity: opacities.pulse },
});
const unknown = ":is([data-indeterminate])";

const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    width: "100%",
  },
  track: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "flex",
    height: strokes.track,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  indicator: {
    animationDuration: { default: null, [unknown]: durations.pulse },
    animationIterationCount: { default: null, [unknown]: "infinite" },
    animationName: {
      default: null,
      [unknown]: { default: sweep, [media.reducedMotion]: breathe },
    },
    animationTimingFunction: { default: null, [unknown]: easings.inOut },
    backgroundColor: colors.accent,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: "100%",
    transitionDuration: {
      default: durations.move,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "width, background-color",
    transitionTimingFunction: easings.out,
    width: { default: null, [unknown]: "33.333%" },
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
  },
  value: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    lineHeight: lineHeights.text,
    marginInlineStart: "auto",
  },
});

/** Renders the track and indicator after its children, so a label and value sit above. */
function Progress({
  children,
  sx,
  ...props
}: Styled<ProgressPrimitive.Root.Props>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      {...props}
      {...stylex.props(styles.root, sx)}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({
  sx,
  ...props
}: Styled<ProgressPrimitive.Track.Props>) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      {...props}
      {...stylex.props(styles.track, sx)}
    />
  );
}

function ProgressIndicator({
  sx,
  ...props
}: Styled<ProgressPrimitive.Indicator.Props>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      {...props}
      {...stylex.props(styles.indicator, sx)}
    />
  );
}

function ProgressLabel({
  sx,
  ...props
}: Styled<ProgressPrimitive.Label.Props>) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function ProgressValue({
  sx,
  ...props
}: Styled<ProgressPrimitive.Value.Props>) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
};
