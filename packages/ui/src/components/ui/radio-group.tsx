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

const radioGroupItemSizes = ["sm", "default", "lg"] as const;

type RadioGroupItemSize = (typeof radioGroupItemSizes)[number];

type RadioGroupItemProps = Styled<RadioPrimitive.Root.Props> & {
  size?: RadioGroupItemSize;
};

const on = ":is([data-checked])";
const invalid = ":is([aria-invalid='true'], [data-invalid])";

// The circle, centered on the label's first line beside top-aligned text, with its hit area.
const circle = (size: string) => ({
  height: size,
  marginBlock: {
    default: null,
    ":is([data-orientation='horizontal'] > *, [data-slot='field-label'] > *)": `calc((${lineHeights.text} - ${size}) / 2)`,
  },
  width: size,
  "::before": {
    insetBlock: `calc((${size} - ${sizes.hitArea}) / 2)`,
    insetInline: `calc((${size} - ${sizes.hitArea}) / 2)`,
  },
});

const dot = (size: string) => ({
  height: `calc(${size} / 2)`,
  width: `calc(${size} / 2)`,
});

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
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
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
    "::before": {
      content: "''",
      position: "absolute",
    },
  },
  sm: circle(sizes.iconSm),
  default: circle(sizes.icon),
  lg: circle(sizes.iconLg),
  // The dot grows from the center and fades out; unchecking is the system answering, so it's quick.
  indicator: {
    backgroundColor: colors.onAccent,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: "block",
    opacity: {
      default: 1,
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transform: {
      default: "scale(1)",
      ":is([data-starting-style])": `scale(${motion.dotScale})`,
    },
    // The dot pops a touch past its size and settles.
    transitionDuration: durations.popover,
    transitionProperty: {
      default: "transform, opacity",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: `${easings.overshoot}, ${easings.out}`,
  },
  dotSm: dot(sizes.iconSm),
  dotDefault: dot(sizes.icon),
  dotLg: dot(sizes.iconLg),
});

const sizeStyles = {
  default: [styles.default, styles.dotDefault],
  lg: [styles.lg, styles.dotLg],
  sm: [styles.sm, styles.dotSm],
} satisfies Record<
  RadioGroupItemSize,
  [stylex.StyleXStyles, stylex.StyleXStyles]
>;

function RadioGroup({ sx, ...props }: Styled<RadioGroupPrimitive.Props>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function RadioGroupItem({
  size = "default",
  sx,
  ...props
}: RadioGroupItemProps) {
  const [item, indicator] = sizeStyles[size];
  return (
    <RadioPrimitive.Root
      data-size={size}
      data-slot="radio-group-item"
      {...props}
      {...stylex.props(styles.item, item, sx)}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator, indicator)}
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem, radioGroupItemSizes };
export type { RadioGroupItemProps, RadioGroupItemSize };
