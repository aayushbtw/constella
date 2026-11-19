---
title: Combobox
description: An input that filters a list of options as you type, for one value or many.
---

<!-- ::demo name="combobox" -->

```tsx
const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

<Combobox items={fruits}>
  <ComboboxInput placeholder="Select a fruit" />
  <ComboboxContent>
    <ComboboxEmpty>No fruits found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
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
  ComboboxList,
} from "@/components/primitives/combobox";
```

Pass `items` to `Combobox`, and render each one from a function in `ComboboxList`. The list shows only the items that match what's typed.

```tsx
<Combobox items={items}>
  <ComboboxInput placeholder="Select an item" />
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

## Composition

```
Combobox
├── ComboboxInput
├── ComboboxChips
│   ├── ComboboxValue
│   │   └── ComboboxChip
│   └── ComboboxChipsInput
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxCollection
        │       └── ComboboxItem
        └── ComboboxSeparator
```

## Multiple

Add `multiple` to `Combobox` and use `ComboboxChips` in place of `ComboboxInput`. Each picked value is a `ComboboxChip`; Backspace in the empty input removes the last one.

<!-- ::demo name="combobox-multiple" -->

```tsx
const anchor = useComboboxAnchor();

<Combobox items={fruits} multiple>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => (
        <>
          {values.map((value) => (
            <ComboboxChip key={value}>{value}</ComboboxChip>
          ))}
          <ComboboxChipsInput />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxEmpty>No fruits found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item} value={item}>
          {item}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

### Creatable

To let people add values that aren't in the list, add the typed text to `items` when nothing matches it, and label that item as new. `autoHighlight` highlights the first match once something is typed, so Enter picks it. A comma, or Enter with nothing highlighted, adds the typed text as a chip.

Opening the list also highlights a picked chip, with the reason `"none"`. Enter on an empty input would remove it, so the handler only lets Enter through for a highlight made by typing, the arrow keys or the pointer. It forgets the highlight when the list closes, so Enter after Escape never submits a surrounding form.

<!-- ::demo name="combobox-creatable" -->

```tsx
const [value, setValue] = useState<string[]>([]);
const [query, setQuery] = useState("");
const highlight = useRef<string | undefined>(undefined);

const typed = query.trim();
const known = [...new Set([...tags, ...value])];
const match = known.find((tag) => tag.toLowerCase() === typed.toLowerCase());
const items = typed !== "" && match === undefined ? [...known, typed] : known;

function handleKeyDown(event) {
  const picks =
    event.key === "Enter" &&
    highlight.current !== undefined &&
    (typed !== "" || highlight.current !== "none");
  if (picks || (event.key !== "Enter" && event.key !== ",")) return;
  event.preventDefault();
  event.preventBaseUIHandler();
  if (typed === "") return;
  const tag = match ?? typed;
  setValue((current) => (current.includes(tag) ? current : [...current, tag]));
  setQuery("");
}

<Combobox
  autoHighlight
  inputValue={query}
  items={items}
  multiple
  onInputValueChange={setQuery}
  onItemHighlighted={(item, { reason }) => {
    highlight.current = item === undefined ? undefined : reason;
  }}
  onOpenChange={(open) => {
    if (!open) highlight.current = undefined;
  }}
  onValueChange={(next) => {
    setValue(next);
    setQuery("");
  }}
  value={value}
>
  <ComboboxChips ref={anchor}>
    <ComboboxValue>
      {(values) => (
        <>
          {values.map((tag) => (
            <ComboboxChip key={tag}>{tag}</ComboboxChip>
          ))}
          <ComboboxChipsInput onKeyDown={handleKeyDown} />
        </>
      )}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxList>
      {(tag) => (
        <ComboboxItem key={tag} value={tag}>
          {known.includes(tag) ? tag : `Create "${tag}"`}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>;
```

Escape with the list closed clears every chip. To keep them, ignore that change and let Escape reach the parent, so a dialog around the field closes instead:

```tsx
onValueChange={(next, details) => {
  if (details.reason === "escape-key") {
    details.allowPropagation();
    return;
  }
  setValue(next);
  setQuery("");
}}
```

## Clear Button

Add `showClear` to `ComboboxInput` to show a button that clears the value. It takes the trigger's place while there's a value.

<!-- ::demo name="combobox-clear" -->

```tsx
<ComboboxInput showClear />
```

## Groups

Pass groups as `items`, each with its own `items`, and render each group's items with `ComboboxCollection`.

<!-- ::demo name="combobox-groups" -->

```tsx
const produce = [
  { items: ["Apple", "Banana", "Blueberry"], value: "Fruits" },
  { items: ["Broccoli", "Carrot", "Spinach"], value: "Vegetables" },
];

<ComboboxList>
  {(group, index) => (
    <ComboboxGroup items={group.items} key={group.value}>
      {index > 0 && <ComboboxSeparator />}
      <ComboboxLabel>{group.value}</ComboboxLabel>
      <ComboboxCollection>
        {(item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxCollection>
    </ComboboxGroup>
  )}
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
<Combobox disabled items={fruits}>
  <ComboboxInput />
</Combobox>
```

## Invalid

Add `invalid` to the `Field`, so the input takes the red edge.

<!-- ::demo name="combobox-invalid" -->

```tsx
<Field invalid>
  <FieldLabel>Fruit</FieldLabel>
  <Combobox items={fruits}>
    <ComboboxInput placeholder="Select a fruit" />
    <ComboboxContent>…</ComboboxContent>
  </Combobox>
  <FieldDescription>Please select a fruit.</FieldDescription>
</Field>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ComboboxInput` | An input group with a trigger; `showTrigger` (default `true`), `showClear`, `size`: `"sm"`, `"default"` or `"lg"` |
| `ComboboxChips` | An input group's box that wraps its chips; `size`: `"sm"`, `"default"` or `"lg"`; `ref` goes to the box |
| `ComboboxChip` | `showRemove` (default `true`): a button that removes the chip |
| `ComboboxContent` | Renders the portal, positioner and popup; takes `side`, `align`, `anchor` and their offsets; `size`: `"sm"`, `"default"` or `"lg"` rows |
| `useComboboxAnchor` | A ref for `ComboboxChips`, passed to `ComboboxContent` as `anchor` |

Every part takes `sx`, applied last. For the rest, see [Base UI Combobox](https://base-ui.com/react/components/combobox).
