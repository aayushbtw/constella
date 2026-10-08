"use client";

import { ArrowDown02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageScroller as MessageScrollerPrimitive } from "@shadcn/react/message-scroller";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  durations,
  easings,
  media,
  motion,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const away = ":is([data-active='false'])";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  viewport: {
    contain: "content",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarGutter: "stable",
    scrollbarWidth: "thin",
    // Hidden until the opening position is applied, so the first frame never shows the top.
    visibility: { default: "visible", ":is([data-pending-scroll])": "hidden" },
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "max-content",
    minHeight: "100%",
  },
  item: {
    flexShrink: 0,
    minWidth: 0,
  },
  // Rises in while there's more below, and drops away at the end.
  button: {
    insetBlockEnd: space.md,
    insetInlineStart: "50%",
    opacity: { default: 1, [away]: 0 },
    pointerEvents: { default: "auto", [away]: "none" },
    position: "absolute",
    transform: {
      default: "translateX(-50%)",
      [away]: {
        default: `translate(-50%, ${motion.exitOffset}) scale(${motion.popoverScale})`,
        [media.reducedMotion]: "translateX(-50%)",
      },
    },
    transitionDuration: durations.popover,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: easings.out,
  },
});

/** Holds the scroll state: sticks to the end as messages arrive, and keeps its place when history loads above. */
const MessageScrollerProvider = MessageScrollerPrimitive.Provider;

function MessageScroller({
  sx,
  ...props
}: Styled<ComponentProps<typeof MessageScrollerPrimitive.Root>>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      {...props}
      {...stylex.props(styles.root, sx)}
    />
  );
}

function MessageScrollerViewport({
  sx,
  ...props
}: Styled<ComponentProps<typeof MessageScrollerPrimitive.Viewport>>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      {...props}
      {...stylex.props(styles.viewport, sx)}
    />
  );
}

function MessageScrollerContent({
  sx,
  ...props
}: Styled<ComponentProps<typeof MessageScrollerPrimitive.Content>>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

function MessageScrollerItem({
  scrollAnchor = false,
  sx,
  ...props
}: Styled<ComponentProps<typeof MessageScrollerPrimitive.Item>>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

/** Scrolls to the newest message; shown only while there's more below. */
function MessageScrollerButton({
  sx,
  ...props
}: Styled<
  Omit<
    ComponentProps<typeof MessageScrollerPrimitive.Button>,
    "children" | "direction" | "render"
  >
>) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      {...props}
      render={
        <Button
          aria-label="Scroll to end"
          corners="pill"
          size="icon-sm"
          sx={[styles.button, sx]}
          variant="outline"
        />
      }
    >
      <HugeiconsIcon
        aria-hidden
        icon={ArrowDown02Icon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </MessageScrollerPrimitive.Button>
  );
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
};
export {
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller";
