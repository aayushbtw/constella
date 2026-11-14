import * as stylex from "@stylexjs/stylex";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";

import type { Sx, TextColor, TextWeight } from "@/lib/constella/styles";
import {
  textColorStyles,
  textWeightStyles,
  typeStyles,
} from "@/lib/constella/styles";

const headingSizes = [1, 2, 3, 4, 5, 6] as const;

type HeadingSize = (typeof headingSizes)[number];

type HeadingProps = Omit<PartProps<"h2">, "className" | "style"> & {
  color?: TextColor;
  /** The heading's rank in the outline: its tag, and its size unless `size` says otherwise. */
  level?: HeadingSize;
  size?: HeadingSize;
  sx?: Sx;
  weight?: TextWeight;
};

const styles = stylex.create({
  base: {
    marginBlock: 0,
    textWrap: "balance",
  },
});

const sizeStyles = {
  1: typeStyles.heading1,
  2: typeStyles.heading2,
  3: typeStyles.heading3,
  4: typeStyles.heading4,
  5: typeStyles.heading5,
  6: typeStyles.heading6,
} satisfies Record<HeadingSize, stylex.StyleXStyles>;

function Heading({
  color = "primary",
  level = 2,
  render,
  size = level,
  sx,
  weight = "semibold",
  ...props
}: HeadingProps) {
  return renderElement(
    `h${level}`,
    mergeProps(
      {
        "data-color": color,
        "data-size": size,
        "data-slot": "heading",
        "data-weight": weight,
      },
      props,
      stylex.props(
        styles.base,
        sizeStyles[size],
        textWeightStyles[weight],
        textColorStyles[color],
        sx
      )
    ),
    render
  );
}

export { Heading, headingSizes };
export type { HeadingProps, HeadingSize };
