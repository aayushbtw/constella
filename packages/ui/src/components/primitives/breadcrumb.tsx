import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles, visuallyHidden } from "@/lib/constella/styles";
import {
  colors,
  durations,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const rtl = ":is([dir='rtl'], [dir='rtl'] *)";

const styles = stylex.create({
  list: {
    alignItems: "center",
    color: colors.textSecondary,
    columnGap: space.xs,
    display: "flex",
    flexWrap: "wrap",
    listStyleType: "none",
    overflowWrap: "break-word",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    rowGap: space.xxs,
  },
  item: {
    alignItems: "center",
    display: "inline-flex",
    gap: space.xxs,
    minWidth: 0,
  },
  link: {
    color: {
      default: colors.textSecondary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover": colors.textPrimary,
      },
    },
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
  page: {
    color: colors.textPrimary,
  },
  separator: {
    display: "flex",
    transform: { default: null, [rtl]: "scaleX(-1)" },
  },
  ellipsis: {
    alignItems: "center",
    display: "flex",
    height: sizes.iconLg,
    justifyContent: "center",
    width: sizes.iconLg,
  },
});

function Breadcrumb({ sx, ...props }: Styled<ComponentProps<"nav">>) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      {...props}
      {...stylex.props(sx)}
    />
  );
}

function BreadcrumbList({ sx, ...props }: Styled<ComponentProps<"ol">>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.list], sx)}
    />
  );
}

function BreadcrumbItem({ sx, ...props }: Styled<ComponentProps<"li">>) {
  return (
    <li
      data-slot="breadcrumb-item"
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

/** Pass a router's link as `render`. */
function BreadcrumbLink({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"a">>) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(props, stylex.props(styles.link, sx)),
    render,
    state: { slot: "breadcrumb-link" },
  });
}

function BreadcrumbPage({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      {...props}
      {...stylex.props(styles.page, sx)}
    />
  );
}

function BreadcrumbSeparator({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"li">>) {
  return (
    <li
      aria-hidden
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
      {...stylex.props(styles.separator, sx)}
    >
      {children ?? (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      )}
    </li>
  );
}

function BreadcrumbEllipsis({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      {...props}
      {...stylex.props(styles.ellipsis, sx)}
    >
      <HugeiconsIcon
        aria-hidden
        icon={MoreHorizontalCircle01Icon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
      <span {...stylex.props(visuallyHidden.base)}>More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
