"use client";

import * as stylex from "@stylexjs/stylex";
import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
  ProgressLabel as ProgressLabelPrimitive,
  ProgressTrack as ProgressTrackPrimitive,
  ProgressValue as ProgressValuePrimitive,
} from "@ui-sdk/react/progress";
import type { ComponentProps, ReactNode } from "react";

import type { Sx } from "@/lib/constella/styles";
import { trackStyles, typeStyles } from "@/lib/constella/styles";
import {
  durations,
  easings,
  media,
  opacities,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type ProgressProps = Styled<
  Omit<ComponentProps<typeof ProgressPrimitive>, "children">
> & {
  children?: ReactNode;
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
  indeterminate: {
    animationDuration: { default: null, [unknown]: durations.pulse },
    animationIterationCount: { default: null, [unknown]: "infinite" },
    animationName: {
      default: null,
      [unknown]: { default: sweep, [media.reducedMotion]: breathe },
    },
    animationTimingFunction: { default: null, [unknown]: easings.inOut },
    width: { default: null, [unknown]: "33.333%" },
  },
});

/** Renders the track and indicator after its children, so a label and value sit above. */
function Progress({ children, sx, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive {...props} {...stylex.props(trackStyles.root, sx)}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive>
  );
}

function ProgressTrack({
  sx,
  ...props
}: Styled<ComponentProps<typeof ProgressTrackPrimitive>>) {
  return (
    <ProgressTrackPrimitive
      {...props}
      {...stylex.props(trackStyles.track, sx)}
    />
  );
}

function ProgressIndicator({
  sx,
  ...props
}: Styled<ComponentProps<typeof ProgressIndicatorPrimitive>>) {
  return (
    <ProgressIndicatorPrimitive
      {...props}
      {...stylex.props(trackStyles.indicator, styles.indeterminate, sx)}
    />
  );
}

function ProgressLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof ProgressLabelPrimitive>>) {
  return (
    <ProgressLabelPrimitive
      {...props}
      {...stylex.props([typeStyles.textSm, trackStyles.label], sx)}
    />
  );
}

function ProgressValue({
  sx,
  ...props
}: Styled<ComponentProps<typeof ProgressValuePrimitive>>) {
  return (
    <ProgressValuePrimitive
      {...props}
      {...stylex.props([typeStyles.textSm, trackStyles.value], sx)}
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
