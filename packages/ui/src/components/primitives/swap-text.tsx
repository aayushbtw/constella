"use client";

import * as stylex from "@stylexjs/stylex";
import { memo, useEffect, useRef } from "react";
import { useTextMorph } from "torph/react";

import type { Sx } from "@/lib/constella/styles";
import { durations, easings } from "@/lib/constella/tokens.stylex";

// Torph's root rule, copied so `sx` can override it. `base.css` reverts Torph's own copy.
const styles = stylex.create({
  root: {
    display: "inline-block",
    position: "relative",
    textAlign: "inherit",
    verticalAlign: "top",
    whiteSpace: "nowrap",
    willChange: "width, height",
  },
});

const morphFor = Number(durations.crossfade.slice(0, -"ms".length));

function Lines({ text }: { text: string }) {
  return text
    .split("\n")
    .flatMap((line, index) =>
      index === 0 ? [line] : [<br key={index} />, line]
    );
}

// Torph rewrites the span's contents, so React renders the first text once and never again.
const FirstLines = memo(Lines, () => true);

/**
 * Morphs its old text into its new one whenever `children` changes: kept letters slide into
 * place, the rest fade, the width eases, and a number rolls by place value.
 */
function SwapText({ children, sx }: { children: string; sx?: Sx }) {
  const { ref, update } = useTextMorph({
    duration: morphFor,
    ease: easings.crossfade,
  });
  // Splitting the text into letters measures each one, so it waits for the first change.
  const unsplit = useRef<string | null>(children);
  useEffect(() => {
    if (unsplit.current !== null) {
      if (children === unsplit.current) {
        return;
      }
      update(unsplit.current);
      unsplit.current = null;
    }
    update(children);
  }, [children, update]);
  return (
    <span data-slot="swap-text" ref={ref} {...stylex.props(styles.root, sx)}>
      <FirstLines text={children} />
    </span>
  );
}

export { SwapText };
