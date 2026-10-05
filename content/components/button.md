---
title: Button
description: Five variants for every level of emphasis, in three sizes.
status: draft
---

<!-- ::demo name="button" -->

## Installation

<!-- ::install name="button" -->

## Usage

```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary">Save</Button>;
```

## Variants

Pick by emphasis, not by look. One `primary` per view, for the action the view exists for.

| Variant     | For                                                  |
| ----------- | ---------------------------------------------------- |
| `primary`   | The main action of the view                          |
| `secondary` | The default: actions next to the primary one         |
| `outline`   | Actions on busy surfaces, where a fill would blur in |
| `ghost`     | Repeated actions in toolbars, lists and menus        |
| `danger`    | Actions that destroy something                       |

## Examples

### Sizes

`sm` sits inside dense surfaces like toasts and tables, `lg` stands alone. `md` is the default.

<!-- ::demo name="button-sizes" -->

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### With an icon

Put the icon before the label, at the icon size.

<!-- ::demo name="button-icon" -->

```tsx
<Button variant="primary">
  <HugeiconsIcon icon={Add01Icon} size={sizes.icon} aria-hidden />
  New project
</Button>
```

### Disabled

<!-- ::demo name="button-disabled" -->

```tsx
<Button disabled>Save</Button>
```

## API

Takes every prop of [Base UI's Button](https://base-ui.com/react/components/button), plus:

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"` | `"secondary"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `sx` | `StyleXStyles`, applied last |  |
