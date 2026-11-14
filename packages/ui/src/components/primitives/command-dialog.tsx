"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@/components/primitives/dialog";
import type { Sx } from "@/lib/constella/styles";
import { visuallyHidden } from "@/lib/constella/styles";
import { radii, space } from "@/lib/constella/tokens.stylex";

const styles = stylex.create({
  viewport: {
    alignItems: "flex-start",
    paddingBlockStart: `max(${space.md}, 15vh)`,
  },
  dialog: {
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    gap: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
});

/** Renders a dialog with a command inside, named for screen readers by `title` and `description`. Lives apart from `command.tsx` so an app can lazy-load the command under this frame. */
function CommandDialog({
  children,
  description = "Search for a command to run...",
  instant = false,
  sx,
  title = "Command Palette",
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children: ReactNode;
  description?: string;
  /** Opens and closes with no motion, for a change the keyboard made. */
  instant?: boolean;
  sx?: Sx;
  title?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogBackdrop data-skip-motion={instant || undefined} />
        <DialogViewport sx={styles.viewport}>
          <DialogPopup
            data-skip-motion={instant || undefined}
            size="lg"
            sx={[styles.dialog, sx]}
          >
            <DialogTitle sx={visuallyHidden.base}>{title}</DialogTitle>
            <DialogDescription sx={visuallyHidden.base}>
              {description}
            </DialogDescription>
            {children}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

export { CommandDialog };
