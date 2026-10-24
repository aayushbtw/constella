"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type SegmentedControlProps<Value extends string> = Styled<
  Omit<
    ToggleGroupPrimitive.Props<Value>,
    "multiple" | "onValueChange" | "value"
  >
> & {
  value: Value;
  onValueChange: (value: Value) => void;
};

interface Place {
  x: number;
  width: number;
}

const styles = stylex.create({
  root: {
    display: "flex",
    position: "relative",
    width: "fit-content",
  },
  // Reads like a tab: the pill behind it, not its own fill, marks the pick.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":is([data-pressed]):not([data-placed] *)": colors.fill,
    },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: {
      default: colors.textSecondary,
      ":is([data-pressed])": colors.textPrimary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover:not(:disabled)": colors.textPrimary,
        ":is([data-pressed])": colors.textPrimary,
      },
    },
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    display: "inline-flex",
    fontWeight: fontWeights.semimedium,
    height: sizes.controlSm,
    opacity: { default: 1, ":disabled": opacities.disabled },
    paddingInline: space.sm,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    zIndex: 1,
  },
  indicator: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: sizes.controlSm,
    left: 0,
    position: "absolute",
    top: 0,
    // Arrow keys move focus visibly and a click doesn't, so only the pointer slides it.
    transitionDuration: {
      default: durations.move,
      ":is([data-slot='segmented-control']:has(:focus-visible) > *)": "0s",
      [media.reducedMotion]: "0s",
    },
    transitionProperty: "transform, width",
    transitionTimingFunction: easings.inOut,
  },
  place: (x: number, width: number) => ({
    transform: `translateX(${x}px)`,
    width,
  }),
});

/** One pick among a few, marked by a pill that slides to it, as a tab's does. */
function SegmentedControl<Value extends string>({
  children,
  onValueChange,
  sx,
  value,
  ...props
}: SegmentedControlProps<Value>) {
  const root = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<Place | null>(null);

  useLayoutEffect(() => {
    const element = root.current;
    const measure = () => {
      const pressed = element?.querySelector<HTMLElement>("[data-pressed]");
      setPlace(
        pressed === null || pressed === undefined
          ? null
          : { x: pressed.offsetLeft, width: pressed.offsetWidth }
      );
    };
    measure();
    // A new pick moves the pill; webfonts and container changes move the items.
    const picks = new MutationObserver(measure);
    const resizes = new ResizeObserver(measure);
    if (element !== null) {
      picks.observe(element, {
        attributeFilter: ["data-pressed"],
        subtree: true,
      });
      resizes.observe(element);
    }
    return () => {
      picks.disconnect();
      resizes.disconnect();
    };
  }, []);

  return (
    <ToggleGroupPrimitive
      data-placed={place === null ? undefined : ""}
      data-slot="segmented-control"
      onValueChange={(next) => {
        const [picked] = next;
        if (picked !== undefined) {
          onValueChange(picked);
        }
      }}
      ref={root}
      value={[value]}
      {...props}
      {...stylex.props([typeStyles.textSm, styles.root], sx)}
    >
      {place === null ? null : (
        <span
          aria-hidden
          {...stylex.props(
            styles.indicator,
            styles.place(place.x, place.width)
          )}
        />
      )}
      {children}
    </ToggleGroupPrimitive>
  );
}

function SegmentedControlItem({ sx, ...props }: Styled<TogglePrimitive.Props>) {
  return (
    <TogglePrimitive
      data-slot="segmented-control-item"
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
export type { SegmentedControlProps };
