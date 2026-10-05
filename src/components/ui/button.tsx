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
  sizes,
  space,
} from "@/lib/tokens.stylex";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "style"> & {
  size?: ButtonSize;
  sx?: stylex.StyleXStyles;
  variant?: ButtonVariant;
};

// Solid fills lift on hover by thinning, so one rule works for any fill color.
const thinOnHover = {
  default: 1,
  [media.hover]: { default: 1, ":hover:not(:disabled)": opacities.hover },
  ":disabled": opacities.disabled,
} as const;

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderRadius: radii.sm,
    display: "inline-flex",
    flexShrink: 0,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    justifyContent: "center",
    opacity: { default: 1, ":disabled": opacities.disabled },
    pointerEvents: { default: null, ":disabled": "none" },
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, box-shadow, opacity",
    transitionTimingFunction: `${easings.out}, ease, ease, ease`,
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  sm: {
    borderRadius: radii.xs,
    fontSize: fontSizes.xs,
    gap: space.xxs,
    height: sizes.controlSm,
    paddingInline: space.xs,
  },
  md: {
    fontSize: fontSizes.sm,
    height: sizes.controlMd,
    paddingInline: space.sm,
  },
  lg: {
    fontSize: fontSizes.sm,
    height: sizes.controlLg,
    paddingInline: space.md,
  },
  primary: {
    backgroundColor: colors.accent,
    color: colors.onAccent,
    opacity: thinOnHover,
  },
  secondary: {
    backgroundColor: {
      default: colors.fill,
      [media.hover]: {
        default: colors.fill,
        ":hover:not(:disabled)": colors.fillStrong,
      },
    },
    color: colors.textPrimary,
  },
  outline: {
    backgroundColor: {
      default: colors.background,
      [media.hover]: {
        default: colors.background,
        ":hover:not(:disabled)": colors.fillSubtle,
      },
    },
    boxShadow: `inset 0 0 0 1px ${colors.edge}`,
    color: colors.textPrimary,
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      [media.hover]: {
        default: "transparent",
        ":hover:not(:disabled)": colors.fillSubtle,
      },
    },
    color: colors.textPrimary,
  },
  danger: {
    backgroundColor: colors.dangerSolid,
    color: colors.onDanger,
    opacity: thinOnHover,
  },
});

const variants = {
  danger: styles.danger,
  ghost: styles.ghost,
  outline: styles.outline,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<ButtonVariant, stylex.StyleXStyles>;

const sizeStyles = {
  lg: styles.lg,
  md: styles.md,
  sm: styles.sm,
} satisfies Record<ButtonSize, stylex.StyleXStyles>;

function Button({
  size = "md",
  sx,
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.base, sizeStyles[size], variants[variant], sx)}
    />
  );
}

export { Button };
export type { ButtonProps, ButtonSize, ButtonVariant };
