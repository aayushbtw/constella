"use client";

import * as stylex from "@stylexjs/stylex";
import {
  PopoverClose as PopoverClosePrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverDescription as PopoverDescriptionPrimitive,
  Popover as PopoverPrimitive,
  PopoverTitle as PopoverTitlePrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@ui-sdk/react/popover";
import type { PopoverProps } from "@ui-sdk/react/popover";
import type { ComponentProps } from "react";

import { createSkipMotion, popupMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import {
  popupReset,
  popupSurface,
  typeStyles,
  withStyles,
} from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  offsets,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type PopoverContentProps = Styled<
  ComponentProps<typeof PopoverContentPrimitive>
>;

const styles = stylex.create({
  surface: {
    display: "flex",
    flexDirection: "column",
    gap: space.popup,
    maxWidth: "var(--available-width)",
    paddingBlock: space.popup,
    paddingInline: space.popup,
    width: sizes.popover,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
  },
  title: {
    fontWeight: fontWeights.medium,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "pretty",
  },
});

/** `usePopoverSkipMotion` tells a part that draws its own popup whether the popover's last open or close skips its motion. */
const [PopoverSkipMotion, usePopoverSkipMotion] = createSkipMotion();

function Popover({
  onOpenChange,
  onOpenChangeComplete,
  ...props
}: PopoverProps) {
  return (
    <PopoverSkipMotion
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      {(handlers) => <PopoverPrimitive {...handlers} {...props} />}
    </PopoverSkipMotion>
  );
}

function PopoverTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverTriggerPrimitive>>) {
  return <PopoverTriggerPrimitive {...withStyles(props, stylex.props(sx))} />;
}

function PopoverContent({
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverContentPrimitive
      data-skip-motion={usePopoverSkipMotion() || undefined}
      sideOffset={sideOffset}
      {...withStyles(
        props,
        stylex.props(
          [
            typeStyles.textSm,
            popupReset.base,
            popupSurface.base,
            styles.surface,
          ],
          popupMotion.popover,
          sx
        )
      )}
    />
  );
}

function PopoverHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="popover-header"
      {...withStyles(props, stylex.props(styles.header, sx))}
    />
  );
}

function PopoverTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverTitlePrimitive>>) {
  return (
    <PopoverTitlePrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.title], sx)
      )}
    />
  );
}

function PopoverDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverDescriptionPrimitive>>) {
  return (
    <PopoverDescriptionPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.description], sx)
      )}
    />
  );
}

function PopoverClose({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverClosePrimitive>>) {
  return <PopoverClosePrimitive {...withStyles(props, stylex.props(sx))} />;
}

/** The popup's reset and surface, for a part that draws its own popup. */
const popoverStyles = {
  popup: popupReset.base,
  surface: [typeStyles.textSm, popupSurface.base, styles.surface],
};

export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  popoverStyles,
  PopoverTitle,
  PopoverTrigger,
  usePopoverSkipMotion,
};
export type { PopoverContentProps };
