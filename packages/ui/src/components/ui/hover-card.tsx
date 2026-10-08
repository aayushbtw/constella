"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  layers,
  media,
  motion,
  offsets,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type HoverCardContentProps = Styled<PreviewCardPrimitive.Popup.Props> &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

const offstage = ":is([data-starting-style], [data-ending-style])";
const closing = ":is([data-ending-style]):not([data-instant])";
const instant = ":is([data-instant])";

// shadcn's padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  // Moving between triggers that share one card, it glides to the new one.
  positioner: {
    transitionDuration: {
      default: durations.move,
      [instant]: "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "top, left, right, bottom",
    transitionTimingFunction: easings.out,
    zIndex: layers.popover,
  },
  // A popover's surface and motion.
  popup: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.popover,
    boxSizing: "border-box",
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    // Base UI measures each trigger's content, so the card can grow to the next one's height.
    height: "var(--popup-height, auto)",
    maxWidth: "var(--available-width)",
    opacity: { default: 1, [offstage]: 0 },
    paddingBlockEnd: px10,
    paddingBlockStart: px10,
    paddingInlineEnd: px10,
    paddingInlineStart: px10,
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: `${durations.popover}, ${durations.popover}, ${durations.move}`,
      [closing]: durations.popoverExit,
      [instant]: "0s",
    },
    transitionProperty: {
      default: "opacity, transform, height",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: sizes.popover,
  },
  viewport: {
    height: "100%",
    overflow: "clip",
    position: "relative",
  },
});

/** One card several triggers share: pass it to `HoverCard` and each `HoverCardTrigger` as `handle`. */
const createHoverCardHandle = PreviewCardPrimitive.createHandle;

/** Its children can be a function of the open trigger's `payload`. */
function HoverCard<Payload>(props: PreviewCardPrimitive.Root.Props<Payload>) {
  return <PreviewCardPrimitive.Root {...props} />;
}

// Base UI takes bare milliseconds; the tokens carry `ms`.
const openDelay = Number(durations.hoverCardDelay.slice(0, -"ms".length));
const closeAfter = Number(durations.hoverCardCloseDelay.slice(0, -"ms".length));

function HoverCardTrigger<Payload>({
  closeDelay = closeAfter,
  delay = openDelay,
  ...props
}: PreviewCardPrimitive.Trigger.Props<Payload>) {
  return (
    <PreviewCardPrimitive.Trigger
      closeDelay={closeDelay}
      data-slot="hover-card-trigger"
      delay={delay}
      {...props}
    />
  );
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function HoverCardContent({
  align = "center",
  alignOffset = 0,
  children,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: HoverCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          {...props}
          {...stylex.props(styles.popup, sx)}
        >
          <PreviewCardPrimitive.Viewport
            data-slot="hover-card-viewport"
            {...stylex.props(styles.viewport)}
          >
            {children}
          </PreviewCardPrimitive.Viewport>
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { createHoverCardHandle, HoverCard, HoverCardContent, HoverCardTrigger };
export type { HoverCardContentProps };
