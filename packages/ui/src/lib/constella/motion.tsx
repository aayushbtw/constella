import * as stylex from "@stylexjs/stylex";
import { createContext, use, useState } from "react";
import type { ReactNode } from "react";
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
  function reset() {
    setSkip(false);
  }
  return [skip, handleOpenChange, reset] as const;
}

interface OpenChangeHandlers<Details extends OpenChangeDetails> {
  onOpenChange?: (open: boolean, details: Details) => void;
  onOpenChangeComplete?: (open: boolean) => void;
}

interface SkipMotionProps<
  Details extends OpenChangeDetails,
> extends OpenChangeHandlers<Details> {
  children: (handlers: Required<OpenChangeHandlers<Details>>) => ReactNode;
  /** Also skips while the enclosing root of the same family does, as a submenu under its menu. */
  inherit?: boolean;
  skips?: (open: boolean, details: Details) => boolean;
}

/** One popup family's skip: its root wraps its open-change handlers here, and its parts read the value for `data-skip-motion`. */
function createSkipMotion() {
  const Skip = createContext(false);
  function SkipMotion<Details extends OpenChangeDetails>({
    children,
    inherit = false,
    onOpenChange,
    onOpenChangeComplete,
    skips,
  }: SkipMotionProps<Details>) {
    const inherited = use(Skip);
    const [skip, handleOpenChange, reset] = useSkipMotion(onOpenChange, skips);
    // A controlled `open` fires no onOpenChange, so the next open must not keep the last close's skip.
    function handleOpenChangeComplete(open: boolean) {
      if (!open) {
        reset();
      }
      onOpenChangeComplete?.(open);
    }
    return (
      <Skip value={(inherit && inherited) || skip}>
        {children({
          onOpenChange: handleOpenChange,
          onOpenChangeComplete: handleOpenChangeComplete,
        })}
      </Skip>
    );
  }
  function useSkip() {
    return use(Skip);
  }
  return [SkipMotion, useSkip] as const;
}

// ui-sdk holds `data-starting-style` a frame on an instant open, so a skipped one is never offstage.
const offstage =
  ":is([data-starting-style], [data-ending-style]):not([data-skip-motion])";
const entering = ":is([data-starting-style]):not([data-skip-motion])";
const closing = ":is([data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const skippedOpenOrClose =
  ":is([data-starting-style], [data-ending-style])[data-skip-motion]";
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
    transitionDuration: { default: durations.dialog, [skippedOpenOrClose]: 0 },
    transitionProperty: scaleProperty,
    transitionTimingFunction: easings.out,
  },
  sidePanel: {
    opacity: { default: 1, [entering]: 0 },
    transform: {
      default: "none",
      [entering]: {
        default: `translateX(${space.sm})`,
        [media.reducedMotion]: "none",
      },
    },
    transitionDuration: { default: durations.dialog, [instant]: 0 },
    transitionProperty: "opacity, transform",
    transitionTimingFunction: easings.layout,
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

export { createSkipMotion, popupMotion, skipsMotion, useSkipMotion };
