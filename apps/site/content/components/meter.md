---
title: Meter
description: Shows a measurement against a limit, like usage against a quota.
---

<!-- ::demo name="meter" -->

```tsx
<Meter value={24}>
  <MeterLabel>Storage</MeterLabel>
  <MeterValue />
</Meter>
```

## Installation

<!-- ::install name="meter" -->

## Usage

```tsx
import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter";
```

```tsx
<Meter value={24}>
  <MeterLabel>Storage</MeterLabel>
  <MeterValue />
</Meter>
```

Use [Progress](/docs/components/progress) for a task that's on its way to done.

## Composition

```
Meter
├── MeterLabel
├── MeterValue
└── MeterTrack
    └── MeterIndicator
```

## Meter Status

The fill is `accent` until you give it a `status`. A full meter isn't always bad, so the meter never picks one itself: set it from your own thresholds.

<!-- ::demo name="meter-status" -->

```tsx
<Meter status="success" value={100}>
  <MeterLabel>Battery</MeterLabel>
  <MeterValue />
</Meter>
<Meter status="warning" value={82}>
  <MeterLabel>Memory</MeterLabel>
  <MeterValue />
</Meter>
<Meter status="danger" value={100}>
  <MeterLabel>Storage</MeterLabel>
  <MeterValue />
</Meter>
```

## Meter Value

Set `max` to measure in the quota's own units, and give `MeterValue` a function to show the value your way.

<!-- ::demo name="meter-value" -->

```tsx
<Meter max={5} value={3.2}>
  <MeterLabel>Storage</MeterLabel>
  <MeterValue>
    {(_, value) => `${gb.format(value)} of ${gb.format(5)}`}
  </MeterValue>
</Meter>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Meter` | Renders `MeterTrack` and `MeterIndicator` after its children; `status` (`success`, `info`, `warning`, `danger`) colors the fill and sets `data-status` |

Every part takes `sx`, applied last. For the rest, see [Base UI Meter](https://base-ui.com/react/components/meter).
