"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
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
} from "@/lib/constella/tokens.stylex";

const textareaSizes = ["sm", "default", "lg"] as const;

type TextareaSize = (typeof textareaSizes)[number];

type TextareaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & {
  size?: TextareaSize;
  sx?: Sx;
};

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";

// A growing textarea can't scale `fontSizes.touch` down the way Input does: its layout
// height would stay at 16px's.

const styles = stylex.create({
  textarea: {
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderBlockColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderInlineColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: { default: shadows.default, [invalid]: shadows.defaultInvalid },
    caretColor: colors.accentSolid,
    color: colors.textPrimary,
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "block",
    fieldSizing: "content",
    fontSize: { default: fontSizes.textSm, [media.coarse]: fontSizes.touch },
    lineHeight: {
      default: lineHeights.textSm,
      [media.coarse]: lineHeights.touch,
    },
    marginBlock: 0,
    marginInline: 0,
    minHeight: `calc(${sizes.controlMd} * 2)`,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: space.xs,
    paddingInline: space.popup,
    resize: { default: "vertical", [disabled]: "none" },
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
    "::placeholder": { color: colors.textMuted },
  },
  sm: {
    fontSize: { default: fontSizes.captionLg, [media.coarse]: fontSizes.touch },
    lineHeight: {
      default: lineHeights.captionLg,
      [media.coarse]: lineHeights.touch,
    },
    minHeight: `calc(${sizes.controlSm} * 2)`,
    paddingBlock: space.row,
  },
  lg: {
    minHeight: `calc(${sizes.controlLg} * 2)`,
    paddingBlock: space.popup,
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
