import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const inTooltip = ":where([data-slot='tooltip-popup'] *)";

const inButton = (size: string) =>
  `:where([data-slot='button'][data-size='${size}'] > *)`;
const inInputGroup = (size: string) =>
  `:where([data-slot='input-group'][data-size='${size}'] *)`;
// Concentric with the box's corner; at `lg` the inset reaches the radius, so it keeps its own.
const nested = (height: string) =>
  `calc(${radii.sm} - (${height} - ${sizes.kbd}) / 2)`;

const styles = stylex.create({
  kbd: {
    alignItems: "center",
    backgroundColor: {
      default: colors.fill,
      [inTooltip]: colors.invertedFill,
    },
    borderStartStartRadius: {
      default: radii.chip,
      [inButton("sm")]: nested(sizes.controlSm),
      [inInputGroup("sm")]: nested(sizes.controlSm),
      [inButton("default")]: nested(sizes.controlMd),
      [inInputGroup("default")]: nested(sizes.controlMd),
      [inTooltip]: `calc(${radii.sm} - ${space.xxs})`,
    },
    borderStartEndRadius: {
      default: radii.chip,
      [inButton("sm")]: nested(sizes.controlSm),
      [inInputGroup("sm")]: nested(sizes.controlSm),
      [inButton("default")]: nested(sizes.controlMd),
      [inInputGroup("default")]: nested(sizes.controlMd),
      [inTooltip]: `calc(${radii.sm} - ${space.xxs})`,
    },
    borderEndStartRadius: {
      default: radii.chip,
      [inButton("sm")]: nested(sizes.controlSm),
      [inInputGroup("sm")]: nested(sizes.controlSm),
      [inButton("default")]: nested(sizes.controlMd),
      [inInputGroup("default")]: nested(sizes.controlMd),
      [inTooltip]: `calc(${radii.sm} - ${space.xxs})`,
    },
    borderEndEndRadius: {
      default: radii.chip,
      [inButton("sm")]: nested(sizes.controlSm),
      [inInputGroup("sm")]: nested(sizes.controlSm),
      [inButton("default")]: nested(sizes.controlMd),
      [inInputGroup("default")]: nested(sizes.controlMd),
      [inTooltip]: `calc(${radii.sm} - ${space.xxs})`,
    },
    color: {
      default: colors.textSecondary,
      [inTooltip]: colors.invertedOnSolid,
    },
    display: "inline-flex",
    // Keycaps read as labels, not code, so they take the text around them over `<kbd>`'s mono.
    fontFamily: "inherit",
    fontWeight: fontWeights.medium,
    gap: space.xxs,
    height: sizes.kbd,
    justifyContent: "center",
    minWidth: sizes.kbd,
    paddingInline: space.xxs,
    pointerEvents: "none",
    userSelect: "none",
  },
  group: {
    alignItems: "center",
    display: "inline-flex",
    gap: space.xxs,
  },
});

function Kbd({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"kbd">>) {
  return useRender({
    defaultTagName: "kbd",
    props: mergeProps<"kbd">(
      props,
      stylex.props([typeStyles.captionLg, styles.kbd], sx)
    ),
    render,
    state: { slot: "kbd" },
  });
}

function KbdGroup({ sx, ...props }: Styled<ComponentProps<"kbd">>) {
  return (
    <kbd data-slot="kbd-group" {...props} {...stylex.props(styles.group, sx)} />
  );
}

export { Kbd, KbdGroup };
