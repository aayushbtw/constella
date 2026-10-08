"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import type { ComponentProps } from "react";

import { durations, easings, motion } from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const textIn = stylex.keyframes({
  from: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});
const textOut = stylex.keyframes({
  to: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});

const styles = stylex.create({
  swap: {
    display: "inline-grid",
  },
  // Old and new share one cell; the layout takes the new text's size at once.
  text: {
    gridArea: "1 / 1",
  },
  // Blur bridges the two, so they read as one text changing.
  entering: {
    animationDuration: durations.crossfade,
    animationName: textIn,
    animationTimingFunction: easings.out,
  },
  leaving: {
    animationDuration: durations.popover,
    animationFillMode: "forwards",
    animationName: textOut,
    animationTimingFunction: easings.out,
    pointerEvents: "none",
    visibility: "visible",
    // Out of the layout, so the new text sets the width.
    width: 0,
    whiteSpace: "nowrap",
  },
});

/** Cross-fades from its old text to its new one whenever `children` changes. */
function SwapText({
  children,
  sx,
  ...props
}: Styled<Omit<ComponentProps<"span">, "children">> & { children: string }) {
  const [seen, setSeen] = useState(children);
  const [previous, setPrevious] = useState<string | null>(null);

  if (children !== seen) {
    setPrevious(seen);
    setSeen(children);
  }

  return (
    <span data-slot="swap-text" {...props} {...stylex.props(styles.swap, sx)}>
      {previous !== null && (
        <span
          aria-hidden
          key={`out-${previous}`}
          onAnimationEnd={() => {
            setPrevious(null);
          }}
          {...stylex.props(styles.text, styles.leaving)}
        >
          {previous}
        </span>
      )}
      <span
        key={children}
        {...stylex.props(styles.text, previous !== null && styles.entering)}
      >
        {children}
      </span>
    </span>
  );
}

export { SwapText };
