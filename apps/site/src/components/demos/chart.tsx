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
  scale: scaleLinear,
  nice: true,
  grid: true,
  axis: { ...axis, ticks: { ...axis.ticks, count: 4 } },
};

const barDefinition = (rows: typeof visitors) =>
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
        layout: group({ padding: 0.1 }),
        radius: 4,
        inset: 1,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.25), axis },
      y: visitorsY,
    },
    color: chartColor(deviceConfig),
    focus: "group-x",
    focusRing: false,
    tooltip: besidePointer,
  });

const lineDefinition = (rows: typeof visitors) =>
  defineChart({
    marks: [
      crosshair({ x: true, y: false }),
      lineY(rows, {
        x: "month",
        y: "visitors",
        z: "device",
        color: "device",
        strokeWidth: 2,
      }),
    ],
    scales: {
      x: { scale: () => scalePoint().padding(0.25), axis },
      y: visitorsY,
    },
    color: chartColor(deviceConfig),
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: besidePointer,
  });

const areaDefinition = (rows: typeof visitors) =>
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
      y: visitorsY,
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

// The series shown, and a legend that toggles them; the last one shown stays.
function useShown(config: ChartConfig) {
  const [shown, setShown] = useState<string[]>(() => Object.keys(config));
  const legend = (
    <ChartLegendContent
      aria-label="Series"
      config={config}
      onValueChange={(next) => {
        if (next.length > 0) {
          setShown(next);
        }
      }}
      value={shown}
    />
  );
  return [shown, legend] as const;
}

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
  const [shown, legend] = useShown(deviceConfig);
  const definition = useMemo(
    () => barDefinition(visitors.filter((row) => shown.includes(row.device))),
    [shown]
  );
  return (
    <ChartCard description="January to June" legend={legend} title="Visitors">
      <Chart
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
  const [shown, legend] = useShown(deviceConfig);
  const definition = useMemo(
    () => lineDefinition(visitors.filter((row) => shown.includes(row.device))),
    [shown]
  );
  return (
    <ChartCard description="January to June" legend={legend} title="Visitors">
      <Chart
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
  const [shown, legend] = useShown(deviceConfig);
  const definition = useMemo(
    () => areaDefinition(visitors.filter((row) => shown.includes(row.device))),
    [shown]
  );
  return (
    <ChartCard
      description="January to June, stacked"
      legend={legend}
      title="Visitors"
    >
      <Chart
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
  const [shown, legend] = useShown(browserConfig);
  const definition = useMemo(
    () => pieDefinition(browsers.filter((row) => shown.includes(row.browser))),
    [shown]
  );
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
