import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { textColors, textWeights, typeStyles } from "@/lib/constella/styles";
import type { TextColor, TextWeight } from "@/lib/constella/styles";
import { letterSpacings } from "@/lib/constella/tokens.stylex";

type CaptionSize = "xs" | "sm" | "base" | "lg";

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
        textWeights[weight],
        textColors[color],
        sx
      )
    ),
    render,
    state: { size, slot: "caption" },
  });
}

export { Caption };
export type { CaptionProps, CaptionSize };
