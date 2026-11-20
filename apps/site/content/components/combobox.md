---
title: Combobox
description: An input that filters a list of options as you type, for one value or many.
---

<!-- ::demo name="combobox" -->

```tsx
const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

<Combobox>
  <ComboboxInput aria-label="Fruit" placeholder="Select a fruit" />
  <ComboboxContent>
    <ComboboxEmpty>No fruits found.</ComboboxEmpty>
    <ComboboxList>
      {fruits.map((fruit) => (
        <ComboboxItem key={fruit} value={fruit}>
          {fruit}
        </ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

## Installation

<!-- ::install name="combobox" -->

## Usage

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/primitives/combobox";
```

Render a `ComboboxItem` for each option in `ComboboxList`. The list shows only the items that contain what's typed. With the list open, Enter picks the highlighted row.

```tsx
<Combobox>
  <ComboboxLabel>Item</ComboboxLabel>
  <ComboboxInput placeholder="Select an item" />
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      {items.map((item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

**Compose the items.** `items` on `Combobox` with no children in `ComboboxList` renders ui-sdk's bare parts, which take none of these styles.

## Composition

```
Combobox
├── ComboboxLabel
├── ComboboxInput
├── ComboboxChips
│   ├── ComboboxChip
│   └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxItem
        ├── ComboboxGroup
        │   ├── ComboboxGroupLabel
        │   └── ComboboxItem
        ├── ComboboxSeparator
        └── ComboboxCreate
```

`ComboboxLabel` names the input. Inside a `Field`, use `FieldLabel` instead. With no visible label, put `aria-label` on `ComboboxInput`, or on both `ComboboxChips` and `ComboboxChipsInput`. `ComboboxGroupLabel` is the heading of a `ComboboxGroup`.

## Multiple

Add `multiple` to `Combobox` and use `ComboboxChips` in place of `ComboboxInput`. Render a `ComboboxChip` for each picked value, then the `ComboboxChipsInput`. The list stays open after each pick. Backspace in the empty input removes the last chip.

<!-- ::demo name="combobox-multiple" -->

```tsx
const [value, setValue] = useState(["Apple", "Banana"]);

<Combobox multiple onValueChange={setValue} value={value}>
  <ComboboxChips aria-label="Fruits">
    {value.map((fruit) => (
      <ComboboxChip key={fruit} value={fruit} />
    ))}
    <ComboboxChipsInput aria-label="Fruits" />
  </ComboboxChips>
  <ComboboxContent>
    <ComboboxEmpty>No fruits found.</ComboboxEmpty>
    <ComboboxList>
      {fruits.map((fruit) => (
        <ComboboxItem key={fruit} value={fruit}>
          {fruit}
        </ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

### Creatable

To let people add values that aren't in the list, put a `ComboboxCreate` at the end of `ComboboxList`. It shows while no item's label matches the typed text exactly, and passes the text to `onCreate`. `autoHighlight` highlights the first row as you type, so Enter picks a match or creates the text. A comma adds the typed text through the same `add()`.

<!-- ::demo name="combobox-creatable" -->

```tsx
const [known, setKnown] = useState(tags);
const [value, setValue] = useState(["design"]);
const [query, setQuery] = useState("");

function add(text: string) {
  const typed = text.trim();
  if (typed === "") {
    return;
  }
  const tag =
    known.find((name) => name.toLowerCase() === typed.toLowerCase()) ?? typed;
  setKnown((current) => (current.includes(tag) ? current : [...current, tag]));
  setValue((current) => (current.includes(tag) ? current : [...current, tag]));
  setQuery("");
}

<Combobox
  autoHighlight
  multiple
  onQueryChange={setQuery}
  onValueChange={setValue}
  query={query}
  value={value}
>
  <ComboboxChips aria-label="Tags">
    {value.map((tag) => (
      <ComboboxChip key={tag} value={tag} />
    ))}
    <ComboboxChipsInput
      aria-label="Tags"
      onKeyDown={(event) => {
        if (event.key !== "," || event.nativeEvent.isComposing) {
          return;
        }
        event.preventDefault();
        add(query);
      }}
      placeholder={value.length > 0 ? "" : "Add a tag"}
    />
  </ComboboxChips>
  <ComboboxContent>
    <ComboboxList>
      {known.map((tag) => (
        <ComboboxItem key={tag} value={tag}>
          {tag}
        </ComboboxItem>
      ))}
      <ComboboxCreate onCreate={add}>
        {(state) => `Create “${state.query}”`}
      </ComboboxCreate>
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

## Clear Button

Add `showClear` to `ComboboxInput` to show a button that clears the value and the typed text. It shows while there's a value or typed text, in the trigger's place.

<!-- ::demo name="combobox-clear" -->

```tsx
<ComboboxInput aria-label="Fruit" showClear />
```

## Groups

Use `ComboboxGroup`, `ComboboxGroupLabel` and `ComboboxSeparator` to organize items. Typing hides a group with no match, and its separator.

<!-- ::demo name="combobox-groups" -->

```tsx
const produce = [
  { items: ["Apple", "Banana", "Blueberry"], label: "Fruits" },
  { items: ["Broccoli", "Carrot", "Spinach"], label: "Vegetables" },
];

<ComboboxList>
  {produce.map((group, index) => (
    <Fragment key={group.label}>
      {index > 0 && <ComboboxSeparator />}
      <ComboboxGroup>
        <ComboboxGroupLabel>{group.label}</ComboboxGroupLabel>
        {group.items.map((item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        ))}
      </ComboboxGroup>
    </Fragment>
  ))}
</ComboboxList>;
```

## Size

Use the `size` prop on `ComboboxInput` or `ComboboxChips` to match the controls beside it, and on `ComboboxContent` to size its rows.

<!-- ::demo name="combobox-size" -->

| Size      | Box  | Chip | Chip text | Row  | Row text |
| --------- | ---- | ---- | --------- | ---- | -------- |
| `sm`      | 28px | 20px | 12px      | 28px | 13px     |
| `default` | 32px | 24px | 12px      | 32px | 14px     |
| `lg`      | 36px | 28px | 13px      | 36px | 15px     |

```tsx
<ComboboxChips size="sm">…</ComboboxChips>
<ComboboxContent size="sm">…</ComboboxContent>
```

## Disabled

Add `disabled` to `Combobox` to disable it, or to a `ComboboxItem` to disable one option.

<!-- ::demo name="combobox-disabled" -->

```tsx
<Combobox defaultValue="Banana" disabled>
  <ComboboxInput aria-label="Fruit" />
  <ComboboxContent>…</ComboboxContent>
</Combobox>
```

## Invalid

Add `invalid` to the `Field`, so the input takes the red edge.

<!-- ::demo name="combobox-invalid" -->

```tsx
<Field invalid>
  <FieldLabel>Fruit</FieldLabel>
  <Combobox>
    <ComboboxInput placeholder="Select a fruit" />
    <ComboboxContent>…</ComboboxContent>
  </Combobox>
  <FieldDescription>Please select a fruit.</FieldDescription>
</Field>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ComboboxLabel` | Names the input or the chips; inside a `Field`, use `FieldLabel` |
| `ComboboxInput` | An input group with a trigger and a clear button at its end, named "Show options" and "Clear" by default; `showTrigger` (default `true`), `showClear`, `size`: `"sm"`, `"default"` or `"lg"`; `sx` goes to the group |
| `ComboboxChips` | An input group's box that wraps its chips and input onto new lines; `size`: `"sm"`, `"default"` or `"lg"`; `sx` goes to the box, and the other props, `ref` included, to ui-sdk's chips toolbar. Give it an `aria-label` when no `ComboboxLabel` names it |
| `ComboboxChip` | `value` (required); without children it shows the value's label; `showRemove` (default `true`): a button that removes the chip, named after it ("Remove Apple") |
| `ComboboxContent` | Anchors to the input group's box, so it's as wide as the box; takes `side`, `align`, `anchor` and their offsets; `size`: `"sm"`, `"default"` or `"lg"` rows |
| `ComboboxCreate` | Styled and sized as an item row |
| `ComboboxGroupLabel` | The heading of a `ComboboxGroup`, sized with the rows |

Every part takes `sx`, applied last. For the rest, see [UI SDK Combobox](https://ui-sdk.dev/docs/react/components/combobox).
