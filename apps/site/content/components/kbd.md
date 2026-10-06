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

## API Reference

`Kbd` and `KbdGroup` take every prop of `<kbd>`, plus `sx`, applied last.
