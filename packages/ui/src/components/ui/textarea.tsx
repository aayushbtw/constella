"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  fontSizes,
  lineHeights,
  media,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const textareaSizes = ["sm", "default", "lg"] as const;

type TextareaSize = (typeof textareaSizes)[number];

type TextareaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & {
  size?: TextareaSize;
  sx?: stylex.StyleXStyles;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";

// shadcn's padding, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  textarea: {
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderBlockColor: { default: colors.edge, [invalid]: colors.danger },
    borderInlineColor: { default: colors.edge, [invalid]: colors.danger },
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    caretColor: colors.accent,
    color: colors.textPrimary,
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "block",
    fieldSizing: "content",
    // Under 16px, iOS Safari zooms the page on focus.
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.sm },
    lineHeight: lineHeights.text,
    marginBlock: 0,
    marginInline: 0,
    minHeight: `calc(${sizes.controlMd} * 2)`,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: space.xs,
    paddingInline: px10,
    resize: { default: "vertical", [disabled]: "none" },
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
    "::placeholder": { color: colors.textMuted },
  },
  // Text steps down with the height like Input's, but stays 16px under `sm` so iOS doesn't zoom.
  sm: {
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.xs },
    minHeight: `calc(${sizes.controlSm} * 2)`,
    paddingBlock: px6,
  },
  lg: {
    minHeight: `calc(${sizes.controlLg} * 2)`,
    paddingBlock: px10,
  },
});

const sizeStyles = {
  default: null,
  lg: styles.lg,
  sm: styles.sm,
} satisfies Record<TextareaSize, stylex.StyleXStyles | null>;

/** A textarea's styles for another element, like a third-party autosizing textarea. */
function textareaStyles({
  size = "default",
}: Pick<TextareaProps, "size"> = {}) {
  return [styles.textarea, sizeStyles[size]];
}

function Textarea({ size = "default", sx, ...props }: TextareaProps) {
  return (
    <FieldPrimitive.Control
      render={(controlProps) => (
        <textarea
          data-size={size}
          data-slot="textarea"
          {...mergeProps<"textarea">(controlProps, props)}
          {...stylex.props(textareaStyles({ size }), sx)}
        />
      )}
    />
  );
}

export { Textarea, textareaSizes, textareaStyles };
export type { TextareaProps, TextareaSize };
