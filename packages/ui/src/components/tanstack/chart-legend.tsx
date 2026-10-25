"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
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

// The seventh is `chartFold`'s "Other", so it takes muted ink rather than a reused hue.
const chartSeries = (config: ChartConfig) =>
  Object.entries(config).map(([key, series], index) => ({
    color: series.color ?? palette[index] ?? colors.textMuted,
    key,
    label: series.label ?? key,
  }));

/**
 * Folds every series past six into one `other`, summing the rows that share their other fields, so
 * no hue repeats. `series` and `value` name the rows' series and number fields.
 */
const chartFold = <TRow extends Record<string, unknown>>(
  config: ChartConfig,
  rows: readonly TRow[],
  {
    label = "Other",
    series,
    value,
  }: { label?: ReactNode; series: keyof TRow; value: keyof TRow }
) => {
  const keys = Object.keys(config);
  if (keys.length <= palette.length) {
    return { config, rows };
  }
  const kept = new Set(keys.slice(0, palette.length));
  const folded: TRow[] = [];
  const at = new Map<string, number>();
  for (const row of rows) {
    if (kept.has(String(row[series]))) {
      folded.push(row);
      continue;
    }
    const by = JSON.stringify(
      Object.entries(row).filter(
        ([field]) => field !== series && field !== value
      )
    );
    const index = at.get(by);
    if (index === undefined) {
      at.set(by, folded.length);
      folded.push({ ...row, [series]: "other", [value]: Number(row[value]) });
    } else {
      const sum = folded[index];
      folded[index] = {
        ...sum,
        [value]: Number(sum[value]) + Number(row[value]),
      };
    }
  }
  return {
    config: {
      ...Object.fromEntries(
        keys.slice(0, palette.length).map((key) => [key, config[key]])
      ),
      other: { label },
    },
    rows: folded,
  };
};

/** The definition's `color`: every series in `config` keeps its paint, shown or hidden. */
const chartColor = (config: ChartConfig) => {
  const series = chartSeries(config);
  return {
    domain: series.map(({ key }) => key),
    range: series.map(({ color }) => color),
  };
};

const hidden = ":is([data-slot='chart-legend-item']:not([data-pressed]) > *)";

const styles = stylex.create({
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
    fontWeight: fontWeights.regular,
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
  ChartIndicator,
  ChartLegend,
  ChartLegendContent,
  ChartLegendItem,
  chartColor,
  chartFold,
  chartIndicatorVariants,
};
export type { ChartConfig, ChartIndicatorVariant };
