"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  avatarVars,
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const avatarSizes = ["sm", "default", "lg"] as const;

type AvatarSize = (typeof avatarSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type AvatarProps = Styled<AvatarPrimitive.Root.Props> & { size?: AvatarSize };

const avatarStatuses = ["online", "away", "busy", "offline"] as const;

type AvatarStatus = (typeof avatarStatuses)[number];

type AvatarBadgeProps = Styled<ComponentProps<"span">> & {
  status?: AvatarStatus;
};

const inGroup = ":is([data-slot='avatar-group'] > *)";
const groupOf = (size: AvatarSize) =>
  `:is([data-slot='avatar-group']:has(> [data-size='${size}']) > *)`;

const gap = `calc(2 * ${strokes.border})`;
const overlap = space.xs;

// A hole one gap wider than a circle of `size` centered at `x y`, so whatever surface is
// behind shows through. Chromium rejects a radius mixing `%` and `px`, so all are lengths.
const hole = (size: string, x: string, y: string) =>
  `radial-gradient(circle calc(${size} / 2 + ${gap}) at ${x} ${y}, transparent calc(100% - 0.5px), black calc(100% + 0.5px))`;

// Each avatar but the last is cut where the next one overlaps it.
const overlapped = `${inGroup}:not(:last-child)`;
const hasBadge = ":has(> [data-slot='avatar-badge'])";
// Not `:dir(rtl)`: Lightning CSS lowers it to a `:lang()` list that ignores `dir`.
const rtl = ":is([dir='rtl'], [dir='rtl'] *)";

const styles = stylex.create({
  avatar: {
    // The fallback leaves as the photo arrives, so the photo fades in over its fill.
    backgroundColor: colors.fillOpaque,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "flex",
    flexShrink: 0,
    height: avatarVars.size,
    marginInlineStart: {
      default: null,
      [`${inGroup}:not(:first-child)`]: `calc(-1 * ${overlap})`,
    },
    maskImage: {
      default: null,
      [overlapped]: {
        default: hole(
          avatarVars.size,
          `calc(${avatarVars.size} * 1.5 - ${overlap})`,
          `calc(${avatarVars.size} / 2)`
        ),
        [rtl]: hole(
          avatarVars.size,
          `calc(${overlap} - ${avatarVars.size} / 2)`,
          `calc(${avatarVars.size} / 2)`
        ),
      },
    },
    position: "relative",
    // The photo, fallback and edge read this; the badge itself stays whole.
    [avatarVars.badgeCut]: {
      default: null,
      [hasBadge]: {
        default: hole(
          avatarVars.badge,
          `calc(${avatarVars.size} - ${avatarVars.badge} / 2)`,
          `calc(${avatarVars.size} - ${avatarVars.badge} / 2)`
        ),
        [rtl]: hole(
          avatarVars.badge,
          `calc(${avatarVars.badge} / 2)`,
          `calc(${avatarVars.size} - ${avatarVars.badge} / 2)`
        ),
      },
    },
    userSelect: "none",
    width: avatarVars.size,
    // A photo's edge is drawn inside it, so a light or dark image keeps its shape.
    "::after": {
      borderBlockColor: colors.edge,
      borderInlineColor: colors.edge,
      borderStartStartRadius: radii.full,
      borderStartEndRadius: radii.full,
      borderEndStartRadius: radii.full,
      borderEndEndRadius: radii.full,
      borderBlockStyle: "solid",
      borderInlineStyle: "solid",
      borderBlockWidth: strokes.border,
      borderInlineWidth: strokes.border,
      content: "''",
      insetBlockEnd: 0,
      insetBlockStart: 0,
      insetInlineEnd: 0,
      insetInlineStart: 0,
      maskImage: avatarVars.badgeCut,
      pointerEvents: "none",
      position: "absolute",
    },
  },
  sm: {
    [avatarVars.size]: sizes.controlXs,
    [avatarVars.badge]: space.xs,
  },
  default: {
    [avatarVars.size]: sizes.controlMd,
    [avatarVars.badge]: `calc(${space.xs} + ${space.xxxs})`,
  },
  lg: {
    [avatarVars.size]: sizes.controlLg,
    [avatarVars.badge]: space.sm,
  },
  image: {
    aspectRatio: "1",
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: "100%",
    maskImage: avatarVars.badgeCut,
    objectFit: "cover",
    opacity: { default: 1, ":is([data-starting-style])": 0 },
    transitionDuration: durations.crossfade,
    transitionProperty: "opacity",
    transitionTimingFunction: easings.crossfade,
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    backgroundColor: colors.fillOpaque,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    color: colors.textSecondary,
    display: "flex",
    fontSize: {
      default: fontSizes.sm,
      ":is([data-size='sm'] *)": fontSizes.xxs,
    },
    fontWeight: fontWeights.medium,
    height: "100%",
    justifyContent: "center",
    maskImage: avatarVars.badgeCut,
    width: "100%",
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    color: colors.onAccent,
    display: "inline-flex",
    height: avatarVars.badge,
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    justifyContent: "center",
    position: "absolute",
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
    width: avatarVars.badge,
    zIndex: 1,
  },
  online: { backgroundColor: colors.successSolid },
  away: { backgroundColor: colors.warningSolid },
  busy: { backgroundColor: colors.dangerSolid },
  offline: { backgroundColor: colors.textMuted },
  group: {
    display: "flex",
  },
  count: {
    alignItems: "center",
    backgroundColor: colors.fillOpaque,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    color: colors.textSecondary,
    display: "flex",
    flexShrink: 0,
    fontSize: { default: fontSizes.sm, [groupOf("sm")]: fontSizes.xxs },
    fontWeight: fontWeights.medium,
    height: {
      default: sizes.controlMd,
      [groupOf("sm")]: sizes.controlXs,
      [groupOf("lg")]: sizes.controlLg,
    },
    justifyContent: "center",
    marginInlineStart: `calc(-1 * ${space.xs})`,
    position: "relative",
    width: {
      default: sizes.controlMd,
      [groupOf("sm")]: sizes.controlXs,
      [groupOf("lg")]: sizes.controlLg,
    },
  },
});

const sizeStyles = {
  default: styles.default,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<AvatarSize, stylex.StyleXStyles>;

function Avatar({ size = "default", sx, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-size={size}
      data-slot="avatar"
      {...props}
      {...stylex.props(styles.avatar, sizeStyles[size], sx)}
    />
  );
}

function AvatarImage({ sx, ...props }: Styled<AvatarPrimitive.Image.Props>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      {...props}
      {...stylex.props(styles.image, sx)}
    />
  );
}

function AvatarFallback({
  sx,
  ...props
}: Styled<AvatarPrimitive.Fallback.Props>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      {...props}
      {...stylex.props(styles.fallback, sx)}
    />
  );
}

const statusStyles = {
  away: styles.away,
  busy: styles.busy,
  offline: styles.offline,
  online: styles.online,
} satisfies Record<AvatarStatus, stylex.StyleXStyles>;

const statusLabels = {
  away: "Away",
  busy: "Busy",
  offline: "Offline",
  online: "Online",
} satisfies Record<AvatarStatus, string>;

function AvatarBadge({ status, sx, ...props }: AvatarBadgeProps) {
  return (
    <span
      aria-label={status && statusLabels[status]}
      data-slot="avatar-badge"
      data-status={status}
      role={status && "img"}
      {...props}
      {...stylex.props(styles.badge, status && statusStyles[status], sx)}
    />
  );
}

function AvatarGroup({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="avatar-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function AvatarGroupCount({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="avatar-group-count"
      {...props}
      {...stylex.props(styles.count, sx)}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarSizes,
  avatarStatuses,
};
export type { AvatarBadgeProps, AvatarProps, AvatarSize, AvatarStatus };
