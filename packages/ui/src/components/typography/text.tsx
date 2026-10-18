import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import {
  textColorStyles,
  textWeightStyles,
  typeStyles,
} from "@/lib/constella/styles";
import type { TextColor, TextWeight } from "@/lib/constella/styles";

const textSizes = ["sm", "base", "lg"] as const;

type TextSize = (typeof textSizes)[number];

type TextProps = Omit<useRender.ComponentProps<"p">, "className" | "style"> & {
  color?: TextColor;
  size?: TextSize;
  sx?: stylex.StyleXStyles;
  weight?: TextWeight;
};

const styles = stylex.create({
  // Inherit, not the user agent's, when rendered as a heading.
  base: {
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    marginBlock: 0,
  },
});

const sizeStyles = {
  sm: typeStyles.textSm,
  base: typeStyles.textBase,
  lg: typeStyles.textLg,
} satisfies Record<TextSize, stylex.StyleXStyles>;

function Text({ color, render, size, sx, weight, ...props }: TextProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      props,
      stylex.props(
        styles.base,
        size && sizeStyles[size],
        weight && textWeightStyles[weight],
        color && textColorStyles[color],
        sx
      )
    ),
    render,
    state: { color, size, slot: "text", weight },
  });
}

export { Text, textSizes };
export type { TextProps, TextSize };
