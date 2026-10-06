"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const buttonVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
] as const;
const buttonSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "icon-xs",
  "icon-sm",
  "icon-md",
  "icon-lg",
] as const;
const buttonCorners = ["rounded", "pill"] as const;

type ButtonVariant = (typeof buttonVariants)[number];
type ButtonSize = (typeof buttonSizes)[number];
type ButtonCorners = (typeof buttonCorners)[number];

type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "style"> & {
  corners?: ButtonCorners;
  size?: ButtonSize;
  sx?: stylex.StyleXStyles;
  variant?: ButtonVariant;
};

// A trigger opens something on press, so it doesn't give.
const press = ":active:not([aria-haspopup], :disabled)";

// Working, not unavailable: a busy cursor, and when it can't be pressed, a lighter fade than disabled.
const busy = "[aria-busy='true']";
const loading = "[aria-busy='true']:disabled";

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

// At rest, and while hovered or while its popup is open (Base UI marks the trigger).
const interactive = <T,>(rest: T, active: T) => ({
  default: rest,
  ":is([data-popup-open])": active,
  [media.hover]: { default: rest, ":hover:not(:disabled)": active },
});

// A glyph carries its own whitespace, so the side holding a `data-icon` sits tighter.
const inset = (padding: string, tight: string) => ({
  paddingInlineEnd: {
    default: padding,
    ":has(> [data-icon='inline-end'])": tight,
  },
  paddingInlineStart: {
    default: padding,
    ":has(> [data-icon='inline-start'])": tight,
  },
});

const square = (size: string) => ({
  height: size,
  paddingInline: 0,
  transform: { default: null, [press]: presses.icon },
  width: size,
});

/* eslint-enable func-style */

// shadcn's spacing, which sits off our 4px grid at 6px and 10px.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  base: {
    alignItems: "center",
    // Every variant reserves the border, so a fill and an outline are the same size.
    borderColor: "transparent",
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: strokes.border,
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
      [busy]: "progress",
    },
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: px6,
    justifyContent: "center",
    margin: 0,
    opacity: {
      default: 1,
      ":disabled": opacities.disabled,
      [loading]: opacities.busy,
    },
    textDecorationLine: "none",
    transform: { default: null, [press]: presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, box-shadow, opacity",
    touchAction: "manipulation",
    transitionTimingFunction: `${easings.out}, ease, ease, ease`,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    whiteSpace: "nowrap",
  },
  // Icons shrink with the size: `sizes.iconXs` at xs, `iconSm` at sm, `icon` from md.
  xs: {
    ...inset(space.xs, px6),
    fontSize: fontSizes.xxs,
    gap: space.xxs,
    height: sizes.controlXs,
  },
  sm: {
    ...inset(px10, px6),
    fontSize: fontSizes.xs,
    gap: space.xxs,
    height: sizes.controlSm,
  },
  md: { ...inset(px10, space.xs), height: sizes.controlMd },
  lg: { ...inset(px10, space.xs), height: sizes.controlLg },
  iconXs: square(sizes.controlXs),
  iconSm: square(sizes.controlSm),
  iconMd: square(sizes.controlMd),
  iconLg: square(sizes.controlLg),
  // The solid fill lifts by thinning, so it needs no hover color of its own.
  primary: {
    backgroundColor: colors.accent,
    color: colors.onAccent,
    opacity: {
      ...interactive<number | string>(1, opacities.hover),
      ":disabled": opacities.disabled,
      [loading]: opacities.busy,
    },
  },
  secondary: {
    backgroundColor: interactive(colors.fill, colors.fillStrong),
    color: colors.textPrimary,
  },
  outline: {
    backgroundClip: "padding-box",
    backgroundColor: interactive(colors.background, colors.fillSubtle),
    borderColor: colors.edge,
    boxShadow: shadows.control,
    color: colors.textPrimary,
  },
  ghost: {
    backgroundColor: interactive("transparent", colors.fillSubtle),
    color: colors.textPrimary,
  },
  // A tint, not a solid: destruction is marked, never shouted.
  danger: {
    backgroundColor: interactive(colors.dangerFillSubtle, colors.dangerFill),
    color: colors.danger,
  },
  // Reads as text, so it answers with an underline instead of a fill or a press.
  link: {
    backgroundColor: "transparent",
    color: colors.textPrimary,
    textDecorationLine: interactive("none", "underline"),
    textUnderlineOffset: space.xxs,
    transform: null,
  },
  rounded: {},
  pill: { borderRadius: radii.full },
});

const variantStyles = {
  danger: styles.danger,
  ghost: styles.ghost,
  link: styles.link,
  outline: styles.outline,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<ButtonVariant, stylex.StyleXStyles>;

const sizeStyles = {
  "icon-lg": styles.iconLg,
  "icon-md": styles.iconMd,
  "icon-sm": styles.iconSm,
  "icon-xs": styles.iconXs,
  lg: styles.lg,
  md: styles.md,
  sm: styles.sm,
  xs: styles.xs,
} satisfies Record<ButtonSize, stylex.StyleXStyles>;

const cornerStyles = {
  pill: styles.pill,
  rounded: styles.rounded,
} satisfies Record<ButtonCorners, stylex.StyleXStyles>;

type ButtonStyleOptions = Pick<ButtonProps, "corners" | "size" | "variant">;

/** A button's styles for another element, like a plain `<a>` that must keep its link role. */
function buttonStyles({
  corners = "rounded",
  size = "md",
  variant = "secondary",
}: ButtonStyleOptions = {}) {
  return [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    cornerStyles[corners],
  ];
}

function Button({
  corners = "rounded",
  size = "md",
  sx,
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-corners={corners}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
      {...stylex.props(buttonStyles({ corners, size, variant }), sx)}
    />
  );
}

export { Button, buttonCorners, buttonSizes, buttonStyles, buttonVariants };
export type {
  ButtonCorners,
  ButtonProps,
  ButtonSize,
  ButtonStyleOptions,
  ButtonVariant,
};
