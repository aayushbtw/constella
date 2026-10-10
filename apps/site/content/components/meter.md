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

A meter at or past its `max` fills red, so a spent quota reads at a glance. Use [Progress](/docs/components/progress) for a task that's on its way to done.

## Composition

```
Meter
├── MeterLabel
├── MeterValue
└── MeterTrack
    └── MeterIndicator
```

## Meter Value

Set `max` to measure in the quota's own units, and give `MeterValue` a function to show the value your way. At the cap the fill turns red.

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
| `Meter` | Renders `MeterTrack` and `MeterIndicator` after its children; `data-full` at or past `max` |

Every part takes `sx`, applied last. For the rest, see [Base UI Meter](https://base-ui.com/react/components/meter).
