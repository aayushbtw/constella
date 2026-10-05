---
title: Slider
description: Picks a value from a range.
draft: true
---

<!-- ::demo name="slider" -->

## Installation

<!-- ::install name="slider" -->

## Usage

```tsx
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/ui/slider";
```

```tsx
<Slider defaultValue={40}>
  <SliderLabel>Volume</SliderLabel>
  <SliderValue />
  <SliderControl />
</Slider>
```

## Range

Pass an array to `defaultValue` and compose the track with a thumb per value.

```tsx
<Slider defaultValue={[20, 80]}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb index={0} />
      <SliderThumb index={1} />
    </SliderTrack>
  </SliderControl>
</Slider>
```

## API Reference

`SliderControl` renders the track, indicator and one thumb when it has no children. Every part takes `sx`, applied last. For the rest, see [Base UI Slider](https://base-ui.com/react/components/slider).
