---
title: Kbd
description: Shows a key or a shortcut.
---

<!-- ::demo name="kbd" -->

```tsx
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>⇧</Kbd>
  <Kbd>⌥</Kbd>
  <Kbd>⌃</Kbd>
</KbdGroup>
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>B</Kbd>
</KbdGroup>
```

## Installation

<!-- ::install name="kbd" -->

## Usage

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd";
```

```tsx
<Kbd>Ctrl</Kbd>
```

## Composition

```
KbdGroup
└── Kbd
```

## Group

Use `KbdGroup` to keep keys together.

<!-- ::demo name="kbd-group" -->

```tsx
<p>
  Use{" "}
  <KbdGroup>
    <Kbd>Ctrl + B</Kbd>
    <Kbd>Ctrl + K</Kbd>
  </KbdGroup>{" "}
  to open the command palette
</p>
```

## Button

Put a `Kbd` inside a [Button](/docs/components/button) with `data-icon="inline-end"`, so the button tightens its end around it.

<!-- ::demo name="kbd-button" -->

```tsx
<Button size="sm" variant="outline">
  Accept <Kbd data-icon="inline-end">⏎</Kbd>
</Button>
```

## Tooltip

Inside a [Tooltip](/docs/components/tooltip), the key inverts with the popup.

<!-- ::demo name="kbd-tooltip" -->

```tsx
<Tooltip>
  <TooltipTrigger render={<Button size="sm" variant="outline" />}>
    Print
  </TooltipTrigger>
  <TooltipContent>
    Print Document{" "}
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  </TooltipContent>
</Tooltip>
```

## API Reference

`Kbd` and `KbdGroup` take every prop of `<kbd>`, plus `sx`, applied last.
