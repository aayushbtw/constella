---
title: Slider
description: Picks a value from a range.
---

<!-- ::demo name="slider" -->

## Installation

<!-- ::install name="slider" -->

## Usage

```tsx
import { Field, FieldLabel } from "@/components/primitives/field";
import {
  Slider,
  SliderControl,
  SliderValue,
} from "@/components/primitives/slider";
```

```tsx
<Field>
  <Slider defaultValue={40}>
    <FieldLabel>Volume</FieldLabel>
    <SliderValue />
    <SliderControl />
  </Slider>
</Field>
```

A `Field` names a single thumb with its `FieldLabel`. Without a `Field`, give each thumb an `aria-label`.

**Name each thumb of a range.** The `FieldLabel` or an `aria-label` on `Slider` names the group, not its thumbs.

## Composition

```
Field
└── Slider
    ├── FieldLabel
    ├── SliderValue
    └── SliderControl
        └── SliderTrack
            ├── SliderIndicator
            └── SliderThumb
```

## Range

Pass an array to `defaultValue` and compose the track with a thumb per value, each with its own `aria-label`.

<!-- ::demo name="slider-range" -->

```tsx
<Field>
  <Slider defaultValue={[20, 80]}>
    <FieldLabel>Price</FieldLabel>
    <SliderValue />
    <SliderControl>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Minimum price" index={0} />
        <SliderThumb aria-label="Maximum price" index={1} />
      </SliderTrack>
    </SliderControl>
  </Slider>
</Field>
```

## Multiple Thumbs

Add a value and a `SliderThumb` for each thumb.

<!-- ::demo name="slider-multiple" -->

```tsx
<Slider aria-label="Stops" defaultValue={[10, 40, 70]} step={10}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="First stop" index={0} />
      <SliderThumb aria-label="Second stop" index={1} />
      <SliderThumb aria-label="Third stop" index={2} />
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

<Slider defaultValue={60} orientation="vertical" sx={styles.slider}>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="Bass" />
    </SliderTrack>
  </SliderControl>
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
    backgroundColor: colors.border,
    height: space.xxs,
    width: strokes.border,
  },
  tickMajor: { backgroundColor: colors.textMuted },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.textSm,
    lineHeight: lineHeights.textSm,
  },
});

<Field>
  <Slider defaultValue={3} max={12}>
    <FieldLabel>Duration (months)</FieldLabel>
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
  </Slider>
</Field>;
```

## Reference Labels

Add a row of labels under the control. A `1fr auto 1fr` grid keeps the middle one centered. Set `format` so `SliderValue` and screen readers read the same unit.

<!-- ::demo name="slider-references" -->

```tsx
const styles = stylex.create({
  references: {
    color: colors.textMuted,
    display: "grid",
    fontSize: fontSizes.textSm,
    lineHeight: lineHeights.textSm,
    gridColumn: "1 / -1",
    gridTemplateColumns: "1fr auto 1fr",
  },
  end: { justifySelf: "end" },
});

<Field>
  <Slider
    defaultValue={20}
    format={{ style: "unit", unit: "gigabyte" }}
    max={35}
    min={5}
  >
    <FieldLabel>Storage</FieldLabel>
    <SliderValue />
    <SliderControl />
    <div aria-hidden {...stylex.props(styles.references)}>
      <span>5 GB</span>
      <span>20 GB</span>
      <span {...stylex.props(styles.end)}>35 GB</span>
    </div>
  </Slider>
</Field>;
```

## Disabled

Use the `disabled` prop to disable the slider.

<!-- ::demo name="slider-disabled" -->

```tsx
<Field>
  <Slider defaultValue={40} disabled>
    <FieldLabel>Volume</FieldLabel>
    <SliderValue />
    <SliderControl />
  </Slider>
</Field>
```

## Tooltip

Render the thumb as a [Tooltip](/docs/components/tooltip) trigger with a `SliderValue` inside the content. Pass `type="description"`, since the thumb's name sits on its inner input: the tooltip then describes the thumb and the `FieldLabel` still names it. Pass the slider's children as a function and keep the tooltip open while `state.dragging`, since the pointer can leave the thumb, and on press with `closeOnPress={false}`.

<!-- ::demo name="slider-tooltip" -->

```tsx
const styles = stylex.create({
  value: { color: "inherit", fontSize: "inherit" },
});

function VolumeSlider() {
  const [hovered, setHovered] = useState(false);

  return (
    <Field>
      <Slider defaultValue={40} format={{ style: "unit", unit: "percent" }}>
        {(state) => (
          <>
            <FieldLabel>Volume</FieldLabel>
            <SliderControl>
              <SliderTrack>
                <SliderIndicator />
                <Tooltip
                  closeOnPress={false}
                  delay={0}
                  onOpenChange={setHovered}
                  open={hovered || state.dragging}
                  type="description"
                >
                  <TooltipTrigger render={<SliderThumb />} />
                  <TooltipContent>
                    <SliderValue sx={styles.value} />
                  </TooltipContent>
                </Tooltip>
              </SliderTrack>
            </SliderControl>
          </>
        )}
      </Slider>
    </Field>
  );
}
```

## Input Group

Control the slider with `value` and `onValueChange`, and keep a number [Input Group](/docs/components/input-group) in sync. The input holds a draft while typing and snaps back to the slider's value on blur. Put the `FieldLabel` and the input in a `Field` inside the slider, so the label names the input, and give the thumb its own `aria-label`. `display: contents` keeps them in the slider's grid.

<!-- ::demo name="slider-input" -->

```tsx
const styles = stylex.create({
  field: { display: "contents" },
});

const [value, setValue] = useState(100);
const [draft, setDraft] = useState("100");

<Slider
  onValueChange={(next) => {
    setValue(next);
    setDraft(String(next));
  }}
  value={value}
>
  <Field sx={styles.field}>
    <FieldLabel>Opacity</FieldLabel>
    <InputGroup size="sm">
      <InputGroupInput
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
  </Field>
  <SliderControl>
    <SliderTrack>
      <SliderIndicator />
      <SliderThumb aria-label="Opacity" />
    </SliderTrack>
  </SliderControl>
</Slider>;
```

**Keep the slider outside that `Field`.** One `Field` hands its control id to both the input and the thumb.

## API Reference

`SliderControl` renders the track, indicator and one thumb when it has no children. Every part takes `sx`, applied last. For the rest, see [ui-sdk Slider](https://ui-sdk.dev/docs/react/components/slider).
