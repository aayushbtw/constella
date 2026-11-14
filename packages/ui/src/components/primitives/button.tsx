"use client";

import * as stylex from "@stylexjs/stylex";
import { Button as ButtonPrimitive } from "@ui-sdk/react/button";
import { renderElement } from "@ui-sdk/react/primitive";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { joinStyles, stateStyles, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  opacities,
  presses,
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

type ButtonProps = Omit<
  ComponentProps<typeof ButtonPrimitive>,
  "className" | "style"
> &
  ButtonStyleOptions & { "data-slot"?: string; sx?: Sx };

// ui-sdk marks a disabled link or `focusableWhenDisabled` with `data-disabled` only; other elements use `:disabled`.
const disabled = ":is(:disabled, [data-disabled])";
// ui-sdk marks a press whose Promise is running; a caller marks its own work with `aria-busy`.
const busy = ":is([aria-busy='true'], [data-pending])";
// Working and can't be pressed: a lighter fade than disabled.
const loading =
  ":is([aria-busy='true']:is(:disabled, [data-disabled]), [data-pending])";
const hoverIdle = ":hover:not(:disabled, [data-disabled], [data-pending])";
const activeIdle = ":active:not(:disabled, [data-disabled], [data-pending])";
// A trigger opens something on press, so it doesn't give.
const press =
  ":active:not([aria-haspopup], :disabled, [data-disabled], [data-pending])";

// styles.ts's `popupOpen`; keep in step.
const popupOpen = ":is([data-popup-open], :where([aria-haspopup])[data-open])";

// At rest, and while hovered or while its popup is open.
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
  transform: {
    default: null,
    [press]: { default: presses.icon, [media.reducedMotion]: null },
  },
  width: size,
});

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
      [disabled]: "not-allowed",
      [busy]: "progress",
    },
    display: "inline-flex",
    flexShrink: 0,
    fontWeight: fontWeights.semimedium,
    gap: space.row,
    justifyContent: "center",
    marginBlock: 0,
    marginInline: 0,
    opacity: {
      default: 1,
      [disabled]: opacities.disabled,
      [loading]: opacities.busy,
    },
    textDecorationLine: "none",
    transform: {
      default: null,
      [press]: { default: presses.link, [media.reducedMotion]: null },
    },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, opacity",
    touchAction: "manipulation",
    transitionTimingFunction: `${easings.out}, ease, ease`,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    whiteSpace: "nowrap",
    // In a ButtonGroup, the focused item's ring stays above its neighbors.
    zIndex: { default: null, ":focus-visible": 1 },
  },
  // Icons shrink with the size: `sizes.iconXs` at xs, `iconSm` at sm, `icon` from default.
  xs: {
    ...inset(space.xs, space.row, sizes.controlXs),
    gap: space.xxs,
    height: sizes.controlXs,
  },
  sm: {
    ...inset(space.popup, space.row, sizes.controlSm),
    gap: space.xxs,
    height: sizes.controlSm,
  },
  default: {
    ...inset(space.popup, space.xs, sizes.controlMd),
    height: sizes.controlMd,
  },
  lg: {
    ...inset(space.popup, space.xs, sizes.controlLg),
    height: sizes.controlLg,
  },
  iconXs: square(sizes.controlXs),
  iconSm: square(sizes.controlSm),
  icon: square(sizes.controlMd),
  iconLg: square(sizes.controlLg),
  // The solid fill lifts by thinning, so it needs no hover color of its own.
  primary: {
    backgroundColor: colors.accentSolid,
    color: colors.accentOnSolid,
    // Disabled and busy repeat inside the hover block, which StyleX ranks above a bare condition.
    opacity: {
      default: 1,
      [popupOpen]: opacities.hover,
      [media.hover]: {
        default: 1,
        [popupOpen]: opacities.hover,
        [hoverIdle]: opacities.hover,
        [disabled]: opacities.disabled,
        [loading]: opacities.busy,
      },
      [activeIdle]: opacities.hover,
      [disabled]: opacities.disabled,
      [loading]: opacities.busy,
    },
  },
  secondary: { color: colors.textPrimary },
  outline: {
    backgroundClip: "padding-box",
    borderBlockColor: colors.border,
    borderInlineColor: colors.border,
    color: colors.textPrimary,
  },
  ghost: { color: colors.textPrimary },
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
      [disabled]: opacities.disabled,
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

const secondary = [styles.secondary, stateStyles.secondary];

const variantStyles = {
  ghost: [styles.ghost, stateStyles.ghost],
  link: styles.link,
  outline: [styles.outline, stateStyles.outline],
  primary: styles.primary,
  secondary,
} satisfies Record<ButtonVariant, stylex.StyleXStyles>;

// A solid takes the tint too: destruction is marked, never shouted.
const colorStyles = {
  ghost: { danger: styles.dangerGhost },
  link: { danger: styles.dangerLink },
  outline: { danger: styles.dangerOutline },
  primary: { danger: [secondary, styles.danger, styles.dangerSolid] },
  secondary: { danger: styles.danger },
} satisfies Record<ButtonVariant, Record<ButtonColor, stylex.StyleXStyles>>;

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

/** A button's styles for an element that isn't a Button, like a server-rendered link. */
function buttonStyles({
  corners = "pill",
  size = "default",
  color,
  variant = "secondary",
}: ButtonStyleOptions = {}) {
  return [
    [typeStyles.textSm, styles.base],
    joinStyles.edges,
    sizeStyles[size],
    variantStyles[variant],
    color && colorStyles[variant][color],
    cornerStyles[corners],
  ];
}

function Button({
  corners = "pill",
  size = "default",
  color,
  "data-slot": slot,
  render,
  sx,
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-corners={corners}
      data-size={size}
      data-color={color}
      data-variant={variant}
      {...props}
      {...stylex.props(buttonStyles({ corners, size, color, variant }), sx)}
      // ui-sdk writes `button` over a passed slot; a part built on Button keeps its own.
      render={
        slot === undefined
          ? render
          : (rendered, state) =>
              renderElement(
                "button",
                { ...rendered, "data-slot": slot },
                render,
                state
              )
      }
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
