---
title: Popover
description: Displays rich content in a floating panel, triggered by a button.
---

<!-- ::demo name="popover" -->

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    Open popover
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
    <Label>
      Width
      <Input defaultValue="100%" size="sm" />
    </Label>
  </PopoverContent>
</Popover>
```

## Installation

<!-- ::install name="popover" -->

## Usage

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
```

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
```

## Composition

```
Popover
├── PopoverTrigger
└── PopoverContent
    ├── PopoverHeader
    │   ├── PopoverTitle
    │   └── PopoverDescription
    └── PopoverClose
```

## Align

Use the `align` prop on `PopoverContent` to line it up with the trigger's start, center or end.

<!-- ::demo name="popover-align" -->

```tsx
<PopoverContent align="start">Aligned to start</PopoverContent>
```

## Field

Put a [Field](/docs/components/field) group under the header for a small form.

<!-- ::demo name="popover-form" -->

```tsx
<PopoverContent align="start">
  <PopoverHeader>
    <PopoverTitle>Dimensions</PopoverTitle>
    <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
  </PopoverHeader>
  <FieldGroup>
    <Field orientation="horizontal">
      <FieldLabel>Width</FieldLabel>
      <Input defaultValue="100%" />
    </Field>
  </FieldGroup>
</PopoverContent>
```

## API Reference

`PopoverContent` renders in place, beside its trigger, in the browser's top layer, and takes `side`, `align` and their offsets. It's 288px wide; pass `sx` to change it. `PopoverClose` is a button that closes the popover. Every part takes `sx`, applied last. For the rest, see [UI SDK Popover](https://ui-sdk.dev/docs/components/popover).
