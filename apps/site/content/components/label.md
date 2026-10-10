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
import { Label } from "@/components/ui/label";
```

```tsx
<Label htmlFor="email">Email</Label>
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
  <FieldLabel htmlFor="email">Your email address</FieldLabel>
  <Input id="email" />
</Field>
```

<!-- ::demo name="field-form" -->

## API Reference

Takes every prop of `<label>`, plus `sx`, applied last. A field's own label part, like `SliderLabel`, shares its style through `labelStyles()`.
