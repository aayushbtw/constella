"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

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
  },
  // At or past its cap, the fill turns red.
  full: {
    backgroundColor: colors.dangerSolid,
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
function Meter({ children, sx, ...props }: Styled<MeterPrimitive.Root.Props>) {
  const isFull = props.value >= (props.max ?? 100);
  return (
    <MeterPrimitive.Root
      data-full={isFull || undefined}
      data-slot="meter"
      {...props}
      {...stylex.props(styles.root, sx)}
    >
      {children}
      <MeterTrack>
        <MeterIndicator sx={isFull && styles.full} />
      </MeterTrack>
    </MeterPrimitive.Root>
  );
}

function MeterTrack({ sx, ...props }: Styled<MeterPrimitive.Track.Props>) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      {...props}
      {...stylex.props(styles.track, sx)}
    />
  );
}

function MeterIndicator({
  sx,
  ...props
}: Styled<MeterPrimitive.Indicator.Props>) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      {...props}
      {...stylex.props(styles.indicator, sx)}
    />
  );
}

function MeterLabel({ sx, ...props }: Styled<MeterPrimitive.Label.Props>) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function MeterValue({ sx, ...props }: Styled<MeterPrimitive.Value.Props>) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

export { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue };
