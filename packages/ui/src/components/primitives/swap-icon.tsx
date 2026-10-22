import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import {
  durations,
  easings,
  media,
  motion,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const styles = stylex.create({
  // Every item shares one cell, so a swap is a crossfade in place.
  swap: {
    display: "inline-grid",
    flexShrink: 0,
  },
  item: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: {
      default: durations.crossfade,
      // Swapped from the keyboard on the control it sits in (only a keyboard focus matches `:focus-visible`), it doesn't move.
      ":is(:focus-visible > [data-slot='swap-icon'] > *)": "0s",
    },
    transitionProperty: {
      default: "opacity, filter, transform",
      [media.reducedMotion]: "opacity, filter",
    },
    transitionTimingFunction: easings.crossfade,
  },
  hidden: {
    filter: `blur(${motion.crossfadeBlur})`,
    opacity: 0,
    transform: `scale(${motion.crossfadeScale})`,
  },
});

const SwapIconContext = createContext<string | undefined>(undefined);

/** Shows the item whose `value` matches its own, cross-fading between them. */
function SwapIcon({
  sx,
  value,
  ...props
}: Styled<ComponentProps<"span">> & { value: string }) {
  return (
    <SwapIconContext value={value}>
      <span
        data-slot="swap-icon"
        {...props}
        {...stylex.props(styles.swap, sx)}
      />
    </SwapIconContext>
  );
}

function SwapIconItem({
  sx,
  value,
  ...props
}: Styled<ComponentProps<"span">> & { value: string }) {
  const shown = use(SwapIconContext) === value;
  return (
    <span
      aria-hidden={!shown}
      data-shown={shown || undefined}
      data-slot="swap-icon-item"
      {...props}
      {...stylex.props(styles.item, !shown && styles.hidden, sx)}
    />
  );
}

export { SwapIcon, SwapIconItem };
