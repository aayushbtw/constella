---
title: Select
description: Displays a list of options for the user to pick from, triggered by a button.
draft: true
---

<!-- ::demo name="select" -->

```tsx
const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

<Select items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>;
```

## Installation

<!-- ::install name="select" -->

## Usage

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

Pass `items` to `Select`, so `SelectValue` shows the picked item's label. An item with `value: null` is the placeholder.

```tsx
<Select items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
```

## Composition

```
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   └── SelectItem
    └── SelectSeparator
```

## Align Item With Trigger

Use `alignItemWithTrigger` on `SelectContent` to choose where the popup opens. When `true` (default), the selected item sits over the trigger. When `false`, the popup opens below the trigger.

<!-- ::demo name="select-align-item" -->

```tsx
<SelectContent alignItemWithTrigger={false}>
  <SelectItem value="apple">Apple</SelectItem>
</SelectContent>
```

## Groups

Use `SelectGroup`, `SelectLabel` and `SelectSeparator` to organize items.

<!-- ::demo name="select-groups" -->

```tsx
<SelectContent>
  <SelectGroup>
    <SelectLabel>Fruits</SelectLabel>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Vegetables</SelectLabel>
    <SelectItem value="carrot">Carrot</SelectItem>
  </SelectGroup>
</SelectContent>
```

## Scrollable

A long list scrolls, with arrows at the ends while there's more to see.

<!-- ::demo name="select-scrollable" -->

```tsx
<SelectContent>
  {timezones.map((group) => (
    <SelectGroup key={group.label}>
      <SelectLabel>{group.label}</SelectLabel>
      {group.items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  ))}
</SelectContent>
```

## Size

Use the `size` prop on `SelectTrigger` to match the controls beside it.

<!-- ::demo name="select-sizes" -->

| Size      | Height |
| --------- | ------ |
| `sm`      | 28px   |
| `default` | 32px   |

```tsx
<SelectTrigger size="sm">
  <SelectValue />
</SelectTrigger>
```

## Disabled

Add `disabled` to `Select` to disable it, or to a `SelectItem` to disable one option.

<!-- ::demo name="select-disabled" -->

```tsx
<Select disabled items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem disabled value="grapes">
      Grapes
    </SelectItem>
  </SelectContent>
</Select>
```

## Invalid

Add `invalid` to the `Field`, so the trigger takes the red edge.

<!-- ::demo name="select-invalid" -->

```tsx
<Field invalid>
  <FieldLabel>Fruit</FieldLabel>
  <Select items={items}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
    </SelectContent>
  </Select>
  <FieldDescription>Please select a fruit.</FieldDescription>
</Field>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SelectTrigger` | `size`: `"sm"` or `"default"` |
| `SelectContent` | Renders the portal, positioner and popup; takes `side`, `align`, `alignItemWithTrigger` and their offsets |

Every part takes `sx`, applied last. For the rest, see [Base UI Select](https://base-ui.com/react/components/select).
