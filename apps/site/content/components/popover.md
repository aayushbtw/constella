---
title: Popover
description: Displays rich content in a portal, triggered by a button.
draft: true
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
} from "@/components/ui/popover";
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
    └── PopoverHeader
        ├── PopoverTitle
        └── PopoverDescription
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

`PopoverContent` renders the portal, positioner and popup, and takes `side`, `align` and their offsets. It's 288px wide; pass `sx` to change it. Every part takes `sx`, applied last. For the rest, see [Base UI Popover](https://base-ui.com/react/components/popover).
