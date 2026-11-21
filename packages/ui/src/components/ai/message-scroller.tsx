"use client";

import { ArrowDown02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createStickToBottom } from "@ui-sdk/core";
import type { StickToBottomState } from "@ui-sdk/core";
import { mergeProps } from "@ui-sdk/react/primitive";
import { ScrollArea, ScrollAreaViewport } from "@ui-sdk/react/scroll-area";
import {
  createContext,
  use,
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import {
  ScrollBar,
  scrollHideDelay,
} from "@/components/primitives/scroll-area";
import type { Sx } from "@/lib/constella/styles";
import { withStyles } from "@/lib/constella/styles";
import {
  durations,
  easings,
  media,
  motion,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const messageScrollerPositions = ["start", "end"] as const;

type MessageScrollerPosition = (typeof messageScrollerPositions)[number];

interface MessageScrollerScrollOptions {
  behavior?: ScrollBehavior;
}

const anchorRoomVar = "--message-scroller-anchor-room";
const priorTurnPeek = `calc(${space.xl} + ${space.md})`;
const hidden = ":not([data-visible])";
const reducedMotionQuery = media.reducedMotion.slice("@media ".length);

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
  area: {
    height: "100%",
    minHeight: 0,
    width: "100%",
  },
  viewport: {
    contain: "content",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overscrollBehavior: "contain",
    scrollPaddingBlockStart: priorTurnPeek,
    // Hidden until the opening position is applied, so the first frame never shows the top.
    visibility: { default: "visible", ":is([data-pending-scroll])": "hidden" },
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "max-content",
    minHeight: `calc(100% + var(${anchorRoomVar}, 0px))`,
  },
  item: {
    flexShrink: 0,
    minWidth: 0,
  },
  // Rises in while there's more below, and drops away at the end.
  button: {
    insetBlockEnd: space.md,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    marginInlineEnd: "auto",
    marginInlineStart: "auto",
    opacity: { default: 1, [hidden]: 0 },
    pointerEvents: { default: "auto", [hidden]: "none" },
    position: "absolute",
    transform: {
      default: "none",
      [hidden]: {
        default: `translateY(${motion.exitOffset}) scale(${motion.popoverScale})`,
        [media.reducedMotion]: "none",
      },
    },
    transitionDuration: durations.popover,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: easings.out,
  },
});

const scrollTopOf = (scroller: HTMLElement, element: HTMLElement) =>
  element.getBoundingClientRect().top -
  scroller.getBoundingClientRect().top +
  scroller.scrollTop -
  (Number.parseFloat(getComputedStyle(scroller).scrollPaddingBlockStart) || 0);

function createMessageScroller(position: MessageScrollerPosition) {
  const stick = createStickToBottom({ initial: position === "end" });
  const messages = new Map<string, HTMLElement>();
  let viewport: HTMLElement | undefined;
  let content: HTMLElement | undefined;

  return {
    position,
    getState: stick.get,
    subscribe: (listener: () => void) => stick.subscribe(listener),
    connect(element: HTMLElement) {
      viewport = element;
      const disconnect = stick.connect(element);
      return () => {
        disconnect();
        viewport = undefined;
      };
    },
    holdContent: (element: HTMLElement) => {
      content = element;
      return () => {
        content = undefined;
      };
    },
    register(messageId: string, element: HTMLElement) {
      messages.set(messageId, element);
      return () => {
        if (messages.get(messageId) === element) {
          messages.delete(messageId);
        }
      };
    },
    pinQuestionToTop(element: HTMLElement) {
      if (!viewport) {
        return;
      }
      viewport.style.setProperty(
        anchorRoomVar,
        `${Math.max(0, scrollTopOf(viewport, element))}px`
      );
      stick.scrollToBottom();
      stick.release();
    },
    jumpToEnd(fromKeyboard: boolean) {
      stick.scrollToBottom({
        behavior:
          fromKeyboard || matchMedia(reducedMotionQuery).matches
            ? "instant"
            : "smooth",
      });
    },
    focusLog() {
      content?.focus({ preventScroll: true });
    },
    actions: {
      prepend: () => {
        stick.prepend();
      },
      scrollToEnd: (options?: MessageScrollerScrollOptions) => {
        stick.scrollToBottom(options);
      },
      scrollToMessage: (
        messageId: string,
        options?: MessageScrollerScrollOptions
      ) => {
        const element = messages.get(messageId);
        if (!viewport || !element) {
          return;
        }
        stick.release();
        viewport.scrollTo({ ...options, top: scrollTopOf(viewport, element) });
      },
      scrollToStart: (options?: MessageScrollerScrollOptions) => {
        stick.release();
        viewport?.scrollTo({ ...options, top: 0 });
      },
    },
  };
}

type Scroller = ReturnType<typeof createMessageScroller>;

const ScrollerContext = createContext<Scroller | null>(null);

function useScroller() {
  const scroller = use(ScrollerContext);
  if (!scroller) {
    throw new Error(
      "Message Scroller parts must be inside a MessageScrollerProvider."
    );
  }
  return scroller;
}

/** Holds the scroll state: sticks to the end as messages arrive, and keeps its place when history loads above. */
function MessageScrollerProvider({
  children,
  defaultScrollPosition = "end",
}: {
  children?: ReactNode;
  defaultScrollPosition?: MessageScrollerPosition;
}) {
  // oxlint-disable-next-line react/hook-use-state -- created once per mount and never set
  const [scroller] = useState(() =>
    createMessageScroller(defaultScrollPosition)
  );
  return <ScrollerContext value={scroller}>{children}</ScrollerContext>;
}

function useMessageScroller() {
  return useScroller().actions;
}

function useMessageScrollerState(): StickToBottomState {
  const { getState, subscribe } = useScroller();
  return useSyncExternalStore(subscribe, getState, getState);
}

function MessageScroller({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="message-scroller"
      {...withStyles(props, stylex.props(styles.root, sx))}
    />
  );
}

/** The element that scrolls, with Scroll Area's bar. It's a tab stop only while it overflows and holds no control. */
function MessageScrollerViewport({
  "aria-label": label = "Messages",
  children,
  sx,
  ...props
}: Styled<ComponentProps<"section">>) {
  const scroller = useScroller();
  const [pending, setPending] = useState(scroller.position === "end");
  const connect = useCallback(
    (element: HTMLElement) => {
      const disconnect = scroller.connect(element);
      setPending(false);
      return disconnect;
    },
    [scroller]
  );

  return (
    <ScrollArea
      scrollHideDelay={scrollHideDelay}
      {...stylex.props(styles.area)}
    >
      <ScrollAreaViewport
        render={
          <section
            aria-label={label}
            data-pending-scroll={pending ? "" : undefined}
            data-slot="message-scroller-viewport"
            {...mergeProps(props, { ref: connect })}
          />
        }
        {...stylex.props(styles.viewport, sx)}
      >
        {children}
      </ScrollAreaViewport>
      <ScrollBar />
    </ScrollArea>
  );
}

function MessageScrollerContent({
  sx,
  ...props
}: Styled<ComponentProps<"div">>) {
  const scroller = useScroller();
  return (
    <div
      aria-relevant="additions"
      data-slot="message-scroller-content"
      role="log"
      tabIndex={-1}
      {...mergeProps(withStyles(props, stylex.props(styles.content, sx)), {
        ref: scroller.holdContent,
      })}
    />
  );
}

function MessageScrollerItem({
  messageId,
  scrollAnchor = false,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & {
  messageId: string;
  scrollAnchor?: boolean;
}) {
  const scroller = useScroller();
  const register = useCallback(
    (element: HTMLDivElement) => {
      if (scrollAnchor) {
        scroller.pinQuestionToTop(element);
      }
      return scroller.register(messageId, element);
    },
    [messageId, scrollAnchor, scroller]
  );

  return (
    <div
      data-slot="message-scroller-item"
      {...mergeProps(withStyles(props, stylex.props(styles.item, sx)), {
        ref: register,
      })}
    />
  );
}

/** Scrolls to the newest message; shown only while there's more below. */
function MessageScrollerButton({
  "aria-label": label = "Scroll to end",
  onClick,
  sx,
  ...props
}: Omit<
  ComponentProps<typeof Button>,
  "children" | "render" | "size" | "variant"
>) {
  const scroller = useScroller();
  const { following, atBottom, unseen } = useMessageScrollerState();
  const visible = !following && !atBottom;
  return (
    <Button
      aria-label={label}
      data-slot="message-scroller-button"
      data-unseen={unseen ? "" : undefined}
      data-visible={visible ? "" : undefined}
      inert={!visible}
      onClick={(event, details) => {
        onClick?.(event, details);
        if (!event.defaultPrevented) {
          const button = event.currentTarget;
          scroller.jumpToEnd(details.source === "keyboard");
          if (button.ownerDocument.activeElement === button) {
            scroller.focusLog();
          }
        }
      }}
      size="icon-sm"
      sx={[styles.button, sx]}
      variant="outline"
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={ArrowDown02Icon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </Button>
  );
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  messageScrollerPositions,
  useMessageScroller,
  useMessageScrollerState,
};
export type { MessageScrollerPosition, MessageScrollerScrollOptions };
