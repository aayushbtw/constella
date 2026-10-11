"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useState } from "react";

import { useSkipMotion } from "@/lib/motion";
import { durations, easings, media } from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const offstage = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  // Content below has to make room, so the panel grows to Base UI's measured height.
  content: {
    height: {
      default: "var(--collapsible-panel-height)",
      [offstage]: 0,
    },
    opacity: { default: 1, [offstage]: 0 },
    overflow: "hidden",
    transitionDuration: {
      default: durations.layout,
      [media.reducedMotion]: "0s",
      ":is([data-collapsible-instant])": "0s",
    },
    transitionProperty: "height, opacity",
    transitionTimingFunction: easings.layout,
  },
});

// Per root, so a nested collapsible opened by keyboard doesn't snap its parent.
const Instant = createContext(false);

function Collapsible({
  onOpenChange,
  open,
  ...props
}: CollapsiblePrimitive.Root.Props) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  const [toggledTo, setToggledTo] = useState<boolean>();
  // A later change from the app's `open` isn't the keyboard's, so it animates.
  const instant = skip && (open === undefined || open === toggledTo);
  return (
    <Instant value={instant}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        onOpenChange={(next, details) => {
          setToggledTo(next);
          handleOpenChange(next, details);
        }}
        open={open}
        {...props}
      />
    </Instant>
  );
}

/** Carries `data-collapsible-instant` after a keyboard toggle, so its own icons can snap too. */
function CollapsibleTrigger(props: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-collapsible-instant={use(Instant) || undefined}
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  sx,
  ...props
}: Styled<CollapsiblePrimitive.Panel.Props>) {
  return (
    <CollapsiblePrimitive.Panel
      data-collapsible-instant={use(Instant) || undefined}
      data-slot="collapsible-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
