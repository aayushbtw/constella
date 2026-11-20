"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/primitives/dialog";
import { useSkipMotion } from "@/lib/constella/motion";
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

type CommandDialogProps = Omit<ComponentProps<typeof Dialog>, "children"> & {
  children: ReactNode;
  description?: string;
  sx?: Sx;
  title?: string;
};

// A pick closes it through the controller, which reports `imperative`; it closes at once, as a picked menu item does.
const picked = (open: boolean, { reason }: { reason: string }) =>
  !open && reason === "imperative";

/** Renders a dialog with a command inside, named for screen readers by `title` and `description`. Lives apart from `command.tsx` so an app can lazy-load the command under this frame. */
function CommandDialog({
  children,
  description = "Search for a command to run...",
  onOpenChange,
  sx,
  title = "Command Palette",
  ...props
}: CommandDialogProps) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange, picked);
  return (
    <Dialog onOpenChange={handleOpenChange} {...props}>
      <DialogBackdrop data-skip-motion={skip || undefined} />
      <DialogPopup
        data-skip-motion={skip || undefined}
        size="lg"
        sx={[styles.dialog, sx]}
      >
        <DialogTitle sx={visuallyHidden.base}>{title}</DialogTitle>
        <DialogDescription sx={visuallyHidden.base}>
          {description}
        </DialogDescription>
        {children}
      </DialogPopup>
    </Dialog>
  );
}

export { CommandDialog };
