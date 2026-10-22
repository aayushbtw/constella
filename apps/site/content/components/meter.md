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
import { Meter, MeterLabel, MeterValue } from "@/components/primitives/meter";
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

## Meter Variant

Use `variant="ring"` for an icon-sized ring in place of the bar, for a meter in a table row or beside an icon. The label and value sit beside it.

<!-- ::demo name="meter-variant" -->

```tsx
<Meter max={10} value={7} variant="ring">
  <MeterLabel>Seats</MeterLabel>
  <MeterValue>{(_, value) => `${value} of 10`}</MeterValue>
</Meter>
```

| Variant | Draws |
| --- | --- |
| `bar` | A full-width track under the label and value (default) |
| `ring` | A ring the size of an icon before them, filling clockwise from the top |

## Meter Color

The fill, bar or ring, is `accentSolid` until you give it a `color`. A full meter isn't always bad, so the meter never picks one itself: set it from your own thresholds.

<!-- ::demo name="meter-status" -->

```tsx
<Meter color="success" value={100}>
  <MeterLabel>Battery</MeterLabel>
  <MeterValue />
</Meter>
<Meter color="warning" value={82}>
  <MeterLabel>Memory</MeterLabel>
  <MeterValue />
</Meter>
<Meter color="danger" value={100}>
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
| `Meter` | Renders `MeterTrack` and `MeterIndicator` after its children; `variant` (`bar`, `ring`) swaps them for a ring before its children and sets `data-variant`; `color` (`success`, `info`, `warning`, `danger`) colors the fill and sets `data-color` |

Every part takes `sx`, applied last. For the rest, see [Base UI Meter](https://base-ui.com/react/components/meter).
