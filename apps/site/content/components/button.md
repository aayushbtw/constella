---
title: Button
description: Displays a button or a link that looks like a button.
---

<!-- ::demo name="button" -->

## Installation

<!-- ::install name="button" -->

## Usage

```tsx
import { Button } from "@/components/ui/button";
```

```tsx
<Button variant="outline">Button</Button>
```

## Variants

Use the `variant` prop to set how much the button stands out. Use one `primary` per view.

<!-- ::demo name="button-variants" -->

| Variant     | Use for                                    |
| ----------- | ------------------------------------------ |
| `primary`   | The main action of the view                |
| `secondary` | Everything else. The default.              |
| `outline`   | Actions on busy surfaces                   |
| `ghost`     | Repeated actions in toolbars, lists, menus |
| `danger`    | Actions that delete or destroy             |
| `link`      | Actions inside a sentence                  |

## Size

Use the `size` prop to change the size of the button.

<!-- ::demo name="button-sizes" -->

```tsx
<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Icon

Use an `icon-*` size for a button with only an icon. Add an `aria-label`.

<!-- ::demo name="button-icon-only" -->

```tsx
<Button size="icon-md" aria-label="Search">
  <HugeiconsIcon icon={Search01Icon} size={sizes.icon} aria-hidden />
</Button>
```

## With Icon

Add `data-icon="inline-start"` or `data-icon="inline-end"` to the icon for the correct spacing. Use `sizes.iconXs` at `xs`, `sizes.iconSm` at `sm` and `sizes.icon` otherwise.

<!-- ::demo name="button-icon" -->

```tsx
<Button>
  <HugeiconsIcon
    icon={Add01Icon}
    size={sizes.icon}
    data-icon="inline-start"
    aria-hidden
  />
  New project
</Button>
```

## Pill

Use `corners="pill"` to round the ends.

<!-- ::demo name="button-pill" -->

```tsx
<Button corners="pill">Get started</Button>
```

## Spinner

Render a [Spinner](/docs/components/spinner) inside the button to show it's loading. Add `data-icon="inline-start"` to the spinner, and `disabled` so it can't be pressed twice.

<!-- ::demo name="button-loading" -->

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving
</Button>
```

## As Link

Use `buttonStyles` to make a link look like a button.

**Don't use `<Button render={<a />} nativeButton={false} />` for links.** Base UI's `Button` always sets `role="button"`, so screen readers announce it as a button, not a link.

<!-- ::demo name="button-link" -->

```tsx
import * as stylex from "@stylexjs/stylex";
import { buttonStyles } from "@/components/ui/button";

<a href="/settings" {...stylex.props(buttonStyles({ variant: "outline" }))}>
  Settings
</a>;
```

## API Reference

### Button

Takes every prop of [Base UI's Button](https://base-ui.com/react/components/button), plus:

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"secondary"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "icon-xs" \| "icon-sm" \| "icon-md" \| "icon-lg"` | `"md"` |
| `corners` | `"rounded" \| "pill"` | `"rounded"` |
| `sx` | `StyleXStyles`, applied last |  |

### buttonStyles

Returns the button's styles for `stylex.props`. Takes `variant`, `size` and `corners`, with the same defaults.
