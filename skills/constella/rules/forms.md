# Forms and Inputs

## Contents

- Forms use FieldGroup + Field
- Label, description and error link themselves
- Validation and disabled states
- FieldSet for related controls
- Choice cards
- InputGroup for addons and buttons
- Option sets use ToggleGroup
- Controls with no label element

---

## Forms use FieldGroup + Field

Never lay a form out with a `div` and a gap. `FieldGroup` spaces its fields; `Field` holds one control.

**Incorrect:**

```tsx
<div className="grid gap-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" />
  </div>
</div>
```

**Correct:**

```tsx
<FieldGroup>
  <Field>
    <FieldLabel>Email</FieldLabel>
    <Input type="email" />
    <FieldDescription>We never share it.</FieldDescription>
  </Field>
</FieldGroup>
```

A horizontal control (checkbox, switch) uses `orientation="horizontal"`. Wrap its label and description in `FieldContent` to stack them.

```tsx
<Field orientation="horizontal">
  <Checkbox />
  <FieldContent>
    <FieldLabel>Accept terms</FieldLabel>
    <FieldDescription>You agree to the terms.</FieldDescription>
  </FieldContent>
</Field>
```

Submit buttons sit in a `Field orientation="horizontal"` at the end of the `FieldGroup`.

---

## Label, description and error link themselves

Inside a `Field`, `FieldLabel`, `FieldDescription` and `FieldError` attach to the control with no `id` or `htmlFor`. Don't add them.

**Incorrect:**

```tsx
<Field>
  <FieldLabel htmlFor="name">Name</FieldLabel>
  <Input id="name" aria-describedby="name-help" />
  <FieldDescription id="name-help">Your full name.</FieldDescription>
</Field>
```

**Correct:**

```tsx
<Field>
  <FieldLabel>Name</FieldLabel>
  <Input />
  <FieldDescription>Your full name.</FieldDescription>
</Field>
```

---

## Validation and disabled states

`invalid` and `disabled` go on `Field`, not on the control. It styles the label, the control and the message together.

**Incorrect:**

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <p className="text-red-500">Invalid email.</p>
</Field>
```

**Correct:**

```tsx
<Field invalid>
  <FieldLabel>Email</FieldLabel>
  <Input />
  <FieldError match>Enter a valid email.</FieldError>
</Field>
```

- `match` shows the error always. Without it, `FieldError` shows only when Base UI's validation fails.
- With a form library, pass its errors: `<FieldError errors={field.state.meta.errors} />`. Nothing renders when the array is empty.
- `<Field disabled>` disables its control and dims the label.

Color alone never says invalid: the message says it too.

---

## FieldSet for related controls

Group related checkboxes or radios in a `FieldSet` with a `FieldLegend`, not a `div` with a heading.

**Incorrect:**

```tsx
<div>
  <h3>Notifications</h3>
  <Checkbox /> Email
  <Checkbox /> Push
</div>
```

**Correct:**

```tsx
<FieldSet>
  <FieldLegend variant="label">Notifications</FieldLegend>
  <FieldSetDescription>Choose how you hear from us.</FieldSetDescription>
  <FieldGroup>
    <Field orientation="horizontal">
      <Checkbox />
      <FieldLabel>Email</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <Checkbox />
      <FieldLabel>Push</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

A radio group is `FieldSet` + `FieldLegend` around `RadioGroup`, each `RadioGroupItem` in a horizontal `Field`. Break stacked fieldsets with `FieldSeparator`.

---

## Choice cards

Put the control and a `FieldContent` inside the `FieldLabel`, and the whole label becomes a card that toggles it.

```tsx
<Field>
  <FieldLabel>
    <Checkbox />
    <FieldContent>
      <FieldTitle>Enable notifications</FieldTitle>
      <FieldDescription>Change this any time.</FieldDescription>
    </FieldContent>
  </FieldLabel>
</Field>
```

---

## InputGroup for addons and buttons

An icon, prefix or button inside an input is an `InputGroup`. Use `InputGroupInput` or `InputGroupTextarea` for the field. `Input` is itself an InputGroup box, so don't nest one in another.

**Incorrect:**

```tsx
<div className="relative">
  <SearchIcon className="absolute left-2" />
  <Input className="pl-8" />
</div>
```

**Correct:**

```tsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <HugeiconsIcon icon={Search01Icon} size={sizes.icon} aria-hidden />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupButton>Go</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

Put `InputGroupAddon` after the input in the DOM and place it with `align` (`inline-start`, `inline-end`, `block-start`, `block-end`), so the tab order keeps the input first. Use the block ones with a textarea. `InputGroupText` is for a prefix like `https://`. A plain `Input` takes `sx` on its box; every other prop goes to the `<input>`.

---

## Option sets use ToggleGroup

For two to seven options, use `ToggleGroup`. Don't loop `Button`s and track the active one.

**Incorrect:**

```tsx
{
  ["left", "center", "right"].map((a) => (
    <Button
      key={a}
      variant={a === align ? "primary" : "outline"}
      onClick={() => setAlign(a)}
    >
      {a}
    </Button>
  ));
}
```

**Correct:**

```tsx
<ToggleGroup
  value={[align]}
  onValueChange={([next]) => next && setAlign(next)}
  variant="outline"
>
  <ToggleGroupItem value="left" aria-label="Align left">
    …
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    …
  </ToggleGroupItem>
</ToggleGroup>
```

The value is always an array, even for one choice. Without `multiple`, one item is on at a time. An icon-only item needs an `aria-label`.

---

## Controls with no label element

A `Slider` has no `<label>`, so use `FieldTitle` and give the control an `aria-label`.

```tsx
<Field>
  <FieldTitle>Price range</FieldTitle>
  <Slider
    aria-label="Price range"
    max={1000}
    value={range}
    onValueChange={setRange}
  />
</Field>
```

`Select` goes in a `Field` like any control; remember its `items`.
