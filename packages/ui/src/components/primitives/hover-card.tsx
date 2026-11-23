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
import { popupMotion, useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { popupSurface, typeStyles, withStyles } from "@/lib/constella/styles";
import {
  durations,
  offsets,
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

const styles = stylex.create({
  surface: {
    maxWidth: "var(--available-width)",
    paddingBlock: space.popup,
    paddingInline: space.popup,
    width: sizes.popover,
  },
});

const openDelay = Number.parseFloat(durations.hoverCardDelay);
const closeAfter = Number.parseFloat(durations.hoverCardCloseDelay);
const moveFor = Number.parseFloat(durations.move);

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
  const isOpen = useRef(props.open ?? props.defaultOpen ?? false);
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
        onOpenChange={(nextOpen, details) => {
          handleOpenChange(nextOpen, details);
          if (details.canceled) {
            return;
          }
          isOpen.current = nextOpen;
          if (!nextOpen) {
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
  return <HoverCardTriggerPrimitive {...withStyles(props, stylex.props(sx))} />;
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
      {...withStyles(
        props,
        stylex.props(
          [
            typeStyles.textSm,
            popoverStyles.popup,
            popupSurface.base,
            styles.surface,
          ],
          popupMotion.popover,
          popupMotion.glide,
          sx
        )
      )}
    />
  );
}

export { createHoverCardController } from "@ui-sdk/react/hover-card";
export type { HoverCardController } from "@ui-sdk/react/hover-card";
export { HoverCard, HoverCardContent, HoverCardTrigger };
export type { HoverCardContentProps, HoverCardTriggerProps };
