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

type PreviewCardContentProps = Styled<PreviewCardPrimitive.Popup.Props> &
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
  positioner: {
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
    maxWidth: "var(--available-width)",
    opacity: { default: 1, [offstage]: 0 },
    paddingBlockEnd: px10,
    paddingBlockStart: px10,
    paddingInlineEnd: px10,
    paddingInlineStart: px10,
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
      [instant]: "0s",
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: sizes.popover,
  },
});

function PreviewCard(props: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root {...props} />;
}

function PreviewCardTrigger(props: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
  );
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function PreviewCardContent({
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PreviewCardContentProps) {
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
          data-slot="preview-card-content"
          {...props}
          {...stylex.props(styles.popup, sx)}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { PreviewCard, PreviewCardContent, PreviewCardTrigger };
export type { PreviewCardContentProps };
