"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { TextMorph } from "torph/react";

import type { Sx } from "@/lib/constella/styles";
import { durations, easings } from "@/lib/constella/tokens.stylex";

const morphFor = Number(durations.crossfade.slice(0, -"ms".length));

// Torph renders `as` with only its ref, class and style, so the slot rides on the element.
function Root(props: ComponentProps<"span">) {
  return <span data-slot="swap-text" {...props} />;
}

/**
 * Morphs its old text into its new one whenever `children` changes: kept letters slide into
 * place, the rest fade, the width eases, and a number rolls by place value.
 */
function SwapText({ children, sx }: { children: string; sx?: Sx }) {
  return (
    <TextMorph
      as={Root}
      duration={morphFor}
      ease={easings.crossfade}
      {...stylex.props(sx)}
    >
      {children}
    </TextMorph>
  );
}

export { SwapText };
