"use client";

import * as stylex from "@stylexjs/stylex";
import {
  SliderControl as SliderControlPrimitive,
  SliderIndicator as SliderIndicatorPrimitive,
  Slider as SliderPrimitive,
  SliderThumb as SliderThumbPrimitive,
  SliderTrack as SliderTrackPrimitive,
  SliderValue as SliderValuePrimitive,
} from "@ui-sdk/react/slider";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
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
  value: {
    color: colors.textSecondary,
    fontVariantNumeric: "tabular-nums",
    gridColumn: 2,
  },
  control: {
    alignItems: "center",
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    gridColumn: "1 / -1",
    height: { default: sizes.controlXxs, [vertical]: "100%" },
    // ui-sdk maps the pointer onto the track, so a thumb centered on either end
    // overhangs into this padding, stays within the bar and still tracks the pointer.
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
      backgroundColor: colors.fillOpaque,
      borderStartStartRadius: radii.full,
      borderStartEndRadius: radii.full,
      borderEndStartRadius: radii.full,
      borderEndEndRadius: radii.full,
      content: "''",
      insetBlockEnd: { default: 0, [vertical]: halfThumbOut },
      insetBlockStart: { default: 0, [vertical]: halfThumbOut },
      insetInlineEnd: { default: halfThumbOut, [vertical]: 0 },
      insetInlineStart: { default: halfThumbOut, [vertical]: 0 },
      position: "absolute",
    },
  },
  // ui-sdk sizes the indicator along the track; the bar reaches back under the start thumb.
  indicator: {
    height: { default: "100%", [vertical]: null },
    width: { default: null, [vertical]: "100%" },
    "::before": {
      backgroundColor: colors.accentSolid,
      borderStartStartRadius: radii.full,
      borderStartEndRadius: radii.full,
      borderEndStartRadius: radii.full,
      borderEndEndRadius: radii.full,
      content: "''",
      insetBlockEnd: { default: 0, [vertical]: halfThumbOut },
      insetBlockStart: 0,
      insetInlineEnd: 0,
      insetInlineStart: { default: halfThumbOut, [vertical]: 0 },
      position: "absolute",
    },
  },
  thumb: {
    backgroundColor: colors.accentSolid,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    boxShadow: shadows.defaultRing,
    height: sizes.thumb,
    // ui-sdk places the thumb with insets and `translate`, so `transform` is free for the press.
    transform: { default: null, ":is([data-dragging])": presses.icon },
    transitionDuration: durations.press,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
    width: sizes.thumb,
    "::before": {
      content: "''",
      insetBlockEnd: `calc((${sizes.thumb} - ${sizes.hitArea}) / 2)`,
      insetBlockStart: `calc((${sizes.thumb} - ${sizes.hitArea}) / 2)`,
      insetInlineEnd: `calc((${sizes.thumb} - ${sizes.hitArea}) / 2)`,
      insetInlineStart: `calc((${sizes.thumb} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
  },
});

function Slider<Value extends number | number[]>({
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderPrimitive<Value>>>) {
  return (
    <SliderPrimitive {...withStyles(props, stylex.props(styles.slider, sx))} />
  );
}

function SliderValue({
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderValuePrimitive>>) {
  return (
    <SliderValuePrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.value], sx)
      )}
    />
  );
}

/** Renders the track, the filled indicator and one thumb. For a range, compose the parts. */
function SliderControl({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderControlPrimitive>>) {
  return (
    <SliderControlPrimitive
      {...withStyles(props, stylex.props(styles.control, sx))}
    >
      {children ?? (
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      )}
    </SliderControlPrimitive>
  );
}

function SliderTrack({
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderTrackPrimitive>>) {
  return (
    <SliderTrackPrimitive
      {...withStyles(props, stylex.props(styles.track, sx))}
    />
  );
}

function SliderIndicator({
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderIndicatorPrimitive>>) {
  return (
    <SliderIndicatorPrimitive
      {...withStyles(props, stylex.props(styles.indicator, sx))}
    />
  );
}

function SliderThumb({
  sx,
  ...props
}: Styled<ComponentProps<typeof SliderThumbPrimitive>>) {
  return (
    <SliderThumbPrimitive
      {...withStyles(props, stylex.props(styles.thumb, sx))}
    />
  );
}

export {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
};
