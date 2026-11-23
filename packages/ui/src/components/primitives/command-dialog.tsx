"use client";

import * as stylex from "@stylexjs/stylex";
import { Dialog as DialogPrimitive } from "@ui-sdk/react/dialog";
import type { DialogProps } from "@ui-sdk/react/dialog";
import type { ReactNode } from "react";

import {
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogSkipMotion,
  DialogTitle,
} from "@/components/primitives/dialog";
import { skipsMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { visuallyHidden } from "@/lib/constella/styles";
import { radii, space } from "@/lib/constella/tokens.stylex";

const styles = stylex.create({
  dialog: {
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    gap: 0,
    marginBlockEnd: "auto",
    marginBlockStart: `max(${space.md}, 15vh)`,
    maxHeight: `calc(100% - max(${space.md}, 15vh) - ${space.md})`,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
});

type CommandDialogProps = Omit<DialogProps, "children"> & {
  children: ReactNode;
  description?: string;
  sx?: Sx;
  title?: string;
};

const skipsDialogMotion = (
  open: boolean,
  details: { reason: string; source: string }
) => skipsMotion(open, details) || (!open && details.reason === "imperative");

/** Renders a dialog with a command inside, named for screen readers by `title` and `description`. Lives apart from `command.tsx` so an app can lazy-load the command under this frame. */
function CommandDialog({
  children,
  description = "Search for a command to run...",
  onOpenChange,
  onOpenChangeComplete,
  sx,
  title = "Command Palette",
  ...props
}: CommandDialogProps) {
  return (
    <DialogSkipMotion
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      skips={skipsDialogMotion}
    >
      {(handlers) => (
        <DialogPrimitive {...handlers} {...props}>
          <DialogBackdrop />
          <DialogPopup size="lg" sx={[styles.dialog, sx]}>
            <DialogTitle sx={visuallyHidden.base}>{title}</DialogTitle>
            <DialogDescription sx={visuallyHidden.base}>
              {description}
            </DialogDescription>
            {children}
          </DialogPopup>
        </DialogPrimitive>
      )}
    </DialogSkipMotion>
  );
}

export { CommandDialog };
