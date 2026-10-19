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
const textTruncates = [1, 2, 3] as const;

type TextSize = (typeof textSizes)[number];
type TextTruncate = (typeof textTruncates)[number];

type TextProps = Omit<useRender.ComponentProps<"p">, "className" | "style"> & {
  color?: TextColor;
  size?: TextSize;
  sx?: stylex.StyleXStyles;
  tabularNums?: boolean;
  /** Lines to show before an ellipsis; `true` is one. */
  truncate?: boolean | TextTruncate;
  weight?: TextWeight;
};

const styles = stylex.create({
  // Inherit, not the user agent's, when rendered as a heading.
  base: {
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    marginBlock: 0,
    textWrap: "pretty",
  },
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  // `textWrap`, not `whiteSpace`, so it replaces base's `pretty` instead of racing it.
  line: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textWrap: "nowrap",
  },
  clamp: {
    display: "-webkit-box",
    minWidth: 0,
    overflow: "hidden",
    overflowWrap: "anywhere",
    WebkitBoxOrient: "vertical",
  },
  clamp2: {
    WebkitLineClamp: 2,
  },
  clamp3: {
    WebkitLineClamp: 3,
  },
});

const sizeStyles = {
  sm: typeStyles.textSm,
  base: typeStyles.textBase,
  lg: typeStyles.textLg,
} satisfies Record<TextSize, stylex.StyleXStyles>;

const truncateStyles = {
  1: styles.line,
  2: [styles.clamp, styles.clamp2],
  3: [styles.clamp, styles.clamp3],
} satisfies Record<TextTruncate, stylex.StyleXStyles>;

function Text({
  color,
  render,
  size,
  sx,
  tabularNums = false,
  truncate = false,
  weight,
  ...props
}: TextProps) {
  const lines = truncate === true ? 1 : truncate;

  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      props,
      stylex.props(
        styles.base,
        size && sizeStyles[size],
        weight && textWeightStyles[weight],
        color && textColorStyles[color],
        tabularNums && styles.tabularNums,
        lines !== false && truncateStyles[lines],
        sx
      )
    ),
    render,
    state: { color, size, slot: "text", truncate: lines, weight },
  });
}

export { Text, textSizes, textTruncates };
export type { TextProps, TextSize, TextTruncate };
