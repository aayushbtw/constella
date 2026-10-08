"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { labelStyles } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  colors,
  durations,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const fieldOrientations = ["vertical", "horizontal"] as const;
type FieldOrientation = (typeof fieldOrientations)[number];

const legendVariants = ["legend", "label"] as const;
type LegendVariant = (typeof legendVariants)[number];

const card = ":has(> [data-slot='field-content'])";

const styles = stylex.create({
  set: {
    borderWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  legend: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    padding: 0,
  },
  legendLegend: { fontSize: fontSizes.md },
  legendLabel: { fontSize: fontSizes.sm },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    width: "100%",
  },
  field: {
    display: "flex",
    gap: space.xs,
    width: "100%",
  },
  vertical: {
    flexDirection: "column",
  },
  // With a description, top-aligned, so it grows downward and the control stays on the first line.
  horizontal: {
    alignItems: {
      default: "center",
      ":has(> [data-slot='field-content'])": "flex-start",
    },
    flexDirection: "row",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: space.xxxs,
    minWidth: 0,
  },
  // A label that wraps a control and its content becomes a card: the whole box toggles it.
  label: {
    alignItems: { default: "center", [card]: "flex-start" },
    backgroundColor: {
      default: null,
      [card]: {
        default: "transparent",
        ":has([data-checked])": colors.fillSubtle,
        [media.hover]: {
          default: "transparent",
          ":hover:not([data-disabled])": colors.fillSubtle,
          ":has([data-checked])": colors.fillSubtle,
        },
      },
    },
    borderColor: {
      default: null,
      [card]: {
        default: colors.edge,
        ":has([data-checked])": colors.accent,
      },
    },
    borderRadius: { default: null, [card]: radii.md },
    borderStyle: { default: null, [card]: "solid" },
    borderWidth: { default: null, [card]: strokes.border },
    cursor: {
      default: null,
      [card]: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    },
    gap: { default: space.xs, [card]: space.sm },
    padding: { default: null, [card]: space.sm },
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: "ease",
    width: { default: "fit-content", [card]: "100%" },
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.row,
    margin: 0,
    textWrap: "pretty",
  },
  // A line, or a line broken by its text, so it needs no fill to sit on any surface.
  separator: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    lineHeight: lineHeights.text,
    marginBlock: `calc(-1 * ${space.xs})`,
    minHeight: lineHeights.text,
  },
  separatorLine: { flex: 1 },
  // The only red in an invalid field besides the control's edge, a step under the label.
  error: {
    color: colors.danger,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
  },
});

const orientationStyles = {
  horizontal: styles.horizontal,
  vertical: styles.vertical,
} satisfies Record<FieldOrientation, stylex.StyleXStyles>;

const legendStyles = {
  label: styles.legendLabel,
  legend: styles.legendLegend,
} satisfies Record<LegendVariant, stylex.StyleXStyles>;

function FieldSet({ sx, ...props }: Styled<FieldsetPrimitive.Root.Props>) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      {...props}
      {...stylex.props(styles.set, sx)}
    />
  );
}

function FieldLegend({
  sx,
  variant = "legend",
  ...props
}: Styled<FieldsetPrimitive.Legend.Props> & { variant?: LegendVariant }) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.legend, legendStyles[variant], sx)}
    />
  );
}

function FieldGroup({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="field-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function Field({
  orientation = "vertical",
  sx,
  ...props
}: Styled<FieldPrimitive.Root.Props> & { orientation?: FieldOrientation }) {
  return (
    <FieldPrimitive.Root
      data-orientation={orientation}
      data-slot="field"
      {...props}
      {...stylex.props(styles.field, orientationStyles[orientation], sx)}
    />
  );
}

function FieldContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="field-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

function FieldLabel({ sx, ...props }: Styled<FieldPrimitive.Label.Props>) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      {...props}
      {...stylex.props(labelStyles(), styles.label, sx)}
    />
  );
}

/** A label's look without the `<label>`, for a card's heading inside a `FieldLabel`. */
function FieldTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="field-title"
      {...props}
      {...stylex.props(labelStyles(), sx)}
    />
  );
}

function FieldDescription({
  sx,
  ...props
}: Styled<FieldPrimitive.Description.Props>) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

/** A fieldset's helper text. Base UI's description only works inside a `Field`. */
function FieldSetDescription({ sx, ...props }: Styled<ComponentProps<"p">>) {
  return (
    <p
      data-slot="field-set-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function FieldError({ sx, ...props }: Styled<FieldPrimitive.Error.Props>) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      {...props}
      {...stylex.props(styles.error, sx)}
    />
  );
}

function FieldSeparator({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-content={children !== undefined}
      data-slot="field-separator"
      {...props}
      {...stylex.props(styles.separator, sx)}
    >
      <Separator sx={styles.separatorLine} />
      {children !== undefined && (
        <>
          <span data-slot="field-separator-content">{children}</span>
          <Separator sx={styles.separatorLine} />
        </>
      )}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldSetDescription,
  FieldTitle,
  fieldOrientations,
  legendVariants,
};
export type { FieldOrientation, LegendVariant };
