---
title: Input
description: A single-line text box for forms and user data entry.
draft: true
---

<!-- ::demo name="input" -->

```tsx
<Field>
  <FieldLabel>API Key</FieldLabel>
  <Input placeholder="sk-..." type="password" />
  <FieldDescription>
    Your API key is encrypted and stored securely.
  </FieldDescription>
</Field>
```

## Installation

<!-- ::install name="input" -->

## Usage

```tsx
import { Input } from "@/components/ui/input";
```

```tsx
<Input />
```

## Basic

<!-- ::demo name="input-basic" -->

```tsx
<Input aria-label="Text" placeholder="Enter text" />
```

## Field

Use `Field`, `FieldLabel` and `FieldDescription` to give the input a label and helper text. They link to the input on their own, so no `id` or `htmlFor` is needed.

<!-- ::demo name="input-field" -->

```tsx
<Field>
  <FieldLabel>Username</FieldLabel>
  <Input placeholder="Enter your username" />
  <FieldDescription>
    Choose a unique username for your account.
  </FieldDescription>
</Field>
```

## Field Group

Use `FieldGroup` to stack several fields into a form.

<!-- ::demo name="input-field-group" -->

```tsx
<FieldGroup>
  <Field>
    <FieldLabel>Name</FieldLabel>
    <Input placeholder="Jordan Lee" />
  </Field>
  <Field>
    <FieldLabel>Email</FieldLabel>
    <Input placeholder="name@example.com" type="email" />
    <FieldDescription>We’ll send updates to this address.</FieldDescription>
  </Field>
  <Field orientation="horizontal">
    <Button type="reset" variant="outline">
      Reset
    </Button>
    <Button type="submit" variant="primary">
      Submit
    </Button>
  </Field>
</FieldGroup>
```

## Disabled

Use the `disabled` prop on `Field` to disable the input and dim its label. On a bare input, use `disabled` on the input.

<!-- ::demo name="input-disabled" -->

```tsx
<Field disabled>
  <FieldLabel>Email</FieldLabel>
  <Input placeholder="Email" type="email" />
  <FieldDescription>This field is currently disabled.</FieldDescription>
</Field>
```

## Invalid

Use the `invalid` prop on `Field` to mark the input. On a bare input, add `aria-invalid`.

<!-- ::demo name="input-invalid" -->

```tsx
<Field invalid>
  <FieldLabel>Invalid Input</FieldLabel>
  <Input placeholder="Error" />
  <FieldDescription>This field contains validation errors.</FieldDescription>
</Field>
```

## File

Use `type="file"` for a file input.

<!-- ::demo name="input-file" -->

```tsx
<Field>
  <FieldLabel>Picture</FieldLabel>
  <Input type="file" />
  <FieldDescription>Select a picture to upload.</FieldDescription>
</Field>
```

## Inline

Use a horizontal `Field` to put a button beside the input.

<!-- ::demo name="input-inline" -->

```tsx
<Field orientation="horizontal">
  <Input aria-label="Search" placeholder="Search..." type="search" />
  <Button variant="primary">Search</Button>
</Field>
```

## Grid

Give `FieldGroup` a grid to place inputs side by side.

<!-- ::demo name="input-grid" -->

```tsx
const styles = stylex.create({
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr" },
});

<FieldGroup sx={styles.grid}>
  <Field>
    <FieldLabel>First Name</FieldLabel>
    <Input placeholder="Jordan" />
  </Field>
  <Field>
    <FieldLabel>Last Name</FieldLabel>
    <Input placeholder="Lee" />
  </Field>
</FieldGroup>;
```

## Required

Use the `required` prop, and mark the label so the requirement is visible.

<!-- ::demo name="input-required" -->

```tsx
const styles = stylex.create({
  required: { color: colors.danger },
});

<Field>
  <FieldLabel>
    <span>
      Required Field <span {...stylex.props(styles.required)}>*</span>
    </span>
  </FieldLabel>
  <Input placeholder="This field is required" required />
  <FieldDescription>This field must be filled out.</FieldDescription>
</Field>;
```

## API Reference

`Input` renders Base UI's input, so inside a `Field` it takes the field's name, state and validation. It takes `sx`, applied last. For the rest, see [Base UI Input](https://base-ui.com/react/components/input).

## Pending

Blocked on missing components. Remove this section before the page leaves draft.

- Badge: add shadcn's Badge example.
- InputGroup: add the Input Group example.
- ButtonGroup: add the Button Group example.
- Select and Textarea: add the Form example.
