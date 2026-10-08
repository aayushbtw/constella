"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";

import { joinStyles } from "@/lib/join";
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

const inputSizes = ["sm", "default", "lg"] as const;

type InputSize = (typeof inputSizes)[number];

// Native `size` counts characters; width comes from layout here.
type InputProps = Omit<InputPrimitive.Props, "className" | "size" | "style"> & {
  size?: InputSize;
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
    borderColor: { default: colors.edge, [invalid]: colors.danger },
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStyle: "solid",
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: { default: null, [disabled]: "not-allowed" },
    fontFamily: "inherit",
    // Under 16px, iOS Safari zooms the page on focus.
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.sm },
    height: sizes.controlMd,
    marginBlock: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: 0,
    paddingInlineEnd: px10,
    paddingInlineStart: px10,
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
    // In a ButtonGroup, the focused item's ring stays above its neighbors.
    zIndex: { default: null, ":focus-visible": 1 },
    "::placeholder": { color: colors.textMuted },
    "::file-selector-button": {
      backgroundColor: {
        default: colors.fill,
        [media.hover]: {
          default: colors.fill,
          ":hover:not(:disabled)": colors.fillStrong,
        },
      },
      borderBlockEndWidth: 0,
      borderBlockStartWidth: 0,
      borderInlineEndWidth: 0,
      borderInlineStartWidth: 0,
      borderRadius: radii.xs,
      color: colors.textPrimary,
      cursor: "inherit",
      fontFamily: "inherit",
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      height: "100%",
      marginInlineEnd: space.xs,
      paddingBlock: 0,
      paddingInlineEnd: space.xs,
      paddingInlineStart: space.xs,
      transform: { default: null, ":active": presses.link },
      transitionDuration: `${durations.hover}, ${durations.press}`,
      transitionProperty: "background-color, transform",
      transitionTimingFunction: `ease, ${easings.out}`,
    },
  },
  // Text steps down with the height like Button's, but stays 16px under `sm` so iOS doesn't zoom.
  sm: {
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.xs },
    height: sizes.controlSm,
    "::file-selector-button": { fontSize: fontSizes.xs },
  },
  lg: {
    height: sizes.controlLg,
  },
  // The chip sits in the box with an even inset on three sides, its corner concentric with the box's.
  file: {
    color: colors.textSecondary,
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    paddingBlock: chipInset,
    paddingInlineStart: chipInset,
  },
});

const sizeStyles = {
  default: null,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<InputSize, stylex.StyleXStyles | null>;

/** An input's styles for another element, like a third-party masked input. */
function inputStyles({ size = "default" }: Pick<InputProps, "size"> = {}) {
  return [styles.input, joinStyles.sm, joinStyles.edges, sizeStyles[size]];
}

function Input({ size = "default", sx, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      data-size={size}
      data-slot="input"
      type={type}
      {...props}
      {...stylex.props(
        inputStyles({ size }),
        type === "file" && styles.file,
        sx
      )}
    />
  );
}

export { Input, inputSizes, inputStyles };
export type { InputProps, InputSize };
