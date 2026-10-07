---
title: Button Group
description: Joins buttons, inputs and text into one control, across or down.
draft: true
---

<!-- ::demo name="button-group" -->

```tsx
<ButtonGroup aria-label="Message actions">
  <ButtonGroup>
    <Button aria-label="Go back" size="icon" variant="outline">
      <ArrowLeftIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
</ButtonGroup>
```

## Installation

<!-- ::install name="button-group" -->

## Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
```

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Accessibility

`ButtonGroup` has `role="group"`. Label it with `aria-label` or `aria-labelledby`; <kbd>Tab</kbd> moves between its buttons.

Use `ButtonGroup` for buttons that act. For buttons that toggle a state, use a toggle group.

## Orientation

Use `orientation="vertical"` to stack the group.

<!-- ::demo name="button-group-orientation" -->

```tsx
<ButtonGroup aria-label="Media controls" orientation="vertical">
  <Button aria-label="Volume up" size="icon" variant="outline">
    <PlusIcon />
  </Button>
  <Button aria-label="Volume down" size="icon" variant="outline">
    <MinusIcon />
  </Button>
</ButtonGroup>
```

## Size

Set `size` on each button; the group takes their height.

<!-- ::demo name="button-group-size" -->

```tsx
<ButtonGroup>
  <Button size="sm" variant="outline">
    Small
  </Button>
  <Button size="sm" variant="outline">
    Button
  </Button>
  <Button aria-label="Add" size="icon-sm" variant="outline">
    <PlusIcon />
  </Button>
</ButtonGroup>
```

## Nested

Nest groups to space them apart.

<!-- ::demo name="button-group-nested" -->

```tsx
<ButtonGroup aria-label="Pagination">
  <ButtonGroup>
    <Button size="sm" variant="outline">
      1
    </Button>
    <Button size="sm" variant="outline">
      2
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button aria-label="Previous" size="icon-sm" variant="outline">
      <ArrowLeftIcon />
    </Button>
    <Button aria-label="Next" size="icon-sm" variant="outline">
      <ArrowRightIcon />
    </Button>
  </ButtonGroup>
</ButtonGroup>
```

## Separator

Add `ButtonGroupSeparator` between buttons without an edge. `outline` buttons have one, so they don't need it.

<!-- ::demo name="button-group-separator" -->

```tsx
<ButtonGroup>
  <Button size="sm">Copy</Button>
  <ButtonGroupSeparator />
  <Button size="sm">Paste</Button>
</ButtonGroup>
```

## Split

Pair an action with an icon button, split by a separator.

<!-- ::demo name="button-group-split" -->

```tsx
<ButtonGroup>
  <Button>Button</Button>
  <ButtonGroupSeparator />
  <Button aria-label="Add" size="icon">
    <PlusIcon />
  </Button>
</ButtonGroup>
```

## Input

Put an `Input` in the group to join it to a button.

<!-- ::demo name="button-group-input" -->

```tsx
<ButtonGroup>
  <Input aria-label="Search" placeholder="Search..." />
  <Button aria-label="Search" size="icon" variant="outline">
    <SearchIcon />
  </Button>
</ButtonGroup>
```

## Input Group

Put an `InputGroup` in the group for an input with its own addons.

<!-- ::demo name="button-group-input-group" -->

```tsx
<ButtonGroup>
  <ButtonGroup>
    <Button aria-label="Add" size="icon" variant="outline">
      <PlusIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <InputGroup>
      <InputGroupInput aria-label="Message" placeholder="Send a message..." />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton
                aria-label="Voice mode"
                aria-pressed={voice}
                onClick={() => setVoice(!voice)}
                size="icon-xs"
              />
            }
          >
            <AudioLinesIcon />
          </TooltipTrigger>
          <TooltipContent>Voice mode</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  </ButtonGroup>
</ButtonGroup>
```

## Text

Use `ButtonGroupText` for a fixed prefix or suffix. Pass `render` to make it a label.

<!-- ::demo name="button-group-text" -->

```tsx
<ButtonGroup>
  <ButtonGroupText render={<label htmlFor="url" />}>https://</ButtonGroupText>
  <InputGroup>
    <InputGroupInput id="url" />
    <InputGroupAddon align="inline-end">
      <LinkIcon />
    </InputGroupAddon>
  </InputGroup>
  <ButtonGroupText>.com</ButtonGroupText>
</ButtonGroup>
```

## API Reference

### ButtonGroup

A `div` with `role="group"`. Takes every `div` prop, plus `sx`, applied last.

| Prop          | Values                         | Default        |
| ------------- | ------------------------------ | -------------- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` |

### ButtonGroupSeparator

A [Separator](/docs/components/separator) that fits between the group's items.

| Prop          | Values                         | Default      |
| ------------- | ------------------------------ | ------------ |
| `orientation` | `"horizontal"` \| `"vertical"` | `"vertical"` |

### ButtonGroupText

Takes every `div` prop, plus `sx`, applied last.

| Prop     | Values               | Default |
| -------- | -------------------- | ------- |
| `render` | `React.ReactElement` |         |

## Pending

- **DropdownMenu:** the main preview's "More" menu and the Dropdown Menu example.
- **Select:** the Select example (currency picker beside an amount).
- **Popover:** the Popover example.
