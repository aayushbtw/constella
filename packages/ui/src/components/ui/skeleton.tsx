import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  easings,
  opacities,
  radii,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const pulse = stylex.keyframes({
  "50%": { opacity: opacities.pulse },
});

const styles = stylex.create({
  skeleton: {
    animationDuration: durations.pulse,
    animationIterationCount: "infinite",
    animationName: pulse,
    animationTimingFunction: easings.inOut,
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
  },
});

function Skeleton({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      {...props}
      {...stylex.props(styles.skeleton, sx)}
    />
  );
}

export { Skeleton };
