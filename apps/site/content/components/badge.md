---
title: Badge
description: Displays a badge or a component that looks like a badge.
---

<!-- ::demo name="badge" -->

```tsx
<Badge>Badge</Badge>
```

## Installation

<!-- ::install name="badge" -->

## Usage

```tsx
import { Badge, BadgeDot } from "@/components/primitives/badge";
```

```tsx
<Badge variant="outline">Badge</Badge>
```

## Composition

```
Badge
└── BadgeDot
```

## Variant

Use the `variant` prop to change the badge's emphasis. The variants match [Button](/docs/components/button)'s.

<!-- ::demo name="badge-variants" -->

```tsx
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="link">Link</Badge>
```

## Size

Use the `size` prop. Pass icons at the size below.

<!-- ::demo name="badge-size" -->

| Size      | Height | Text | Icon |
| --------- | ------ | ---- | ---- |
| `sm`      | 18px   | 12px | 12px |
| `default` | 20px   | 12px | 12px |
| `lg`      | 24px   | 13px | 14px |

```tsx
<Badge size="lg">
  <HugeiconsIcon
    data-icon="inline-start"
    icon={Tick02Icon}
    size={sizes.iconSm}
  />
  Large
</Badge>
```

## Color

Use the `color` prop to color a badge. Every variant takes it; what it colors depends on the variant. Add `BadgeDot` for a colored dot.

<!-- ::demo name="badge-status" -->

| Variant                | Colors                         |
| ---------------------- | ------------------------------ |
| `secondary`, `primary` | Background and text, as a tint |
| `ghost`, `link`        | Text                           |
| `outline`              | Dot, spinner and icons         |

```tsx
<Badge color="success">Paid</Badge>
<Badge color="success" variant="outline">
  <BadgeDot />
  Paid
</Badge>
```

## With Icon

Add `data-icon="inline-start"` or `"inline-end"` to an icon or a [Spinner](/docs/components/spinner), so the badge tightens that side.

<!-- ::demo name="badge-icon" -->

```tsx
<Badge>
  <HugeiconsIcon data-icon="inline-start" icon={CheckmarkBadge01Icon} size={sizes.iconXs} />
  Verified
</Badge>
<Badge variant="outline">
  Bookmark
  <HugeiconsIcon data-icon="inline-end" icon={Bookmark01Icon} size={sizes.iconXs} />
</Badge>
<Badge>
  Generating
  <Spinner data-icon="inline-end" />
</Badge>
```

## As Link

Use the `render` prop to render a link as a badge. Only a link answers hover.

<!-- ::demo name="badge-link" -->

```tsx
<Badge render={<a href="#link" />} variant="outline">
  Open Link
  <HugeiconsIcon
    data-icon="inline-end"
    icon={ArrowUpRight01Icon}
    size={sizes.iconXs}
  />
</Badge>
```

A trigger goes in `render` too: `<Badge render={<HoverCardTrigger href="…" />}>`, as [Citation](/docs/components/citation) does. Not the trigger as a badge: the badge would render its `span` in place of the trigger's link.

## Avatar

Put an [Avatar](/docs/components/avatar) first in the badge, with `aria-hidden`.

<!-- ::demo name="badge-avatar" -->

```tsx
<Badge>
  <Avatar aria-hidden>
    <AvatarImage alt="" src="/avatars/shadcn.png" />
    <AvatarFallback>C</AvatarFallback>
  </Avatar>
  shadcn
</Badge>
```

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |
| `color` | `"success" \| "info" \| "warning" \| "danger"` | - |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "link"` | `"secondary"` |
| `render` | `ReactElement \| function` | `<span>` |
| `sx` | `Sx`, applied last | - |

`BadgeDot` takes `sx`. `badgeStyles({ color, size, variant })` returns the badge's styles for another element.
