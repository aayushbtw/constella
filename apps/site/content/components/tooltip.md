---
title: Tooltip
description: Names what's under the pointer.
---

<!-- ::demo name="tooltip" -->

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Hover</TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>
```

## Installation

<!-- ::install name="tooltip" -->

## Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
```

```tsx
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>
```

## Composition

```
Tooltip
├── TooltipTrigger
└── TooltipContent
```

## Side

Use the `side` prop on `TooltipContent` to place the tooltip. Neighbors group on their own: once one is open, the next opens at once.

<!-- ::demo name="tooltip-side" -->

```tsx
<>
  {["left", "top", "bottom", "right"].map((side) => (
    <Tooltip key={side}>
      <TooltipTrigger render={<Button variant="outline" />}>
        {side}
      </TooltipTrigger>
      <TooltipContent side={side}>Add to library</TooltipContent>
    </Tooltip>
  ))}
</>
```

## Disabled Button

A natively disabled button can't take focus, so its tooltip never shows. Add `focusableWhenDisabled`: the button stays in the Tab order, reads as dimmed to screen readers and ignores presses, and its tooltip can say why.

<!-- ::demo name="tooltip-disabled" -->

```tsx
<Tooltip>
  <TooltipTrigger
    render={<Button disabled focusableWhenDisabled variant="outline" />}
  >
    Disabled
  </TooltipTrigger>
  <TooltipContent>This feature is currently unavailable</TooltipContent>
</Tooltip>
```

## Kbd

Put a [Kbd](/docs/components/kbd) last in the content; the popup tightens its end around it.

<!-- ::demo name="tooltip-kbd" -->

```tsx
<Tooltip>
  <TooltipTrigger
    aria-label="Save"
    render={<Button size="icon-sm" variant="outline" />}
  >
    <HugeiconsIcon icon={FloppyDiskIcon} />
  </TooltipTrigger>
  <TooltipContent>
    Save Changes <Kbd>S</Kbd>
  </TooltipContent>
</Tooltip>
```

## API Reference

`Tooltip` opens after `300ms` (ui-sdk's default is `600ms`); pass `delay` to change it. `TooltipContent` renders in place beside the trigger and shows in the top layer; it takes the placement props `side`, `align`, `sideOffset` and `alignOffset`. `TooltipTrigger` and `TooltipContent` take `sx`, applied last. For the rest, see [ui-sdk Tooltip](https://ui-sdk.dev/docs/react/components/tooltip).
