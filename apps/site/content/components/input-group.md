---
title: Input Group
description: Add icons, text, keys and buttons inside an input or textarea.
---

<!-- ::demo name="input-group" -->

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search..." />
  <InputGroupAddon>
    <HugeiconsIcon icon={Search01Icon} />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
</InputGroup>
```

## Installation

<!-- ::install name="input-group" -->

## Usage

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
```

```tsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <HugeiconsIcon icon={Search01Icon} />
  </InputGroupAddon>
</InputGroup>
```

## Composition

```text
InputGroup
├── InputGroupInput or InputGroupTextarea
├── InputGroupAddon
├── InputGroupButton
└── InputGroupText
```

## Align

Use the `align` prop on `InputGroupAddon` to place it around the input.

**Put `InputGroupAddon` after the input in the DOM**, and place it with `align`: the tab order follows the DOM, so the input stays first.

### inline-start

Use `align="inline-start"` to place the addon at the start of the input. This is the default.

<!-- ::demo name="input-group-inline-start" -->

```tsx
<Field>
  <FieldLabel>Input</FieldLabel>
  <InputGroup>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon align="inline-start">
      <HugeiconsIcon icon={Search01Icon} />
    </InputGroupAddon>
  </InputGroup>
  <FieldDescription>Icon positioned at the start.</FieldDescription>
</Field>
```

### inline-end

Use `align="inline-end"` to place the addon at the end of the input.

<!-- ::demo name="input-group-inline-end" -->

```tsx
<Field>
  <FieldLabel>Input</FieldLabel>
  <InputGroup>
    <InputGroupInput placeholder="Enter password" type="password" />
    <InputGroupAddon align="inline-end">
      <HugeiconsIcon icon={ViewOffSlashIcon} />
    </InputGroupAddon>
  </InputGroup>
  <FieldDescription>Icon positioned at the end.</FieldDescription>
</Field>
```

### block-start

Use `align="block-start"` to place the addon above the input.

<!-- ::demo name="input-group-block-start" -->

```tsx
const styles = stylex.create({
  code: {
    fontFamily: '"JetBrains Mono Variable", monospace',
    fontSize: fontSizes.xs,
    fontVariantLigatures: "none",
  },
});

<FieldGroup>
  <Field>
    <FieldLabel>Input</FieldLabel>
    <InputGroup>
      <InputGroupInput placeholder="Enter your name" />
      <InputGroupAddon align="block-start">
        <InputGroupText>Full Name</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Header positioned above the input.</FieldDescription>
  </Field>
  <Field>
    <FieldLabel>Textarea</FieldLabel>
    <InputGroup>
      <InputGroupTextarea
        placeholder="console.log('Hello, world!');"
        sx={styles.code}
      />
      <InputGroupAddon align="block-start">
        <HugeiconsIcon icon={FileScriptIcon} />
        <InputGroupText sx={styles.code}>script.js</InputGroupText>
        <InputGroupButton aria-label="Copy" size="icon-xs">
          <HugeiconsIcon icon={Copy01Icon} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Header positioned above the textarea.</FieldDescription>
  </Field>
</FieldGroup>;
```

### block-end

Use `align="block-end"` to place the addon below the input.

<!-- ::demo name="input-group-block-end" -->

```tsx
<FieldGroup>
  <Field>
    <FieldLabel>Input</FieldLabel>
    <InputGroup>
      <InputGroupInput placeholder="Enter amount" />
      <InputGroupAddon align="block-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Footer positioned below the input.</FieldDescription>
  </Field>
  <Field>
    <FieldLabel>Textarea</FieldLabel>
    <InputGroup>
      <InputGroupTextarea placeholder="Write a comment..." />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/280</InputGroupText>
        <InputGroupButton size="sm" variant="primary">
          Post
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <FieldDescription>Footer positioned below the textarea.</FieldDescription>
  </Field>
</FieldGroup>
```

## Size

Use the `size` prop to match the group to the buttons beside it, and size icons to match.

| Size      | Height | Icon           |
| --------- | ------ | -------------- |
| `sm`      | 28px   | `sizes.iconSm` |
| `default` | 32px   | `sizes.icon`   |
| `lg`      | 36px   | `sizes.icon`   |

<!-- ::demo name="input-group-size" -->

```tsx
<InputGroup size="sm">
  <InputGroupInput aria-label="Small" placeholder="Small" />
  <InputGroupAddon>
    <HugeiconsIcon icon={Search01Icon} size={sizes.iconSm} />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
</InputGroup>
<InputGroup>…</InputGroup>
<InputGroup size="lg">…</InputGroup>
```

## With Icon

Put an icon in an `InputGroupAddon`. An addon can hold more than one.

<!-- ::demo name="input-group-icon" -->

```tsx
<InputGroup>
  <InputGroupInput aria-label="Card number" placeholder="Card number" />
  <InputGroupAddon>
    <HugeiconsIcon icon={CreditCardIcon} />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <HugeiconsIcon icon={Tick02Icon} />
  </InputGroupAddon>
</InputGroup>
```

## Text

Use `InputGroupText` for a prefix, a suffix or a hint. A text prefix or suffix sits close to the value, so `https://` and `example.com` read as one.

<!-- ::demo name="input-group-text" -->

```tsx
<InputGroup>
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput aria-label="Website" placeholder="example.com" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>.com</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

## Button

Use `InputGroupButton` for an action inside the input. It's a ghost `Button` that defaults to `size="xs"` and `type="button"`, so it never submits the form by accident.

<!-- ::demo name="input-group-button" -->

```tsx
<InputGroup>
  <InputGroupInput
    aria-label="Profile link"
    placeholder="https://x.com/shadcn"
    readOnly
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton aria-label="Copy" size="icon-xs">
      <HugeiconsIcon icon={Copy01Icon} />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Type to search..." />
  <InputGroupAddon align="inline-end">
    <InputGroupButton variant="secondary">Search</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

Render a button as a [Popover](/docs/components/popover) trigger to explain the field.

```tsx
<InputGroupAddon>
  <Popover>
    <PopoverTrigger
      render={<InputGroupButton size="icon-xs" variant="secondary" />}
    >
      <HugeiconsIcon icon={InformationCircleIcon} />
    </PopoverTrigger>
    <PopoverContent align="start">
      <PopoverHeader>
        <PopoverTitle>Your connection is not secure.</PopoverTitle>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
  <InputGroupText>https://</InputGroupText>
</InputGroupAddon>
```

## Textarea

Use `InputGroupTextarea` with `block-start` and `block-end` addons for a header and a footer. Add `separated` to a block addon to draw an edge between it and the textarea.

<!-- ::demo name="input-group-textarea" -->

```tsx
<InputGroup>
  <InputGroupTextarea
    aria-label="Code"
    placeholder="console.log('Hello, world!');"
  />
  <InputGroupAddon align="block-end" separated>
    <InputGroupText>Line 1, Column 1</InputGroupText>
    <InputGroupButton size="sm" variant="primary">
      Run <HugeiconsIcon data-icon="inline-end" icon={ArrowTurnBackwardIcon} />
    </InputGroupButton>
  </InputGroupAddon>
  <InputGroupAddon align="block-start" separated>
    <InputGroupText>
      <HugeiconsIcon icon={JavaScriptIcon} />
      script.js
    </InputGroupText>
    <InputGroupButton aria-label="Refresh" size="icon-xs">
      <HugeiconsIcon icon={Refresh01Icon} />
    </InputGroupButton>
    <InputGroupButton aria-label="Copy" size="icon-xs">
      <HugeiconsIcon icon={Copy01Icon} />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Custom Input

Add `data-slot="input-group-control"` to your own input, so the group draws its focus ring, invalid edge and disabled fade. Spread `inputGroupTextareaStyles()` (or `inputGroupInputStyles()`) on it for the control's look. Here, a textarea from `react-textarea-autosize`:

<!-- ::demo name="input-group-custom" -->

```tsx
import TextareaAutosize from "react-textarea-autosize";

<InputGroup>
  <TextareaAutosize
    aria-label="Message"
    data-slot="input-group-control"
    placeholder="Autoresize textarea..."
    {...stylex.props(inputGroupTextareaStyles())}
  />
  <InputGroupAddon align="block-end">
    <InputGroupButton size="sm" variant="primary">
      Submit
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>;
```

## Dropdown Menu

Render a button as a [Dropdown Menu](/docs/components/dropdown-menu) trigger for more actions.

<!-- ::demo name="input-group-dropdown" -->

```tsx
<InputGroup>
  <InputGroupInput placeholder="Enter file name" />
  <InputGroupAddon align="inline-end">
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<InputGroupButton aria-label="More" size="icon-xs" />}
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Copy path</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </InputGroupAddon>
</InputGroup>
```

## Kbd

Put a [Kbd](/docs/components/kbd) in an addon to show a shortcut.

<!-- ::demo name="input-group-kbd" -->

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search" placeholder="Search..." />
  <InputGroupAddon>
    <HugeiconsIcon icon={Search01Icon} />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <Kbd>⌘K</Kbd>
  </InputGroupAddon>
</InputGroup>
```

## Spinner

Put a [Spinner](/docs/components/spinner) in an addon while something loads.

<!-- ::demo name="input-group-spinner" -->

```tsx
<InputGroup>
  <InputGroupInput aria-label="Notes" placeholder="Saving changes..." />
  <InputGroupAddon align="inline-end">
    <InputGroupText>Saving...</InputGroupText>
    <Spinner />
  </InputGroupAddon>
</InputGroup>
```

## API Reference

`InputGroup` is a `<div role="group">` that takes `size`: `"sm"`, `"default"` or `"lg"`. It draws the box, focus ring, invalid edge and disabled fade for the control inside, so `InputGroupInput` and `InputGroupTextarea` drop their own.

`InputGroupAddon` takes `align`: `"inline-start"` (default), `"inline-end"`, `"block-start"` or `"block-end"`. Use the inline ones with an input and the block ones with a textarea. In a block addon, buttons sit at the end, after any text; `separated` draws an edge between it and the control. Clicking an addon focuses the control, unless the click lands on a button.

`InputGroupButton` takes `size`: `"xs"` (default), `"sm"`, `"icon-xs"` or `"icon-sm"`, and every other [Button](/docs/components/button) prop; `variant` defaults to `"ghost"`.

`InputGroupInput` and `InputGroupTextarea` take every [Input](/docs/components/input) and [Textarea](/docs/components/textarea) prop. Every part takes `sx`, applied last.
