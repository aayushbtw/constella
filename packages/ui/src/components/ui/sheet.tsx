"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  DialogBackdrop,
  DialogCloseButton,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  colors,
  durations,
  easings,
  fontSizes,
  layers,
  media,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const sheetSides = ["top", "right", "bottom", "left"] as const;

type SheetSide = (typeof sheetSides)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type SheetContentProps = Styled<SheetPrimitive.Popup.Props> & {
  showCloseButton?: boolean;
  side?: SheetSide;
};

const offstage = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  // Slides the whole way in from its edge and back out the same way.
  popup: {
    backgroundColor: colors.raised,
    boxShadow: shadows.dialog,
    boxSizing: "border-box",
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    opacity: {
      default: 1,
      [media.reducedMotion]: { default: 1, [offstage]: 0 },
    },
    overflowY: "auto",
    position: "fixed",
    transitionDuration: {
      default: durations.layout,
      ":is([data-ending-style])": durations.dialog,
    },
    transitionProperty: {
      default: "transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.layout,
    zIndex: layers.dialog,
  },
  // Sides are physical, like the slide that brings them in.
  right: {
    height: "100%",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    right: 0,
    transform: {
      default: "none",
      [offstage]: {
        default: "translateX(100%)",
        [media.reducedMotion]: "none",
      },
    },
    width: `min(75%, ${sizes.dialog})`,
  },
  left: {
    height: "100%",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    left: 0,
    transform: {
      default: "none",
      [offstage]: {
        default: "translateX(-100%)",
        [media.reducedMotion]: "none",
      },
    },
    width: `min(75%, ${sizes.dialog})`,
  },
  top: {
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    transform: {
      default: "none",
      [offstage]: {
        default: "translateY(-100%)",
        [media.reducedMotion]: "none",
      },
    },
  },
  bottom: {
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    transform: {
      default: "none",
      [offstage]: {
        default: "translateY(100%)",
        [media.reducedMotion]: "none",
      },
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xxs,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  body: {
    flexGrow: 1,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  // The dialog's footer bar, pinned to the bottom.
  footer: {
    backgroundColor: colors.fillSubtle,
    borderBlockStartColor: colors.edgeSubtle,
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

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/** Renders the portal, backdrop and popup at the `side` edge, with a close button unless `showCloseButton={false}`. */
function SheetContent({
  children,
  showCloseButton = true,
  side = "right",
  sx,
  ...props
}: SheetContentProps) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <SheetPrimitive.Popup
        data-side={side}
        data-slot="sheet-content"
        {...props}
        {...stylex.props(styles.popup, styles[side], sx)}
      >
        {children}
        {showCloseButton && <DialogCloseButton />}
      </SheetPrimitive.Popup>
    </DialogPortal>
  );
}

function SheetHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sheet-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function SheetBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div data-slot="sheet-body" {...props} {...stylex.props(styles.body, sx)} />
  );
}

function SheetFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="sheet-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

function SheetTitle(props: ComponentProps<typeof DialogTitle>) {
  return <DialogTitle data-slot="sheet-title" {...props} />;
}

function SheetDescription(props: ComponentProps<typeof DialogDescription>) {
  return <DialogDescription data-slot="sheet-description" {...props} />;
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
export type { SheetContentProps, SheetSide };
