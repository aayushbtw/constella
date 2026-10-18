---
title: Model Picker
description: A searchable list of models in a popover, with the highlighted model's details beside it.
section: AI
---

<!-- ::demo name="model-picker" -->

```tsx
<ModelPicker>
  <ModelPickerTrigger>
    <ModelPickerLogo src={picked.logo} />
    {picked.label}
  </ModelPickerTrigger>
  <ModelPickerContent>
    <ModelPickerCommand
      items={models}
      onItemHighlighted={(item) =>
        setHighlighted(models.find((model) => model === item))
      }
    >
      <CommandInput placeholder="Search models..." />
      <CommandEmpty>No models found.</CommandEmpty>
      <CommandList>
        {(model) => (
          <ModelPickerItem
            key={model.value}
            onClick={() => setValue(model.value)}
            selected={model.value === value}
            value={model}
          >
            <ModelPickerLogo src={model.logo} />
            {model.label}
          </ModelPickerItem>
        )}
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

The list is a [Command](/docs/components/command). Pass the models as `items`, and group them as Command shows. Picking a model calls the item's `onClick` and closes the picker.

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

`ModelPickerDetails` shows the highlighted model once a row is reached by arrow key or rested on for 300ms, then follows the highlight. Keep the highlighted model in state from the command's `onItemHighlighted`. The card wraps under the list when the window is too narrow for both.

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
| `ModelPickerTrigger` | A ghost `sm` [Button](/docs/components/button) ending in a chevron; takes the button's props |
| `ModelPickerContent` | The popover's popup without a surface, so the list and the details are two cards; opens `align="start"`; `detailsSide` is `inline-end` or `inline-start` |
| `ModelPickerCommand` | A `Command` 240px wide, as its own surface, with `keepHighlight` on |
| `ModelPickerItem` | A `CommandItem` that closes the picker at once on pick; `selected` adds a tick and `aria-checked` |
| `ModelPickerLogo` | A one-color logo from `src`, painted in the text color |
| `ModelPickerDetails` | The highlighted model's card, hidden until reached |
| `ModelPickerTitle`, `ModelPickerDescription` | The card's name row and muted text |

Every part takes `sx`, applied last.
