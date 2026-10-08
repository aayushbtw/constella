---
title: Switch
description: A control that turns a setting on or off.
draft: true
---

<!-- ::demo name="switch" -->

```tsx
<Label>
  <Switch />
  Airplane Mode
</Label>
```

## Installation

<!-- ::install name="switch" -->

## Usage

```tsx
import { Switch } from "@/components/ui/switch";
```

```tsx
<Switch />
```

## Size

Use the `size` prop to change the size of the switch.

<!-- ::demo name="switch-sizes" -->

| Size      | Track   | Thumb |
| --------- | ------- | ----- |
| `sm`      | 24 × 14 | 12    |
| `default` | 32 × 18 | 16    |
| `lg`      | 40 × 22 | 20    |

```tsx
<Switch size="sm" />
```

## Description

Put the label and description in a `FieldContent`, and the switch after it in a horizontal `Field`.

<!-- ::demo name="switch-description" -->

```tsx
<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel>Share across devices</FieldLabel>
    <FieldDescription>
      Focus is shared across devices, and turns off when you leave the app.
    </FieldDescription>
  </FieldContent>
  <Switch />
</Field>
```

## Choice Card

Put the content and the switch inside a `FieldLabel` to make the whole card toggle it.

<!-- ::demo name="switch-card" -->

```tsx
<Field>
  <FieldLabel>
    <FieldContent>
      <FieldTitle>Enable notifications</FieldTitle>
      <FieldDescription>
        Receive notifications when focus mode is enabled or disabled.
      </FieldDescription>
    </FieldContent>
    <Switch defaultChecked />
  </FieldLabel>
</Field>
```

## Disabled

Add `disabled` to the `Field`, so the switch and its label fade together.

<!-- ::demo name="switch-disabled" -->

```tsx
<Field disabled orientation="horizontal">
  <Switch />
  <FieldLabel>Disabled</FieldLabel>
</Field>
```

## Invalid

Add `invalid` to the `Field`, so the switch takes the red edge.

<!-- ::demo name="switch-invalid" -->

```tsx
<Field invalid orientation="horizontal">
  <FieldContent>
    <FieldLabel>Accept terms and conditions</FieldLabel>
    <FieldDescription>
      You must accept the terms and conditions to continue.
    </FieldDescription>
  </FieldContent>
  <Switch />
</Field>
```

## API Reference

`Switch` takes `size` (`"sm"` or `"default"`) and `sx`, applied last. For the rest, see [Base UI Switch](https://base-ui.com/react/components/switch).
