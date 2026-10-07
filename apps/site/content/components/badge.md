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
import { Badge } from "@/components/ui/badge";
```

```tsx
<Badge variant="outline">Badge</Badge>
```

## Variants

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

## With Icon

Add `data-icon="inline-start"` or `data-icon="inline-end"` to an icon, so the badge tightens that side around it. Icons in a badge are `sizes.iconXs`.

<!-- ::demo name="badge-icon" -->

```tsx
<Badge>
  <HugeiconsIcon
    data-icon="inline-start"
    icon={CheckmarkBadge01Icon}
    size={12}
  />
  Verified
</Badge>
```

## With Spinner

Add `data-icon` to a [Spinner](/docs/components/spinner) the same way. It shrinks to fit the badge.

<!-- ::demo name="badge-spinner" -->

```tsx
<Badge variant="danger">
  <Spinner data-icon="inline-start" />
  Deleting
</Badge>
```

## Link

Use the `render` prop to render a link as a badge. Only a link answers hover.

<!-- ::demo name="badge-link" -->

```tsx
<Badge render={<a href="#link" />} variant="outline">
  Open Link
  <HugeiconsIcon data-icon="inline-end" icon={ArrowUpRight01Icon} size={12} />
</Badge>
```

## Custom Colors

Pass `sx` with a status fill and color for a status badge.

<!-- ::demo name="badge-colors" -->

```tsx
const styles = stylex.create({
  success: { backgroundColor: colors.successFillSubtle, color: colors.success },
});

<Badge sx={styles.success}>Success</Badge>;
```

## API Reference

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "link"` | `"secondary"` |
| `render` | `ReactElement \| function` | `<span>` |
| `sx` | `StyleXStyles`, applied last | - |

`badgeStyles({ variant })` returns the same styles for another element.
