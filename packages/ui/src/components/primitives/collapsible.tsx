"use client";

import * as stylex from "@stylexjs/stylex";
import {
  CollapsiblePanel as CollapsiblePanelPrimitive,
  Collapsible as CollapsiblePrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
} from "@ui-sdk/react/collapsible";
import { createContext, use, useState } from "react";
import type { ComponentProps } from "react";

import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { durations, easings, media } from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const closing = ":is([data-ending-style])";
// A keyboard open has no from-state, so its first frame is already open.
const opening = ":is([data-starting-style]):not([data-collapsible-instant])";

const styles = stylex.create({
  // Content below has to make room, so the panel grows to ui-sdk's measured height.
  content: {
    height: {
      default: "var(--collapsible-panel-height)",
      [closing]: 0,
      [opening]: 0,
    },
    opacity: { default: 1, [closing]: 0, [opening]: 0 },
    overflow: "hidden",
    // Shutting is quicker and drops the gentle settle, whose long tail reads as stuck.
    transitionDuration: {
      default: durations.layout,
      ":is([data-ending-style]):not([data-collapsible-instant])": {
        default: durations.layoutExit,
        [media.reducedMotion]: "0s",
      },
      [media.reducedMotion]: "0s",
      ":is([data-collapsible-instant])": "0s",
    },
    transitionProperty: "height, opacity",
    transitionTimingFunction: {
      default: easings.layout,
      ":is([data-ending-style])": easings.out,
    },
  },
});

// Per root, so a nested collapsible opened by keyboard doesn't snap its parent.
const Instant = createContext(false);

function Collapsible({
  onOpenChange,
  open,
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsiblePrimitive>>) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  const [toggledTo, setToggledTo] = useState<boolean>();
  // A later change from the app's `open` isn't the keyboard's, so it animates.
  const instant = skip && (open === undefined || open === toggledTo);
  return (
    <Instant value={instant}>
      <CollapsiblePrimitive
        onOpenChange={(next, details) => {
          setToggledTo(next);
          handleOpenChange(next, details);
        }}
        open={open}
        {...props}
        {...stylex.props(sx)}
      />
    </Instant>
  );
}

/** Carries `data-collapsible-instant` after a keyboard toggle, so its own icons can snap too. */
function CollapsibleTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsibleTriggerPrimitive>>) {
  return (
    <CollapsibleTriggerPrimitive
      data-collapsible-instant={use(Instant) || undefined}
      {...props}
      {...stylex.props(sx)}
    />
  );
}

function CollapsibleContent({
  sx,
  ...props
}: Styled<ComponentProps<typeof CollapsiblePanelPrimitive>>) {
  return (
    <CollapsiblePanelPrimitive
      data-collapsible-instant={use(Instant) || undefined}
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
