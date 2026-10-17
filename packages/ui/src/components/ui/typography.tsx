import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { typeStyles } from "@/lib/constella/styles";
import { colors, fontWeights } from "@/lib/constella/tokens.stylex";

type TextSize = "sm" | "base" | "lg";
type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;
type TypeWeight = "regular" | "semimedium" | "medium" | "semibold";
type TypeColor =
  | "primary"
  | "secondary"
  | "muted"
  | "danger"
  | "success"
  | "warning"
  | "info";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

interface TypeProps {
  color?: TypeColor;
  weight?: TypeWeight;
}

type TextProps = Styled<useRender.ComponentProps<"p">> &
  TypeProps & { size?: TextSize };

type HeadingProps = Styled<useRender.ComponentProps<"h2">> &
  TypeProps & {
    /** The heading's rank in the outline: its tag, and its size unless `size` says otherwise. */
    level?: HeadingSize;
    size?: HeadingSize;
  };

type CaptionProps = Styled<useRender.ComponentProps<"p">> & TypeProps;

const styles = stylex.create({
  base: {
    marginBlock: 0,
  },
  heading: {
    textWrap: "balance",
  },
  regular: { fontWeight: fontWeights.regular },
  semimedium: { fontWeight: fontWeights.semimedium },
  medium: { fontWeight: fontWeights.medium },
  semibold: { fontWeight: fontWeights.semibold },
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
  danger: { color: colors.dangerText },
  success: { color: colors.successText },
  warning: { color: colors.warningText },
  info: { color: colors.infoText },
});

const textSizes = {
  sm: typeStyles.textSm,
  base: typeStyles.textBase,
  lg: typeStyles.textLg,
} as const;

const headingSizes = {
  1: typeStyles.heading1,
  2: typeStyles.heading2,
  3: typeStyles.heading3,
  4: typeStyles.heading4,
  5: typeStyles.heading5,
  6: typeStyles.heading6,
} as const;

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
        textSizes[size],
        styles[weight],
        color && styles[color],
        sx
      )
    ),
    render,
    state: { size, slot: "text" },
  });
}

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
        styles.heading,
        headingSizes[size],
        styles[weight],
        styles[color],
        sx
      )
    ),
    render,
    state: { size, slot: "heading" },
  });
}

function Caption({
  color = "muted",
  render,
  sx,
  weight = "regular",
  ...props
}: CaptionProps) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      props,
      stylex.props(
        styles.base,
        typeStyles.caption,
        styles[weight],
        styles[color],
        sx
      )
    ),
    render,
    state: { slot: "caption" },
  });
}

export { Caption, Heading, Text };
export type {
  CaptionProps,
  HeadingProps,
  HeadingSize,
  TextProps,
  TextSize,
  TypeColor,
  TypeWeight,
};
