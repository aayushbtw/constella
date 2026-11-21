"use client";

import * as stylex from "@stylexjs/stylex";
import { createContext, use, useMemo } from "react";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { withStyles } from "@/lib/constella/styles";
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
  leaving: {
    filter: {
      default: `blur(${motion.crossfadeBlur})`,
      "@starting-style": "none",
    },
    opacity: { default: 0, "@starting-style": 1 },
    transform: {
      default: `scale(${motion.crossfadeScale})`,
      "@starting-style": "none",
    },
  },
  entering: {
    filter: {
      default: null,
      "@starting-style": `blur(${motion.crossfadeBlur})`,
    },
    opacity: { default: null, "@starting-style": 0 },
    transform: {
      default: null,
      "@starting-style": `scale(${motion.crossfadeScale})`,
    },
  },
});

const SwapIconContext = createContext<{ from?: string; value?: string }>({});

/** Shows the item whose `value` matches its own, cross-fading between them. Mounted with `from`, it cross-fades from that item. */
function SwapIcon({
  from,
  sx,
  value,
  ...props
}: Styled<ComponentProps<"span">> & { from?: string; value: string }) {
  return (
    <SwapIconContext value={useMemo(() => ({ from, value }), [from, value])}>
      <span
        data-slot="swap-icon"
        {...withStyles(props, stylex.props(styles.swap, sx))}
      />
    </SwapIconContext>
  );
}

function SwapIconItem({
  sx,
  value,
  ...props
}: Styled<ComponentProps<"span">> & { value: string }) {
  const { from, value: current } = use(SwapIconContext);
  const shown = current === value;
  return (
    <span
      aria-hidden={!shown}
      data-shown={shown || undefined}
      data-slot="swap-icon-item"
      {...withStyles(
        props,
        stylex.props(
          styles.item,
          !shown && (from === value ? styles.leaving : styles.hidden),
          shown && from !== undefined && from !== value && styles.entering,
          sx
        )
      )}
    />
  );
}

export { SwapIcon, SwapIconItem };
