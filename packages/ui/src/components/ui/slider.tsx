"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const halfThumb = `calc(${sizes.thumb} / 2)`;
const halfThumbOut = `calc(${sizes.thumb} / -2)`;
const vertical = ":is([data-orientation='vertical'])";

const styles = stylex.create({
  // Label and value share the first row; the control spans the second.
  slider: {
    alignItems: "center",
    columnGap: space.sm,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    width: { default: "100%", [vertical]: "auto" },
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  value: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    gridColumn: 2,
  },
  control: {
    alignItems: "center",
    cursor: { default: "pointer", ":is([data-disabled])": "default" },
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    gridColumn: "1 / -1",
    height: { default: sizes.controlXxs, [vertical]: "100%" },
    // Centered thumbs need no measuring, so they render before hydration; Base UI maps the
    // pointer inside this padding, so the thumb stays within the bar and still tracks the pointer.
    paddingBlock: { default: 0, [vertical]: halfThumb },
    paddingInline: { default: halfThumb, [vertical]: 0 },
    touchAction: "none",
    userSelect: "none",
    width: { default: null, [vertical]: sizes.controlXxs },
  },
  // The bar reaches past the track into the control's padding, under the thumb at either end.
  track: {
    height: { default: strokes.track, [vertical]: "100%" },
    position: "relative",
    width: { default: "100%", [vertical]: strokes.track },
    "::before": {
      backgroundColor: colors.fill,
      borderRadius: radii.full,
      content: "''",
      insetBlock: { default: 0, [vertical]: halfThumbOut },
      insetInline: { default: halfThumbOut, [vertical]: 0 },
      position: "absolute",
    },
  },
  // Base UI sizes the indicator along the track; the bar reaches back under the start thumb.
  indicator: {
    height: { default: "100%", [vertical]: null },
    width: { default: null, [vertical]: "100%" },
    "::before": {
      backgroundColor: colors.accent,
      borderRadius: radii.full,
      content: "''",
      insetBlockEnd: { default: 0, [vertical]: halfThumbOut },
      insetBlockStart: 0,
      insetInlineEnd: 0,
      insetInlineStart: { default: halfThumbOut, [vertical]: 0 },
      position: "absolute",
    },
  },
  thumb: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    boxShadow: shadows.thumb,
    height: sizes.thumb,
    // Base UI positions the thumb with `translate`, so `transform` is free for the press.
    transform: { default: null, ":is([data-dragging])": presses.icon },
    transitionDuration: durations.press,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
    width: sizes.thumb,
    "::before": {
      content: "''",
      inset: `calc((${sizes.thumb} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
  },
});

function Slider<Value extends number | readonly number[]>({
  sx,
  ...props
}: Styled<SliderPrimitive.Root.Props<Value>>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      {...props}
      {...stylex.props(styles.slider, sx)}
    />
  );
}

function SliderLabel({ sx, ...props }: Styled<SliderPrimitive.Label.Props>) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function SliderValue({ sx, ...props }: Styled<SliderPrimitive.Value.Props>) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

/** Renders the track, the filled indicator and one thumb. For a range, compose the parts. */
function SliderControl({
  children,
  sx,
  ...props
}: Styled<SliderPrimitive.Control.Props>) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      {...props}
      {...stylex.props(styles.control, sx)}
    >
      {children ?? (
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      )}
    </SliderPrimitive.Control>
  );
}

function SliderTrack({ sx, ...props }: Styled<SliderPrimitive.Track.Props>) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      {...props}
      {...stylex.props(styles.track, sx)}
    />
  );
}

function SliderIndicator({
  sx,
  ...props
}: Styled<SliderPrimitive.Indicator.Props>) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      {...props}
      {...stylex.props(styles.indicator, sx)}
    />
  );
}

function SliderThumb({ sx, ...props }: Styled<SliderPrimitive.Thumb.Props>) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      {...props}
      {...stylex.props(styles.thumb, sx)}
    />
  );
}

export {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
};
