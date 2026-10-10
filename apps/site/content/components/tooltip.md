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
} from "@/components/ui/tooltip";
```

```tsx
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>
```

## Composition

```
TooltipProvider
└── Tooltip
    ├── TooltipTrigger
    └── TooltipContent
```

## Side

Use the `side` prop on `TooltipContent` to place the tooltip. Wrap neighbors in a `TooltipProvider`, so once one is open the next opens at once.

<!-- ::demo name="tooltip-side" -->

```tsx
<TooltipProvider>
  {["left", "top", "bottom", "right"].map((side) => (
    <Tooltip key={side}>
      <TooltipTrigger render={<Button variant="outline" />}>
        {side}
      </TooltipTrigger>
      <TooltipContent side={side}>Add to library</TooltipContent>
    </Tooltip>
  ))}
</TooltipProvider>
```

## Disabled Button

A disabled button takes no pointer events, so put the trigger on a wrapper around it.

<!-- ::demo name="tooltip-disabled" -->

```tsx
<Tooltip>
  <TooltipTrigger render={<span />}>
    <Button disabled variant="outline">
      Disabled
    </Button>
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

`TooltipTrigger` opens after `300ms` (Base UI's is `600ms`); pass `delay` to change it. `TooltipContent` renders the portal, positioner and popup; `side`, `align`, `sideOffset` and `alignOffset` go to the positioner. The parts stay exported for when it doesn't fit. Every styled part takes `sx`, applied last. For the rest, see [Base UI Tooltip](https://base-ui.com/react/components/tooltip).
