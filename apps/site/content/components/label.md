---
title: Label
description: Names a control.
---

<!-- ::demo name="label" -->

```tsx
<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms and conditions</Label>
```

## Installation

<!-- ::install name="label" -->

## Usage

```tsx
import { Label } from "@/components/primitives/label";
```

```tsx
<Label htmlFor="email">Email</Label>
```

## Naming Any Control

A plain `<label>` only names inputs, buttons and selects. `Label` also names a radio group, a slider or any other control by its `htmlFor`. A press on the label focuses the control, or checks it, as a native label would.

<!-- ::demo name="label-radio-group" -->

```tsx
<Label htmlFor="speed">Shipping speed</Label>
<RadioGroup defaultValue="standard" id="speed">
  <Label>
    <RadioGroupItem value="standard" />
    Standard
  </Label>
  <Label>
    <RadioGroupItem value="express" />
    Express
  </Label>
  <Label>
    <RadioGroupItem value="overnight" />
    Overnight
  </Label>
</RadioGroup>
```

## Wrapping a Control

Put the control inside the label to associate them without an `id`.

<!-- ::demo name="label-wrap" -->

```tsx
<Label>
  <Checkbox />
  Accept terms and conditions
</Label>
```

## Label in Field

For form fields, use [Field](/docs/components/field). Its `FieldLabel` comes with `FieldDescription` and `FieldError`.

```tsx
<Field>
  <FieldLabel>Your email address</FieldLabel>
  <Input />
</Field>
```

<!-- ::demo name="field-form" -->

## API Reference

Built on ui-sdk's `Label`. Takes every prop of `<label>` and ui-sdk's `render`, plus `sx`, applied last. A field's own label part, like `FieldLabel`, shares its style through `labelStyles()`.
