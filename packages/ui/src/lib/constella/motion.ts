import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { flushSync } from "react-dom";

import {
  durations,
  easings,
  media,
  motion,
  space,
} from "@/lib/constella/tokens.stylex";

interface OpenChangeDetails {
  reason: string;
  source: string;
}

// ui-sdk marks no change `data-instant` outside Tooltip, but reports how each one came about.
function skipsMotion(_open: boolean, { reason, source }: OpenChangeDetails) {
  return (
    source === "keyboard" || reason === "focus-out" || reason === "item-press"
  );
}

/** Wraps a popup root's `onOpenChange`; `skip` is true while `skips` holds, by default while the keyboard, Esc or a picked item moved it. */
function useSkipMotion<Details extends OpenChangeDetails>(
  onOpenChange?: (open: boolean, details: Details) => void,
  skips: (open: boolean, details: Details) => boolean = skipsMotion
) {
  const [skip, setSkip] = useState(false);
  function handleOpenChange(open: boolean, details: Details) {
    const next = skips(open, details);
    if (next !== skip) {
      // ui-sdk reads the content's transitions right after this callback, so the attribute lands first.
      flushSync(() => {
        setSkip(next);
      });
    }
    onOpenChange?.(open, details);
  }
  return [skip, handleOpenChange] as const;
}

// ui-sdk holds `data-starting-style` a frame on an instant open, so a skipped one is never offstage.
const offstage =
  ":is([data-starting-style], [data-ending-style]):not([data-skip-motion])";
const closing = ":is([data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const gliding =
  ":is([data-moving]):not([data-ending-style], [data-skip-motion])";
// Tooltip also skips on ui-sdk's `data-instant`, which stays set while closing, and a close still fades.
const tooltipOffstage =
  ":is([data-starting-style], [data-ending-style]):not([data-instant][data-open], [data-skip-motion])";
const tooltipInstant = ":is([data-instant][data-open], [data-skip-motion])";
const stack = "var(--dialog-stack, 0)";
const stepBackUnderStack = `translateY(calc(${stack} * -1 * ${space.sm})) scale(calc(1 - ${stack} * ${motion.stackScale}))`;

const popoverDuration = {
  default: durations.popover,
  [closing]: durations.popoverExit,
  [instant]: "0s",
};
const scaleProperty = {
  default: "opacity, transform",
  [media.reducedMotion]: "opacity",
};

/** Every popup's open and close, keyed off ui-sdk's `data-starting-style` and `useSkipMotion`'s `data-skip-motion`. */
const popupMotion = stylex.create({
  popover: {
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: popoverDuration,
    transitionProperty: scaleProperty,
    transitionTimingFunction: easings.out,
  },
  glide: {
    transitionDuration: {
      ...popoverDuration,
      [gliding]: `${durations.popover}, ${durations.popover}, ${durations.move}, ${durations.move}`,
    },
    transitionProperty: {
      ...scaleProperty,
      [gliding]: {
        default: "opacity, transform, top, left",
        [media.reducedMotion]: "opacity",
      },
    },
  },
  submenu: {
    transform: "none",
    transitionDuration: { default: durations.popoverExit, [instant]: "0s" },
    transitionProperty: "opacity",
  },
  dialog: {
    opacity: { default: 1, [offstage]: 0 },
    transform: {
      default: stepBackUnderStack,
      [offstage]: `scale(${motion.dialogScale})`,
    },
    transitionDuration: { default: durations.dialog, [instant]: 0 },
    transitionProperty: scaleProperty,
    transitionTimingFunction: easings.out,
  },
  backdrop: {
    opacity: { default: 1, [offstage]: 0 },
    transitionDuration: { default: durations.dialog, [instant]: 0 },
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
  },
  tooltip: {
    opacity: { default: 1, [tooltipOffstage]: 0 },
    transform: {
      default: "none",
      [tooltipOffstage]: `scale(${motion.popoverScale})`,
    },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: { default: durations.hover, [tooltipInstant]: "0s" },
    transitionProperty: scaleProperty,
    transitionTimingFunction: easings.out,
  },
});

export { popupMotion, skipsMotion, useSkipMotion };
