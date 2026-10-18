import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { colors, durations, media } from "@/lib/constella/tokens.stylex";

type ShimmerProps = Omit<
  useRender.ComponentProps<"span">,
  "className" | "style"
> & {
  sx?: stylex.StyleXStyles;
};

const rtl = ":is([dir='rtl'], [dir='rtl'] *)";
const spread = "calc(3ch + 40px)";
const mid = `color-mix(in oklch, ${colors.textPrimary}, currentColor 50%)`;

const sweep = stylex.keyframes({
  from: { backgroundPosition: "100% 0" },
  to: { backgroundPosition: "0 0" },
});

const styles = stylex.create({
  // A band of primary text sweeping across the text's own color, start to end.
  shimmer: {
    animationDirection: { default: null, [rtl]: "reverse" },
    animationDuration: durations.shimmer,
    animationIterationCount: "infinite",
    animationName: { default: sweep, [media.reducedMotion]: "none" },
    animationTimingFunction: "linear",
    backgroundClip: "text",
    backgroundImage: {
      default: `linear-gradient(110deg, currentColor calc(50% - ${spread}), ${mid} calc(50% - ${spread} * 0.5), ${colors.textPrimary} 50%, ${mid} calc(50% + ${spread} * 0.5), currentColor calc(50% + ${spread}))`,
      [media.reducedMotion]: "none",
    },
    backgroundPosition: "0 0",
    backgroundRepeat: "no-repeat",
    backgroundSize: `calc(200% + ${spread} * 2) 100%`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: {
      default: "transparent",
      [media.reducedMotion]: "currentColor",
    },
  },
});

/** Text still being worked on: a slow sweep of light across it. */
function Shimmer({ render, sx, ...props }: ShimmerProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(props, stylex.props(styles.shimmer, sx)),
    render,
    state: { slot: "shimmer" },
  });
}

export { Shimmer };
export type { ShimmerProps };
