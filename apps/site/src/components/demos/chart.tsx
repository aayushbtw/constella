import * as stylex from "@stylexjs/stylex";
import { areaY, barY, defineChart, group, lineY } from "@tanstack/charts";
import { crosshair } from "@tanstack/charts/crosshair";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Chart,
  ChartIndicator,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  chartColor,
  chartGroupScale,
  useChartTween,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { colors, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  card: { maxWidth: "100%", width: 480 },
  content: { display: "flex", flexDirection: "column", gap: space.sm },
});

const deviceConfig = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

const browserConfig = {
  chrome: { label: "Chrome" },
  safari: { label: "Safari" },
  firefox: { label: "Firefox" },
  edge: { label: "Edge" },
  other: { label: "Other" },
} satisfies ChartConfig;

interface Visits {
  device: keyof typeof deviceConfig;
  month: string;
  visitors: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const visitors: Visits[] = [
  [186, 80],
  [305, 200],
  [237, 120],
  [73, 190],
  [209, 130],
  [214, 140],
].flatMap(([desktop, mobile], index) => [
  { device: "desktop", month: months[index], visitors: desktop },
  { device: "mobile", month: months[index], visitors: mobile },
]);

const browsers = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];

// The grid carries the scale and the labels the values, so no axis line or tick stubs.
const axis = { line: false, ticks: { size: 0 } };

// Beside the pointer, so it never covers the values it reads.
const besidePointer = {
  use: tooltip,
  anchor: "pointer",
  placement: ["right", "left"],
} as const;

const visitorsY = {
  grid: true,
  axis: { ...axis, ticks: { ...axis.ticks, count: 4 } },
};

const barDefinition = (
  rows: typeof visitors,
  max: number,
  weights: readonly (readonly [string, number])[]
) =>
  defineChart({
    marks: [
      // Under the bars, the column the tooltip reads.
      crosshair({
        x: { band: { fill: colors.fillSubtle, fillOpacity: 1, radius: 4 } },
        y: false,
      }),
      barY(rows, {
        x: "month",
        y: "visitors",
        z: "device",
        color: "device",
        layout: group({ scale: chartGroupScale(weights, 0.1) }),
        radius: 4,
        inset: 1,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.25), axis },
      y: { ...visitorsY, scale: scaleLinear().domain([0, max]) },
    },
    color: chartColor(deviceConfig),
    focus: "group-x",
    focusRing: false,
    tooltip: besidePointer,
  });

// A line per series, so each can fade on its own.
const lineDefinition = (
  rows: typeof visitors,
  domain: readonly [number, number],
  opacities: readonly (readonly [string, number])[]
) =>
  defineChart({
    marks: [
      crosshair({ x: true, y: false }),
      ...opacities.map(([device, opacity]) =>
        lineY(
          rows.filter((row) => row.device === device),
          {
            id: `line-${device}`,
            x: "month",
            y: "visitors",
            color: "device",
            strokeOpacity: opacity,
            strokeWidth: 2,
          }
        )
      ),
    ],
    // A fading line follows the scale past the plot's edge.
    clip: true,
    scales: {
      x: { scale: () => scalePoint().padding(0.25), axis },
      y: { ...visitorsY, scale: scaleLinear().domain(domain) },
    },
    color: chartColor(deviceConfig),
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: besidePointer,
  });

const areaDefinition = (rows: typeof visitors, max: number) =>
  defineChart({
    marks: [
      areaY(rows, {
        x: "month",
        y: "visitors",
        z: "device",
        color: "device",
        fillOpacity: 0.7,
      }),
    ],
    scales: {
      x: { scale: () => scalePoint(), axis },
      y: { ...visitorsY, scale: scaleLinear().domain([0, max]) },
    },
    color: chartColor(deviceConfig),
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: besidePointer,
  });

const pieDefinition = (rows: typeof browsers) =>
  defineChart({
    marks: [
      polar({
        inset: 8,
        marks: [
          radialArc(pie(rows, { value: "visitors", gapAngle: 0.012 }), {
            innerRadius: ({ radius }) => radius * 0.6,
            color: "browser",
            key: "browser",
          }),
        ],
        scales: { angle: null, radius: null },
      }),
    ],
    scales: { x: null, y: null },
    color: chartColor(browserConfig),
    focusRing: false,
    tooltip: {
      ...besidePointer,
      content: (points) => ({
        rows: points.map(({ color, datum }) => ({
          color,
          label: datum.browser,
          value: datum.visitors.toLocaleString(),
        })),
      }),
    },
  });

// The series shown, and a legend that toggles them; the last one shown stays. Only a click
// animates: a keyboard press reports a `detail` of 0.
function useLegend(config: ChartConfig) {
  const [shown, setShown] = useState<string[]>(() => Object.keys(config));
  const [animate, setAnimate] = useState(false);
  const legend = (
    <ChartLegendContent
      aria-label="Series"
      config={config}
      onValueChange={(next, { event }) => {
        if (next.length > 0) {
          setShown(next);
          setAnimate(event instanceof MouseEvent && event.detail > 0);
        }
      }}
      value={shown}
    />
  );
  return { animate, legend, shown };
}

// The rows of the series shown, each eased to its new value, or toward 0 while it leaves.
function useEasedRows<T extends { visitors: number }>(
  rows: readonly T[],
  seriesOf: (row: T) => string,
  keyOf: (row: T) => string,
  shown: readonly string[],
  animate: boolean
) {
  const target = useMemo(
    () =>
      Object.fromEntries(
        rows.map((row) => [
          keyOf(row),
          shown.includes(seriesOf(row)) ? row.visitors : 0,
        ])
      ),
    [keyOf, rows, seriesOf, shown]
  );
  const values = useChartTween(target, animate);
  return useMemo(
    () =>
      rows
        .map((row) => ({ ...row, visitors: values[keyOf(row)] ?? 0 }))
        .filter((row) => row.visitors > 0),
    [keyOf, rows, values]
  );
}

// Each device's share of the chart: 1 shown, 0 hidden, eased between.
const deviceWeights = (shown: readonly string[]) => ({
  desktop: shown.includes("desktop") ? 1 : 0,
  mobile: shown.includes("mobile") ? 1 : 0,
});

const visibleWeights = (weights: ReturnType<typeof deviceWeights>) =>
  Object.entries(weights).filter(([, weight]) => weight > 0);

const deviceOf = (row: Visits) => row.device;
const visitKey = (row: Visits) => `${row.month}-${row.device}`;
const browserOf = (row: (typeof browsers)[number]) => row.browser;

// A range rounded out as `nice` would round it.
const axisDomain = (from: number, to: number) => {
  const [min, max] = scaleLinear()
    .domain([from, to])
    .nice(visitorsY.axis.ticks.count)
    .domain();
  return [min, max] as const;
};

const axisMax = (values: number[]) => axisDomain(0, Math.max(...values))[1];

const stackTop = (shown: readonly string[]) =>
  axisMax(
    months.map((month) =>
      visitors
        .filter((row) => row.month === month && shown.includes(row.device))
        .reduce((sum, row) => sum + row.visitors, 0)
    )
  );

const barTop = (shown: readonly string[]) =>
  axisMax(
    visitors
      .filter((row) => shown.includes(row.device))
      .map((row) => row.visitors)
  );

function ChartCard({
  children,
  description,
  legend,
  title,
}: {
  children: React.ReactNode;
  description: string;
  legend: React.ReactNode;
  title: string;
}) {
  return (
    <DemoRow sx={styles.stage}>
      <Card sx={styles.card}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent sx={styles.content}>
          {legend}
          {children}
        </CardContent>
      </Card>
    </DemoRow>
  );
}

function ChartDemo() {
  const { animate, legend, shown } = useLegend(deviceConfig);
  const rows = useEasedRows(visitors, deviceOf, visitKey, shown, animate);
  const target = useMemo(
    () => ({ ...deviceWeights(shown), max: barTop(shown) }),
    [shown]
  );
  const eased = useChartTween(target, animate);
  // On the final axis, scaled by the eased one, so bars move from where they were. A closing
  // slot's bars go first, so they paint under the bars that widen over them.
  const definition = useMemo(
    () =>
      barDefinition(
        rows
          .map((row) => ({
            ...row,
            visitors: (row.visitors * target.max) / eased.max,
          }))
          .toSorted((a, b) => eased[a.device] - eased[b.device]),
        target.max,
        visibleWeights({ desktop: eased.desktop, mobile: eased.mobile })
      ),
    [eased, rows, target]
  );
  return (
    <ChartCard description="January to June" legend={legend} title="Visitors">
      <Chart
        animate={animate}
        ariaLabel="Monthly visitors on desktop and mobile, January to June"
        config={deviceConfig}
        definition={definition}
        height={240}
        initialWidth={432}
      />
    </ChartCard>
  );
}

function ChartLineDemo() {
  const { animate, legend, shown } = useLegend(deviceConfig);
  const target = useMemo(() => {
    const values = visitors
      .filter((row) => shown.includes(row.device))
      .map((row) => row.visitors);
    const [min, max] = axisDomain(Math.min(...values), Math.max(...values));
    return { ...deviceWeights(shown), max, min };
  }, [shown]);
  const eased = useChartTween(target, animate);
  // Lines keep their values, mapped from the eased axis onto the final one, so they move from
  // where they were. A series leaving or arriving fades.
  const definition = useMemo(
    () =>
      lineDefinition(
        visitors.map((row) => ({
          ...row,
          visitors:
            target.min +
            ((row.visitors - eased.min) * (target.max - target.min)) /
              (eased.max - eased.min),
        })),
        [target.min, target.max],
        visibleWeights({ desktop: eased.desktop, mobile: eased.mobile })
      ),
    [eased, target]
  );
  return (
    <ChartCard description="January to June" legend={legend} title="Visitors">
      <Chart
        animate={animate}
        ariaLabel="Monthly visitors on desktop and mobile, January to June"
        config={deviceConfig}
        definition={definition}
        height={240}
        initialWidth={432}
      />
    </ChartCard>
  );
}

// The stack's own rows, then what they add up to.
const renderTotalTooltip = ({
  points,
  primaryPoint,
}: ChartTooltipBodyRenderContext<(typeof visitors)[number]>) => (
  <ChartTooltip>
    <ChartTooltipTitle>{points[0]?.datum.month}</ChartTooltipTitle>
    {points.map((point) => (
      <ChartTooltipRow active={point === primaryPoint} key={point.key}>
        <ChartIndicator color={point.color} variant="line" />
        <ChartTooltipLabel>
          {deviceConfig[point.datum.device].label}
        </ChartTooltipLabel>
        <ChartTooltipValue>{point.datum.visitors}</ChartTooltipValue>
      </ChartTooltipRow>
    ))}
    <ChartTooltipRow>
      <ChartTooltipLabel>Total</ChartTooltipLabel>
      <ChartTooltipValue>
        {points.reduce((sum, point) => sum + point.datum.visitors, 0)}
      </ChartTooltipValue>
    </ChartTooltipRow>
  </ChartTooltip>
);

function ChartAreaDemo() {
  const { animate, legend, shown } = useLegend(deviceConfig);
  const rows = useEasedRows(visitors, deviceOf, visitKey, shown, animate);
  const target = useMemo(() => ({ max: stackTop(shown) }), [shown]);
  const { max } = useChartTween(target, animate);
  // On the final axis, scaled by the eased one, so the stack moves from where it was.
  const definition = useMemo(
    () =>
      areaDefinition(
        rows.map((row) => ({
          ...row,
          visitors: (row.visitors * target.max) / max,
        })),
        target.max
      ),
    [max, rows, target]
  );
  return (
    <ChartCard
      description="January to June, stacked"
      legend={legend}
      title="Visitors"
    >
      <Chart
        animate={animate}
        ariaLabel="Monthly visitors on desktop and mobile stacked, January to June"
        definition={definition}
        height={240}
        initialWidth={432}
        renderTooltipBody={renderTotalTooltip}
      />
    </ChartCard>
  );
}

function ChartPieDemo() {
  const { animate, legend, shown } = useLegend(browserConfig);
  const rows = useEasedRows(browsers, browserOf, browserOf, shown, animate);
  const definition = useMemo(() => pieDefinition(rows), [rows]);
  return (
    <ChartCard
      description="January to June"
      legend={legend}
      title="Visitors by browser"
    >
      <Chart
        ariaLabel="Visitors by browser, January to June"
        config={browserConfig}
        definition={definition}
        height={240}
        initialWidth={432}
      />
    </ChartCard>
  );
}

export { ChartAreaDemo, ChartDemo, ChartLineDemo, ChartPieDemo };
