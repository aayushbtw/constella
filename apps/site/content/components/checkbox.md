---
title: Checkbox
description: Turns an option on or off.
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
import { Checkbox, CheckboxGroup } from "@/components/primitives/checkbox";
import { Label } from "@/components/primitives/label";
```

```tsx
<Label>
  <Checkbox />
  Accept terms and conditions
</Label>
```

## Composition

```
CheckboxGroup
└── Checkbox
```

## Size

Use the `size` prop to change the size of the box and its tick.

<!-- ::demo name="checkbox-size" -->

```tsx
<Checkbox size="lg" />
```

| Size      | Box  | Mark |
| --------- | ---- | ---- |
| `sm`      | 14px | 12px |
| `default` | 16px | 14px |
| `lg`      | 20px | 16px |

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

Use `CheckboxGroup` to keep one list of checked values. Each checkbox supplies its `value`. In a `FieldSet`, point the group at the legend with `aria-labelledby` and at the description with `aria-describedby`.

<!-- ::demo name="checkbox-group" -->

```tsx
const desktopItems = [
  { label: "Hard disks", value: "hard-disks" },
  { label: "External disks", value: "external-disks" },
  { label: "CDs, DVDs, and iPods", value: "media" },
  { label: "Connected servers", value: "servers" },
];

function DesktopItems() {
  const legend = useId();
  const description = useId();
  return (
    <FieldSet>
      <FieldLegend id={legend} variant="label">
        Show these items on the desktop
      </FieldLegend>
      <FieldDescription id={description}>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <CheckboxGroup
        aria-describedby={description}
        aria-labelledby={legend}
        defaultValue={["hard-disks", "external-disks"]}
      >
        {desktopItems.map((item) => (
          <Label key={item.value}>
            <Checkbox value={item.value} />
            {item.label}
          </Label>
        ))}
      </CheckboxGroup>
    </FieldSet>
  );
}
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

Use `checked` and `onCheckedChange` to control the checkbox. The value is `true`, `false` or `"indeterminate"`.

<!-- ::demo name="checkbox-controlled" -->

```tsx
const [checked, setChecked] = useState(true);

<Label>
  <Checkbox
    checked={checked}
    onCheckedChange={(next) => setChecked(next === true)}
  />
  {checked ? "Notifications on" : "Notifications off"}
</Label>;
```

## Indeterminate

Add a checkbox with `parent` to a `CheckboxGroup` to check or uncheck the whole group. It shows a dash while some, but not all, are checked, and a click checks them all. Pass `allValues` so it has the right state on the first render, on the server too.

<!-- ::demo name="checkbox-indeterminate" -->

```tsx
const fruits = ["Apples", "Oranges", "Pears"];

function Fruits() {
  return (
    <CheckboxGroup
      aria-label="Fruits"
      allValues={fruits}
      defaultValue={["Apples"]}
    >
      <Label>
        <Checkbox parent />
        All fruits
      </Label>
      {fruits.map((fruit) => (
        <Label key={fruit}>
          <Checkbox value={fruit} />
          {fruit}
        </Label>
      ))}
    </CheckboxGroup>
  );
}
```

A checkbox outside a group takes `checked="indeterminate"` directly.

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

Wrap the table in a `CheckboxGroup`. Put a checkbox with the row's `value` in the first cell of each row, and a `parent` checkbox in the header to select them all. Mark a picked row with `data-state="selected"`.

<!-- ::demo name="checkbox-table" -->

```tsx
function TeamMembers() {
  const [selected, setSelected] = useState(["1"]);

  return (
    <CheckboxGroup
      allValues={people.map((row) => row.id)}
      aria-label="Team members"
      onValueChange={setSelected}
      value={selected}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox aria-label="Select all" parent />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((row) => (
            <TableRow
              data-state={selected.includes(row.id) ? "selected" : undefined}
              key={row.id}
            >
              <TableCell>
                <Checkbox aria-label={`Select ${row.name}`} value={row.id} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CheckboxGroup>
  );
}
```

## API Reference

`Checkbox` renders a button with the `checkbox` role, its tick, which turns into a dash while `checked` is `"indeterminate"`, and a hidden native checkbox for forms. It takes `size` (`"sm"`, `"default"` or `"lg"`) and `sx`, applied last. `CheckboxGroup` stacks its children and takes `sx`. For the rest, see [UI SDK Checkbox](https://ui-sdk.dev/docs/react/components/checkbox).
