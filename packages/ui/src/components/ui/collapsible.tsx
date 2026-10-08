"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";

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
    },
    transitionProperty: "height, opacity",
    transitionTimingFunction: easings.layout,
  },
});

function Collapsible(props: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger(props: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

function CollapsibleContent({
  sx,
  ...props
}: Styled<CollapsiblePrimitive.Panel.Props>) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
