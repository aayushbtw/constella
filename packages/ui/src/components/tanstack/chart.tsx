"use client";

import * as stylex from "@stylexjs/stylex";
import type {
  ChartBuildContext,
  ChartPositionScaleOptions,
  ChartTooltipContent as ChartTooltipModel,
  ConfiguredScaleLike,
  ChartValue,
  DomChartDefinition,
} from "@tanstack/charts";
import { Chart as ChartPrimitive } from "@tanstack/charts/react/tooltip";
import type {
  ChartProps as ChartPrimitiveProps,
  ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";

import { ChartIndicator } from "@/components/tanstack/chart-legend";
import type {
  ChartConfig,
  ChartIndicatorVariant,
} from "@/components/tanstack/chart-legend";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fonts,
  fontWeights,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

/**
 * An axis's `ticks.format` for counts: `1.2M`, not `1200000`, and no `0.2` steps on whole
 * numbers. Takes the locale, as the server's default can differ from the reader's.
 */
const chartTickFormat = (locale: Intl.LocalesArgument) => {
  const compact = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    notation: "compact",
  });
  return (value: number) =>
    Number.isInteger(value) ? compact.format(value) : "";
};

const styles = stylex.create({
  root: {
    // Axis labels, ticks and grid lines are drawn in `currentColor`.
    color: colors.textMuted,
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
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    columnGap: space.xs,
    display: "grid",
    fontWeight: fontWeights.regular,
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    maxWidth: sizes.tooltip,
    paddingBlock: space.popup,
    paddingInlineEnd: space.popup,
    paddingInlineStart: space.popup,
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
});

function ChartTooltip({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="chart-tooltip"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.tooltip], sx)}
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
  sx?: Sx;
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

const tweenFor = Number(durations.chart.slice(0, -"ms".length));

/**
 * Eases each value toward `target` over `durations.chart`, or jumps when `animate` is false or
 * motion is reduced. Memoize `target`: a new object restarts the tween. Keep one chart's values in
 * one tween, or in tweens that share `animate`, so its axis and marks move together.
 */
function useChartTween<T extends Record<string, number>>(
  target: T,
  animate: boolean
): T {
  const [current, setCurrent] = useState(target);
  const painted = useRef(target);
  // Before paint, so a jump lands in the same frame as the axis it belongs to.
  useLayoutEffect(() => {
    const from = painted.current;
    const duration =
      animate && !matchMedia("(prefers-reduced-motion: reduce)").matches
        ? tweenFor
        : 0;
    // A real animation keeps time, so the tween takes the `out` curve and follows DevTools' playback speed.
    const clock = document.documentElement.animate(null, {
      duration,
      easing: easings.out,
      fill: "forwards",
    });
    const paint = () => {
      const eased = clock.effect?.getComputedTiming().progress ?? 1;
      const next = {
        ...target,
        ...Object.fromEntries(
          Object.entries(target).map(([key, value]) => {
            const begin = from[key] ?? 0;
            return [key, begin + (value - begin) * eased];
          })
        ),
      };
      painted.current = next;
      setCurrent(next);
    };
    if (duration === 0) {
      paint();
    }
    let frame = requestAnimationFrame(function step() {
      paint();
      if (clock.playState !== "finished") {
        frame = requestAnimationFrame(step);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      clock.cancel();
    };
  }, [animate, target]);
  return current;
}

/**
 * A `group({ scale })` band scale where each series takes `weight` (0 to 1) of a slot, so a slot
 * eases open or shut with `useChartTween`. Every bar keeps the full bandwidth and is pulled inside
 * the group: put a closing series' rows first, and it paints under the bars that grow over it.
 */
const chartGroupScale = (
  weights: readonly (readonly [string, number])[],
  padding = 0
): ConfiguredScaleLike<string> => {
  let [from, to] = [0, 1];
  // At least one slot wide, so a last series closing doesn't stretch its bars.
  const total = Math.max(
    1,
    weights.reduce((sum, [, weight]) => sum + weight, 0)
  );
  const step = () => (to - from) / (total + padding);
  const scale = (key: string) => {
    const index = weights.findIndex(([member]) => member === key);
    // Not a member: NaN, which TanStack reports as a key outside the group's domain.
    if (index === -1) {
      return Number.NaN;
    }
    const before = weights
      .slice(0, index)
      .reduce((sum, [, weight]) => sum + weight, 0);
    const first = from + step() * padding;
    return Math.min(first + step() * before, first + step() * (total - 1));
  };
  const band = Object.assign(scale, {
    bandwidth: () => step() * (1 - padding),
    copy: () => chartGroupScale(weights, padding).range([from, to]),
    domain: () => weights.map(([member]) => member),
    // TanStack sets the range in place and reads the bandwidth after.
    range: (values: Iterable<number>) => {
      [from = 0, to = 1] = values;
      return band;
    },
  });
  return band;
};

type ChartScales = Readonly<Record<string, ChartPositionScaleOptions | null>>;

// captionLg's 12, set on the axes, not in CSS: TanStack measures labels by this number for margins and thinning.
const tickLabelSize = 12;

const withTickLabelSize = <TSpec extends { scales?: ChartScales }>(
  spec: TSpec
): TSpec =>
  spec.scales === undefined
    ? spec
    : {
        ...spec,
        scales: Object.fromEntries(
          Object.entries(spec.scales).map(([id, options]) => [
            id,
            options === null ||
            options.axis === false ||
            options.axis?.tickLabels === false
              ? options
              : {
                  ...options,
                  axis: {
                    ...options.axis,
                    tickLabels: {
                      fontSize: tickLabelSize,
                      ...options.axis?.tickLabels,
                    },
                  },
                },
          ])
        ),
      };

const withChartDefaults = <
  TDatum,
  TXValue extends ChartValue,
  TYValue extends ChartValue,
>(
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
): DomChartDefinition<TDatum, TXValue, TYValue> =>
  "chart" in definition
    ? {
        ...definition,
        chart: (context: ChartBuildContext) =>
          withTickLabelSize(definition.chart(context)),
      }
    : withTickLabelSize(definition);

/** Renders a TanStack Charts definition in the theme's palette, with a `ChartTooltipContent` unless `renderTooltipBody` replaces it. Axis labels default to 12px. */
function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  animate = false,
  config,
  onRender,
  renderTooltipBody,
  sx,
  ...props
}: Styled<ChartPrimitiveProps<TDatum, TXValue, TYValue>> & {
  /** Axis labels that arrive, move or change with this definition fade in; set it for a click, not a key press. */
  animate?: boolean;
  /** Names the series in the default tooltip. */
  config?: ChartConfig;
}) {
  // Where each axis label was painted, so only the ones a change adds or moves fade in; a resize
  // moves labels too, so only a new definition counts.
  const placed = useRef(
    new WeakMap<Element, { text: string | null; x: number; y: number }>()
  );
  const painted = useRef(props.definition);
  const definition = useMemo(
    () => withChartDefaults(props.definition),
    [props.definition]
  );
  const renderConfigTooltip = ({ content }: ChartTooltipBodyRenderContext) => (
    <ChartTooltipContent config={config} content={content} />
  );
  const fadeLabels: typeof onRender = (context) => {
    const changed = painted.current !== props.definition;
    painted.current = props.definition;
    for (const label of context.svg.querySelectorAll(".ts-chart__axes text")) {
      const at = {
        text: label.textContent,
        x: Number(label.getAttribute("x")),
        y: Number(label.getAttribute("y")),
      };
      const was = placed.current.get(label);
      // A label width change nudges the plot under a pixel; that isn't a move.
      const moved =
        was === undefined ||
        was.text !== at.text ||
        Math.hypot(at.x - was.x, at.y - was.y) >= 1;
      if (animate && changed && moved) {
        // From partway, never from nothing: the old label is already gone.
        label.animate([{ opacity: 0.4 }, { opacity: 1 }], {
          duration: tweenFor,
          easing: easings.crossfade,
        });
      }
      placed.current.set(label, at);
    }
    onRender?.(context);
  };
  return (
    <div
      data-slot="chart"
      {...stylex.props([typeStyles.captionLg, styles.root], sx)}
    >
      <ChartPrimitive
        onRender={fadeLabels}
        renderTooltipBody={renderTooltipBody ?? renderConfigTooltip}
        {...props}
        definition={definition}
      />
    </div>
  );
}

export {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  chartTickFormat,
  chartGroupScale,
  useChartTween,
};
