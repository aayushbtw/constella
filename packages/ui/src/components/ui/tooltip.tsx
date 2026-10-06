"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  layers,
  lineHeights,
  media,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const offstage = ":is([data-starting-style], [data-ending-style])";

const styles = stylex.create({
  positioner: {
    zIndex: layers.tooltip,
  },
  popup: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    color: colors.onAccent,
    display: "flex",
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    lineHeight: lineHeights.row,
    maxWidth: sizes.tooltip,
    opacity: { default: 1, [offstage]: 0 },
    paddingBlock: space.xxs,
    paddingInlineEnd: {
      default: space.xs,
      ":has(> [data-slot^='kbd']:last-child)": space.xxs,
    },
    paddingInlineStart: space.xs,
    transform: { default: "none", [offstage]: "scale(0.96)" },
    transformOrigin: "var(--transform-origin)",
    // Once one tooltip is open, the next opens at once, so moving along a toolbar stays quick.
    transitionDuration: {
      default: durations.hover,
      ":is([data-instant])": "0s",
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
});

function TooltipProvider(props: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger({
  // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("300ms")` is NaN
  delay = Number.parseFloat(durations.tooltipDelay),
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay}
      {...props}
    />
  );
}

function TooltipPortal(props: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
}

function TooltipPositioner({
  // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("8px")` is NaN
  sideOffset = Number.parseFloat(space.xs),
  sx,
  ...props
}: Styled<TooltipPrimitive.Positioner.Props>) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(styles.positioner, sx)}
    />
  );
}

function TooltipPopup({ sx, ...props }: Styled<TooltipPrimitive.Popup.Props>) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-popup"
      {...props}
      {...stylex.props(styles.popup, sx)}
    />
  );
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function TooltipContent({
  align,
  alignOffset,
  side,
  sideOffset,
  ...props
}: Styled<TooltipPrimitive.Popup.Props> &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPortal>
      <TooltipPositioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPopup {...props} />
      </TooltipPositioner>
    </TooltipPortal>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
};
