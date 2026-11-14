import * as stylex from "@stylexjs/stylex";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";

import type { Sx, TextColor, TextWeight } from "@/lib/constella/styles";
import {
  textColorStyles,
  textWeightStyles,
  typeStyles,
} from "@/lib/constella/styles";
import { letterSpacings } from "@/lib/constella/tokens.stylex";

const captionSizes = ["xs", "sm", "base", "lg"] as const;

type CaptionSize = (typeof captionSizes)[number];

type CaptionProps = Omit<PartProps<"p">, "className" | "style"> & {
  color?: TextColor;
  size?: CaptionSize;
  sx?: Sx;
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
  return renderElement(
    "p",
    mergeProps(
      {
        "data-color": color,
        "data-size": size,
        "data-slot": "caption",
        "data-weight": weight,
      },
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
    render
  );
}

export { Caption, captionSizes };
export type { CaptionProps, CaptionSize };
