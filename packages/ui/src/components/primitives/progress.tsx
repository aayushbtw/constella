"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";

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
function Progress({
  children,
  sx,
  ...props
}: Styled<ProgressPrimitive.Root.Props>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      {...props}
      {...stylex.props(trackStyles.root, sx)}
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
      {...stylex.props(trackStyles.track, sx)}
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
      {...stylex.props(trackStyles.indicator, styles.indeterminate, sx)}
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
      {...stylex.props([typeStyles.textSm, trackStyles.label], sx)}
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
