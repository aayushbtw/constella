"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Separator } from "@/components/ui/separator";
import type { SeparatorProps } from "@/components/ui/separator";
import { joinStyles } from "@/lib/join";
import {
  colors,
  fontSizes,
  fontWeights,
  joins,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const buttonGroupOrientations = ["horizontal", "vertical"] as const;

type ButtonGroupOrientation = (typeof buttonGroupOrientations)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type ButtonGroupProps = Styled<ComponentProps<"div">> & {
  orientation?: ButtonGroupOrientation;
};

type ButtonGroupTextProps = Styled<useRender.ComponentProps<"div">>;

// Groups inside a group sit apart, so nothing joins at this level.
const nested = ":has(> [data-slot='button-group'])";

// shadcn's inline padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  group: {
    alignItems: "stretch",
    display: "flex",
    gap: { default: 0, [nested]: space.xs },
    width: "fit-content",
  },
  horizontal: {
    [joins.block]: "1",
    [joins.either]: { default: "0", [nested]: "1" },
    [joins.inline]: { default: "0", [nested]: "1" },
  },
  vertical: {
    [joins.block]: { default: "0", [nested]: "1" },
    [joins.either]: { default: "0", [nested]: "1" },
    [joins.inline]: "1",
    flexDirection: "column",
  },
  text: {
    alignItems: "center",
    backgroundClip: "padding-box",
    backgroundColor: colors.fill,
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderBlockColor: colors.edge,
    borderInlineColor: colors.edge,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    boxSizing: "border-box",
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    paddingInline: px10,
    whiteSpace: "nowrap",
  },
  separatorHorizontal: {
    backgroundColor: colors.edge,
    width: "auto",
  },
  separatorVertical: { backgroundColor: colors.edge },
});

const orientationStyles = {
  horizontal: styles.horizontal,
  vertical: styles.vertical,
} satisfies Record<ButtonGroupOrientation, stylex.StyleXStyles>;

function ButtonGroup({
  orientation = "horizontal",
  sx,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      data-orientation={orientation}
      data-slot="button-group"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset brings its own border and padding into a flex row
      role="group"
      {...props}
      {...stylex.props(styles.group, orientationStyles[orientation], sx)}
    />
  );
}

function ButtonGroupText({ render, sx, ...props }: ButtonGroupTextProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      props,
      stylex.props(styles.text, joinStyles.sm, joinStyles.edges, sx)
    ),
    render,
    // Base UI writes state as data attributes: `data-slot="button-group-text"`.
    state: { slot: "button-group-text" },
  });
}

function ButtonGroupSeparator({
  orientation = "vertical",
  sx,
  ...props
}: SeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
      sx={[
        orientation === "vertical"
          ? styles.separatorVertical
          : styles.separatorHorizontal,
        sx,
      ]}
    />
  );
}

export {
  ButtonGroup,
  buttonGroupOrientations,
  ButtonGroupSeparator,
  ButtonGroupText,
};
export type { ButtonGroupOrientation, ButtonGroupProps, ButtonGroupTextProps };
