---
title: Select
description: Displays a list of options for the user to pick from, triggered by a button.
---

<!-- ::demo name="select" -->

```tsx
const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

<Select items={items} placeholder="Select a fruit">
  <SelectTrigger aria-label="Fruit">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectGroupLabel>Fruits</SelectGroupLabel>
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
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
```

Pass `items` to `Select` as an array of `{ label, value }`. The trigger then shows the picked item's label before the list opens and in the server's HTML, and an agent sees the choices while the select is closed. Use `placeholder` for the text the trigger shows while nothing is picked.

```tsx
<Select items={items} placeholder="Select a theme">
  <SelectLabel>Theme</SelectLabel>
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
├── SelectLabel
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectInput
    ├── SelectEmpty
    └── SelectList
        ├── SelectGroup
        │   ├── SelectGroupLabel
        │   └── SelectItem
        │       └── SelectItemText
        └── SelectSeparator
```

`SelectInput`, `SelectEmpty`, `SelectList` and `SelectItemText` are only for [Search](#search). Without a search field, put the groups and items straight in `SelectContent`.

`SelectLabel` names the trigger. Inside a `Field`, use `FieldLabel` instead. With no visible label, put `aria-label` on `SelectTrigger`. `SelectGroupLabel` is the heading of a `SelectGroup`.

## Align Item With Trigger

Use `alignItemWithTrigger` on `SelectContent` to choose where the popup opens. When `false` (default), the popup opens below the trigger, like a dropdown menu. When `true` and an item is selected, the selected item sits over the trigger.

<!-- ::demo name="select-align-item" -->

```tsx
<SelectContent alignItemWithTrigger>
  <SelectItem value="apple">Apple</SelectItem>
</SelectContent>
```

## Groups

Use `SelectGroup`, `SelectGroupLabel` and `SelectSeparator` to organize items.

<!-- ::demo name="select-groups" -->

```tsx
<SelectContent>
  <SelectGroup>
    <SelectGroupLabel>Fruits</SelectGroupLabel>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectGroupLabel>Vegetables</SelectGroupLabel>
    <SelectItem value="carrot">Carrot</SelectItem>
  </SelectGroup>
</SelectContent>
```

## Scrollable

A long list scrolls and keeps the highlighted row in view.

<!-- ::demo name="select-scrollable" -->

```tsx
<SelectContent>
  {timezones.map((group) => (
    <SelectGroup key={group.label}>
      <SelectGroupLabel>{group.label}</SelectGroupLabel>
      {group.items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  ))}
</SelectContent>
```

## Search

Add `SelectInput` at the top of `SelectContent` to filter a long list, and put the items in `SelectList` so the field stays put while the list scrolls. `SelectEmpty` shows when nothing matches, and `SelectItemText` marks the matched text.

<!-- ::demo name="select-search" -->

```tsx
<Select items={timezones} placeholder="Select a timezone">
  <SelectTrigger aria-label="Timezone">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectInput aria-label="Search timezones" placeholder="Search timezones" />
    <SelectEmpty>No timezones found.</SelectEmpty>
    <SelectList>{({ items }) => <Options entries={items} />}</SelectList>
  </SelectContent>
</Select>
```

**Render the items from `SelectList`'s `items`.** With `items` on `Select`, ui-sdk filters only the items in that list, not ones written out by hand. Pass `items` as groups (`{ type: "group", label, items }`) and map them back to parts:

```tsx
function Options({ entries }: { entries: ListData<unknown> }) {
  return entries.map((entry) => {
    const item =
      typeof entry === "string" ? { label: entry, value: entry } : entry;
    if ("type" in item) {
      return item.type === "group" ? (
        <SelectGroup key={item.label}>
          <SelectGroupLabel>{item.label}</SelectGroupLabel>
          <Options entries={item.items} />
        </SelectGroup>
      ) : null;
    }
    return (
      <SelectItem key={item.label} label={item.label} value={item.value}>
        <SelectItemText />
      </SelectItem>
    );
  });
}
```

## Size

Use the `size` prop on `SelectTrigger` to match the controls beside it, and on `SelectContent` to size its rows.

<!-- ::demo name="select-sizes" -->

| Size      | Trigger | Trigger text | Row  | Row text | Icon |
| --------- | ------- | ------------ | ---- | -------- | ---- |
| `sm`      | 28px    | 12px         | 28px | 13px     | 14px |
| `default` | 32px    | 13px         | 32px | 14px     | 16px |
| `lg`      | 36px    | 13px         | 36px | 15px     | 16px |

```tsx
<SelectTrigger size="sm">
  <SelectValue />
</SelectTrigger>
<SelectContent size="sm">
  <SelectItem value="apple">Apple</SelectItem>
</SelectContent>
```

## Disabled

Add `disabled` to `Select` to disable it, or to a `SelectItem` to disable one option.

<!-- ::demo name="select-disabled" -->

```tsx
<Select disabled items={items} placeholder="Select a fruit">
  <SelectTrigger aria-label="Fruit">
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
  <Select items={items} placeholder="Select a fruit">
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
| `Select` | `loop` defaults to `false`, so arrows stop at either end |
| `SelectTrigger` | `size`: `"sm"`, `"default"` or `"lg"` |
| `SelectContent` | Renders in place in the browser's top layer, with no portal or positioner; takes `side`, `align`, `alignItemWithTrigger` and their offsets; `size`: `"sm"`, `"default"` or `"lg"` rows |
| `SelectInput` | An input group with a search icon, a step above the rows' size; `sx` goes to the group |
| `SelectItemText` | Takes no children. Shows the item's label, with the match in medium weight |

Every part takes `sx`, applied last. For the rest, see [UI SDK Select](https://ui-sdk.dev/docs/react/components/select).
