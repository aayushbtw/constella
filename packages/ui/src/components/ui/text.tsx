import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { textColors, textWeights, typeStyles } from "@/lib/constella/styles";
import type { TextColor, TextWeight } from "@/lib/constella/styles";

type TextSize = "sm" | "base" | "lg";

type TextProps = Omit<useRender.ComponentProps<"p">, "className" | "style"> & {
  color?: TextColor;
  size?: TextSize;
  sx?: stylex.StyleXStyles;
  weight?: TextWeight;
};

const styles = stylex.create({
  base: {
    marginBlock: 0,
  },
});

const sizeStyles = {
  sm: typeStyles.textSm,
  base: typeStyles.textBase,
  lg: typeStyles.textLg,
} satisfies Record<TextSize, stylex.StyleXStyles>;

function Text({
  color,
  render,
  size = "base",
  sx,
  weight = "regular",
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      props,
      stylex.props(
        styles.base,
        sizeStyles[size],
        textWeights[weight],
        color && textColors[color],
        sx
      )
    ),
    render,
    state: { size, slot: "text" },
  });
}

export { Text };
export type { TextProps, TextSize };
