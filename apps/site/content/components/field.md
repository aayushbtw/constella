---
title: Field
description: Lays out a control with its label, description and error.
draft: true
---

<!-- ::demo name="field-form" -->

```tsx
<form>
  <FieldGroup>
    <FieldSet>
      <FieldLegend>Payment Method</FieldLegend>
      <FieldSetDescription>
        All transactions are secure and encrypted
      </FieldSetDescription>
      <FieldGroup>
        <Field>
          <FieldLabel>Name on Card</FieldLabel>
          <Input placeholder="Evil Rabbit" required />
        </Field>
        <Field>
          <FieldLabel>Card Number</FieldLabel>
          <Input placeholder="1234 5678 9012 3456" required />
          <FieldDescription>Enter your 16-digit card number</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
    <FieldSeparator />
    <FieldSet>
      <FieldLegend>Billing Address</FieldLegend>
      <Field orientation="horizontal">
        <Checkbox defaultChecked />
        <FieldLabel>Same as shipping address</FieldLabel>
      </Field>
    </FieldSet>
    <Field orientation="horizontal">
      <Button type="submit" variant="primary">
        Submit
      </Button>
      <Button type="button" variant="outline">
        Cancel
      </Button>
    </Field>
  </FieldGroup>
</form>
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
  FieldSeparator,
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

## Input

<!-- ::demo name="field-input" -->

```tsx
<Field>
  <FieldLabel>Username</FieldLabel>
  <Input placeholder="Max Leiter" />
  <FieldDescription>
    Choose a unique username for your account.
  </FieldDescription>
</Field>
```

## Textarea

<!-- ::demo name="field-textarea" -->

```tsx
<Field>
  <FieldLabel>Feedback</FieldLabel>
  <Textarea placeholder="Your feedback helps us improve..." rows={4} />
  <FieldDescription>Share your thoughts about our service.</FieldDescription>
</Field>
```

## Select

<!-- ::demo name="field-select" -->

```tsx
<Field>
  <FieldLabel>Department</FieldLabel>
  <Select items={departments}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="engineering">Engineering</SelectItem>
    </SelectContent>
  </Select>
  <FieldDescription>Select your department or area of work.</FieldDescription>
</Field>
```

## Slider

Use `FieldTitle` for a control that isn't labelled by a `<label>`.

<!-- ::demo name="field-slider" -->

```tsx
<Field>
  <FieldTitle>Price Range</FieldTitle>
  <FieldDescription>
    Set your budget range (${range[0]} - {range[1]}).
  </FieldDescription>
  <Slider
    aria-label="Price Range"
    max={1000}
    onValueChange={setRange}
    value={range}
  />
</Field>
```

## Radio

<!-- ::demo name="field-radio" -->

```tsx
<FieldSet>
  <FieldLegend variant="label">Subscription Plan</FieldLegend>
  <RadioGroup defaultValue="monthly">
    <Field orientation="horizontal">
      <RadioGroupItem value="monthly" />
      <FieldLabel>Monthly ($9.99/month)</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
```

## Switch

<!-- ::demo name="field-switch" -->

```tsx
<Field orientation="horizontal">
  <FieldLabel>Multi-factor authentication</FieldLabel>
  <Switch />
</Field>
```

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

## Field Group

Stack fieldsets in a `FieldGroup`, with a `FieldSeparator` between them. Pass it text to label the break.

<!-- ::demo name="field-group" -->

```tsx
<FieldGroup>
  <FieldSet>
    <FieldLegend variant="label">Responses</FieldLegend>
    <Field orientation="horizontal">
      <Checkbox defaultChecked disabled />
      <FieldLabel>Push notifications</FieldLabel>
    </Field>
  </FieldSet>
  <FieldSeparator />
  <FieldSet>
    <FieldLegend variant="label">Tasks</FieldLegend>
    <Field orientation="horizontal">
      <Checkbox />
      <FieldLabel>Email notifications</FieldLabel>
    </Field>
  </FieldSet>
</FieldGroup>
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

`Field` adds `orientation` (`"vertical"`, the default, or `"horizontal"`) and `FieldLegend` adds `variant` (`"legend"`, the default, or `"label"`). `FieldGroup`, `FieldContent`, `FieldTitle` and `FieldSetDescription` are plain elements. `FieldSeparator` draws a line, broken by its children when it has any. Every part takes `sx`, applied last. For the rest, see [Base UI Field](https://base-ui.com/react/components/field) and [Fieldset](https://base-ui.com/react/components/fieldset).
