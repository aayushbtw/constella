"use client";

import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Input, inputStyles } from "@/components/ui/input";
import type { InputProps, InputSize } from "@/components/ui/input";
import { Textarea, textareaStyles } from "@/components/ui/textarea";
import type { TextareaProps } from "@/components/ui/textarea";
import { joinStyles } from "@/lib/join";
import {
  colors,
  durations,
  fontSizes,
  fontWeights,
  joins,
  lineHeights,
  opacities,
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
const inputGroupSizes = ["sm", "default", "lg"] as const;

type InputGroupAddonAlign = (typeof inputGroupAddonAligns)[number];
type InputGroupButtonSize = (typeof inputGroupButtonSizes)[number];
type InputGroupSize = (typeof inputGroupSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
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

const control = "[data-slot='input-group-control']";
const invalid = `:has(> ${control}:is([aria-invalid='true'], [data-invalid]))`;
const disabled = `:has(> ${control}:is(:disabled, [data-disabled]))`;
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

// shadcn's spacing, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const stackedInput = `calc(${lineHeights.text} + ${space.xs} + ${space.xxs})`;
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
const textSize = bySize({
  lg: fontSizes.sm,
  default: fontSizes.sm,
  sm: fontSizes.xs,
});

const styles = stylex.create({
  group: {
    alignItems: { default: "center", [stacked]: "stretch" },
    backgroundClip: "padding-box",
    backgroundColor: colors.background,
    borderBlockEndColor: { default: colors.edge, [invalid]: colors.danger },
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartColor: { default: colors.edge, [invalid]: colors.danger },
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    borderInlineEndColor: { default: colors.edge, [invalid]: colors.danger },
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    borderInlineStartColor: { default: colors.edge, [invalid]: colors.danger },
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    boxShadow: { default: shadows.control, [invalid]: shadows.invalid },
    cursor: { default: null, [disabled]: "not-allowed" },
    display: "flex",
    flexDirection: { default: "row", [stacked]: "column" },
    height: {
      default: sizes.controlMd,
      ":is([data-size='sm'])": sizes.controlSm,
      ":is([data-size='lg'])": sizes.controlLg,
      [stacked]: "auto",
    },
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
    fontSize: textSize,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    justifyContent: "center",
    // The control's line, so text above or below it sits the same distance from the edge.
    lineHeight: lineHeights.text,
    paddingBlockEnd: px6,
    paddingBlockStart: px6,
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
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    paddingBlockEnd: space.xs,
  },
  separatedEnd: {
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    paddingBlockStart: space.xs,
  },
  text: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    fontSize: textSize,
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
  input: {
    height: {
      default: "100%",
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
    paddingInlineEnd: {
      default: px10,
      [inGroupWith("inline-end")]: px6,
      [beforeSuffix]: space.xxxs,
    },
    paddingInlineStart: {
      default: px10,
      [inGroupWith("inline-start")]: px6,
      [afterPrefix]: space.xxxs,
    },
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
    fontSize: textSize,
    gap: space.xxs,
    paddingInlineEnd: px6,
    paddingInlineStart: px6,
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
  xs: [styles.buttonXs, joinStyles.xs],
} satisfies Record<InputGroupButtonSize, stylex.StyleXStyles | null>;

const InputGroupSizeContext = createContext<InputGroupSize>("default");

function InputGroup({ size = "default", sx, ...props }: InputGroupProps) {
  return (
    <InputGroupSizeContext value={size}>
      <div
        data-size={size}
        data-slot="input-group"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset brings its own border and padding into a flex row
        role="group"
        {...props}
        {...stylex.props(styles.group, joinStyles.sm, joinStyles.edges, sx)}
      />
    </InputGroupSizeContext>
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
function inputGroupInputStyles({
  size = "default",
}: { size?: InputSize } = {}) {
  return [...inputStyles({ size }), styles.control, styles.input];
}

/** The control's styles for your own textarea; pair them with `data-slot="input-group-control"`. */
function inputGroupTextareaStyles() {
  return [...textareaStyles(), styles.control, styles.textarea];
}

function InputGroupInput({ sx, ...props }: InputProps) {
  const size = use(InputGroupSizeContext);
  return (
    <Input
      data-slot="input-group-control"
      size={size}
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
  InputGroupProps,
  InputGroupSize,
};
