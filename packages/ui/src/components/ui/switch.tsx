"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  lineHeights,
  media,
  opacities,
  radii,
  shadows,
  sizes,
  strokes,
} from "@/lib/tokens.stylex";

const switchSizes = ["sm", "default", "lg"] as const;

type SwitchSize = (typeof switchSizes)[number];

type SwitchProps = Omit<SwitchPrimitive.Root.Props, "className" | "style"> & {
  size?: SwitchSize;
  sx?: stylex.StyleXStyles;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is([data-disabled])";
const beside =
  ":is([data-orientation='horizontal'] > *, [data-slot='field-label'] > *)";

// The track is the thumb wide twice, and the thumb plus its edge tall; the thumb travels the difference.
const track = (thumb: string) => ({
  height: `calc(${thumb} + 2 * ${strokes.border})`,
  // Beside top-aligned text, the track centers on the label's first line.
  marginBlock: {
    default: null,
    [beside]: `calc((${lineHeights.text} - ${thumb} - 2 * ${strokes.border}) / 2)`,
  },
  width: `calc(2 * ${thumb})`,
  "::before": {
    insetBlock: `calc((${thumb} + 2 * ${strokes.border} - ${sizes.hitArea}) / 2)`,
    insetInline: `calc((2 * ${thumb} - ${sizes.hitArea}) / 2)`,
  },
});

// Held, the thumb stretches a quarter of itself toward where it will go, like a finger
// pressing into it; checked, it stretches back from the end, so it stays inside the track.
const pressed = ":is([data-slot='switch']:active:not([data-disabled]) > *)";

const knob = (thumb: string) => ({
  height: thumb,
  transform: {
    default: "translateX(0)",
    ":is([data-checked])": `translateX(calc(${thumb} - 2 * ${strokes.border}))`,
    [`:is([data-checked])${pressed}`]: `translateX(calc(${thumb} * 3 / 4 - 2 * ${strokes.border}))`,
  },
  width: { default: thumb, [pressed]: `calc(${thumb} * 5 / 4)` },
});

const styles = stylex.create({
  switch: {
    alignItems: "center",
    backgroundColor: {
      default: colors.fillStrong,
      ":is([data-checked])": colors.accent,
    },
    borderBlockColor: { default: "transparent", [invalid]: colors.danger },
    borderInlineColor: { default: "transparent", [invalid]: colors.danger },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: { default: null, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: 0,
    paddingInline: 0,
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: "ease",
    "::before": {
      content: "''",
      position: "absolute",
    },
  },
  default: track(sizes.icon),
  sm: track(sizes.iconXs),
  lg: track(sizes.iconLg),
  thumb: {
    backgroundColor: {
      default: colors.textSecondary,
      ":is([data-checked])": colors.onAccent,
    },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "block",
    pointerEvents: "none",
    // The thumb lands with a little give; the stretch answers the press at once.
    transitionDuration: `${durations.move}, ${durations.press}, ${durations.hover}`,
    transitionProperty: {
      default: "transform, width, background-color",
      [media.reducedMotion]: "background-color",
    },
    transitionTimingFunction: `${easings.overshoot}, ${easings.out}, ease`,
  },
  thumbDefault: knob(sizes.icon),
  thumbSm: knob(sizes.iconXs),
  thumbLg: knob(sizes.iconLg),
});

const sizeStyles = {
  default: [styles.default, styles.thumbDefault],
  lg: [styles.lg, styles.thumbLg],
  sm: [styles.sm, styles.thumbSm],
} satisfies Record<SwitchSize, [stylex.StyleXStyles, stylex.StyleXStyles]>;

function Switch({ size = "default", sx, ...props }: SwitchProps) {
  const [root, thumb] = sizeStyles[size];
  return (
    <SwitchPrimitive.Root
      data-size={size}
      data-slot="switch"
      {...props}
      {...stylex.props(styles.switch, root, sx)}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        {...stylex.props(styles.thumb, thumb)}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchSizes };
export type { SwitchProps, SwitchSize };
