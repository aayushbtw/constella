"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  DialogBackdrop as DialogBackdropPrimitive,
  DialogClose as DialogClosePrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  Dialog as DialogPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogTrigger as DialogTriggerPrimitive,
} from "@ui-sdk/react/dialog";
import type { DialogProps } from "@ui-sdk/react/dialog";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import { popoverStyles } from "@/components/primitives/popover";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  blurs,
  colors,
  durations,
  easings,
  fontWeights,
  layers,
  media,
  motion,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const dialogSizes = ["sm", "default", "lg", "full"] as const;

type DialogSize = (typeof dialogSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type DialogPopupProps<Payload = unknown> = Styled<
  ComponentProps<typeof DialogContentPrimitive<Payload>>
> & {
  size?: DialogSize;
};

// An instant open paints its first frame onstage, since ui-sdk holds `data-starting-style` for one.
const offstage =
  ":is([data-starting-style], [data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const withClose = ":is(:has(> [data-slot='dialog-close-button']) > *)";
const stack = "var(--dialog-stack, 0)";
const gutter = `calc(100% - 2 * ${space.md})`;

const styles = stylex.create({
  backdrop: {
    backdropFilter: `blur(${blurs.backdrop})`,
    backgroundColor: colors.overlay,
    cursor: "auto",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    position: "fixed",
    zIndex: layers.dialog,
  },
  backdropMotion: {
    opacity: { default: 1, [offstage]: 0 },
    transitionDuration: { default: durations.dialog, [instant]: 0 },
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
  },
  popup: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.xl,
    borderStartEndRadius: radii.xl,
    borderEndStartRadius: radii.xl,
    borderEndEndRadius: radii.xl,
    boxShadow: shadows.xl,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxHeight: "100%",
    opacity: { default: 1, [offstage]: 0 },
    overflowY: {
      default: "auto",
      ":has(> [data-slot='dialog-body'])": "hidden",
    },
    paddingBlock: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
    position: "relative",
    // A parent steps back while a dialog opened from it sits on top.
    transform: {
      default: `translateY(calc(${stack} * -1 * ${space.sm})) scale(calc(1 - ${stack} * ${motion.stackScale}))`,
      [offstage]: `scale(${motion.dialogScale})`,
    },
    transitionDuration: { default: durations.dialog, [instant]: 0 },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: `min(100%, ${sizes.dialog})`,
  },
  centered: {
    height: "fit-content",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    marginBlockEnd: "auto",
    marginBlockStart: "auto",
    marginInline: "auto",
    maxHeight: gutter,
    maxWidth: gutter,
    position: "fixed",
  },
  sm: { width: `min(100%, ${sizes.dialogSm})` },
  lg: { width: `min(100%, ${sizes.dialogLg})` },
  full: { height: "100%", width: "100%" },
  header: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xxs,
    paddingInlineEnd: {
      default: null,
      [withClose]: `calc(${sizes.controlSm} + ${space.xs} - ${space.md})`,
    },
  },
  // Bleeds to the popup's edges so the scrollbar sits there, not beside the text.
  body: {
    flexGrow: 1,
    flexShrink: 1,
    marginInline: `calc(-1 * ${space.md})`,
    minHeight: 0,
    overflowY: "auto",
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  // A tinted bar set into the popup's bottom edge, so the actions read as their own row.
  footer: {
    backgroundColor: colors.fillSubtle,
    borderTopColor: colors.borderSubtle,
    borderTopStyle: "solid",
    borderTopWidth: strokes.border,
    display: "flex",
    flexDirection: { default: "column-reverse", [media.sm]: "row" },
    flexShrink: 0,
    gap: space.xs,
    justifyContent: "flex-end",
    marginBlockEnd: `calc(-1 * ${space.md})`,
    // Pinned to the bottom when the popup is taller than its content, as at `full`.
    marginBlockStart: "auto",
    marginInline: `calc(-1 * ${space.md})`,
    paddingBlock: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  title: {
    fontWeight: fontWeights.medium,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInline: 0,
    // A long name or address in the title breaks rather than widening the popup.
    overflowWrap: "anywhere",
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInline: 0,
    overflowWrap: "anywhere",
    textWrap: "pretty",
  },
  closeButton: {
    insetBlockStart: space.xs,
    insetInlineEnd: space.xs,
    position: "absolute",
  },
});

function Dialog(props: DialogProps) {
  return <DialogPrimitive {...props} />;
}

function DialogTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof DialogTriggerPrimitive>>) {
  return <DialogTriggerPrimitive {...props} {...stylex.props(sx)} />;
}

function DialogBackdrop({
  sx,
  ...props
}: Styled<ComponentProps<typeof DialogBackdropPrimitive>>) {
  return (
    <DialogBackdropPrimitive
      {...props}
      {...stylex.props(styles.backdrop, styles.backdropMotion, sx)}
    />
  );
}

// Shared with Alert Dialog and Sheet, type included, so they never drift apart.
const dialogStyles = {
  backdrop: [styles.backdrop, styles.backdropMotion],
  backdropSurface: styles.backdrop,
  closeButton: styles.closeButton,
  description: [typeStyles.textSm, styles.description],
  footer: styles.footer,
  header: styles.header,
  popup: [
    popoverStyles.popup,
    typeStyles.textSm,
    styles.popup,
    styles.centered,
  ],
  sm: styles.sm,
  title: [typeStyles.textBase, styles.title],
};

const sizeStyles = {
  default: null,
  full: styles.full,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<DialogSize, stylex.StyleXStyles | null>;

function DialogPopup<Payload = unknown>({
  size = "default",
  sx,
  ...props
}: DialogPopupProps<Payload>) {
  return (
    <DialogContentPrimitive<Payload>
      data-size={size}
      {...props}
      {...stylex.props(dialogStyles.popup, sizeStyles[size], sx)}
    />
  );
}

function DialogContent<Payload = unknown>(props: DialogPopupProps<Payload>) {
  return (
    <>
      <DialogBackdrop />
      <DialogPopup<Payload> {...props} />
    </>
  );
}

function DialogHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="dialog-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function DialogBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="dialog-body"
      {...props}
      {...stylex.props(styles.body, sx)}
    />
  );
}

function DialogFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="dialog-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

function DialogTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof DialogTitlePrimitive>>) {
  return (
    <DialogTitlePrimitive
      {...props}
      {...stylex.props(dialogStyles.title, sx)}
    />
  );
}

function DialogDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof DialogDescriptionPrimitive>>) {
  return (
    <DialogDescriptionPrimitive
      {...props}
      {...stylex.props(dialogStyles.description, sx)}
    />
  );
}

function DialogClose({
  sx,
  ...props
}: Styled<ComponentProps<typeof DialogClosePrimitive>>) {
  return <DialogClosePrimitive {...props} {...stylex.props(sx)} />;
}

// The styles ride on the Button: it applies its own last, over anything ui-sdk merges in.
function DialogCloseButton({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof DialogClosePrimitive>>, "render">) {
  return (
    <DialogClosePrimitive
      aria-label="Close"
      render={
        <Button
          data-slot="dialog-close-button"
          size="icon-sm"
          sx={[styles.closeButton, sx]}
          variant="ghost"
        />
      }
      {...props}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={Cancel01Icon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
      )}
    </DialogClosePrimitive>
  );
}

export { createDialogController } from "@ui-sdk/react/dialog";
export type { DialogController } from "@ui-sdk/react/dialog";
export {
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  dialogSizes,
  dialogStyles,
};
export type { DialogPopupProps, DialogSize };
