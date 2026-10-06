---
title: Field
description: Lays out a control with its label, description and error.
draft: true
---

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

## Installation

<!-- ::install name="field" -->

## Usage

```tsx
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSetDescription,
  FieldTitle,
} from "@/components/ui/field";
```

```tsx
<Field>
  <FieldLabel>Label</FieldLabel>
  {/* control */}
  <FieldDescription>Helper text.</FieldDescription>
</Field>
```

The label, description and error link to the control inside the `Field` on their own, so no `id` or `htmlFor` is needed.

## Orientation

Use `orientation="horizontal"` to put the control beside its label, as for a checkbox. Wrap the label and description in `FieldContent` to stack them.

<!-- ::demo name="field" -->

```tsx
<Field orientation="horizontal">
  <Checkbox />
  <FieldContent>
    <FieldLabel>Accept terms and conditions</FieldLabel>
    <FieldDescription>
      By clicking this checkbox, you agree to the terms.
    </FieldDescription>
  </FieldContent>
</Field>
```

## Fieldset

Group related fields in a `FieldSet` with a `FieldLegend`. Use `variant="label"` for a legend the size of a label, and `FieldSetDescription` for its helper text.

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

Put the control and a `FieldContent` inside the `FieldLabel` to turn the whole label into a card that toggles it. Use `FieldTitle` for its heading.

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

## Disabled

Use the `disabled` prop on `Field` to disable its control and dim its label.

<!-- ::demo name="field-disabled" -->

```tsx
<Field disabled orientation="horizontal">
  <Checkbox />
  <FieldLabel>Enable notifications</FieldLabel>
</Field>
```

## Error

Use the `invalid` prop to mark the field, and `FieldError` for the message. `match` shows it always; leave it out to show it only when Base UI's validation fails.

<!-- ::demo name="field-error" -->

```tsx
<Field invalid orientation="horizontal">
  <Checkbox />
  <FieldContent>
    <FieldLabel>Accept terms and conditions</FieldLabel>
    <FieldError match>You must accept the terms to continue.</FieldError>
  </FieldContent>
</Field>
```

## API Reference

`Field` adds `orientation` (`"vertical"`, the default, or `"horizontal"`) and `FieldLegend` adds `variant` (`"legend"`, the default, or `"label"`). `FieldGroup`, `FieldContent`, `FieldTitle` and `FieldSetDescription` are plain elements. Every part takes `sx`, applied last. For the rest, see [Base UI Field](https://base-ui.com/react/components/field) and [Fieldset](https://base-ui.com/react/components/fieldset).

## Pending

Blocked on missing components. Remove this section before the page leaves draft.

- Input, Textarea, Radio, Switch and Select: fill the page like shadcn's Field page, and make the top demo its form.
- Separator: add `FieldSeparator`.
