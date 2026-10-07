---
title: Badge
description: Displays a badge or a component that looks like a badge.
draft: true
---

<!-- ::demo name="badge" -->

```tsx
<Badge>Badge</Badge>
```

## Installation

<!-- ::install name="badge" -->

## Usage

```tsx
import { Badge, BadgeDot } from "@/components/ui/badge";
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
<Badge variant="danger">Danger</Badge>
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

## Status

Use the `status` prop to color a badge. What it colors depends on the variant. Add `BadgeDot` for a status dot.

<!-- ::demo name="badge-status" -->

| Variant             | Colors                 |
| ------------------- | ---------------------- |
| `secondary`         | Background and text    |
| `ghost`, `link`     | Text                   |
| `outline`           | Dot, spinner and icons |
| `primary`, `danger` | Nothing                |

```tsx
<Badge status="success">Paid</Badge>
<Badge status="success" variant="outline">
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

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` |
| `status` | `"success" \| "info" \| "warning" \| "danger"` | - |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"secondary"` |
| `render` | `ReactElement \| function` | `<span>` |
| `sx` | `StyleXStyles`, applied last | - |

`BadgeDot` takes `sx`. `badgeStyles({ size, status, variant })` returns the badge's styles for another element.
