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

// A group's own parts: not ui-sdk popup content, which renders in place beside its trigger,
// `popover` while shown and `hidden` while closed, nor ui-sdk's hidden form field beside a
// select's trigger.
const notFirst =
  ":not(:nth-child(1 of [data-slot]:not([popover], [hidden], [data-slot='select-form-input'])))";
const notLast =
  ":not(:nth-last-child(1 of [data-slot]:not([popover], [hidden], [data-slot='select-form-input'])))";

// The neighbor before draws the shared edge, or the separator does.
const joined =
  ":not(:nth-child(1 of [data-slot]:not([popover], [hidden], [data-slot='select-form-input'])), [data-slot='separator'] + *)";

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
  md: corners(radii.md),
  sm: corners(radii.sm),
  xs: corners(radii.xs),
});

const popupReset = stylex.create({
  // A ui-sdk popup renders in place, so it drops what it would inherit from there: a group's
  // joins, an addon's text, a table cell's wrapping.
  base: {
    [joins.block]: "1",
    [joins.either]: "1",
    [joins.inline]: "1",
    color: colors.textPrimary,
    cursor: "auto",
    fontVariantNumeric: "normal",
    fontWeight: fontWeights.regular,
    textAlign: "start",
    userSelect: "text",
    whiteSpace: "normal",
  },
  // ui-sdk's menu, select, combobox, date picker and trigger menu keep the browser's `[popover]` border.
  borderless: {
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
  },
});

const popupSurface = stylex.create({
  base: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
  },
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
  textProse: {
    fontSize: fontSizes.textProse,
    lineHeight: lineHeights.textProse,
  },
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

// ui-sdk sets `data-open` on a collapsible's trigger too, and gives a hover card or combobox
// trigger no `aria-haspopup`. StyleX compiles an imported selector key to a descendant
// selector, so button.tsx and prompt-input.tsx repeat this one.
const popupOpen =
  ":where([aria-haspopup], [data-slot='hover-card-trigger'], [data-slot='combobox-trigger'])[data-open]";

// button.tsx's `hoverIdle` and `activeIdle`; keep in step.
const hoverIdle = ":hover:not(:disabled, [data-disabled], [data-pending])";
const activeIdle = ":active:not(:disabled, [data-disabled], [data-pending])";

// The open state repeats inside the media block, which StyleX ranks above a bare condition.
const interactive = <R, A>(rest: R, active: A) => ({
  default: rest,
  [popupOpen]: active,
  [media.hover]: {
    default: rest,
    [popupOpen]: active,
    [hoverIdle]: active,
  },
  [activeIdle]: active,
});

const off = ":disabled, [data-disabled]";
const pressed = ":is([data-pressed])";
const hoverUnpressed = `:hover:not(${off}, [data-pressed])`;
const activeUnpressed = `:active:not(${off}, [data-pressed])`;
const hoverPressed = `:is([data-pressed]):hover:not(${off}, :active)`;
const hoverLifted = `:hover:not(${off}, :active)`;
const activeLifted = `:active:not(${off})`;

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
    backgroundColor: colors.background,
    backgroundImage: interactive(
      "none",
      `linear-gradient(${colors.fillSubtle}, ${colors.fillSubtle})`
    ),
  },
  secondary: { backgroundColor: interactive(colors.fillSubtle, colors.fill) },
  // A ghost toggle, selected while `[data-pressed]`.
  selectedFill: {
    backgroundColor: selectable("transparent"),
    boxShadow: {
      default: unlit,
      [media.hover]: { default: unlit, [hoverPressed]: lit },
    },
  },
  // An outline toggle: `selectedFill` on a background, with the resting shadow under it.
  selectedFillLifted: {
    backgroundColor: selectable(colors.background),
    boxShadow: {
      default: `${unlit}, ${shadows.default}`,
      [media.hover]: {
        default: `${unlit}, ${shadows.default}`,
        [hoverLifted]: `${unlit}, ${shadows.defaultHover}`,
        [hoverPressed]: `${lit}, ${shadows.defaultHover}`,
        [activeLifted]: `${unlit}, ${shadows.defaultPressed}`,
      },
      [activeLifted]: `${unlit}, ${shadows.defaultPressed}`,
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

type StyleProps = ReturnType<typeof stylex.props>;

// Declared here, not by @types/node, so a copied file typechecks in a Vite app.
declare const process: { env: { NODE_ENV?: string } };

const reported = new Set<string>();

/** A part's own styles on its props. Class names join across `render`, so one part in a chain draws. A className from an outer part beside one of its own throws in development, and in production logs once and loses to its own. Inline styles merge, its own last. */
const withStyles = <P extends object>(
  props: P & StyleProps & { "data-slot"?: string },
  own: StyleProps
): P & StyleProps => {
  if ((props.className ?? "") !== "" && (own.className ?? "") !== "") {
    const slot =
      props["data-slot"] === undefined
        ? ""
        : ` [data-slot="${props["data-slot"]}"]`;
    const message = `Two parts style one element${slot}. Put \`sx\` on the part that draws and leave the others unstyled.`;
    if (process.env.NODE_ENV !== "production") {
      throw new Error(message);
    }
    if (!reported.has(message)) {
      reported.add(message);
      console.error(message);
    }
  }
  return {
    ...props,
    ...own,
    className: own.className ?? props.className,
    style:
      own.style === undefined ? props.style : { ...props.style, ...own.style },
  };
};

export {
  controlIconSize,
  joinStyles,
  popupReset,
  popupSurface,
  stateStyles,
  textColors,
  textColorStyles,
  textWeights,
  textWeightStyles,
  trackStyles,
  typeStyles,
  visuallyHidden,
  withStyles,
};
export type { Sx, TextColor, TextWeight };
