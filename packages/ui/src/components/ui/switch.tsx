"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  lineHeights,
  opacities,
  radii,
  shadows,
  sizes,
  strokes,
} from "@/lib/tokens.stylex";

const switchSizes = ["sm", "default"] as const;

type SwitchSize = (typeof switchSizes)[number];

type SwitchProps = Omit<SwitchPrimitive.Root.Props, "className" | "style"> & {
  size?: SwitchSize;
  sx?: stylex.StyleXStyles;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is([data-disabled])";
const beside =
  ":is([data-orientation='horizontal'] > *, [data-slot='field-label'] > *)";

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

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

const knob = (thumb: string) => ({
  height: thumb,
  transform: {
    default: "translateX(0)",
    ":is([data-checked])": `translateX(calc(${thumb} - 2 * ${strokes.border}))`,
  },
  width: thumb,
});

/* eslint-enable func-style */

const styles = stylex.create({
  switch: {
    alignItems: "center",
    backgroundColor: {
      default: colors.fillStrong,
      ":is([data-checked])": colors.accent,
    },
    borderColor: { default: "transparent", [invalid]: colors.danger },
    borderRadius: radii.full,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxShadow: { default: null, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    padding: 0,
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
  thumb: {
    backgroundColor: {
      default: colors.textSecondary,
      ":is([data-checked])": colors.onAccent,
    },
    borderRadius: radii.full,
    display: "block",
    pointerEvents: "none",
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, background-color",
    transitionTimingFunction: `${easings.out}, ease`,
  },
  thumbDefault: knob(sizes.icon),
  thumbSm: knob(sizes.iconXs),
});

const sizeStyles = {
  default: [styles.default, styles.thumbDefault],
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
