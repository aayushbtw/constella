import * as stylex from "@stylexjs/stylex";

import type { layers } from "@/lib/constella/tokens.stylex";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  joins,
  letterSpacings,
  lineHeights,
  media,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

// A group's own parts, not the focus guards Base UI drops beside an open popup's trigger.
const notFirst = ":not(:nth-child(1 of [data-slot]))";
const notLast = ":not(:nth-last-child(1 of [data-slot]))";

// The neighbor before draws the shared edge, or the separator does.
const joined =
  ":not(:nth-child(1 of [data-slot]), [data-slot='button-group-separator'] + *)";

// Whole on their own; in a ButtonGroup, the corners that meet a neighbor take its join.
const corners = (radius: Values<typeof radii>) => ({
  borderEndEndRadius: {
    default: radius,
    [notLast]: `calc(${radius} * ${joins.either})` as const,
  },
  borderEndStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.inline})` as const,
    [notLast]: {
      default: `calc(${radius} * ${joins.block})` as const,
      [notFirst]: `calc(${radius} * ${joins.either})` as const,
    },
  },
  borderStartEndRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.block})` as const,
    [notLast]: {
      default: `calc(${radius} * ${joins.inline})` as const,
      [notFirst]: `calc(${radius} * ${joins.either})` as const,
    },
  },
  borderStartStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.either})` as const,
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
  textMd: { fontSize: fontSizes.textMd, lineHeight: lineHeights.textMd },
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

// The open state repeats inside the media block, which StyleX ranks above a bare condition.
const interactive = <R, A>(rest: R, active: A) => ({
  default: rest,
  ":is([data-popup-open])": active,
  [media.hover]: {
    default: rest,
    ":is([data-popup-open])": active,
    ":hover:not(:disabled)": active,
  },
  ":active:not(:disabled)": active,
});

// The press and open state repeat inside the media block, which StyleX ranks above a bare condition.
const lift = {
  default: shadows.default,
  ":is([data-popup-open])": shadows.defaultHover,
  [media.hover]: {
    default: shadows.default,
    ":is([data-popup-open])": shadows.defaultHover,
    ":hover:not(:disabled, :active)": shadows.defaultHover,
    ":active:not(:disabled)": shadows.defaultPressed,
  },
  ":active:not(:disabled)": shadows.defaultPressed,
};

const pressed = ":is([data-pressed])";
const hoverUnpressed = ":hover:not(:disabled, [data-pressed])";
const activeUnpressed = ":active:not(:disabled, [data-pressed])";
const hoverPressed = ":is([data-pressed]):hover:not(:disabled, :active)";

// Selected is `fill`; hover stays a step under, and hovering a selected part stacks
// `fillSubtle` on its fill as an inset shadow, so the two never read alike.
const selectable = <R>(rest: R) => ({
  default: rest,
  [media.hover]: {
    default: rest,
    [hoverUnpressed]: colors.fillSubtle,
    [pressed]: colors.fill,
  },
  [activeUnpressed]: colors.fillSubtle,
  [pressed]: colors.fill,
});
const lit = `inset 0 0 0 100vmax ${colors.fillSubtle}`;
const unlit = "inset 0 0 0 100vmax transparent";

// A pressable's fill and height by variant, for a part that looks like a button but isn't
// one. Apply after the part's own styles: each replaces its whole property.
const stateStyles = stylex.create({
  ghost: { backgroundColor: interactive("transparent", colors.fillSubtle) },
  outline: {
    backgroundColor: interactive(colors.background, colors.fillSubtle),
  },
  secondary: { backgroundColor: interactive(colors.fill, colors.fillStrong) },
  lift: { boxShadow: lift },
  // A ghost toggle, selected while `[data-pressed]`.
  selectedFill: {
    backgroundColor: selectable("transparent"),
    boxShadow: {
      default: unlit,
      [media.hover]: { default: unlit, [hoverPressed]: lit },
    },
  },
  // An outline toggle: `selectedFill` on a background, with the lift under it.
  selectedFillLifted: {
    backgroundColor: selectable(colors.background),
    boxShadow: {
      default: `${unlit}, ${shadows.default}`,
      [media.hover]: {
        default: `${unlit}, ${shadows.default}`,
        ":hover:not(:disabled, :active)": `${unlit}, ${shadows.defaultHover}`,
        [hoverPressed]: `${lit}, ${shadows.defaultHover}`,
        ":active:not(:disabled)": `${unlit}, ${shadows.defaultPressed}`,
      },
      ":active:not(:disabled)": `${unlit}, ${shadows.defaultPressed}`,
    },
  },
});

// A control's icon by its size, for an icon the part renders itself (`size={controlIconSize[size]}`).
const controlIconSize = {
  xs: sizes.iconXs,
  "icon-xs": sizes.iconXs,
  sm: sizes.iconSm,
  "icon-sm": sizes.icon,
  default: sizes.icon,
  icon: sizes.icon,
  lg: sizes.icon,
  "icon-lg": sizes.icon,
} as const;

// The bar Progress and Meter share, and the label and value above it. A slider's track takes `colors.fillOpaque` too.
const trackStyles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    width: "100%",
  },
  track: {
    backgroundColor: colors.fillOpaque,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "flex",
    height: strokes.track,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  indicator: {
    backgroundColor: colors.accentSolid,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: "100%",
    transitionDuration: {
      default: durations.move,
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "width, background-color",
    transitionTimingFunction: easings.out,
  },
  label: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  value: {
    color: colors.textSecondary,
    fontVariantNumeric: "tabular-nums",
    marginInlineStart: "auto",
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

type Values<T> = T[keyof T];
type SpaceValue = Values<typeof space>;

type ColorProperty =
  | "accentColor"
  | "backgroundColor"
  | "borderBlockColor"
  | "borderBlockEndColor"
  | "borderBlockStartColor"
  | "borderBottomColor"
  | "borderColor"
  | "borderInlineColor"
  | "borderInlineEndColor"
  | "borderInlineStartColor"
  | "borderLeftColor"
  | "borderRightColor"
  | "borderTopColor"
  | "caretColor"
  | "color"
  | "columnRuleColor"
  | "fill"
  | "outlineColor"
  | "stroke"
  | "textDecorationColor";
type SpaceProperty =
  | `${"margin" | "padding"}${"" | "Block" | "BlockEnd" | "BlockStart" | "Bottom" | "Inline" | "InlineEnd" | "InlineStart" | "Left" | "Right" | "Top"}`
  | "columnGap"
  | "gap"
  | "rowGap";
type RadiusProperty =
  | "borderBottomLeftRadius"
  | "borderBottomRightRadius"
  | "borderEndEndRadius"
  | "borderEndStartRadius"
  | "borderRadius"
  | "borderStartEndRadius"
  | "borderStartStartRadius"
  | "borderTopLeftRadius"
  | "borderTopRightRadius";
type DurationProperty =
  | "animationDelay"
  | "animationDuration"
  | "transitionDelay"
  | "transitionDuration";
type EasingProperty = "animationTimingFunction" | "transitionTimingFunction";

type ShorthandProperty =
  | "animation"
  | "background"
  | "border"
  | "borderBlock"
  | "borderBlockEnd"
  | "borderBlockStart"
  | "borderBottom"
  | "borderInline"
  | "borderInlineEnd"
  | "borderInlineStart"
  | "borderLeft"
  | "borderRight"
  | "borderTop"
  | "columnRule"
  | "font"
  | "outline"
  | "textDecoration"
  | "transition";

type SpaceToken = SpaceValue | Values<typeof sizes>;
type DurationValue = Values<typeof durations>;
type EasingValue = Values<typeof easings> | "ease" | "linear";

type TokenStyles = Partial<
  Record<
    ColorProperty,
    | Values<(typeof colors)["__tokens"]>
    | "currentColor"
    | "inherit"
    | "transparent"
    | null
  > &
    Record<
      SpaceProperty,
      | SpaceToken
      | 0
      | "auto"
      | `${"calc" | "clamp" | "max" | "min"}(${string}${SpaceToken}${string}`
      | null
    > &
    Record<
      RadiusProperty,
      | Values<typeof radii>
      | `calc(${Values<typeof radii>} * ${string})`
      | 0
      | "inherit"
      | null
    > &
    Record<
      DurationProperty,
      DurationValue | `${DurationValue}, ${string}` | 0 | null
    > &
    Record<EasingProperty, EasingValue | `${EasingValue}, ${string}` | null> &
    Record<
      "boxShadow",
      Values<typeof shadows> | `${string}var(--${string}` | "none" | null
    > &
    Record<"fontSize", Values<typeof fontSizes> | "inherit" | null> &
    Record<"zIndex", Values<typeof layers> | 0 | "auto" | null>
>;

/** A part's `sx`: colors, space, radii, shadows, type sizes, layers and motion take only tokens, as longhands; other properties stay open. A property that takes a token joins the lists above. */
type Sx = stylex.StyleXStyles<
  Omit<stylex.CSSProperties, keyof TokenStyles | ShorthandProperty> &
    TokenStyles
>;

export {
  controlIconSize,
  joinStyles,
  stateStyles,
  textColors,
  textColorStyles,
  textWeights,
  textWeightStyles,
  trackStyles,
  typeStyles,
  visuallyHidden,
};
export type { Sx, TextColor, TextWeight };
