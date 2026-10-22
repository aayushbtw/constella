"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { Textarea, textareaStyles } from "@/components/primitives/textarea";
import type { TextareaProps } from "@/components/primitives/textarea";
import type { Sx } from "@/lib/constella/styles";
import { joinStyles, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  inputVars,
  joins,
  lineHeights,
  media,
  opacities,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const inputGroupAddonAligns = [
  "inline-start",
  "inline-end",
  "block-start",
  "block-end",
] as const;
const inputGroupButtonSizes = ["xs", "sm", "icon-xs", "icon-sm"] as const;
const inputGroupSizes = ["sm", "default", "lg"] as const;

type InputGroupAddonAlign = (typeof inputGroupAddonAligns)[number];
type InputGroupButtonSize = (typeof inputGroupButtonSizes)[number];
type InputGroupSize = (typeof inputGroupSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type InputGroupProps = Styled<ComponentProps<"div">> & {
  size?: InputGroupSize;
};

type InputGroupAddonProps = Styled<ComponentProps<"div">> & {
  align?: InputGroupAddonAlign;
  /** Draws an edge between a block addon and the control. */
  separated?: boolean;
};

type InputGroupButtonProps = Omit<ButtonProps, "size"> & {
  size?: InputGroupButtonSize;
};

// Native `size` counts characters; width comes from layout here.
type InputGroupInputProps = Omit<
  InputPrimitive.Props,
  "className" | "size" | "style"
> & {
  sx?: Sx;
};

const control = "[data-slot='input-group-control']";
const invalid = `:has(${control}:is([aria-invalid='true'], [data-invalid]))`;
const disabled = `:has(${control}:is(:disabled, [data-disabled]))`;
const controlDisabled = ":is(:disabled, [data-disabled])";
const sm = ":is([data-size='sm'])";
// Not `:dir(rtl)`: Lightning CSS lowers it to a `:lang()` list that ignores `dir`.
const rtl = ":is([dir='rtl'] *)";
// The first button in a run, inside a block addon.
const leadingBlockButton =
  ":where([data-slot='input-group-addon'][data-align^='block'] > :not([data-slot='button'] + *))";
// A text prefix like `https://` or `$`, or a suffix like `%`, reads as part of the value. `:is`, not `:where`, so it outranks the inline padding.
const afterPrefix =
  ":is([data-slot='input-group']:has(> [data-align='inline-start'] > [data-slot='input-group-text']:only-child) *)";
const beforeSuffix =
  ":is([data-slot='input-group']:has(> [data-align='inline-end'] > [data-slot='input-group-text']:only-child) *)";
// A trailing button sits as far from the side as from the edge it rests on.
const trailingButton = ":has(> [data-slot='button']:last-child)";
const stacked = ":has(> [data-align^='block'], > textarea)";

// Conditions on the control, read from the group around it.
const inGroupWith = (align: InputGroupAddonAlign) =>
  `:where([data-slot='input-group']:has(> [data-align='${align}']) *)`;
const inGroupSized = (size: InputGroupSize) =>
  `:where([data-slot='input-group'][data-size='${size}'] *)`;

// Per group height: the size's value, `default` unless set.
const bySize = (values: Record<InputGroupSize, string>) => ({
  default: values.default,
  [inGroupSized("sm")]: values.sm,
  [inGroupSized("lg")]: values.lg,
});

const insetMargin = (group: string, item: string) =>
  `calc((${group} - ${item}) / 2 - ${strokes.border} - ${space.xs})`;

const stackedInput = `calc(${lineHeights.textSm} + ${space.xs} + ${space.xxs})`;
const chipInset = `calc((${sizes.controlMd} - ${sizes.controlXs}) / 2 - ${strokes.border})`;
const unscaled = (length: string) => `calc(${length} / ${inputVars.scale})`;
// An xs button or a keycap sits in the box with an even inset on three sides.
const insetEdge = {
  default: null,
  ":has(> [data-slot='button'])": bySize({
    lg: insetMargin(sizes.controlLg, sizes.controlXs),
    default: insetMargin(sizes.controlMd, sizes.controlXs),
    sm: insetMargin(sizes.controlSm, sizes.controlXs),
  }),
  ":has(> [data-slot='kbd'])": bySize({
    lg: insetMargin(sizes.controlLg, sizes.kbd),
    default: insetMargin(sizes.controlMd, sizes.kbd),
    sm: insetMargin(sizes.controlSm, sizes.kbd),
  }),
};

const styles = stylex.create({
  group: {
    alignItems: { default: "center", [stacked]: "stretch" },
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderBlockEndColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    borderInlineEndColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    borderInlineStartColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    boxShadow: { default: shadows.default, [invalid]: shadows.defaultInvalid },
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "flex",
    flexDirection: { default: "row", [stacked]: "column" },
    fontSize: { default: fontSizes.textSm, [sm]: fontSizes.captionLg },
    height: {
      default: sizes.controlMd,
      [sm]: sizes.controlSm,
      ":is([data-size='lg'])": sizes.controlLg,
      [stacked]: "auto",
    },
    [inputVars.scale]: {
      default: null,
      [media.coarse]: { default: "calc(13 / 16)", [sm]: "calc(12 / 16)" },
    },
    lineHeight: { default: lineHeights.textSm, [sm]: lineHeights.captionLg },
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    position: "relative",
    transitionDuration: durations.hover,
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "ease",
    width: "100%",
    // In a ButtonGroup, the focused group's ring stays above its neighbors.
    zIndex: { default: null, ":focus-within": 1 },
  },
  addon: {
    // A ButtonGroup's joins stop at the group, so the buttons inside stay whole.
    [joins.block]: "1",
    [joins.either]: "1",
    [joins.inline]: "1",
    alignItems: "center",
    color: colors.textMuted,
    cursor: "text",
    display: "flex",
    flexShrink: 0,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    justifyContent: "center",
    // The control's line, so text above or below it sits the same distance from the edge.
    paddingBlockEnd: space.row,
    paddingBlockStart: space.row,
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
    paddingInlineEnd: { default: space.popup, [trailingButton]: space.xs },
    paddingInlineStart: space.popup,
  },
  blockEnd: {
    justifyContent: "flex-start",
    order: 1,
    paddingBlockEnd: space.xs,
    paddingBlockStart: 0,
    paddingInlineEnd: { default: space.popup, [trailingButton]: space.xs },
    paddingInlineStart: space.popup,
  },
  separatedStart: {
    borderBlockEndColor: colors.borderSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    paddingBlockEnd: space.xs,
  },
  separatedEnd: {
    borderBlockStartColor: colors.borderSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    paddingBlockStart: space.xs,
  },
  text: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    gap: space.xs,
  },
  // The group draws the surface, edge, ring and fade, so the control drops its own.
  control: {
    backgroundColor: "transparent",
    borderEndEndRadius: 0,
    borderEndStartRadius: 0,
    borderStartEndRadius: 0,
    borderStartStartRadius: 0,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    boxShadow: "none",
    flexGrow: 1,
    opacity: 1,
  },
  // The input can outgrow this slot at 16px, then scale back to fit.
  inputSlot: {
    alignSelf: "stretch",
    display: "flex",
    flexGrow: 1,
    height: {
      default: null,
      // One line, the outer edge's gap, and a step to the addon so the two lines space evenly.
      [inGroupWith("block-start")]: stackedInput,
      [inGroupWith("block-end")]: stackedInput,
    },
    minWidth: 0,
  },
  input: {
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    caretColor: colors.accentSolid,
    color: colors.textPrimary,
    cursor: { default: null, [controlDisabled]: "not-allowed" },
    flexShrink: 0,
    // Under 16px, iOS Safari zooms the page on focus.
    fontSize: {
      default: unscaled("1em"),
      // A smaller root or text step than the scale assumes would drop it under again.
      [media.coarse]: `max(16px, ${unscaled("1em")})`,
    },
    height: unscaled("100%"),
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    minWidth: 0,
    paddingBlockEnd: {
      default: 0,
      [inGroupWith("block-start")]: unscaled(space.xs),
      [inGroupWith("block-end")]: unscaled(space.xxs),
    },
    paddingBlockStart: {
      default: 0,
      [inGroupWith("block-start")]: unscaled(space.xxs),
      [inGroupWith("block-end")]: unscaled(space.xs),
    },
    paddingInlineEnd: {
      default: unscaled(space.popup),
      [inGroupWith("inline-end")]: unscaled(space.row),
      [beforeSuffix]: unscaled(space.xxxs),
    },
    paddingInlineStart: {
      default: unscaled(space.popup),
      [inGroupWith("inline-start")]: unscaled(space.row),
      [afterPrefix]: unscaled(space.xxxs),
    },
    scale: { default: null, [media.coarse]: inputVars.scale },
    transformOrigin: {
      default: null,
      [media.coarse]: { default: "left top", [rtl]: "right top" },
    },
    width: unscaled("100%"),
    "::placeholder": { color: colors.textMuted },
    "::file-selector-button": {
      backgroundColor: {
        default: colors.fill,
        [media.hover]: {
          default: colors.fill,
          ":hover:not(:disabled)": colors.fillStrong,
        },
        ":active:not(:disabled)": colors.fillStrong,
      },
      borderBlockEndWidth: 0,
      borderBlockStartWidth: 0,
      borderInlineEndWidth: 0,
      borderInlineStartWidth: 0,
      borderStartStartRadius: radii.xs,
      borderStartEndRadius: radii.xs,
      borderEndStartRadius: radii.xs,
      borderEndEndRadius: radii.xs,
      color: colors.textPrimary,
      cursor: "inherit",
      fontSize: fontSizes.textSm,
      lineHeight: lineHeights.textSm,
      fontWeight: fontWeights.medium,
      height: "100%",
      marginInlineEnd: space.xs,
      paddingBlockEnd: 0,
      paddingBlockStart: 0,
      paddingInlineEnd: space.xs,
      paddingInlineStart: space.xs,
      transform: { default: null, ":active": presses.link },
      transitionDuration: `${durations.hover}, ${durations.press}`,
      transitionProperty: "background-color, transform",
      transitionTimingFunction: `ease, ${easings.out}`,
    },
  },
  // The chip sits in the box with an even inset on three sides, its corner concentric with the box's.
  file: {
    // A file input opens a picker, so iOS never zooms it.
    [inputVars.scale]: "1",
    color: colors.textSecondary,
    fontSize: "inherit",
    cursor: { default: "pointer", [controlDisabled]: "not-allowed" },
    paddingBlockEnd: chipInset,
    paddingBlockStart: chipInset,
    paddingInlineStart: chipInset,
  },
  textarea: {
    resize: "none",
  },
  button: {
    boxShadow: "none",
    // In a header or footer the actions gather at the end, after any text.
    marginInlineStart: { default: null, [leadingBlockButton]: "auto" },
  },
  // Concentric with the group's corner at the even inset.
  buttonXs: {
    gap: space.xxs,
    paddingInlineEnd: space.row,
    paddingInlineStart: space.row,
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
  "icon-xs": joinStyles.xs,
  sm: null,
  xs: [[typeStyles.textSm, styles.buttonXs], joinStyles.xs],
} satisfies Record<InputGroupButtonSize, stylex.StyleXStyles | null>;

function InputGroup({ size = "default", sx, ...props }: InputGroupProps) {
  return (
    <div
      data-size={size}
      data-slot="input-group"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset brings its own border and padding into a flex row
      role="group"
      {...props}
      {...stylex.props(styles.group, joinStyles.sm, joinStyles.edges, sx)}
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
        [typeStyles.textSm, styles.addon],
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

function InputGroupText({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"span">>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      props,
      stylex.props([typeStyles.textSm, styles.text], sx)
    ),
    render,
    state: { slot: "input-group-text" },
  });
}

/** The control's styles for your own textarea; pair them with `data-slot="input-group-control"`. */
function inputGroupTextareaStyles() {
  return [...textareaStyles(), styles.control, styles.textarea];
}

function InputGroupInput({ sx, type, ...props }: InputGroupInputProps) {
  return (
    <span data-slot="input-group-input" {...stylex.props(styles.inputSlot)}>
      <InputPrimitive
        type={type}
        {...props}
        data-slot="input-group-control"
        {...stylex.props(styles.input, type === "file" && styles.file, sx)}
      />
    </span>
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
  inputGroupSizes,
  InputGroupText,
  InputGroupTextarea,
  inputGroupTextareaStyles,
};
export type {
  InputGroupAddonAlign,
  InputGroupAddonProps,
  InputGroupButtonProps,
  InputGroupButtonSize,
  InputGroupInputProps,
  InputGroupProps,
  InputGroupSize,
};
