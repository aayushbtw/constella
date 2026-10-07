---
title: Radio Group
description: A set of options where only one can be picked at a time.
draft: true
---

<!-- ::demo name="radio-group" -->

```tsx
<RadioGroup defaultValue="comfortable">
  <Label>
    <RadioGroupItem value="default" />
    Default
  </Label>
  <Label>
    <RadioGroupItem value="comfortable" />
    Comfortable
  </Label>
</RadioGroup>
```

## Installation

<!-- ::install name="radio-group" -->

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
```

```tsx
<RadioGroup defaultValue="option-one">
  <Label>
    <RadioGroupItem value="option-one" />
    Option One
  </Label>
  <Label>
    <RadioGroupItem value="option-two" />
    Option Two
  </Label>
</RadioGroup>
```

## Composition

```
RadioGroup
└── RadioGroupItem
```

## Description

Put each item in a horizontal `Field`, with the label and description in a `FieldContent`.

<!-- ::demo name="radio-group-description" -->

```tsx
<RadioGroup defaultValue="comfortable">
  <Field orientation="horizontal">
    <RadioGroupItem value="default" />
    <FieldContent>
      <FieldLabel>Default</FieldLabel>
      <FieldDescription>Standard spacing for most use cases.</FieldDescription>
    </FieldContent>
  </Field>
</RadioGroup>
```

## Choice Card

Put the content and the item inside a `FieldLabel` to make the whole card pick it.

<!-- ::demo name="radio-group-card" -->

```tsx
<RadioGroup defaultValue="plus">
  <Field>
    <FieldLabel>
      <FieldContent>
        <FieldTitle>Plus</FieldTitle>
        <FieldDescription>For individuals and small teams.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="plus" />
    </FieldLabel>
  </Field>
</RadioGroup>
```

## Fieldset

Use `FieldSet` and `FieldLegend` to name the group.

<!-- ::demo name="radio-group-fieldset" -->

```tsx
<FieldSet>
  <FieldLegend variant="label">Subscription Plan</FieldLegend>
  <FieldSetDescription>
    Yearly and lifetime plans offer significant savings.
  </FieldSetDescription>
  <RadioGroup defaultValue="monthly">
    <Field orientation="horizontal">
      <RadioGroupItem value="monthly" />
      <FieldLabel>Monthly ($9.99/month)</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
```

## Disabled

Add `disabled` to an item's `Field`, so the item and its label fade together.

<!-- ::demo name="radio-group-disabled" -->

```tsx
<Field disabled orientation="horizontal">
  <RadioGroupItem value="option1" />
  <FieldLabel>Disabled</FieldLabel>
</Field>
```

## Invalid

Add `invalid` to each `Field`, and `aria-invalid` to its item.

<!-- ::demo name="radio-group-invalid" -->

```tsx
<Field invalid orientation="horizontal">
  <RadioGroupItem aria-invalid value="email" />
  <FieldLabel>Email only</FieldLabel>
</Field>
```

## API Reference

`RadioGroup` and `RadioGroupItem` take `sx`, applied last. For the rest, see [Base UI Radio Group](https://base-ui.com/react/components/radio).
