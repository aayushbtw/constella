---
title: Toggle
description: A two-state button that stays pressed until pressed again.
draft: true
---

<!-- ::demo name="toggle" -->

```tsx
<Toggle aria-label="Toggle bold" size="icon">
  <HugeiconsIcon icon={TextBoldIcon} />
</Toggle>
```

## Installation

<!-- ::install name="toggle" -->

## Usage

```tsx
import { Toggle } from "@/components/ui/toggle";
```

```tsx
<Toggle>Toggle</Toggle>
```

## Variant

Use the `variant` prop for an outline toggle. Pressed, both fill.

<!-- ::demo name="toggle-outline" -->

| Variant   | At rest          |
| --------- | ---------------- |
| `default` | No fill          |
| `outline` | An `edge` border |

```tsx
<Toggle variant="outline">Underline</Toggle>
```

## Size

Use the `size` prop to match the controls beside it, with Button's sizes. Use an `icon` size for a square, icon-only toggle.

<!-- ::demo name="toggle-size" -->

| Size      | Icon size | Height |
| --------- | --------- | ------ |
| `sm`      | `icon-sm` | 28px   |
| `default` | `icon`    | 32px   |
| `lg`      | `icon-lg` | 36px   |

```tsx
<Toggle size="icon-sm" aria-label="Toggle italic">
  …
</Toggle>
```

## Disabled

<!-- ::demo name="toggle-disabled" -->

```tsx
<Toggle disabled>…</Toggle>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Toggle` | `variant`: `"default"` or `"outline"`; `size`: `"sm"`, `"default"`, `"lg"`, `"icon-sm"`, `"icon"` or `"icon-lg"` |

`Toggle` takes `sx`, applied last. `toggleStyles` gives its styles to another element. For the rest, see [Base UI Toggle](https://base-ui.com/react/components/toggle).
