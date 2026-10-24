"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, RefObject } from "react";

import { Button } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
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
  // Part of the layout, not over it: a hairline all round.
  surface: {
    backgroundColor: colors.background,
    borderBlockEndColor: colors.borderSubtle,
    borderBlockStartColor: colors.borderSubtle,
    borderInlineEndColor: colors.borderSubtle,
    borderInlineStartColor: colors.borderSubtle,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  // Inset from the content and the window's edges.
  placed: {
    marginBlockEnd: space.sm,
    marginBlockStart: space.sm,
    marginInlineEnd: space.sm,
    marginInlineStart: space.sm,
    maxWidth: `calc(100vw - 2 * ${space.sm})`,
    width: sizes.sidePanel,
  },
  popup: {
    flexGrow: 1,
    opacity: { default: 1, [entering]: 0 },
    overflow: "hidden",
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
  },
  // The page's header height, so its controls sit as the page's do.
  header: {
    alignItems: "center",
    borderBlockEndColor: colors.borderSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    display: "flex",
    flexShrink: 0,
    gap: space.xxs,
    height: sizes.header,
    paddingInlineEnd: `calc((${sizes.header} - ${sizes.controlSm}) / 2)`,
    paddingInlineStart: space.md,
  },
  title: {
    flexGrow: 1,
    fontWeight: fontWeights.medium,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // First in the body: the header is one row, with no room under the title.
  description: {
    color: colors.textSecondary,
    marginBlockEnd: space.md,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    textWrap: "pretty",
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: space.xs,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
});

/** The side panel's surface without the dialog or its place: the page sizes and places it. */
function Panel({ sx, ...props }: Styled<ComponentProps<"aside">>) {
  return (
    <aside
      data-slot="panel"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.surface], sx)}
    />
  );
}

/** A row the page's header height: the title first, any actions after it. */
function PanelHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="panel-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function PanelTitle({ children, sx, ...props }: Styled<ComponentProps<"h2">>) {
  return (
    <h2
      data-slot="panel-title"
      {...props}
      {...stylex.props([typeStyles.textLg, styles.title], sx)}
    >
      {children}
    </h2>
  );
}

/** Scrolls on its own once the panel's height can't hold it. */
function PanelBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div data-slot="panel-body" {...props} {...stylex.props(styles.body, sx)} />
  );
}

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
        {...stylex.props(
          [typeStyles.textSm, styles.surface, styles.placed, styles.popup],
          sx
        )}
      />
    </DialogPrimitive.Portal>
  );
}

/** A row the page's header height: the title first, any actions after it, Close last. */
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
      {children}
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
      {...stylex.props([typeStyles.textLg, styles.title], sx)}
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
      {...stylex.props([typeStyles.textSm, styles.description], sx)}
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

/** Pinned below the body, which scrolls on its own. */
function SidePanelFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="side-panel-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

export {
  Panel,
  PanelBody,
  PanelHeader,
  PanelTitle,
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
};
export type { SidePanelContentProps };
