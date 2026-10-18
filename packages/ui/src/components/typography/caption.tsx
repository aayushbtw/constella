import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import {
  textColorStyles,
  textWeightStyles,
  typeStyles,
} from "@/lib/constella/styles";
import type { TextColor, TextWeight } from "@/lib/constella/styles";
import { letterSpacings } from "@/lib/constella/tokens.stylex";

const captionSizes = ["xs", "sm", "base", "lg"] as const;

type CaptionSize = (typeof captionSizes)[number];

type CaptionProps = Omit<
  useRender.ComponentProps<"p">,
  "className" | "style"
> & {
  color?: TextColor;
  size?: CaptionSize;
  sx?: stylex.StyleXStyles;
  uppercase?: boolean;
  weight?: TextWeight;
};

const styles = stylex.create({
  base: {
    marginBlock: 0,
  },
  uppercase: {
    letterSpacing: letterSpacings.caps,
    textTransform: "uppercase",
  },
});

const sizeStyles = {
  xs: typeStyles.captionXs,
  sm: typeStyles.captionSm,
  base: typeStyles.captionBase,
  lg: typeStyles.captionLg,
} satisfies Record<CaptionSize, stylex.StyleXStyles>;

function Caption({
  color = "muted",
  render,
  size = "base",
  sx,
  uppercase = false,
  weight = "regular",
  ...props
}: CaptionProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      props,
      stylex.props(
        styles.base,
        sizeStyles[size],
        uppercase && styles.uppercase,
        textWeightStyles[weight],
        textColorStyles[color],
        sx
      )
    ),
    render,
    state: { color, size, slot: "caption", weight },
  });
}

export { Caption, captionSizes };
export type { CaptionProps, CaptionSize };
