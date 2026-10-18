"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { typeStyles } from "@/lib/constella/styles";
import {
  badgeVars,
  colors,
  durations,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const badgeVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
] as const;

type BadgeVariant = (typeof badgeVariants)[number];

const badgeStatuses = ["success", "info", "warning", "danger"] as const;

type BadgeStatus = (typeof badgeStatuses)[number];

const badgeSizes = ["sm", "default", "lg"] as const;

type BadgeSize = (typeof badgeSizes)[number];

type BadgeProps = Omit<
  useRender.ComponentProps<"span">,
  "className" | "style"
> & {
  size?: BadgeSize;
  status?: BadgeStatus;
  sx?: stylex.StyleXStyles;
  variant?: BadgeVariant;
};

// A badge only answers when it's rendered as a link.
const link = ":is(a)";

const linkHover = <T,>(rest: T, active: T) => ({
  default: rest,
  [media.hover]: { default: rest, [`${link}:hover`]: active },
  [`${link}:active`]: active,
});

const dotIn = (status: BadgeStatus) => `:is([data-status='${status}'] > *)`;

const withAvatar = ":has(> [data-slot='avatar']:first-child)";

// A glyph carries its own whitespace, so the side holding a `data-icon` sits tighter. A
// leading avatar fills the height less this inset and the border on every side, and the
// ends round, so the two stay concentric.
// Positional: StyleX can't evaluate a destructured parameter.
const sizing = (side: string, tight: string, height: string) => ({
  height,
  paddingInlineEnd: {
    default: side,
    ":has(> [data-icon='inline-end'])": tight,
  },
  paddingInlineStart: {
    default: side,
    ":has(> [data-icon='inline-start'])": tight,
    [withAvatar]: space.xxxs,
  },
  [badgeVars.avatar]: `calc(${height} - 2 * (${space.xxxs} + ${strokes.border}))`,
});

// A rounded avatar (a logo) keeps the chip corner, a ladder step around its own.
const corner = {
  default: radii.chip,
  ":has(> [data-slot='avatar'][data-corners='pill']:first-child)": radii.full,
};

// shadcn's 6px and 10px, and an 18px small, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;
const px18 = `calc(${sizes.controlXxs} - ${space.xxxs})`;

const styles = stylex.create({
  base: {
    alignItems: "center",
    // Every variant reserves the border, so a fill and an outline are the same size.
    borderBlockColor: "transparent",
    borderInlineColor: "transparent",
    borderStartStartRadius: corner,
    borderStartEndRadius: corner,
    borderEndStartRadius: corner,
    borderEndEndRadius: corner,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    display: "inline-flex",
    flexShrink: 0,
    fontWeight: fontWeights.medium,
    // Safe, so a label wider than the cap clips at its end, not both.
    justifyContent: "safe center",
    // Capped at its container. Clipped only sideways: the text's line box is taller than the
    // badge, so a clip on both axes would cut tall accents.
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "clip",
    overflowY: "visible",
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color, color, opacity",
    transitionTimingFunction: "ease",
    // In a sentence it centers on the text; a badge opening on an icon or avatar would
    // otherwise take its baseline from that child's bottom edge.
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    width: "fit-content",
  },
  // Icons are `sizes.iconXs` up to default and `iconSm` at lg.
  sm: {
    ...sizing(px6, space.xxs, px18),
    gap: space.xxs,
  },
  default: {
    ...sizing(space.xs, px6, sizes.controlXxs),
    gap: space.xxs,
  },
  lg: {
    ...sizing(px10, space.xs, sizes.controlXs),
    gap: px6,
  },
  primary: {
    backgroundColor: colors.accentSolid,
    color: colors.accentOnSolid,
    opacity: linkHover<number | string>(1, opacities.hover),
  },
  secondary: {
    backgroundColor: linkHover(colors.fill, colors.fillStrong),
    color: colors.textPrimary,
  },
  outline: {
    backgroundColor: linkHover("transparent", colors.fillSubtle),
    borderBlockColor: colors.border,
    borderInlineColor: colors.border,
    color: colors.textPrimary,
  },
  ghost: {
    backgroundColor: linkHover("transparent", colors.fillSubtle),
    color: colors.textPrimary,
  },
  dot: {
    backgroundColor: {
      default: colors.textMuted,
      // With no status, the dot on a solid follows its text.
      ":is([data-variant='primary']:not([data-status]) > *)": "currentColor",
      [dotIn("success")]: colors.successSolid,
      [dotIn("info")]: colors.infoSolid,
      [dotIn("warning")]: colors.warningSolid,
      [dotIn("danger")]: colors.dangerSolid,
    },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    flexShrink: 0,
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
    height: { default: px6, ":is([data-size='lg'] > *)": space.xs },
    width: { default: px6, ":is([data-size='lg'] > *)": space.xs },
  },
  link: {
    color: colors.textPrimary,
    textDecorationLine: linkHover("none", "underline"),
    textUnderlineOffset: space.xxs,
  },
  successTint: {
    backgroundColor: linkHover(colors.successSubtle, colors.successSubtleHover),
    color: colors.successText,
  },
  infoTint: {
    backgroundColor: linkHover(colors.infoSubtle, colors.infoSubtleHover),
    color: colors.infoText,
  },
  warningTint: {
    backgroundColor: linkHover(colors.warningSubtle, colors.warningSubtleHover),
    color: colors.warningText,
  },
  dangerTint: {
    backgroundColor: linkHover(colors.dangerSubtle, colors.dangerSubtleHover),
    color: colors.dangerText,
  },
  successText: { color: colors.successText },
  infoText: { color: colors.infoText },
  warningText: { color: colors.warningText },
  dangerText: { color: colors.dangerText },
  // The tint answers hover with its own color, so the solid's fade is undone.
  solidTint: { opacity: 1 },
});

// A tint on secondary and primary, colored text on ghost and link. Outline keeps its text
// neutral and colors only its dot, so a row of them stays quiet.
const statusStyles = {
  ghost: {
    danger: styles.dangerText,
    info: styles.infoText,
    success: styles.successText,
    warning: styles.warningText,
  },
  link: {
    danger: styles.dangerText,
    info: styles.infoText,
    success: styles.successText,
    warning: styles.warningText,
  },
  outline: null,
  primary: {
    danger: [styles.dangerTint, styles.solidTint],
    info: [styles.infoTint, styles.solidTint],
    success: [styles.successTint, styles.solidTint],
    warning: [styles.warningTint, styles.solidTint],
  },
  secondary: {
    danger: styles.dangerTint,
    info: styles.infoTint,
    success: styles.successTint,
    warning: styles.warningTint,
  },
} satisfies Record<
  BadgeVariant,
  Record<BadgeStatus, stylex.StyleXStyles> | null
>;

const sizeStyles = {
  default: [typeStyles.captionLg, styles.default],
  lg: [typeStyles.textSm, styles.lg],
  sm: [typeStyles.captionLg, styles.sm],
} satisfies Record<BadgeSize, stylex.StyleXStyles>;

const variantStyles = {
  ghost: styles.ghost,
  link: styles.link,
  outline: styles.outline,
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<BadgeVariant, stylex.StyleXStyles>;

/** A badge's styles for another element. */
function badgeStyles({
  size = "default",
  status,
  variant = "secondary",
}: Pick<BadgeProps, "size" | "status" | "variant"> = {}) {
  return [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    status && statusStyles[variant]?.[status],
  ];
}

function Badge({
  render,
  size = "default",
  status,
  sx,
  variant = "secondary",
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      props,
      stylex.props(badgeStyles({ size, status, variant }), sx)
    ),
    render,
    // Base UI writes state as data attributes: `data-slot`, `data-size`, `data-variant`, `data-status`.
    state: { size, slot: "badge", status, variant },
  });
}

function BadgeDot({
  sx,
  ...props
}: Omit<ComponentProps<"span">, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
}) {
  return (
    <span
      aria-hidden
      data-icon="inline-start"
      data-slot="badge-dot"
      {...props}
      {...stylex.props(styles.dot, sx)}
    />
  );
}

export {
  Badge,
  BadgeDot,
  badgeSizes,
  badgeStatuses,
  badgeStyles,
  badgeVariants,
};
export type { BadgeProps, BadgeSize, BadgeStatus, BadgeVariant };
