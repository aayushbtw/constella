import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { textColors, textWeights, typeStyles } from "@/lib/constella/styles";
import type { TextColor, TextWeight } from "@/lib/constella/styles";

type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = Omit<
  useRender.ComponentProps<"h2">,
  "className" | "style"
> & {
  color?: TextColor;
  /** The heading's rank in the outline: its tag, and its size unless `size` says otherwise. */
  level?: HeadingSize;
  size?: HeadingSize;
  sx?: stylex.StyleXStyles;
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
  return useRender({
    defaultTagName: `h${level}`,
    props: mergeProps<"h2">(
      props,
      stylex.props(
        styles.base,
        sizeStyles[size],
        textWeights[weight],
        textColors[color],
        sx
      )
    ),
    render,
    state: { size, slot: "heading" },
  });
}

export { Heading };
export type { HeadingProps, HeadingSize };
