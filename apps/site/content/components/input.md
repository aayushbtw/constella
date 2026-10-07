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

## Size

Use the `size` prop to match the input to the buttons beside it.

| Size      | Height | Text |
| --------- | ------ | ---- |
| `sm`      | 28px   | 13px |
| `default` | 32px   | 14px |
| `lg`      | 36px   | 14px |

Under 640px every size uses 16px text, so iOS doesn't zoom on focus.

<!-- ::demo name="input-size" -->

```tsx
<Input aria-label="Small" placeholder="Small" size="sm" />
<Input aria-label="Default" placeholder="Default" />
<Input aria-label="Large" placeholder="Large" size="lg" />
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

## Badge

Put a [Badge](/docs/components/badge) in the `FieldLabel` to mark the field.

<!-- ::demo name="input-badge" -->

```tsx
<Field>
  <FieldLabel>
    Webhook URL
    <Badge>Beta</Badge>
  </FieldLabel>
  <Input placeholder="https://api.example.com/webhook" type="url" />
</Field>
```

## Input Group

Use [Input Group](/docs/components/input-group) to put icons, text or buttons inside the input.

<!-- ::demo name="input-input-group" -->

```tsx
<Field>
  <FieldLabel>Website URL</FieldLabel>
  <InputGroup>
    <InputGroupInput placeholder="example.com" />
    <InputGroupAddon>
      <InputGroupText>https://</InputGroupText>
    </InputGroupAddon>
    <InputGroupAddon align="inline-end">
      <HugeiconsIcon icon={InformationCircleIcon} />
    </InputGroupAddon>
  </InputGroup>
</Field>
```

## Button Group

Use [Button Group](/docs/components/button-group) to join a button to the input.

<!-- ::demo name="input-button-group" -->

```tsx
<Field>
  <FieldLabel>Search</FieldLabel>
  <ButtonGroup>
    <Input placeholder="Type to search..." />
    <Button variant="outline">Search</Button>
  </ButtonGroup>
</Field>
```

## Form

Inputs with a [Select](/docs/components/select) in a `FieldGroup`, for a whole form.

<!-- ::demo name="input-form" -->

```tsx
<form>
  <FieldGroup>
    <Field>
      <FieldLabel>Name</FieldLabel>
      <Input placeholder="Evil Rabbit" required />
    </Field>
    <Field>
      <FieldLabel>Country</FieldLabel>
      <Select defaultValue="us" items={countries}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
        </SelectContent>
      </Select>
    </Field>
    <Field orientation="horizontal">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Field>
  </FieldGroup>
</form>
```

## API Reference

`Input` renders Base UI's input, so inside a `Field` it takes the field's name, state and validation. It takes `size` (`sm`, `default`, `lg`) in place of the native `size` attribute, and `sx`, applied last. For the rest, see [Base UI Input](https://base-ui.com/react/components/input).
