"use client";

import * as stylex from "@stylexjs/stylex";
import {
  DrawerBackdrop as DrawerBackdropPrimitive,
  DrawerClose as DrawerClosePrimitive,
  DrawerContent as DrawerContentPrimitive,
  DrawerDescription as DrawerDescriptionPrimitive,
  Drawer as DrawerPrimitive,
  DrawerTitle as DrawerTitlePrimitive,
  DrawerTrigger as DrawerTriggerPrimitive,
} from "@ui-sdk/react/drawer";
import type { DrawerProps } from "@ui-sdk/react/drawer";
import type { ComponentProps, ReactNode } from "react";

import { CloseButton } from "@/components/primitives/button";
import { dialogStyles } from "@/components/primitives/dialog";
import type { Sx } from "@/lib/constella/styles";
import { popupReset, typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  motion,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const sheetSides = ["top", "right", "bottom", "left"] as const;

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type SheetContentProps = Omit<
  Styled<ComponentProps<typeof DrawerContentPrimitive>>,
  "children"
> & {
  children?: ReactNode;
  showCloseButton?: boolean;
};

const sideways = ":is([data-side='left'], [data-side='right'])";
const vertical = ":is([data-side='top'], [data-side='bottom'])";
const onSide = {
  bottom: ":is([data-side='bottom'])",
  left: ":is([data-side='left'])",
  right: ":is([data-side='right'])",
  top: ":is([data-side='top'])",
} as const;
const withClose = ":is(:has(> [data-slot='dialog-close-button']) > *)";

const styles = stylex.create({
  popup: {
    backgroundColor: colors.raised,
    boxShadow: shadows.xl,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    height: { default: null, [sideways]: "100%" },
    maxHeight: "100%",
    position: "relative",
    width: { default: "100%", [sideways]: `min(75%, ${sizes.dialog})` },
    // Covers the gap the rubber band opens past the edge, as ui-sdk's own sheet does.
    "::after": {
      backgroundColor: "inherit",
      bottom: { default: null, [sideways]: 0, [onSide.top]: "100%" },
      content: "''",
      height: { default: null, [vertical]: "100%" },
      left: { default: null, [vertical]: 0, [onSide.right]: "100%" },
      position: "absolute",
      right: { default: null, [vertical]: 0, [onSide.left]: "100%" },
      top: { default: null, [sideways]: 0, [onSide.bottom]: "100%" },
      width: { default: null, [sideways]: "100%" },
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xxs,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: {
      default: space.md,
      [withClose]: `calc(${sizes.controlSm} + ${space.xs})`,
    },
    paddingInlineStart: space.md,
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  // The dialog's footer bar, pinned to the bottom.
  footer: {
    backgroundColor: colors.fillSubtle,
    borderBlockStartColor: colors.borderSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xs,
    marginBlockStart: "auto",
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
});

function Sheet({ physics, side = "right", ...props }: DrawerProps) {
  return (
    <DrawerPrimitive
      physics={{ response: Number(motion.sheetResponse), ...physics }}
      side={side}
      {...props}
    />
  );
}

function SheetTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof DrawerTriggerPrimitive>>) {
  return <DrawerTriggerPrimitive {...withStyles(props, stylex.props(sx))} />;
}

function SheetClose({
  sx,
  ...props
}: Styled<ComponentProps<typeof DrawerClosePrimitive>>) {
  return <DrawerClosePrimitive {...withStyles(props, stylex.props(sx))} />;
}

/** Renders the backdrop and the sheet, with a close button unless `showCloseButton={false}`. */
function SheetContent({
  children,
  showCloseButton = true,
  sx,
  ...props
}: SheetContentProps) {
  return (
    <>
      <DrawerBackdropPrimitive
        {...stylex.props(dialogStyles.backdropSurface)}
      />
      <DrawerContentPrimitive
        {...withStyles(
          props,
          stylex.props(popupReset.base, typeStyles.textSm, styles.popup, sx)
        )}
      >
        {children}
        {showCloseButton && (
          <DrawerClosePrimitive
            render={
              <CloseButton
                data-slot="dialog-close-button"
                sx={dialogStyles.closeButton}
              />
            }
          />
        )}
      </DrawerContentPrimitive>
    </>
  );
}

function SheetHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sheet-header"
      {...withStyles(props, stylex.props(styles.header, sx))}
    />
  );
}

function SheetBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-drawer-no-drag=""
      data-slot="sheet-body"
      {...withStyles(props, stylex.props(styles.body, sx))}
    />
  );
}

function SheetFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sheet-footer"
      {...withStyles(props, stylex.props(styles.footer, sx))}
    />
  );
}

function SheetTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof DrawerTitlePrimitive>>) {
  return (
    <DrawerTitlePrimitive
      {...withStyles(props, stylex.props(dialogStyles.title, sx))}
    />
  );
}

function SheetDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof DrawerDescriptionPrimitive>>) {
  return (
    <DrawerDescriptionPrimitive
      {...withStyles(props, stylex.props(dialogStyles.description, sx))}
    />
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  sheetSides,
  SheetTitle,
  SheetTrigger,
};
export type { SheetContentProps };
