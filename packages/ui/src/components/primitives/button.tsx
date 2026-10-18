"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { joinStyles, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  opacities,
  presses,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const buttonVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
] as const;
const buttonColors = ["danger"] as const;
const buttonSizes = [
  "xs",
  "sm",
  "default",
  "lg",
  "icon-xs",
  "icon-sm",
  "icon",
  "icon-lg",
] as const;
const buttonCorners = ["rounded", "pill"] as const;

type ButtonVariant = (typeof buttonVariants)[number];
type ButtonColor = (typeof buttonColors)[number];
type ButtonSize = (typeof buttonSizes)[number];
type ButtonCorners = (typeof buttonCorners)[number];

interface ButtonStyleOptions {
  corners?: ButtonCorners;
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
}

type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "style"> &
  ButtonStyleOptions & { sx?: stylex.StyleXStyles };

// A trigger opens something on press, so it doesn't give.
const press = ":active:not([aria-haspopup], :disabled)";

// Working, not unavailable: a busy cursor, and when it can't be pressed, a lighter fade than disabled.
const busy = "[aria-busy='true']";
const loading = "[aria-busy='true']:disabled";

// At rest, and while hovered or while its popup is open (Base UI marks the trigger).
const interactive = <T,>(rest: T, active: T) => ({
  default: rest,
  ":is([data-popup-open])": active,
  [media.hover]: { default: rest, ":hover:not(:disabled)": active },
  ":active:not(:disabled)": active,
});

// Every surface that can be pressed climbs the ladder. The press repeats inside the media
// block, which StyleX ranks above a bare `:active`.
const lift = {
  default: shadows.default,
  ":is([data-popup-open])": shadows.defaultHover,
  [media.hover]: {
    default: shadows.default,
    ":hover:not(:disabled, :active)": shadows.defaultHover,
    ":active:not(:disabled)": shadows.defaultPressed,
  },
  ":active:not(:disabled)": shadows.defaultPressed,
};

const kbdInset = (height: string) =>
  `calc((${height} - ${sizes.kbd}) / 2 - ${strokes.border})`;

// A glyph carries its own whitespace, so the side holding a `data-icon` sits tighter.
// A Kbd is a box, so it sits as far from the side as from the top and bottom.
const inset = (padding: string, tight: string, height: string) => ({
  paddingInlineEnd: {
    default: padding,
    ":has(> [data-icon='inline-end']:not([data-slot='kbd']))": tight,
    ":has(> [data-slot='kbd'][data-icon='inline-end'])": kbdInset(height),
  },
  paddingInlineStart: {
    default: padding,
    ":has(> [data-icon='inline-start']:not([data-slot='kbd']))": tight,
    ":has(> [data-slot='kbd'][data-icon='inline-start'])": kbdInset(height),
  },
});

const square = (size: string) => ({
  height: size,
  paddingInlineEnd: 0,
  paddingInlineStart: 0,
  transform: { default: null, [press]: presses.icon },
  width: size,
});

// shadcn's spacing, which sits off our 4px grid at 6px and 10px.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  base: {
    alignItems: "center",
    // Every variant reserves the border, so a fill and an outline are the same size.
    borderBlockColor: "transparent",
    borderInlineColor: "transparent",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
      [busy]: "progress",
    },
    display: "inline-flex",
    flexShrink: 0,
    fontWeight: fontWeights.medium,
    gap: px6,
    justifyContent: "center",
    marginBlock: 0,
    marginInline: 0,
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
    // In a ButtonGroup, the focused item's ring stays above its neighbors.
    zIndex: { default: null, ":focus-visible": 1 },
  },
  // Icons shrink with the size: `sizes.iconXs` at xs, `iconSm` at sm, `icon` from default.
  xs: {
    ...inset(space.xs, px6, sizes.controlXs),
    gap: space.xxs,
    height: sizes.controlXs,
  },
  sm: {
    ...inset(px10, px6, sizes.controlSm),
    gap: space.xxs,
    height: sizes.controlSm,
  },
  default: {
    ...inset(px10, space.xs, sizes.controlMd),
    height: sizes.controlMd,
  },
  lg: { ...inset(px10, space.xs, sizes.controlLg), height: sizes.controlLg },
  iconXs: square(sizes.controlXs),
  iconSm: square(sizes.controlSm),
  icon: square(sizes.controlMd),
  iconLg: square(sizes.controlLg),
  // The solid fill lifts by thinning, so it needs no hover color of its own.
  primary: {
    backgroundColor: colors.accentSolid,
    boxShadow: {
      default: shadows.solid,
      ":active:not(:disabled)": shadows.solidPressed,
    },
    color: colors.accentOnSolid,
    opacity: {
      ...interactive<number | string>(1, opacities.hover),
      ":disabled": opacities.disabled,
      [loading]: opacities.busy,
    },
  },
  secondary: {
    backgroundColor: interactive(colors.fill, colors.fillStrong),
    boxShadow: lift,
    color: colors.textPrimary,
  },
  outline: {
    backgroundClip: "padding-box",
    backgroundColor: interactive(colors.background, colors.fillSubtle),
    borderBlockColor: colors.border,
    borderInlineColor: colors.border,
    boxShadow: lift,
    color: colors.textPrimary,
  },
  ghost: {
    backgroundColor: interactive("transparent", colors.fillSubtle),
    color: colors.textPrimary,
  },
  // A tint, not a solid: destruction is marked, never shouted.
  danger: {
    backgroundColor: interactive(colors.dangerSubtle, colors.dangerSubtleHover),
    color: colors.dangerText,
  },
  dangerGhost: {
    backgroundColor: interactive("transparent", colors.dangerSubtle),
    color: colors.dangerText,
  },
  dangerOutline: {
    backgroundColor: interactive(colors.background, colors.dangerSubtle),
    borderBlockColor: colors.dangerBorder,
    borderInlineColor: colors.dangerBorder,
    color: colors.dangerText,
  },
  dangerLink: { color: colors.dangerText },
  // The tint answers hover with its own color, so the solid's fade is undone.
  dangerSolid: {
    opacity: {
      default: 1,
      ":disabled": opacities.disabled,
      [loading]: opacities.busy,
    },
  },
  // Reads as text, so it answers with an underline instead of a fill or a press.
  link: {
    backgroundColor: "transparent",
    color: colors.textPrimary,
    textDecorationLine: interactive("none", "underline"),
    textUnderlineOffset: space.xxs,
    transform: null,
  },
});

const variantStyles = {
  ghost: styles.ghost,
  link: styles.link,
  outline: styles.outline,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<ButtonVariant, stylex.StyleXStyles>;

// A solid takes the tint too: destruction is marked, never shouted.
const colorStyles = {
  danger: {
    ghost: styles.dangerGhost,
    link: styles.dangerLink,
    outline: styles.dangerOutline,
    primary: [styles.secondary, styles.danger, styles.dangerSolid],
    secondary: styles.danger,
  },
} satisfies Record<ButtonColor, Record<ButtonVariant, stylex.StyleXStyles>>;

const sizeStyles = {
  "icon-lg": styles.iconLg,
  default: styles.default,
  icon: styles.icon,
  "icon-sm": styles.iconSm,
  "icon-xs": styles.iconXs,
  lg: styles.lg,
  sm: [typeStyles.textSm, styles.sm],
  xs: [typeStyles.captionLg, styles.xs],
} satisfies Record<ButtonSize, stylex.StyleXStyles>;

const cornerStyles = {
  pill: joinStyles.full,
  rounded: joinStyles.sm,
} satisfies Record<ButtonCorners, stylex.StyleXStyles>;

/** A button's styles for another element, like a plain `<a>` that must keep its link role. */
function buttonStyles({
  corners = "rounded",
  size = "default",
  color,
  variant = "secondary",
}: ButtonStyleOptions = {}) {
  return [
    [typeStyles.textSm, styles.base],
    joinStyles.edges,
    sizeStyles[size],
    variantStyles[variant],
    color && colorStyles[color][variant],
    cornerStyles[corners],
  ];
}

function Button({
  corners = "rounded",
  size = "default",
  color,
  sx,
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-corners={corners}
      data-size={size}
      data-slot="button"
      data-color={color}
      data-variant={variant}
      {...props}
      {...stylex.props(buttonStyles({ corners, size, color, variant }), sx)}
    />
  );
}

export {
  Button,
  buttonCorners,
  buttonSizes,
  buttonColors,
  buttonStyles,
  buttonVariants,
};
export type {
  ButtonCorners,
  ButtonProps,
  ButtonSize,
  ButtonColor,
  ButtonStyleOptions,
  ButtonVariant,
};
