"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { MinusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  lineHeights,
  media,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  strokes,
} from "@/lib/tokens.stylex";

const checkboxSizes = ["sm", "default", "lg"] as const;

type CheckboxSize = (typeof checkboxSizes)[number];

type CheckboxProps = Omit<
  CheckboxPrimitive.Root.Props,
  "className" | "style"
> & {
  size?: CheckboxSize;
  sx?: stylex.StyleXStyles;
};

const on = ":is([data-checked], [data-indeterminate])";
const invalid = ":is([aria-invalid='true'], [data-invalid])";

// The box, centered on the label's first line beside top-aligned text, with its hit area.
const box = (size: string) => ({
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

const styles = stylex.create({
  checkbox: {
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
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    color: colors.onAccent,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    position: "relative",
    transform: {
      default: null,
      ":active:not([data-disabled])": presses.icon,
    },
    transitionDuration: `${durations.hover}, ${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, border-color, transform",
    transitionTimingFunction: `ease, ease, ${easings.out}`,
    verticalAlign: "middle",
    "::before": {
      content: "''",
      position: "absolute",
    },
  },
  sm: box(sizes.iconSm),
  default: box(sizes.icon),
  lg: box(sizes.iconLg),
  // The tick draws in from its start and fades out; unchecking is the system answering, so it's quick.
  indicator: {
    clipPath: {
      default: "inset(0)",
      ":is([data-starting-style])": "inset(0 100% 0 0)",
    },
    display: "flex",
    opacity: { default: 1, ":is([data-ending-style])": 0 },
    transitionDuration: {
      default: durations.move,
      ":is([data-ending-style])": durations.hover,
    },
    transitionProperty: {
      default: "clip-path, opacity",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  tick: {
    display: { default: "block", ":is([data-indeterminate] *)": "none" },
  },
  minus: {
    display: { default: "none", ":is([data-indeterminate] *)": "block" },
  },
});

const sizeStyles = {
  default: styles.default,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<CheckboxSize, stylex.StyleXStyles>;

// The tick is a step under the box.
const tickSizes = {
  default: sizes.iconSm,
  lg: sizes.icon,
  sm: sizes.iconXs,
} satisfies Record<CheckboxSize, string>;

function Checkbox({ size = "default", sx, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-size={size}
      data-slot="checkbox"
      {...props}
      {...stylex.props(styles.checkbox, sizeStyles[size], sx)}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <HugeiconsIcon
          aria-hidden
          icon={Tick02Icon}
          size={tickSizes[size]}
          strokeWidth={Number(strokes.icon)}
          {...stylex.props(styles.tick)}
        />
        <HugeiconsIcon
          aria-hidden
          icon={MinusSignIcon}
          size={tickSizes[size]}
          strokeWidth={Number(strokes.icon)}
          {...stylex.props(styles.minus)}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxSizes };
export type { CheckboxProps, CheckboxSize };
