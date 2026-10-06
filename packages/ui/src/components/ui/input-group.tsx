"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Input, inputStyles } from "@/components/ui/input";
import type { InputProps } from "@/components/ui/input";
import { Textarea, textareaStyles } from "@/components/ui/textarea";
import type { TextareaProps } from "@/components/ui/textarea";
import {
  colors,
  durations,
  fontSizes,
  fontWeights,
  lineHeights,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const inputGroupAddonAligns = [
  "inline-start",
  "inline-end",
  "block-start",
  "block-end",
] as const;
const inputGroupButtonSizes = ["xs", "sm", "icon-xs", "icon-sm"] as const;

type InputGroupAddonAlign = (typeof inputGroupAddonAligns)[number];
type InputGroupButtonSize = (typeof inputGroupButtonSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type InputGroupAddonProps = Styled<ComponentProps<"div">> & {
  align?: InputGroupAddonAlign;
  /** Draws an edge between a block addon and the control. */
  separated?: boolean;
};

type InputGroupButtonProps = Omit<ButtonProps, "size"> & {
  size?: InputGroupButtonSize;
};

const control = "[data-slot='input-group-control']";
const invalid = `:has(> ${control}:is([aria-invalid='true'], [data-invalid]))`;
const disabled = `:has(> ${control}:is(:disabled, [data-disabled]))`;
// The first button in a run, inside a block addon.
const leadingBlockButton =
  ":where([data-slot='input-group-addon'][data-align^='block'] > :not([data-slot='button'] + *))";
// A text prefix like `https://` or `$` reads as part of the value. `:is`, not `:where`, so it outranks the inline-start padding.
const afterPrefix =
  ":is([data-slot='input-group']:has(> [data-align='inline-start'] > [data-slot='input-group-text']:only-child) *)";
// A trailing button sits as far from the side as from the edge it rests on.
const trailingButton = ":has(> [data-slot='button']:last-child)";
const stacked = ":has(> [data-align^='block'], > textarea)";

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

// Conditions on the control, read from the group around it.
const inGroupWith = (align: InputGroupAddonAlign) =>
  `:where([data-slot='input-group']:has(> [data-align='${align}']) *)`;

/* eslint-enable func-style */

// shadcn's spacing, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

// An xs button or a keycap sits in the box with an even inset on three sides.
const buttonInset = `calc((${sizes.controlMd} - ${sizes.controlXs}) / 2 - ${strokes.border})`;
const stackedInput = `calc(${lineHeights.text} + ${space.xs} + ${space.xxs})`;
const kbdInset = `calc((${sizes.controlMd} - ${sizes.kbd}) / 2 - ${strokes.border})`;
const insetEdge = {
  default: null,
  ":has(> [data-slot='button'])": `calc(${buttonInset} - ${space.xs})`,
  ":has(> [data-slot='kbd'])": `calc(${kbdInset} - ${space.xs})`,
};

const styles = stylex.create({
  group: {
    alignItems: { default: "center", [stacked]: "stretch" },
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderColor: { default: colors.edgeStrong, [invalid]: colors.danger },
    borderRadius: radii.sm,
    borderStyle: "solid",
    borderWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    boxSizing: "border-box",
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "flex",
    flexDirection: { default: "row", [stacked]: "column" },
    height: { default: sizes.controlMd, [stacked]: "auto" },
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
  },
  addon: {
    alignItems: "center",
    color: colors.textMuted,
    cursor: "text",
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    justifyContent: "center",
    // The control's line, so text above or below it sits the same distance from the edge.
    lineHeight: lineHeights.text,
    paddingBlock: px6,
    userSelect: "none",
  },
  inlineStart: {
    marginInlineStart: insetEdge,
    order: -1,
    paddingInlineStart: space.xs,
  },
  inlineEnd: {
    marginInlineEnd: insetEdge,
    order: 1,
    paddingInlineEnd: space.xs,
  },
  blockStart: {
    justifyContent: "flex-start",
    order: -1,
    paddingBlockEnd: 0,
    paddingBlockStart: space.xs,
    paddingInlineEnd: { default: px10, [trailingButton]: space.xs },
    paddingInlineStart: px10,
  },
  blockEnd: {
    justifyContent: "flex-start",
    order: 1,
    paddingBlockEnd: space.xs,
    paddingBlockStart: 0,
    paddingInlineEnd: { default: px10, [trailingButton]: space.xs },
    paddingInlineStart: px10,
  },
  separatedStart: {
    borderBlockEndColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    paddingBlockEnd: space.xs,
  },
  separatedEnd: {
    borderBlockStartColor: colors.edge,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    paddingBlockStart: space.xs,
  },
  text: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
  },
  // The group draws the surface, edge, ring and fade, so the control drops its own.
  control: {
    backgroundColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
    boxShadow: "none",
    flexGrow: 1,
    opacity: 1,
  },
  input: {
    height: {
      default: `calc(${sizes.controlMd} - 2 * ${strokes.border})`,
      // One line, the outer edge's gap, and a step to the addon so the two lines space evenly.
      [inGroupWith("block-start")]: stackedInput,
      [inGroupWith("block-end")]: stackedInput,
    },
    paddingBlockEnd: {
      default: 0,
      [inGroupWith("block-start")]: space.xs,
      [inGroupWith("block-end")]: space.xxs,
    },
    paddingBlockStart: {
      default: 0,
      [inGroupWith("block-start")]: space.xxs,
      [inGroupWith("block-end")]: space.xs,
    },
    paddingInlineEnd: { default: px10, [inGroupWith("inline-end")]: px6 },
    paddingInlineStart: {
      default: px10,
      [inGroupWith("inline-start")]: px6,
      [afterPrefix]: space.xxxs,
    },
  },
  textarea: {
    resize: "none",
  },
  // Packed inside the group's edge, so the ring sits flush instead of crossing it.
  button: {
    boxShadow: "none",
    // In a header or footer the actions gather at the end, after any text.
    marginInlineStart: { default: null, [leadingBlockButton]: "auto" },
    outlineOffset: 0,
  },
  // Concentric with the group's corner at the even inset.
  buttonXs: {
    borderRadius: radii.xs,
    fontSize: fontSizes.sm,
    gap: space.xxs,
    paddingInlineEnd: px6,
    paddingInlineStart: px6,
  },
  buttonIconXs: {
    borderRadius: radii.xs,
  },
});

const alignStyles = {
  "block-end": styles.blockEnd,
  "block-start": styles.blockStart,
  "inline-end": styles.inlineEnd,
  "inline-start": styles.inlineStart,
} satisfies Record<InputGroupAddonAlign, stylex.StyleXStyles>;

// Only a header or footer has an edge to draw.
const separatedStyles = {
  "block-end": styles.separatedEnd,
  "block-start": styles.separatedStart,
  "inline-end": null,
  "inline-start": null,
} satisfies Record<InputGroupAddonAlign, stylex.StyleXStyles | null>;

const buttonSizeStyles = {
  "icon-sm": null,
  "icon-xs": styles.buttonIconXs,
  sm: null,
  xs: styles.buttonXs,
} satisfies Record<InputGroupButtonSize, stylex.StyleXStyles | null>;

function InputGroup({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="input-group"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset brings its own border and padding into a flex row
      role="group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function InputGroupAddon({
  align = "inline-start",
  onClick,
  separated = false,
  sx,
  ...props
}: InputGroupAddonProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- A pointer shortcut to the control; keyboard users tab straight to it.
    <div
      data-align={align}
      data-separated={separated || undefined}
      data-slot="input-group-addon"
      onClick={(event) => {
        onClick?.(event);
        if (event.target instanceof Element && event.target.closest("button")) {
          return;
        }
        event.currentTarget.parentElement
          ?.querySelector<HTMLElement>(control)
          ?.focus();
      }}
      {...props}
      {...stylex.props(
        styles.addon,
        alignStyles[align],
        separated && separatedStyles[align],
        sx
      )}
    />
  );
}

function InputGroupButton({
  size = "xs",
  sx,
  type = "button",
  variant = "ghost",
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      size={size}
      type={type}
      variant={variant}
      {...props}
      sx={[styles.button, buttonSizeStyles[size], sx]}
    />
  );
}

function InputGroupText({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="input-group-text"
      {...props}
      {...stylex.props(styles.text, sx)}
    />
  );
}

/** The control's styles for your own input; pair them with `data-slot="input-group-control"`. */
function inputGroupInputStyles() {
  return [...inputStyles(), styles.control, styles.input];
}

/** The control's styles for your own textarea; pair them with `data-slot="input-group-control"`. */
function inputGroupTextareaStyles() {
  return [...textareaStyles(), styles.control, styles.textarea];
}

function InputGroupInput({ sx, ...props }: InputProps) {
  return (
    <Input
      data-slot="input-group-control"
      {...props}
      sx={[styles.control, styles.input, sx]}
    />
  );
}

function InputGroupTextarea({ sx, ...props }: TextareaProps) {
  return (
    <Textarea
      data-slot="input-group-control"
      {...props}
      sx={[styles.control, styles.textarea, sx]}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  inputGroupAddonAligns,
  InputGroupButton,
  inputGroupButtonSizes,
  InputGroupInput,
  inputGroupInputStyles,
  InputGroupText,
  InputGroupTextarea,
  inputGroupTextareaStyles,
};
export type {
  InputGroupAddonAlign,
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupButtonSize,
};
