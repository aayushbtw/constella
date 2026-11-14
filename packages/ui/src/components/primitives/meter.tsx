"use client";

import * as stylex from "@stylexjs/stylex";
import {
  MeterIndicator as MeterIndicatorPrimitive,
  MeterLabel as MeterLabelPrimitive,
  Meter as MeterPrimitive,
  MeterTrack as MeterTrackPrimitive,
  MeterValue as MeterValuePrimitive,
} from "@ui-sdk/react/meter";
import type { ComponentProps, ReactNode } from "react";

import type { Sx } from "@/lib/constella/styles";
import { trackStyles, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  media,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

const meterColors = ["success", "info", "warning", "danger"] as const;
const meterVariants = ["bar", "ring"] as const;

type MeterColor = (typeof meterColors)[number];
type MeterVariant = (typeof meterVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type MeterProps = Omit<
  ComponentProps<typeof MeterPrimitive>,
  "children" | "className" | "color" | "style"
> & {
  children?: ReactNode;
  color?: MeterColor;
  variant?: MeterVariant;
  sx?: Sx;
};

const styles = stylex.create({
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
  ringRoot: {
    alignItems: "center",
    display: "inline-flex",
    gap: space.xs,
  },
  // A step smaller than an icon, centered in an icon's box, as Spinner is, so the two swap in place.
  ring: {
    display: "block",
    flexShrink: 0,
    height: sizes.iconSm,
    marginBlock: `calc((${sizes.icon} - ${sizes.iconSm}) / 2)`,
    marginInline: `calc((${sizes.icon} - ${sizes.iconSm}) / 2)`,
    // Starts at twelve o'clock and fills clockwise.
    transform: "rotate(-90deg)",
    width: sizes.iconSm,
  },
  ringTrack: {
    fill: "none",
    stroke: colors.fillOpaque,
  },
  ringIndicator: {
    fill: "none",
    stroke: colors.accentSolid,
    strokeLinecap: "round",
    transitionDuration: {
      default: durations.move,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "stroke-dasharray, stroke",
    transitionTimingFunction: easings.out,
  },
  // A round cap on an empty ring would still draw a dot.
  ringEmpty: {
    strokeLinecap: "butt",
  },
  ringFill: (percent: number) => ({
    strokeDasharray: `${percent} 100`,
  }),
  successRing: {
    stroke: colors.successSolid,
  },
  infoRing: {
    stroke: colors.infoSolid,
  },
  warningRing: {
    stroke: colors.warningSolid,
  },
  dangerRing: {
    stroke: colors.dangerSolid,
  },
});

const colorStyles = {
  danger: styles.danger,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
} satisfies Record<MeterColor, stylex.StyleXStyles>;

const ringColorStyles = {
  danger: styles.dangerRing,
  info: styles.infoRing,
  success: styles.successRing,
  warning: styles.warningRing,
} satisfies Record<MeterColor, stylex.StyleXStyles>;

const rootStyles = {
  bar: trackStyles.root,
  ring: styles.ringRoot,
} satisfies Record<MeterVariant, stylex.StyleXStyles>;

/**
 * Renders its fill after its children, so a label and value sit beside it: a bar under them,
 * or at `ring`, an icon-sized ring before them.
 */
function Meter({ children, color, sx, variant = "bar", ...props }: MeterProps) {
  return (
    <MeterPrimitive
      data-color={color}
      data-variant={variant}
      {...props}
      {...stylex.props(rootStyles[variant], sx)}
    >
      {({ percent }) => (
        <>
          {variant === "ring" ? (
            <svg
              aria-hidden
              data-slot="meter-ring"
              viewBox="0 0 16 16"
              {...stylex.props(styles.ring)}
            >
              <circle
                cx={8}
                cy={8}
                pathLength={100}
                r={6.5}
                strokeWidth={3}
                {...stylex.props(styles.ringTrack)}
              />
              <circle
                cx={8}
                cy={8}
                pathLength={100}
                r={6.5}
                strokeWidth={3}
                {...stylex.props(
                  styles.ringIndicator,
                  styles.ringFill(percent),
                  percent === 0 && styles.ringEmpty,
                  color && ringColorStyles[color]
                )}
              />
            </svg>
          ) : null}
          {children}
          {variant === "bar" ? (
            <MeterTrack>
              <MeterIndicator sx={color && colorStyles[color]} />
            </MeterTrack>
          ) : null}
        </>
      )}
    </MeterPrimitive>
  );
}

function MeterTrack({
  sx,
  ...props
}: Styled<ComponentProps<typeof MeterTrackPrimitive>>) {
  return (
    <MeterTrackPrimitive {...props} {...stylex.props(trackStyles.track, sx)} />
  );
}

function MeterIndicator({
  sx,
  ...props
}: Styled<ComponentProps<typeof MeterIndicatorPrimitive>>) {
  return (
    <MeterIndicatorPrimitive
      {...props}
      {...stylex.props(trackStyles.indicator, sx)}
    />
  );
}

function MeterLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof MeterLabelPrimitive>>) {
  return (
    <MeterLabelPrimitive
      {...props}
      {...stylex.props([typeStyles.textSm, trackStyles.label], sx)}
    />
  );
}

function MeterValue({
  sx,
  ...props
}: Styled<ComponentProps<typeof MeterValuePrimitive>>) {
  return (
    <MeterValuePrimitive
      // ui-sdk 0.1.0-beta.1 relies on the meter role hiding its children, which Chromium doesn't; drop once ui-sdk hides it.
      aria-hidden
      {...props}
      {...stylex.props([typeStyles.textSm, trackStyles.value], sx)}
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
  meterVariants,
};
export type { MeterColor, MeterProps, MeterVariant };
