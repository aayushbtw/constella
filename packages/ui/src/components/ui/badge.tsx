"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  fontSizes,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const badgeVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
] as const;

type BadgeVariant = (typeof badgeVariants)[number];

type BadgeProps = Omit<
  useRender.ComponentProps<"span">,
  "className" | "style"
> & {
  sx?: stylex.StyleXStyles;
  variant?: BadgeVariant;
};

// A badge only answers when it's rendered as a link.
const link = ":is(a)";

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

const linkHover = <T,>(rest: T, active: T) => ({
  default: rest,
  [media.hover]: { default: rest, [`${link}:hover`]: active },
});

/* eslint-enable func-style */

// shadcn's 6px, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;

const styles = stylex.create({
  base: {
    alignItems: "center",
    // Every variant reserves the border, so a fill and an outline are the same size.
    borderColor: "transparent",
    borderRadius: radii.full,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    gap: space.xxs,
    height: sizes.controlXxs,
    justifyContent: "center",
    overflow: "hidden",
    paddingInlineEnd: {
      default: space.xs,
      ":has(> [data-icon='inline-end'])": px6,
    },
    paddingInlineStart: {
      default: space.xs,
      ":has(> [data-icon='inline-start'])": px6,
    },
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, opacity",
    transitionTimingFunction: "ease",
    whiteSpace: "nowrap",
    width: "fit-content",
  },
  primary: {
    backgroundColor: colors.accent,
    color: colors.onAccent,
    opacity: linkHover<number | string>(1, opacities.hover),
  },
  secondary: {
    backgroundColor: linkHover(colors.fill, colors.fillStrong),
    color: colors.textPrimary,
  },
  outline: {
    backgroundColor: linkHover("transparent", colors.fillSubtle),
    borderColor: colors.edge,
    color: colors.textPrimary,
  },
  ghost: {
    backgroundColor: linkHover("transparent", colors.fillSubtle),
    color: colors.textPrimary,
  },
  // A tint, not a solid, as on a danger button.
  danger: {
    backgroundColor: linkHover(colors.dangerFillSubtle, colors.dangerFill),
    color: colors.danger,
  },
  link: {
    color: colors.textPrimary,
    textDecorationLine: linkHover("none", "underline"),
    textUnderlineOffset: space.xxs,
  },
});

const variantStyles = {
  danger: styles.danger,
  ghost: styles.ghost,
  link: styles.link,
  outline: styles.outline,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<BadgeVariant, stylex.StyleXStyles>;

/** A badge's styles for another element. */
function badgeStyles({
  variant = "secondary",
}: Pick<BadgeProps, "variant"> = {}) {
  return [styles.base, variantStyles[variant]];
}

function Badge({ render, sx, variant = "secondary", ...props }: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      props,
      stylex.props(badgeStyles({ variant }), sx)
    ),
    render,
    // Base UI writes state as data attributes: `data-slot="badge"`, `data-variant`.
    state: { slot: "badge", variant },
  });
}

export { Badge, badgeStyles, badgeVariants };
export type { BadgeProps, BadgeVariant };
