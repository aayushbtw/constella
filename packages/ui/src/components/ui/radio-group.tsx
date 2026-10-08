"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  lineHeights,
  media,
  motion,
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

const on = ":is([data-checked])";
const invalid = ":is([aria-invalid='true'], [data-invalid])";

const styles = stylex.create({
  group: {
    display: "grid",
    gap: space.sm,
    width: "100%",
  },
  // A round checkbox: the same box, edge, fill and press.
  item: {
    alignItems: "center",
    // The checked edge is opaque, so the fill runs under it; clipped, it leaves a seam.
    backgroundClip: { default: "padding-box", [on]: "border-box" },
    backgroundColor: { default: colors.fillSubtle, [on]: colors.accent },
    borderBlockColor: {
      default: colors.edge,
      [invalid]: colors.danger,
      [on]: colors.accent,
    },
    borderInlineColor: {
      default: colors.edge,
      [invalid]: colors.danger,
      [on]: colors.accent,
    },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    // Beside top-aligned text, the circle centers on the label's first line.
    marginBlock: {
      default: null,
      ":is([data-orientation='horizontal'] > *, [data-slot='field-label'] > *)": `calc((${lineHeights.text} - ${sizes.icon}) / 2)`,
    },
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    paddingBlock: 0,
    paddingInline: 0,
    position: "relative",
    transform: {
      default: null,
      ":active:not([data-disabled])": presses.icon,
    },
    transitionDuration: `${durations.hover}, ${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, border-color, transform",
    transitionTimingFunction: `ease, ease, ${easings.out}`,
    width: sizes.icon,
    "::before": {
      content: "''",
      insetBlock: `calc((${sizes.icon} - ${sizes.hitArea}) / 2)`,
      insetInline: `calc((${sizes.icon} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
  },
  // The dot grows from the center and fades out; unchecking is the system answering, so it's quick.
  indicator: {
    backgroundColor: colors.onAccent,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "block",
    height: `calc(${sizes.icon} / 2)`,
    opacity: {
      default: 1,
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transform: {
      default: "scale(1)",
      ":is([data-starting-style])": `scale(${motion.dotScale})`,
    },
    transitionDuration: durations.hover,
    transitionProperty: {
      default: "transform, opacity",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: `calc(${sizes.icon} / 2)`,
  },
});

function RadioGroup({ sx, ...props }: Styled<RadioGroupPrimitive.Props>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function RadioGroupItem({ sx, ...props }: Styled<RadioPrimitive.Root.Props>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      {...props}
      {...stylex.props(styles.item, sx)}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator)}
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
