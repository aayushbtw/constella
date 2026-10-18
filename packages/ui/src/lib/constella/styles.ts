import * as stylex from "@stylexjs/stylex";

import {
  colors,
  fontSizes,
  fontWeights,
  joins,
  letterSpacings,
  lineHeights,
  radii,
  strokes,
} from "@/lib/constella/tokens.stylex";

// A group's own parts, not the focus guards Base UI drops beside an open popup's trigger.
const notFirst = ":not(:nth-child(1 of [data-slot]))";
const notLast = ":not(:nth-last-child(1 of [data-slot]))";

// The neighbor before draws the shared edge, or the separator does.
const joined =
  ":not(:nth-child(1 of [data-slot]), [data-slot='button-group-separator'] + *)";

// Whole on their own; in a ButtonGroup, the corners that meet a neighbor take its join.
const corners = (radius: string) => ({
  borderEndEndRadius: {
    default: radius,
    [notLast]: `calc(${radius} * ${joins.either})`,
  },
  borderEndStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.inline})`,
    [notLast]: {
      default: `calc(${radius} * ${joins.block})`,
      [notFirst]: `calc(${radius} * ${joins.either})`,
    },
  },
  borderStartEndRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.block})`,
    [notLast]: {
      default: `calc(${radius} * ${joins.inline})`,
      [notFirst]: `calc(${radius} * ${joins.either})`,
    },
  },
  borderStartStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.either})`,
  },
});

/** Corners and start edge that join a neighbor in a ButtonGroup. Apply after a part's own styles. */
const joinStyles = stylex.create({
  edges: {
    borderBlockStartWidth: {
      default: strokes.border,
      [joined]: `calc(${strokes.border} * ${joins.block})`,
    },
    borderInlineStartWidth: {
      default: strokes.border,
      [joined]: `calc(${strokes.border} * ${joins.inline})`,
    },
  },
  full: corners(radii.full),
  sm: corners(radii.sm),
  xs: corners(radii.xs),
});

const visuallyHidden = stylex.create({
  base: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

// The type scale's steps, each a size with its line height. Put one before a part's own
// styles: `stylex.props(typeStyles.textSm, styles.label)`.
const typeStyles = stylex.create({
  heading1: {
    fontSize: fontSizes.heading1,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading1,
  },
  heading2: {
    fontSize: fontSizes.heading2,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading2,
  },
  heading3: {
    fontSize: fontSizes.heading3,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading3,
  },
  heading4: {
    fontSize: fontSizes.heading4,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading4,
  },
  heading5: {
    fontSize: fontSizes.heading5,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading5,
  },
  heading6: {
    fontSize: fontSizes.heading6,
    letterSpacing: letterSpacings.heading,
    lineHeight: lineHeights.heading6,
  },
  textLg: { fontSize: fontSizes.textLg, lineHeight: lineHeights.textLg },
  textBase: { fontSize: fontSizes.textBase, lineHeight: lineHeights.textBase },
  textSm: { fontSize: fontSizes.textSm, lineHeight: lineHeights.textSm },
  captionLg: {
    fontSize: fontSizes.captionLg,
    lineHeight: lineHeights.captionLg,
  },
  captionBase: {
    fontSize: fontSizes.captionBase,
    lineHeight: lineHeights.captionBase,
  },
  captionSm: {
    fontSize: fontSizes.captionSm,
    lineHeight: lineHeights.captionSm,
  },
  captionXs: {
    fontSize: fontSizes.captionXs,
    lineHeight: lineHeights.captionXs,
  },
});

// The weights and colors Text, Heading and Caption take as props.
const textWeights = ["regular", "semimedium", "medium", "semibold"] as const;
const textColors = [
  "primary",
  "secondary",
  "muted",
  "danger",
  "success",
  "warning",
  "info",
] as const;

type TextWeight = (typeof textWeights)[number];
type TextColor = (typeof textColors)[number];

const textWeightStyles = stylex.create({
  regular: { fontWeight: fontWeights.regular },
  semimedium: { fontWeight: fontWeights.semimedium },
  medium: { fontWeight: fontWeights.medium },
  semibold: { fontWeight: fontWeights.semibold },
});

const textColorStyles = stylex.create({
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
  danger: { color: colors.dangerText },
  success: { color: colors.successText },
  warning: { color: colors.warningText },
  info: { color: colors.infoText },
});

export {
  joinStyles,
  textColors,
  textColorStyles,
  textWeights,
  textWeightStyles,
  typeStyles,
  visuallyHidden,
};
export type { TextColor, TextWeight };
