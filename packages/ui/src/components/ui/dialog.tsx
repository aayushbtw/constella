"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

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
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const offstage = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  backdrop: {
    backgroundColor: colors.overlay,
    inset: 0,
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
    inset: 0,
    justifyContent: "center",
    padding: space.md,
    position: "fixed",
    zIndex: layers.dialog,
  },
  popup: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    boxShadow: shadows.dialog,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: space.md,
    maxHeight: "100%",
    opacity: { default: 1, [offstage]: 0 },
    outline: "none",
    overflowY: "auto",
    padding: space.lg,
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
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  footer: {
    display: "flex",
    flexDirection: { default: "column-reverse", [media.sm]: "row" },
    gap: space.xs,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.row,
    margin: 0,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    margin: 0,
    textWrap: "pretty",
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

function DialogPopup({ sx, ...props }: Styled<DialogPrimitive.Popup.Props>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      {...props}
      {...stylex.props(styles.popup, sx)}
    />
  );
}

function DialogContent(props: Styled<DialogPrimitive.Popup.Props>) {
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

export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
};
