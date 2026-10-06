"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type InputProps = Omit<InputPrimitive.Props, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";

// shadcn's inline padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;
const chipInset = `calc((${sizes.controlMd} - ${sizes.controlXs}) / 2 - ${strokes.border})`;

const styles = stylex.create({
  input: {
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    // `edge` vanishes on the dark stage, and the 30px fill reads short beside a 32px button.
    borderColor: { default: colors.edgeStrong, [invalid]: colors.danger },
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: { default: null, [disabled]: "not-allowed" },
    fontFamily: "inherit",
    // Under 16px, iOS Safari zooms the page on focus.
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.sm },
    height: sizes.controlMd,
    margin: 0,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: 0,
    paddingInline: px10,
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
    "::placeholder": { color: colors.textMuted },
    "::file-selector-button": {
      backgroundColor: {
        default: colors.fill,
        [media.hover]: {
          default: colors.fill,
          ":hover:not(:disabled)": colors.fillStrong,
        },
      },
      borderRadius: radii.xs,
      borderWidth: 0,
      color: colors.textPrimary,
      cursor: "inherit",
      fontFamily: "inherit",
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      height: "100%",
      marginInlineEnd: space.xs,
      paddingBlock: 0,
      paddingInline: space.xs,
      transform: { default: null, ":active": presses.link },
      transitionDuration: `${durations.hover}, ${durations.press}`,
      transitionProperty: "background-color, transform",
      transitionTimingFunction: `ease, ${easings.out}`,
    },
  },
  // The chip sits in the box with an even inset on three sides, its corner concentric with the box's.
  file: {
    color: colors.textSecondary,
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    paddingBlock: chipInset,
    paddingInlineStart: chipInset,
  },
});

function Input({ sx, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      type={type}
      {...props}
      {...stylex.props(styles.input, type === "file" && styles.file, sx)}
    />
  );
}

export { Input };
export type { InputProps };
