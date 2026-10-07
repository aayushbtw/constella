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

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const on = ":is([data-checked], [data-indeterminate])";
const invalid = ":is([aria-invalid='true'], [data-invalid])";

const styles = stylex.create({
  checkbox: {
    alignItems: "center",
    // The checked edge is opaque, so the fill runs under it; clipped, it leaves a seam.
    backgroundClip: { default: "padding-box", [on]: "border-box" },
    backgroundColor: { default: colors.fillSubtle, [on]: colors.accent },
    borderColor: {
      default: colors.edge,
      [invalid]: colors.danger,
      [on]: colors.accent,
    },
    borderRadius: radii.xs,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    color: colors.onAccent,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    // Beside top-aligned text, the box centers on the label's first line.
    marginBlock: {
      default: null,
      ":is([data-orientation='horizontal'] > *, [data-slot='field-label'] > *)": `calc((${lineHeights.text} - ${sizes.icon}) / 2)`,
    },
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
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
      inset: `calc((${sizes.icon} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
  },
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

function Checkbox({ sx, ...props }: Styled<CheckboxPrimitive.Root.Props>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...props}
      {...stylex.props(styles.checkbox, sx)}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <HugeiconsIcon
          aria-hidden
          icon={Tick02Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
          {...stylex.props(styles.tick)}
        />
        <HugeiconsIcon
          aria-hidden
          icon={MinusSignIcon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
          {...stylex.props(styles.minus)}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
