---
title: Chart
description: Renders a TanStack Charts definition in the theme's series palette, with a tooltip and a legend that toggles series.
section: TanStack
---

<!-- ::demo name="chart" -->

```tsx
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

const definition = useMemo(
  () =>
    defineChart({
      marks: [
        crosshair({
          x: { band: { fill: colors.fillSubtle, fillOpacity: 1, radius: 4 } },
          y: false,
        }),
        barY(visitors.filter((row) => shown.includes(row.device)), {
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
        x: { scale: () => scaleBand().padding(0.25) },
        y: { scale: scaleLinear, nice: true, grid: true },
      },
      color: chartColor(config),
      focus: "group-x",
      tooltip,
    }),
  [shown]
);

<ChartLegendContent config={config} onValueChange={setShown} value={shown} />
<Chart
  ariaLabel="Monthly visitors"
  config={config}
  definition={definition}
  height={240}
/>;
```

## Installation

<!-- ::install name="chart" -->

## Usage

```tsx
import { Chart, chartColor } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
```

Build the chart with [TanStack Charts](https://tanstack.com/charts)' `defineChart` and pass it to `Chart` with an `ariaLabel` that names the metric and period. Marks, scales, focus and the tooltip's behavior stay in the definition; `Chart` draws it in the theme's palette, with axes, ticks and grid lines in `textMuted`.

```tsx
<Chart
  ariaLabel="Monthly visitors, January to June"
  config={config}
  definition={definition}
  height={240}
/>
```

**Keep the definition outside the component**, or in a `useMemo` on the values it reads. A new definition rebuilds the chart.

## Composition

```
Chart
└── ChartTooltipContent
    └── ChartTooltip
        ├── ChartTooltipTitle
        └── ChartTooltipRow
            ├── ChartIndicator
            ├── ChartTooltipLabel
            └── ChartTooltipValue
ChartLegendContent
└── ChartLegend
    └── ChartLegendItem
        └── ChartIndicator
```

## Config

Name each series once in a `ChartConfig`, keyed by its value in the data. Pass `chartColor(config)` as the definition's `color`, and the same `config` to `Chart` and `ChartLegendContent`, so the tooltip and legend name it and every part paints it alike. Hiding a series never repaints the rest.

```tsx
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile", color: colors.chart5 },
} satisfies ChartConfig;
```

A series without a `color` takes the next in the palette, in the config's order. Past six, fold the rest into one "Other" series.

| Series | Token           | Hue    |
| ------ | --------------- | ------ |
| 1      | `colors.chart1` | Indigo |
| 2      | `colors.chart2` | Teal   |
| 3      | `colors.chart3` | Violet |
| 4      | `colors.chart4` | Cyan   |
| 5      | `colors.chart5` | Orange |
| 6      | `colors.chart6` | Pink   |

## Tooltip

Add TanStack's `tooltip` to the definition and `Chart` renders it as `ChartTooltipContent`, naming each series from `config`. Leave `tooltip` out for none. To change its indicator or drop its title, render it yourself:

```tsx
<Chart
  renderTooltipBody={({ content }) => (
    <ChartTooltipContent
      config={config}
      content={content}
      hideLabel
      indicator="dot"
    />
  )}
  {...props}
/>
```

To change what it holds, compose the parts, here with a total under the stack.

<!-- ::demo name="chart-area" -->

```tsx
<Chart
  renderTooltipBody={({ points, primaryPoint }) => (
    <ChartTooltip>
      <ChartTooltipTitle>{points[0]?.datum.month}</ChartTooltipTitle>
      {points.map((point) => (
        <ChartTooltipRow active={point === primaryPoint} key={point.key}>
          <ChartIndicator color={point.color} variant="line" />
          <ChartTooltipLabel>
            {config[point.datum.device].label}
          </ChartTooltipLabel>
          <ChartTooltipValue>{point.datum.visitors}</ChartTooltipValue>
        </ChartTooltipRow>
      ))}
      <ChartTooltipRow>
        <ChartTooltipLabel>Total</ChartTooltipLabel>
        <ChartTooltipValue>{total(points)}</ChartTooltipValue>
      </ChartTooltipRow>
    </ChartTooltip>
  )}
  {...props}
/>
```

## Legend

Use `ChartLegendContent` with `config` for a toggle per series; `value` lists the shown ones. Filter the definition's rows by it.

<!-- ::demo name="chart-pie" -->

```tsx
<ChartLegendContent
  config={config}
  onValueChange={(next) => {
    if (next.length > 0) {
      setShown(next);
    }
  }}
  value={shown}
/>
```

For your own items, compose `ChartLegend`, `ChartLegendItem` and `ChartIndicator`.

```tsx
<ChartLegend onValueChange={setShown} value={shown}>
  <ChartLegendItem value="chrome">
    <ChartIndicator color={colors.chart1} />
    Chrome
  </ChartLegendItem>
</ChartLegend>
```

## Line

<!-- ::demo name="chart-line" -->

```tsx
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
    x: { scale: () => scalePoint().padding(0.25) },
    y: { scale: scaleLinear, nice: true, grid: true },
  },
  color: chartColor(config),
  focus: "group-x",
  maxFocusDistance: Number.POSITIVE_INFINITY,
  tooltip,
});
```

## API Reference

`Chart` takes TanStack Charts' React `Chart` props, with `sx` for `className` and `style`. The rest wrap a single element and take `sx`.

| Part | Adds |
| --- | --- |
| `Chart` | `config`, naming series in the default tooltip; `renderTooltipBody`, `ChartTooltipContent` by default |
| `ChartTooltipContent` | `content`, TanStack's title and rows, or its text; `config`; `indicator`, `line` by default; `hideLabel` |
| `ChartTooltipRow` | `active`, the series under the pointer or keyboard |
| `ChartIndicator` | `color`, the series' paint; `variant`, `dot` or `line`; hollow in a hidden legend item |
| `ChartLegendContent` | `config`, and Chart Legend's props |
| `ChartLegend` | Toggle Group's props, always `multiple` |
| `ChartLegendItem` | Toggle Group Item's props |
| `chartColor` | `config` in, the definition's `color` out: every series' domain and paint |
