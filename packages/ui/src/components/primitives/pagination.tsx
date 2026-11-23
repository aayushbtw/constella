"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  Pagination as PaginationPrimitive,
  PaginationEllipsis as PaginationEllipsisPrimitive,
  PaginationFirst as PaginationFirstPrimitive,
  PaginationItem as PaginationItemPrimitive,
  PaginationLast as PaginationLastPrimitive,
  PaginationLink as PaginationLinkPrimitive,
  PaginationList as PaginationListPrimitive,
  PaginationNext as PaginationNextPrimitive,
  PaginationPrevious as PaginationPreviousPrimitive,
} from "@ui-sdk/react/pagination";
import type { ComponentProps } from "react";

import { buttonStyles } from "@/components/primitives/button";
import type { ButtonSize, ButtonVariant } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  visuallyHidden,
  withStyles,
} from "@/lib/constella/styles";
import {
  colors,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const current = "[data-current]";
const hoverIdle =
  ":hover:not(:disabled, [data-disabled], [data-pending], [data-current])";
const activeIdle =
  ":active:not(:disabled, [data-disabled], [data-pending], [data-current])";
const hoverCurrent = "[data-current]:hover:not([data-disabled])";
const activeCurrent = "[data-current]:active:not([data-disabled])";
const lit = `linear-gradient(${colors.fillSubtle}, ${colors.fillSubtle})`;

const styles = stylex.create({
  root: {
    display: "flex",
    justifyContent: "center",
    marginInline: "auto",
    width: "100%",
  },
  list: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    justifyContent: "center",
    listStyleType: "none",
    marginBlock: 0,
    marginInline: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
  // Each state repeats inside the hover block, which StyleX ranks above a bare condition.
  link: {
    backgroundClip: { default: null, [current]: "padding-box" },
    backgroundColor: {
      default: "transparent",
      [media.hover]: {
        default: "transparent",
        [hoverIdle]: colors.fillSubtle,
        [current]: colors.background,
      },
      [activeIdle]: colors.fillSubtle,
      [current]: colors.background,
    },
    backgroundImage: {
      default: "none",
      [media.hover]: { default: "none", [hoverCurrent]: lit },
      [activeCurrent]: lit,
    },
    borderBlockColor: { default: "transparent", [current]: colors.border },
    borderInlineColor: { default: "transparent", [current]: colors.border },
    fontVariantNumeric: "tabular-nums",
  },
  ellipsis: {
    alignItems: "center",
    display: "flex",
    height: sizes.controlMd,
    justifyContent: "center",
    width: sizes.controlMd,
  },
});

const isIconSize = (size: ButtonSize) => size.startsWith("icon");

function Pagination({
  sx,
  ...props
}: Styled<ComponentProps<typeof PaginationPrimitive>>) {
  return (
    <PaginationPrimitive
      aria-label="Pagination"
      {...withStyles(props, stylex.props(styles.root, sx))}
    />
  );
}

function PaginationList({
  sx,
  ...props
}: Styled<ComponentProps<typeof PaginationListPrimitive>>) {
  return (
    <PaginationListPrimitive
      {...withStyles(props, stylex.props(styles.list, sx))}
    />
  );
}

function PaginationItem({
  sx,
  ...props
}: Styled<ComponentProps<typeof PaginationItemPrimitive>>) {
  return <PaginationItemPrimitive {...withStyles(props, stylex.props(sx))} />;
}

type PaginationLinkProps = Styled<
  ComponentProps<typeof PaginationLinkPrimitive>
> & {
  size?: ButtonSize;
};

function PaginationLink({ size = "icon", sx, ...props }: PaginationLinkProps) {
  return (
    <PaginationLinkPrimitive
      data-size={size}
      {...withStyles(
        props,
        stylex.props(buttonStyles({ size, variant: "ghost" }), styles.link, sx)
      )}
    />
  );
}

type PaginationStepProps = Styled<
  ComponentProps<typeof PaginationPreviousPrimitive>
> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function StepIcon({
  edge,
  icon,
  size,
}: {
  edge: "inline-end" | "inline-start";
  icon: typeof ArrowLeft01Icon;
  size: ButtonSize;
}) {
  return (
    <HugeiconsIcon
      aria-hidden
      data-icon={edge}
      data-rtl-flip
      icon={icon}
      size={controlIconSize[size]}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function StepText({ children, size }: { children: string; size: ButtonSize }) {
  return (
    <span {...stylex.props(isIconSize(size) && visuallyHidden.base)}>
      {children}
    </span>
  );
}

function PaginationPrevious({
  children,
  size = "default",
  sx,
  variant = "ghost",
  ...props
}: PaginationStepProps) {
  return (
    <PaginationPreviousPrimitive
      data-size={size}
      data-variant={variant}
      {...withStyles(props, stylex.props(buttonStyles({ size, variant }), sx))}
    >
      {children ?? (
        <>
          <StepIcon edge="inline-start" icon={ArrowLeft01Icon} size={size} />
          <StepText size={size}>Previous</StepText>
        </>
      )}
    </PaginationPreviousPrimitive>
  );
}

function PaginationNext({
  children,
  size = "default",
  sx,
  variant = "ghost",
  ...props
}: PaginationStepProps) {
  return (
    <PaginationNextPrimitive
      data-size={size}
      data-variant={variant}
      {...withStyles(props, stylex.props(buttonStyles({ size, variant }), sx))}
    >
      {children ?? (
        <>
          <StepText size={size}>Next</StepText>
          <StepIcon edge="inline-end" icon={ArrowRight01Icon} size={size} />
        </>
      )}
    </PaginationNextPrimitive>
  );
}

function PaginationFirst({
  children,
  size = "icon",
  sx,
  variant = "ghost",
  ...props
}: PaginationStepProps) {
  return (
    <PaginationFirstPrimitive
      data-size={size}
      data-variant={variant}
      {...withStyles(props, stylex.props(buttonStyles({ size, variant }), sx))}
    >
      {children ?? (
        <>
          <StepIcon
            edge="inline-start"
            icon={ArrowLeftDoubleIcon}
            size={size}
          />
          <StepText size={size}>First</StepText>
        </>
      )}
    </PaginationFirstPrimitive>
  );
}

function PaginationLast({
  children,
  size = "icon",
  sx,
  variant = "ghost",
  ...props
}: PaginationStepProps) {
  return (
    <PaginationLastPrimitive
      data-size={size}
      data-variant={variant}
      {...withStyles(props, stylex.props(buttonStyles({ size, variant }), sx))}
    >
      {children ?? (
        <>
          <StepText size={size}>Last</StepText>
          <StepIcon edge="inline-end" icon={ArrowRightDoubleIcon} size={size} />
        </>
      )}
    </PaginationLastPrimitive>
  );
}

function PaginationEllipsis({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof PaginationEllipsisPrimitive>>) {
  return (
    <PaginationEllipsisPrimitive
      {...withStyles(props, stylex.props(styles.ellipsis, sx))}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={MoreHorizontalCircle01Icon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
      )}
    </PaginationEllipsisPrimitive>
  );
}

export {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
};
export type { PaginationLinkProps, PaginationStepProps };
