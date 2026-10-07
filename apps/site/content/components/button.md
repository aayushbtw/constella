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

## Variant

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
<Button>Default</Button>
<Button size="lg">Large</Button>
```

## Icon Only

Use an `icon-*` size for a button with only an icon. Add an `aria-label`.

<!-- ::demo name="button-icon-only" -->

```tsx
<Button size="icon" aria-label="Search">
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

## Disabled

Use `disabled` when the action isn't available. It fades the button and shows a not-allowed cursor.

<!-- ::demo name="button-disabled" -->

```tsx
<Button disabled>Disabled</Button>
```

## Busy

Add `aria-busy` while something runs. It shows a busy cursor, so working reads differently from unavailable. What goes inside is up to you.

- With `disabled`, it's loading: it fades less than disabled and can't be pressed twice.
- Alone, it stays pressable at full strength, for a button that acts on the running work: press Generate, and the same button becomes Stop generating.

<!-- ::demo name="button-busy" -->

```tsx
<Button aria-busy disabled>
  <Spinner data-icon="inline-start" />
  Saving
</Button>
<Button aria-busy={generating} onClick={() => setGenerating(!generating)}>
  {generating && <Spinner data-icon="inline-start" />}
  {generating ? "Stop generating" : "Generate"}
</Button>
```

## API Reference

### Button

Takes every prop of [Base UI's Button](https://base-ui.com/react/components/button), plus:

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"secondary"` |
| `size` | `"xs" \| "sm" \| "default" \| "lg" \| "icon-xs" \| "icon-sm" \| "icon" \| "icon-lg"` | `"default"` |
| `corners` | `"rounded" \| "pill"` | `"rounded"` |
| `sx` | `StyleXStyles`, applied last |  |

### buttonStyles

Returns the button's styles for `stylex.props`. Takes `variant`, `size` and `corners`, with the same defaults.
