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

type TextareaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";

// shadcn's inline padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  textarea: {
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderColor: { default: colors.edge, [invalid]: colors.danger },
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "block",
    fieldSizing: "content",
    fontFamily: "inherit",
    // Under 16px, iOS Safari zooms the page on focus.
    fontSize: { default: fontSizes.md, [media.sm]: fontSizes.sm },
    lineHeight: lineHeights.text,
    margin: 0,
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
});

/** A textarea's styles for another element, like a third-party autosizing textarea. */
function textareaStyles() {
  return [styles.textarea];
}

function Textarea({ sx, ...props }: TextareaProps) {
  return (
    <FieldPrimitive.Control
      render={(controlProps) => (
        <textarea
          data-slot="textarea"
          {...mergeProps<"textarea">(controlProps, props)}
          {...stylex.props(textareaStyles(), sx)}
        />
      )}
    />
  );
}

export { Textarea, textareaStyles };
export type { TextareaProps };
