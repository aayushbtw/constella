"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, RefObject } from "react";

import { Button } from "@/components/ui/button";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type SidePanelContentProps = Styled<DialogPrimitive.Popup.Props> & {
  /** The `SidePanelSlot` to open in, beside the content. */
  container: RefObject<HTMLElement | null>;
};

const entering = ":is([data-starting-style])";

const styles = stylex.create({
  slot: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  // Base UI wraps the popup in the portal's own element, which has to fill the slot too.
  portal: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
  },
  // Part of the layout, split from the content by a hairline, not floating over it.
  popup: {
    backgroundColor: colors.background,
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    boxSizing: "border-box",
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    fontSize: fontSizes.sm,
    maxWidth: "100vw",
    minHeight: 0,
    opacity: { default: 1, [entering]: 0 },
    overflowY: "auto",
    transform: {
      default: "none",
      [entering]: {
        default: `translateX(${space.sm})`,
        [media.reducedMotion]: "none",
      },
    },
    // Closes at once, so the content beside it widens in one step.
    transitionDuration: {
      default: durations.dialog,
      ":is([data-ending-style])": "0s",
    },
    transitionProperty: "opacity, transform",
    transitionTimingFunction: easings.layout,
    width: sizes.sidePanel,
  },
  header: {
    alignItems: "flex-start",
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    display: "flex",
    flexShrink: 0,
    gap: space.sm,
    justifyContent: "space-between",
    paddingBlockEnd: space.sm,
    paddingBlockStart: space.sm,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.md,
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    minWidth: 0,
    paddingBlockStart: space.xxs,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
  body: {
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
});

/** A non-modal dialog: clicking the content beside it leaves it open; Escape or Close shuts it. */
function SidePanel(props: DialogPrimitive.Root.Props) {
  return (
    <DialogPrimitive.Root disablePointerDismissal modal={false} {...props} />
  );
}

/** Where the panel opens: after the content it sits beside, in a flex row. */
function SidePanelSlot({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="side-panel-slot"
      {...props}
      {...stylex.props(styles.slot, sx)}
    />
  );
}

function SidePanelContent({ container, sx, ...props }: SidePanelContentProps) {
  return (
    <DialogPrimitive.Portal
      container={container}
      {...stylex.props(styles.portal)}
    >
      <DialogPrimitive.Popup
        data-slot="side-panel"
        {...props}
        {...stylex.props(styles.popup, sx)}
      />
    </DialogPrimitive.Portal>
  );
}

/** Holds the title and description, with Close at its end. */
function SidePanelHeader({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="side-panel-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    >
      <div {...stylex.props(styles.heading)}>{children}</div>
      <DialogPrimitive.Close
        aria-label="Close"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <HugeiconsIcon
          aria-hidden
          icon={Cancel01Icon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
      </DialogPrimitive.Close>
    </div>
  );
}

function SidePanelTitle({ sx, ...props }: Styled<DialogPrimitive.Title.Props>) {
  return (
    <DialogPrimitive.Title
      data-slot="side-panel-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function SidePanelDescription({
  sx,
  ...props
}: Styled<DialogPrimitive.Description.Props>) {
  return (
    <DialogPrimitive.Description
      data-slot="side-panel-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function SidePanelBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="side-panel-body"
      {...props}
      {...stylex.props(styles.body, sx)}
    />
  );
}

export {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelDescription,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
};
export type { SidePanelContentProps };
