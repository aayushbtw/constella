"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  layers,
  lineHeights,
  media,
  motion,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const dialogSizes = ["sm", "default", "lg", "full"] as const;

type DialogSize = (typeof dialogSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type DialogPopupProps = Styled<DialogPrimitive.Popup.Props> & {
  size?: DialogSize;
};

const offstage = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  backdrop: {
    backgroundColor: colors.overlay,
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    opacity: { default: 1, [offstage]: 0 },
    position: "fixed",
    transitionDuration: durations.dialog,
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
    zIndex: layers.dialog,
  },
  viewport: {
    alignItems: "center",
    display: "flex",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    justifyContent: "center",
    paddingBlock: space.md,
    paddingInline: space.md,
    position: "fixed",
    zIndex: layers.dialog,
  },
  popup: {
    backgroundColor: colors.background,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.dialog,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: space.md,
    maxHeight: "100%",
    opacity: { default: 1, [offstage]: 0 },
    overflowY: "auto",
    paddingBlock: space.md,
    paddingInline: space.md,
    position: "relative",
    // A parent steps back while a dialog opened from it sits on top.
    transform: {
      default: `translateY(calc(var(--nested-dialogs, 0) * -1 * ${space.sm})) scale(calc(1 - var(--nested-dialogs, 0) * ${motion.stackScale}))`,
      [offstage]: `scale(${motion.dialogScale})`,
    },
    transitionDuration: durations.dialog,
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: `min(100%, ${sizes.dialog})`,
  },
  sm: { width: `min(100%, ${sizes.dialogSm})` },
  lg: { width: `min(100%, ${sizes.dialogLg})` },
  // The viewport's padding stays around it, so it still reads as a dialog over the page.
  full: { height: "100%", width: "100%" },
  header: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xs,
  },
  // Bleeds to the popup's edges so the scrollbar sits there, not beside the text.
  body: {
    flexGrow: 1,
    flexShrink: 1,
    marginInline: `calc(-1 * ${space.md})`,
    minHeight: 0,
    overflowY: "auto",
    paddingInline: space.md,
  },
  // A tinted bar set into the popup's bottom edge, so the actions read as their own row.
  footer: {
    backgroundColor: colors.fillSubtle,
    borderTopColor: colors.edgeSubtle,
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
    paddingInline: space.md,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInline: 0,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInline: 0,
    textWrap: "pretty",
  },
  closeButton: {
    insetBlockStart: space.xs,
    insetInlineEnd: space.xs,
    position: "absolute",
  },
});

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogBackdrop({
  sx,
  ...props
}: Styled<DialogPrimitive.Backdrop.Props>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      {...props}
      {...stylex.props(styles.backdrop, sx)}
    />
  );
}

function DialogViewport({
  sx,
  ...props
}: Styled<DialogPrimitive.Viewport.Props>) {
  return (
    <DialogPrimitive.Viewport
      data-slot="dialog-viewport"
      {...props}
      {...stylex.props(styles.viewport, sx)}
    />
  );
}

const sizeStyles = {
  default: null,
  full: styles.full,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<DialogSize, stylex.StyleXStyles | null>;

function DialogPopup({ size = "default", sx, ...props }: DialogPopupProps) {
  return (
    <DialogPrimitive.Popup
      data-size={size}
      data-slot="dialog-popup"
      {...props}
      {...stylex.props(styles.popup, sizeStyles[size], sx)}
    />
  );
}

function DialogContent(props: DialogPopupProps) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogViewport>
        <DialogPopup {...props} />
      </DialogViewport>
    </DialogPortal>
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

function DialogTitle({ sx, ...props }: Styled<DialogPrimitive.Title.Props>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function DialogDescription({
  sx,
  ...props
}: Styled<DialogPrimitive.Description.Props>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// The styles ride on the Button: it applies its own last, over anything Base UI merges in.
function DialogCloseButton({
  children,
  sx,
  ...props
}: Styled<DialogPrimitive.Close.Props>) {
  return (
    <DialogPrimitive.Close
      aria-label="Close"
      data-slot="dialog-close-button"
      render={
        <Button size="icon-sm" sx={[styles.closeButton, sx]} variant="ghost" />
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
    </DialogPrimitive.Close>
  );
}

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
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
  dialogSizes,
};
export type { DialogPopupProps, DialogSize };
