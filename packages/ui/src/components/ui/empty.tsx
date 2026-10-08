import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";

const emptyMediaVariants = ["default", "icon"] as const;

type EmptyMediaVariant = (typeof emptyMediaVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

// shadcn's gap, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  empty: {
    alignItems: "center",
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxSizing: "border-box",
    color: colors.textPrimary,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: space.md,
    justifyContent: "center",
    minWidth: 0,
    paddingBlockEnd: space.lg,
    paddingBlockStart: space.lg,
    paddingInlineEnd: space.lg,
    paddingInlineStart: space.lg,
    textAlign: "center",
    textWrap: "balance",
    width: "100%",
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    maxWidth: sizes.measure,
  },
  media: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    marginBlockEnd: space.xs,
  },
  icon: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.textPrimary,
    height: sizes.controlMd,
    width: sizes.controlMd,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    textWrap: "pretty",
  },
  content: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: px10,
    maxWidth: sizes.measure,
    minWidth: 0,
    width: "100%",
  },
});

const mediaStyles = {
  default: null,
  icon: styles.icon,
} satisfies Record<EmptyMediaVariant, stylex.StyleXStyles | null>;

function Empty({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div data-slot="empty" {...props} {...stylex.props(styles.empty, sx)} />
  );
}

function EmptyHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="empty-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function EmptyMedia({
  sx,
  variant = "default",
  ...props
}: Styled<ComponentProps<"div">> & { variant?: EmptyMediaVariant }) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.media, mediaStyles[variant], sx)}
    />
  );
}

function EmptyTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="empty-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function EmptyDescription({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="empty-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function EmptyContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="empty-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  emptyMediaVariants,
  EmptyTitle,
};
export type { EmptyMediaVariant };
