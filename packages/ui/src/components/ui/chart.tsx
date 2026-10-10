"use client";

import * as stylex from "@stylexjs/stylex";
import type {
  ChartTooltipContent as ChartTooltipModel,
  ChartValue,
} from "@tanstack/charts";
import { Chart as ChartPrimitive } from "@tanstack/charts/react/tooltip";
import type {
  ChartProps as ChartPrimitiveProps,
  ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip";
import type { ComponentProps, ReactNode } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  colors,
  durations,
  easings,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

/** Each series by its value in the data: its name, and its paint when not the next in the palette. */
type ChartConfig = Record<string, { color?: string; label?: ReactNode }>;

const palette = [
  colors.chart1,
  colors.chart2,
  colors.chart3,
  colors.chart4,
  colors.chart5,
  colors.chart6,
];

// Past six, a series is "Other" rather than a reused hue, so it takes muted ink.
const chartSeries = (config: ChartConfig) =>
  Object.entries(config).map(([key, series], index) => ({
    color: series.color ?? palette[index] ?? colors.textMuted,
    key,
    label: series.label ?? key,
  }));

/** The definition's `color`: every series in `config` keeps its paint, shown or hidden. */
const chartColor = (config: ChartConfig) => {
  const series = chartSeries(config);
  return {
    domain: series.map(({ key }) => key),
    range: series.map(({ color }) => color),
  };
};

const px10 = `calc(${space.sm} - ${space.xxxs})`;

const hidden = ":is([data-slot='chart-legend-item']:not([data-pressed]) > *)";

const styles = stylex.create({
  root: {
    // Axis labels, ticks and grid lines are drawn in `currentColor`.
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    minWidth: 0,
  },
  // A popover's surface: it holds figures to read, not a one-line hint.
  // Rows share its columns (indicator, label, value), so one without an indicator still lines up.
  tooltip: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.popover,
    color: colors.textPrimary,
    columnGap: space.xs,
    display: "grid",
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    lineHeight: lineHeights.text,
    maxWidth: sizes.tooltip,
    paddingBlock: px10,
    paddingInlineEnd: px10,
    paddingInlineStart: px10,
    rowGap: space.xxxs,
    whiteSpace: "pre-line",
  },
  title: {
    alignItems: "center",
    columnGap: space.xs,
    display: "flex",
    fontWeight: fontWeights.medium,
    gridColumnEnd: -1,
    gridColumnStart: 1,
    marginBlockEnd: space.xxs,
  },
  row: {
    alignItems: "center",
    display: "grid",
    gridColumnEnd: -1,
    gridColumnStart: 1,
    gridTemplateColumns: "subgrid",
  },
  // The series under the pointer reads a step stronger than its neighbors.
  label: {
    color: {
      default: colors.textSecondary,
      ":is([data-active] > *)": colors.textPrimary,
    },
    gridColumnStart: 2,
    minWidth: 0,
  },
  value: {
    fontFamily: fonts.mono,
    fontWeight: fontWeights.medium,
    gridColumnStart: 3,
    paddingInlineStart: space.md,
    textAlign: "end",
  },
  // Hollow in a hidden legend entry, so its state isn't color alone.
  indicator: (color: string) => ({
    backgroundColor: { default: color, [hidden]: "transparent" },
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    boxShadow: `inset 0 0 0 ${strokes.border} ${color}`,
    flexShrink: 0,
    gridColumnStart: 1,
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
  }),
  dot: {
    height: sizes.iconXxs,
    width: sizes.iconXxs,
  },
  // A short bar beside a row of figures.
  line: {
    height: sizes.iconSm,
    width: strokes.track,
  },
  legend: {
    flexWrap: "wrap",
    // Back by an item's start padding and border, so each row's first dot lines up with the text above.
    marginInlineStart: `calc(-1 * (${space.xs} - ${space.xxxs} + ${strokes.border}))`,
  },
  // Every entry starts shown, so shown stays quiet and hidden is the state that reads.
  legendItem: {
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fillSubtle },
      ":active": colors.fillSubtle,
    },
    color: {
      default: colors.textMuted,
      ":is([data-pressed])": colors.textPrimary,
    },
    // Button's transitions (button.tsx `base`, kept in step by hand: StyleX can't import them),
    // plus the label's color, so hiding a series fades like its fill.
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}, ${durations.hover}, ${durations.hover}`,
    transitionProperty:
      "transform, background-color, box-shadow, opacity, color",
    transitionTimingFunction: `${easings.out}, ease, ease, ease, ease`,
  },
});

const chartIndicatorVariants = ["dot", "line"] as const;

type ChartIndicatorVariant = (typeof chartIndicatorVariants)[number];

/** A series' key, in its chart paint like `colors.chart1`. */
function ChartIndicator({
  color,
  sx,
  variant = "dot",
  ...props
}: Styled<ComponentProps<"span">> & {
  color: string;
  variant?: ChartIndicatorVariant;
}) {
  return (
    <span
      data-icon="inline-start"
      data-slot="chart-indicator"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.indicator(color), styles[variant], sx)}
    />
  );
}

function ChartTooltip({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="chart-tooltip"
      {...props}
      {...stylex.props(styles.tooltip, sx)}
    />
  );
}

function ChartTooltipTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="chart-tooltip-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function ChartTooltipRow({
  active = false,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & {
  /** The point under the pointer or keyboard, among the rows of its group. */
  active?: boolean;
}) {
  return (
    <div
      data-active={active ? "" : undefined}
      data-slot="chart-tooltip-row"
      {...props}
      {...stylex.props(styles.row, sx)}
    />
  );
}

function ChartTooltipLabel({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="chart-tooltip-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function ChartTooltipValue({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="chart-tooltip-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

/** Renders TanStack Charts' tooltip content as a `ChartTooltip`, naming each series by `config`. */
function ChartTooltipContent({
  config,
  content,
  hideLabel = false,
  indicator = "line",
  sx,
}: {
  config?: ChartConfig;
  content: ChartTooltipModel | string;
  /** Leaves out the title, the shared x value. */
  hideLabel?: boolean;
  indicator?: ChartIndicatorVariant;
  sx?: stylex.StyleXStyles;
}) {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- TanStack Charts hands plain text when the definition sets `format`
  if (typeof content === "string") {
    return <ChartTooltip sx={sx}>{content}</ChartTooltip>;
  }
  return (
    <ChartTooltip sx={sx}>
      {hideLabel ||
      content.title === undefined ||
      content.title === "" ? null : (
        <ChartTooltipTitle>
          {content.color === undefined ? null : (
            <ChartIndicator color={content.color} variant={indicator} />
          )}
          {content.title}
        </ChartTooltipTitle>
      )}
      {content.rows.map((row, index) => (
        // Two marks on one series give two rows with its label.
        <ChartTooltipRow active={row.active} key={`${row.label}-${index}`}>
          {row.color === undefined ? null : (
            <ChartIndicator color={row.color} variant={indicator} />
          )}
          <ChartTooltipLabel>
            {config?.[row.label]?.label ?? row.label}
          </ChartTooltipLabel>
          <ChartTooltipValue>{row.value}</ChartTooltipValue>
        </ChartTooltipRow>
      ))}
    </ChartTooltip>
  );
}

/** Renders a TanStack Charts definition in the theme's palette, with a `ChartTooltipContent` unless `renderTooltipBody` replaces it. */
function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  config,
  renderTooltipBody,
  sx,
  ...props
}: Styled<ChartPrimitiveProps<TDatum, TXValue, TYValue>> & {
  /** Names the series in the default tooltip. */
  config?: ChartConfig;
}) {
  const renderConfigTooltip = ({ content }: ChartTooltipBodyRenderContext) => (
    <ChartTooltipContent config={config} content={content} />
  );
  return (
    <div data-slot="chart" {...stylex.props(styles.root, sx)}>
      <ChartPrimitive
        renderTooltipBody={renderTooltipBody ?? renderConfigTooltip}
        {...props}
      />
    </div>
  );
}

/** The series a chart shows, each a toggle; `value` lists the shown ones. */
function ChartLegend({
  sx,
  ...props
}: Omit<ComponentProps<typeof ToggleGroup>, "multiple">) {
  return (
    <ToggleGroup
      data-slot="chart-legend"
      multiple
      size="sm"
      spacing={1}
      {...props}
      sx={[styles.legend, sx]}
    />
  );
}

function ChartLegendItem({
  sx,
  ...props
}: ComponentProps<typeof ToggleGroupItem>) {
  return (
    <ToggleGroupItem
      data-slot="chart-legend-item"
      {...props}
      sx={[styles.legendItem, sx]}
    />
  );
}

/** Renders a `ChartLegend` with an item per series in `config`, in its order. */
function ChartLegendContent({
  config,
  ...props
}: Omit<ComponentProps<typeof ChartLegend>, "children"> & {
  config: ChartConfig;
}) {
  return (
    <ChartLegend {...props}>
      {chartSeries(config).map(({ color, key, label }) => (
        <ChartLegendItem key={key} value={key}>
          <ChartIndicator color={color} />
          {label}
        </ChartLegendItem>
      ))}
    </ChartLegend>
  );
}

export {
  Chart,
  ChartIndicator,
  ChartLegend,
  ChartLegendContent,
  ChartLegendItem,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  chartColor,
  chartIndicatorVariants,
};
export type { ChartConfig, ChartIndicatorVariant };
