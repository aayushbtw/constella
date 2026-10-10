import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const alertStatuses = ["success", "info", "warning", "danger"] as const;

type AlertStatus = (typeof alertStatuses)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type AlertProps = Styled<ComponentProps<"div">> & { status?: AlertStatus };

const hasIcon = ":has(> svg)";
const hasAction = ":has(> [data-slot='alert-action'])";
// The title and description sit in the column after the icon, when there is one.
const text = {
  default: 1,
  ":is([data-slot='alert']:has(> svg) > *)": 2,
};

const narrow = "@container (max-width: 24rem)";

// shadcn's padding, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  alert: {
    backgroundColor: colors.raised,
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
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
    fontSize: fontSizes.sm,
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [hasIcon]: "auto minmax(0, 1fr)",
      [hasAction]: "minmax(0, 1fr) auto",
      [`${hasIcon}${hasAction}`]: "auto minmax(0, 1fr) auto",
    },
    lineHeight: lineHeights.text,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: px10,
    paddingInlineStart: px10,
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

function Alert({ status, sx, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-status={status}
      role="alert"
      {...props}
      {...stylex.props(styles.alert, sx)}
    />
  );
}

function AlertTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
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

export { Alert, AlertAction, AlertDescription, alertStatuses, AlertTitle };
export type { AlertProps, AlertStatus };
