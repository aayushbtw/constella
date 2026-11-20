---
title: Model Picker
description: A searchable list of models in a popover, with the highlighted model's details beside it.
section: AI
---

<!-- ::demo name="model-picker" -->

```tsx
<ModelPicker
  onOpenChange={(open) => {
    if (open) setHighlightedValue(models[0].value);
  }}
>
  <ModelPickerTrigger>
    <ModelPickerLogo src={picked.logo} />
    {picked.label}
  </ModelPickerTrigger>
  <ModelPickerContent>
    <ModelPickerCommand
      onValueChange={setHighlightedValue}
      value={highlightedValue}
    >
      <CommandInput aria-label="Search models" placeholder="Search models..." />
      <CommandEmpty>No models found.</CommandEmpty>
      <CommandList>
        {models.map((model) => (
          <ModelPickerItem
            key={model.value}
            onSelect={() => setValue(model.value)}
            selected={model.value === value}
            value={model.value}
          >
            <ModelPickerLogo src={model.logo} />
            {model.label}
          </ModelPickerItem>
        ))}
      </CommandList>
    </ModelPickerCommand>
    {highlighted && (
      <ModelPickerDetails>
        <ModelPickerTitle>{highlighted.label}</ModelPickerTitle>
        <ModelPickerDescription>
          {highlighted.description}
        </ModelPickerDescription>
      </ModelPickerDetails>
    )}
  </ModelPickerContent>
</ModelPicker>
```

## Installation

<!-- ::install name="model-picker" -->

## Usage

```tsx
import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerDetails,
  ModelPickerItem,
  ModelPickerTrigger,
} from "@/components/ai/model-picker";
import { CommandInput, CommandList } from "@/components/primitives/command";
```

The list is a [Command](/docs/components/command). Render a `ModelPickerItem` for each model, and group them as Command shows. Picking a model, by click or Enter, calls the item's `onSelect` and closes the picker.

## Composition

```
ModelPicker
├── ModelPickerTrigger
│   └── ModelPickerLogo
└── ModelPickerContent
    ├── ModelPickerCommand
    │   ├── CommandInput
    │   ├── CommandEmpty
    │   └── CommandList
    │       └── ModelPickerItem
    │           └── ModelPickerLogo
    └── ModelPickerDetails
        ├── ModelPickerTitle
        └── ModelPickerDescription
```

## Details

`ModelPickerDetails` shows the highlighted model once a row is reached by arrow key or rested on for 300ms, then follows the highlight. Control the highlight with the command's `value` and `onValueChange`, which take the highlighted item's `value`, and start it at the first model on each open. ui-sdk doesn't report its first highlight through `onValueChange`, so without that the card has no model until the highlight moves. The card wraps under the list when the window is too narrow for both.

### Side

The card opens at the list's `inline-end` by default. A picker at the end of a row, like the composer above, takes `align="end"` and `detailsSide="inline-start"`, so the card opens into the page. Opening upward, the card lines up with the list's bottom, nearest the trigger.

<!-- ::demo name="model-picker-side" -->

```tsx
<ModelPickerContent align="end" detailsSide="inline-start">
  …
</ModelPickerContent>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ModelPicker` | A [Popover](/docs/components/popover) root |
| `ModelPickerTrigger` | A ghost `sm` [Button](/docs/components/button) ending in a chevron; takes the button's props; `label`, `"Model"` by default, is read before the model's name by screen readers and agents |
| `ModelPickerContent` | The popover's popup without a surface, so the list and the details are two cards; opens `align="start"`; `detailsSide` is `inline-end` or `inline-start` |
| `ModelPickerCommand` | A `Command` 240px wide, as its own surface |
| `ModelPickerItem` | A `CommandItem` that closes the picker at once on pick; `selected` adds a tick and `aria-checked` |
| `ModelPickerLogo` | A one-color logo from `src`, painted in the text color |
| `ModelPickerDetails` | The highlighted model's card, hidden until reached |
| `ModelPickerTitle`, `ModelPickerDescription` | The card's name row and muted text; the title takes `render` |

Every part takes `sx`, applied last. For `render`, see [ui-sdk's `render`](https://ui-sdk.dev/docs/react/parts-and-composition#choose-the-element).
