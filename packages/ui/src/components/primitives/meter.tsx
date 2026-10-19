"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  radii,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const meterColors = ["success", "info", "warning", "danger"] as const;

type MeterColor = (typeof meterColors)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
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
    backgroundColor: colors.accentSolid,
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
  success: {
    backgroundColor: colors.successSolid,
  },
  info: {
    backgroundColor: colors.infoSolid,
  },
  warning: {
    backgroundColor: colors.warningSolid,
  },
  danger: {
    backgroundColor: colors.dangerSolid,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  value: {
    color: colors.textSecondary,
    fontVariantNumeric: "tabular-nums",
    marginInlineStart: "auto",
  },
});

const colorStyles = {
  danger: styles.danger,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
} satisfies Record<MeterColor, stylex.StyleXStyles>;

/** Renders the track and indicator after its children, so a label and value sit above. */
function Meter({
  children,
  color,
  sx,
  ...props
}: Styled<MeterPrimitive.Root.Props> & { color?: MeterColor }) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      data-color={color}
      {...props}
      {...stylex.props(styles.root, sx)}
    >
      {children}
      <MeterTrack>
        <MeterIndicator sx={color && colorStyles[color]} />
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
      {...stylex.props([typeStyles.textSm, styles.label], sx)}
    />
  );
}

function MeterValue({ sx, ...props }: Styled<MeterPrimitive.Value.Props>) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.value], sx)}
    />
  );
}

export {
  Meter,
  MeterIndicator,
  MeterLabel,
  meterColors,
  MeterTrack,
  MeterValue,
};
export type { MeterColor };
