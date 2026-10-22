import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  radii,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const alertColors = ["success", "info", "warning", "danger"] as const;

type AlertColor = (typeof alertColors)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type AlertProps = Styled<ComponentProps<"div">> & { color?: AlertColor };

const hasIcon = ":has(> svg)";
const hasAction = ":has(> [data-slot='alert-action'])";
// The title and description sit in the column after the icon, when there is one.
const text = {
  default: 1,
  ":is([data-slot='alert']:has(> svg) > *)": 2,
};

const narrow = "@container (max-width: 24rem)";

const styles = stylex.create({
  alert: {
    backgroundColor: colors.raised,
    borderBlockEndColor: colors.border,
    borderBlockStartColor: colors.border,
    borderInlineEndColor: colors.border,
    borderInlineStartColor: colors.border,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.textPrimary,
    columnGap: space.xs,
    // The action reads the alert's width, to drop under the text when they can't share a row.
    containerType: "inline-size",
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [hasIcon]: "auto minmax(0, 1fr)",
      [hasAction]: "minmax(0, 1fr) auto",
      [`${hasIcon}${hasAction}`]: "auto minmax(0, 1fr) auto",
    },
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.popup,
    paddingInlineStart: space.popup,
    rowGap: space.xxxs,
    textAlign: "start",
    width: "100%",
  },
  title: {
    fontWeight: fontWeights.medium,
    gridColumnStart: text,
    overflowWrap: "anywhere",
  },
  description: {
    color: colors.textSecondary,
    gridColumnStart: text,
    overflowWrap: "anywhere",
    textWrap: "pretty",
  },
  action: {
    alignSelf: "center",
    gridColumnEnd: -1,
    gridColumnStart: { default: null, [narrow]: text },
    gridRowEnd: { default: "span 2", [narrow]: "auto" },
    gridRowStart: { default: 1, [narrow]: "auto" },
    justifySelf: { default: null, [narrow]: "start" },
    marginBlockStart: { default: null, [narrow]: space.xxs },
  },
});

function Alert({ color, sx, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-color={color}
      role="alert"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.alert], sx)}
    />
  );
}

function AlertTitle({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.title, sx)),
    render,
    state: { slot: "alert-title" },
  });
}

function AlertDescription({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function AlertAction({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-action"
      {...props}
      {...stylex.props(styles.action, sx)}
    />
  );
}

export { Alert, AlertAction, AlertDescription, alertColors, AlertTitle };
export type { AlertProps, AlertColor };
