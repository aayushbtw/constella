"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
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

const inGroup = ":is([data-slot='avatar-group'] > *)";
/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */
const groupOf = (size: AvatarSize) =>
  `:is([data-slot='avatar-group']:has(> [data-size='${size}']) > *)`;
/* eslint-enable func-style */
// Overlapping avatars are cut apart by a ring of the page behind them.
const cutout = `0 0 0 calc(2 * ${strokes.border}) ${colors.background}`;

const styles = stylex.create({
  avatar: {
    borderRadius: radii.full,
    boxShadow: { default: null, [inGroup]: cutout },
    display: "flex",
    flexShrink: 0,
    marginInlineStart: {
      default: null,
      [`${inGroup}:not(:first-child)`]: `calc(-1 * ${space.xs})`,
    },
    position: "relative",
    userSelect: "none",
    // A photo's edge is drawn inside it, so a light or dark image keeps its shape.
    "::after": {
      borderColor: colors.edge,
      borderRadius: radii.full,
      borderStyle: "solid",
      borderWidth: strokes.border,
      content: "''",
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
    },
  },
  sm: { height: sizes.controlXs, width: sizes.controlXs },
  default: { height: sizes.controlMd, width: sizes.controlMd },
  lg: { height: sizes.controlLg, width: sizes.controlLg },
  image: {
    aspectRatio: "1",
    borderRadius: radii.full,
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderRadius: radii.full,
    color: colors.textSecondary,
    display: "flex",
    fontSize: {
      default: fontSizes.sm,
      ":is([data-size='sm'] *)": fontSizes.xxs,
    },
    fontWeight: fontWeights.medium,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    boxShadow: cutout,
    color: colors.onAccent,
    display: "inline-flex",
    height: {
      default: `calc(${space.xs} + ${space.xxxs})`,
      ":is([data-size='sm'] *)": space.xs,
      ":is([data-size='lg'] *)": space.sm,
    },
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    justifyContent: "center",
    position: "absolute",
    width: {
      default: `calc(${space.xs} + ${space.xxxs})`,
      ":is([data-size='sm'] *)": space.xs,
      ":is([data-size='lg'] *)": space.sm,
    },
    zIndex: 1,
  },
  group: {
    display: "flex",
  },
  count: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderRadius: radii.full,
    boxShadow: cutout,
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

function AvatarBadge({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="avatar-badge"
      {...props}
      {...stylex.props(styles.badge, sx)}
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
};
export type { AvatarProps, AvatarSize };
