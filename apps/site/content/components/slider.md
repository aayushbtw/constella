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

## Composition

```
Slider
├── SliderLabel
├── SliderValue
└── SliderControl
    └── SliderTrack
        ├── SliderIndicator
        └── SliderThumb
```

## Range

Pass an array to `defaultValue` and compose the track with a thumb per value.

<!-- ::demo name="slider-range" -->

```tsx
<Slider defaultValue={[20, 80]}>
  <SliderLabel>Price</SliderLabel>
  <SliderValue />
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb index={0} />
      <SliderThumb index={1} />
    </SliderTrack>
  </SliderControl>
</Slider>
```

## Multiple Thumbs

Add a value and a `SliderThumb` for each thumb.

<!-- ::demo name="slider-multiple" -->

```tsx
<Slider aria-label="Stops" defaultValue={[10, 40, 70]} step={10}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb index={0} />
      <SliderThumb index={1} />
      <SliderThumb index={2} />
    </SliderTrack>
  </SliderControl>
</Slider>
```

## Vertical

Use `orientation="vertical"` and give the slider a height.

<!-- ::demo name="slider-vertical" -->

```tsx
const styles = stylex.create({
  slider: { height: 160 },
});

<Slider
  aria-label="Bass"
  defaultValue={60}
  orientation="vertical"
  sx={styles.slider}
>
  <SliderControl />
</Slider>;
```

## Steps

Set `max` and `step`, then place a mark under each step. The marks sit in a row inset by half a thumb, so each percentage lands under the thumb.

<!-- ::demo name="slider-steps" -->

```tsx
const months = Array.from({ length: 13 }, (_, month) => month);

const styles = stylex.create({
  scale: {
    gridColumn: "1 / -1",
    height: space.lg,
    marginInline: `calc(${sizes.thumb} / 2)`,
    position: "relative",
  },
  mark: (position: string) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    insetInlineStart: position,
    position: "absolute",
    translate: "-50% 0",
  }),
  tick: {
    backgroundColor: colors.edge,
    height: space.xxs,
    width: strokes.border,
  },
  tickMajor: { backgroundColor: colors.textMuted },
  label: { color: colors.textMuted, fontSize: fontSizes.xs },
});

<Slider defaultValue={3} max={12}>
  <SliderLabel>Duration (months)</SliderLabel>
  <SliderValue />
  <SliderControl />
  <div aria-hidden {...stylex.props(styles.scale)}>
    {months.map((month) => {
      const major = month % 2 === 0;
      return (
        <span
          key={month}
          {...stylex.props(styles.mark(`${(month / 12) * 100}%`))}
        >
          <span {...stylex.props(styles.tick, major && styles.tickMajor)} />
          {major && <span {...stylex.props(styles.label)}>{month}</span>}
        </span>
      );
    })}
  </div>
</Slider>;
```

## Reference Labels

Add a row of labels under the control. A `1fr auto 1fr` grid keeps the middle one centered.

<!-- ::demo name="slider-references" -->

```tsx
const styles = stylex.create({
  references: {
    color: colors.textMuted,
    display: "grid",
    fontSize: fontSizes.xs,
    gridColumn: "1 / -1",
    gridTemplateColumns: "1fr auto 1fr",
  },
  end: { justifySelf: "end" },
});

<Slider defaultValue={20} max={35} min={5}>
  <SliderLabel>Storage</SliderLabel>
  <SliderValue>{(formatted) => `${formatted[0] ?? ""} GB`}</SliderValue>
  <SliderControl />
  <div aria-hidden {...stylex.props(styles.references)}>
    <span>5 GB</span>
    <span>20 GB</span>
    <span {...stylex.props(styles.end)}>35 GB</span>
  </div>
</Slider>;
```

## Disabled

Use the `disabled` prop to disable the slider.

<!-- ::demo name="slider-disabled" -->

```tsx
<Slider defaultValue={40} disabled>
  <SliderLabel>Volume</SliderLabel>
  <SliderValue />
  <SliderControl />
</Slider>
```

## Tooltip

Render the thumb as a [Tooltip](/docs/components/tooltip) trigger with a `SliderValue` inside the content. Keep it open while dragging, since the pointer can leave the thumb.

<!-- ::demo name="slider-tooltip" -->

```tsx
const styles = stylex.create({
  value: { color: "inherit", fontSize: "inherit" },
});

function VolumeSlider() {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  return (
    <Slider
      defaultValue={40}
      onValueChange={(_, details) => {
        if (details.reason === "drag" || details.reason === "track-press") {
          setDragging(true);
        }
      }}
      onValueCommitted={() => setDragging(false)}
    >
      <SliderLabel>Volume</SliderLabel>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <Tooltip onOpenChange={setHovered} open={hovered || dragging}>
            <TooltipTrigger delay={0} render={<SliderThumb />} />
            <TooltipContent>
              <SliderValue sx={styles.value}>
                {(formatted) => `${formatted[0] ?? ""}%`}
              </SliderValue>
            </TooltipContent>
          </Tooltip>
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}
```

## Input Group

Control the slider with `value` and `onValueChange`, and keep a number [Input Group](/docs/components/input-group) in sync. The input holds a draft while typing and snaps back to the slider's value on blur.

<!-- ::demo name="slider-input" -->

```tsx
const [value, setValue] = useState(100);
const [draft, setDraft] = useState("100");

<Slider
  onValueChange={(next) => {
    setValue(next);
    setDraft(String(next));
  }}
  value={value}
>
  <SliderLabel>Opacity</SliderLabel>
  <InputGroup size="sm">
    <InputGroupInput
      aria-label="Opacity"
      max={100}
      min={0}
      onBlur={() => setDraft(String(value))}
      onChange={(event) => {
        setDraft(event.target.value);
        const next = event.target.valueAsNumber;
        if (Number.isFinite(next)) {
          setValue(Math.min(100, Math.max(0, Math.round(next))));
        }
      }}
      type="number"
      value={draft}
    />
    <InputGroupAddon align="inline-end">
      <InputGroupText>%</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  <SliderControl />
</Slider>;
```

## API Reference

`SliderControl` renders the track, indicator and one thumb when it has no children. Every part takes `sx`, applied last. For the rest, see [Base UI Slider](https://base-ui.com/react/components/slider).

## Pending

Blocked on draft components. Remove this section before the page leaves draft.

- Tooltip and Input Group: leaves draft with them, which the With Tooltip and With Input examples link.
