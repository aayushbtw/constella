"use client";

import * as stylex from "@stylexjs/stylex";
import {
  HoverCardContent as HoverCardContentPrimitive,
  HoverCard as HoverCardPrimitive,
  HoverCardTrigger as HoverCardTriggerPrimitive,
} from "@ui-sdk/react/hover-card";
import type {
  HoverCardController,
  HoverCardProps,
} from "@ui-sdk/react/hover-card";
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps } from "react";
import { flushSync } from "react-dom";

import { popoverStyles } from "@/components/primitives/popover";
import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  media,
  motion,
  offsets,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type HoverCardTriggerProps<Payload> = Styled<
  Omit<
    ComponentProps<typeof HoverCardTriggerPrimitive>,
    "controller" | "payload"
  >
> & {
  controller?: HoverCardController<Payload>;
  payload?: NoInfer<Payload>;
};

type HoverCardContentProps<Payload = unknown> = Styled<
  ComponentProps<typeof HoverCardContentPrimitive<Payload>>
>;

const offstage = ":is([data-starting-style], [data-ending-style])";
const closing = ":is([data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const gliding =
  ":is([data-moving]):not([data-ending-style], [data-skip-motion])";

const styles = stylex.create({
  surface: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
    maxWidth: "var(--available-width)",
    paddingBlock: space.popup,
    paddingInline: space.popup,
    width: sizes.popover,
  },
  // Moving between triggers that share one card, it glides to the new one. Only then, or it
  // would trail its trigger on scroll.
  motion: {
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
      [instant]: "0s",
      [gliding]: `${durations.popover}, ${durations.popover}, ${durations.move}, ${durations.move}`,
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
      [gliding]: {
        default: "opacity, transform, top, left",
        [media.reducedMotion]: "opacity",
      },
    },
    transitionTimingFunction: easings.out,
  },
});

// ui-sdk takes bare milliseconds; the tokens carry `ms`.
const openDelay = Number(durations.hoverCardDelay.slice(0, -"ms".length));
const closeAfter = Number(durations.hoverCardCloseDelay.slice(0, -"ms".length));
const moveFor = Number(durations.move.slice(0, -"ms".length));

const Motion = createContext({ moving: false, skip: false });

function HoverCard({
  closeDelay = closeAfter,
  delay = openDelay,
  onOpenChange,
  onPayloadChange,
  ...props
}: HoverCardProps) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  const [moving, setMoving] = useState(false);
  const isOpen = useRef(false);
  const settle = useRef(0);
  const state = useMemo(() => ({ moving, skip }), [moving, skip]);

  useEffect(
    () => () => {
      clearTimeout(settle.current);
    },
    []
  );

  return (
    <Motion value={state}>
      <HoverCardPrimitive
        closeDelay={closeDelay}
        delay={delay}
        onOpenChange={(open, details) => {
          handleOpenChange(open, details);
          if (details.canceled) {
            return;
          }
          isOpen.current = open;
          if (!open) {
            clearTimeout(settle.current);
            setMoving(false);
          }
        }}
        onPayloadChange={(payload, details) => {
          onPayloadChange?.(payload, details);
          if (
            details.canceled ||
            !isOpen.current ||
            details.reason === "trigger-focus"
          ) {
            return;
          }
          // ui-sdk rewrites the inset right after this callback, so the transition has to be on first.
          flushSync(() => {
            setMoving(true);
          });
          clearTimeout(settle.current);
          settle.current = window.setTimeout(() => {
            setMoving(false);
          }, moveFor);
        }}
        {...props}
      />
    </Motion>
  );
}

function HoverCardTrigger<Payload = unknown>({
  sx,
  ...props
}: HoverCardTriggerProps<Payload>) {
  return <HoverCardTriggerPrimitive {...props} {...stylex.props(sx)} />;
}

function HoverCardContent<Payload = unknown>({
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: HoverCardContentProps<Payload>) {
  const { moving, skip } = use(Motion);
  return (
    <HoverCardContentPrimitive<Payload>
      data-moving={moving || undefined}
      data-skip-motion={skip || undefined}
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(
        [typeStyles.textSm, popoverStyles.popup, styles.surface],
        styles.motion,
        sx
      )}
    />
  );
}

export { createHoverCardController } from "@ui-sdk/react/hover-card";
export type { HoverCardController } from "@ui-sdk/react/hover-card";
export { HoverCard, HoverCardContent, HoverCardTrigger };
export type { HoverCardContentProps, HoverCardTriggerProps };
