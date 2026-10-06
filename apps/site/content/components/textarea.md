---
title: Textarea
description: A multi-line text box that grows with what's typed.
draft: true
---

<!-- ::demo name="textarea" -->

```tsx
<Textarea aria-label="Message" placeholder="Type your message here." />
```

## Installation

<!-- ::install name="textarea" -->

## Usage

```tsx
import { Textarea } from "@/components/ui/textarea";
```

```tsx
<Textarea />
```

## Field

Use `Field`, `FieldLabel` and `FieldDescription` to give the textarea a label and helper text. They link to it on their own, so no `id` or `htmlFor` is needed.

<!-- ::demo name="textarea-field" -->

```tsx
<Field>
  <FieldLabel>Message</FieldLabel>
  <FieldDescription>Enter your message below.</FieldDescription>
  <Textarea placeholder="Type your message here." />
</Field>
```

## Disabled

Use the `disabled` prop on `Field` to disable the textarea and dim its label. On a bare textarea, use `disabled` on the textarea.

<!-- ::demo name="textarea-disabled" -->

```tsx
<Field disabled>
  <FieldLabel>Message</FieldLabel>
  <Textarea placeholder="Type your message here." />
</Field>
```

## Invalid

Use the `invalid` prop on `Field` to mark the textarea. On a bare textarea, add `aria-invalid`.

<!-- ::demo name="textarea-invalid" -->

```tsx
<Field invalid>
  <FieldLabel>Message</FieldLabel>
  <Textarea placeholder="Type your message here." />
  <FieldDescription>Please enter a valid message.</FieldDescription>
</Field>
```

## Button

Pair with `Button` to send what's typed.

<!-- ::demo name="textarea-button" -->

```tsx
const styles = stylex.create({
  stack: { display: "grid", gap: space.xs },
});

<div {...stylex.props(styles.stack)}>
  <Textarea aria-label="Message" placeholder="Type your message here." />
  <Button variant="primary">Send message</Button>
</div>;
```

## API Reference

`Textarea` renders Base UI's `Field.Control` as a `<textarea>`, so inside a `Field` it takes the field's name, state and validation. It starts two rows tall and grows with its content; set `rows` for a taller start. It takes `sx`, applied last.
