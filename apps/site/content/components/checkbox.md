---
title: Checkbox
description: Turns an option on or off.
draft: true
---

<!-- ::demo name="checkbox" -->

```tsx
<Label>
  <Checkbox defaultChecked />
  Accept terms and conditions
</Label>
```

## Installation

<!-- ::install name="checkbox" -->

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
```

```tsx
<Label>
  <Checkbox />
  Accept terms and conditions
</Label>
```

## Description

Use a horizontal [Field](/docs/components/field) with `FieldContent` and `FieldDescription` for helper text.

<!-- ::demo name="field" -->

```tsx
<Field orientation="horizontal">
  <Checkbox defaultChecked />
  <FieldContent>
    <FieldLabel>Accept terms and conditions</FieldLabel>
    <FieldDescription>
      By clicking this checkbox, you agree to the terms.
    </FieldDescription>
  </FieldContent>
</Field>
```

## Group

Use a `FieldSet` of fields for a checkbox list.

<!-- ::demo name="field-set" -->

```tsx
<FieldSet>
  <FieldLegend variant="label">Show these items on the desktop</FieldLegend>
  <FieldSetDescription>
    Select the items you want to show on the desktop.
  </FieldSetDescription>
  <FieldGroup>
    <Field orientation="horizontal">
      <Checkbox defaultChecked />
      <FieldLabel>Hard disks</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox />
      <FieldLabel>Connected servers</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Choice Card

Put the checkbox and its content inside a `FieldLabel` to make the whole card toggle it.

<!-- ::demo name="field-card" -->

```tsx
<Field>
  <FieldLabel>
    <Checkbox defaultChecked />
    <FieldContent>
      <FieldTitle>Enable notifications</FieldTitle>
      <FieldDescription>
        You can enable or disable notifications at any time.
      </FieldDescription>
    </FieldContent>
  </FieldLabel>
</Field>
```

## Controlled

Use `checked` and `onCheckedChange` to control the checkbox.

<!-- ::demo name="checkbox-controlled" -->

```tsx
const [checked, setChecked] = useState(true);

<Label>
  <Checkbox checked={checked} onCheckedChange={setChecked} />
  {checked ? "Notifications on" : "Notifications off"}
</Label>;
```

## Indeterminate

Use `indeterminate` when some, but not all, of a group is checked.

<!-- ::demo name="checkbox-indeterminate" -->

```tsx
const fruits = ["Apples", "Oranges", "Pears"];

function FruitPicker() {
  const [selected, setSelected] = useState(["Apples"]);
  const all = selected.length === fruits.length;

  return (
    <>
      <Label>
        <Checkbox
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onCheckedChange={(checked) => setSelected(checked ? fruits : [])}
        />
        All fruits
      </Label>
      {fruits.map((fruit) => (
        <Label key={fruit}>
          <Checkbox
            checked={selected.includes(fruit)}
            onCheckedChange={(checked) =>
              setSelected((current) =>
                checked
                  ? [...current, fruit]
                  : current.filter((item) => item !== fruit)
              )
            }
          />
          {fruit}
        </Label>
      ))}
    </>
  );
}
```

## Disabled

Use the `disabled` prop to disable the checkbox. A `Label` around it dims too.

<!-- ::demo name="checkbox-disabled" -->

```tsx
<Label>
  <Checkbox disabled />
  Unavailable
</Label>
```

## Invalid

Add `aria-invalid` to mark the checkbox as needing attention.

<!-- ::demo name="checkbox-invalid" -->

```tsx
<Label>
  <Checkbox aria-invalid />
  Accept terms and conditions
</Label>
```

## Table

Put a checkbox in the first cell of each row, and one in the header to select them all. Mark a picked row with `data-state="selected"`.

<!-- ::demo name="checkbox-table" -->

```tsx
<TableRow data-state={selected.has(row.id) ? "selected" : undefined}>
  <TableCell>
    <Checkbox
      aria-label={`Select ${row.name}`}
      checked={selected.has(row.id)}
      onCheckedChange={(checked) => toggle(row.id, checked)}
    />
  </TableCell>
  <TableCell>{row.name}</TableCell>
</TableRow>
```

## API Reference

`Checkbox` renders the box and its tick, which turns into a dash when `indeterminate`. It takes `sx`, applied last. For the rest, see [Base UI Checkbox](https://base-ui.com/react/components/checkbox).
