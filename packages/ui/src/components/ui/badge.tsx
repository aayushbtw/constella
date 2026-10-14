"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  badgeVars,
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

// A dot takes its badge's status, but on primary and danger it follows the text, which
// already carries their color.
const dotIn = (status: BadgeStatus) =>
  `:is([data-status='${status}']:not([data-variant='primary'], [data-variant='danger']) > *)`;

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
    fontSize: fontSizes.xxs,
    gap: space.xxs,
  },
  default: {
    ...sizing(space.xs, px6, sizes.controlXxs),
    fontSize: fontSizes.xxs,
    gap: space.xxs,
  },
  lg: {
    ...sizing(px10, space.xs, sizes.controlXs),
    fontSize: fontSizes.xs,
    gap: px6,
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
    borderBlockColor: colors.edge,
    borderInlineColor: colors.edge,
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
  dot: {
    backgroundColor: {
      default: colors.textMuted,
      ":is([data-variant='primary'] > *, [data-variant='danger'] > *)":
        "currentColor",
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
    backgroundColor: linkHover(colors.successFillSubtle, colors.successFill),
    color: colors.success,
  },
  infoTint: {
    backgroundColor: linkHover(colors.infoFillSubtle, colors.infoFill),
    color: colors.info,
  },
  warningTint: {
    backgroundColor: linkHover(colors.warningFillSubtle, colors.warningFill),
    color: colors.warning,
  },
  dangerTint: {
    backgroundColor: linkHover(colors.dangerFillSubtle, colors.dangerFill),
    color: colors.danger,
  },
  successText: { color: colors.success },
  infoText: { color: colors.info },
  warningText: { color: colors.warning },
  dangerText: { color: colors.danger },
});

// A tint on secondary, colored text on ghost and link. Outline keeps its text neutral and
// colors only its dot; primary stays the accent, and danger already carries a status.
const statusStyles = {
  danger: null,
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
  primary: null,
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
  default: styles.default,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<BadgeSize, stylex.StyleXStyles>;

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
