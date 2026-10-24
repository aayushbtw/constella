---
title: Breadcrumb
description: Shows where a page sits, as a trail of links to the pages above it.
---

<!-- ::demo name="breadcrumb" -->

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Members</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Installation

<!-- ::install name="breadcrumb" -->

## Usage

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/primitives/breadcrumb";
```

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Composition

```
Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   ├── BreadcrumbLink
    │   ├── BreadcrumbEllipsis
    │   └── BreadcrumbPage
    └── BreadcrumbSeparator
```

## Breadcrumb Ellipsis

Use `BreadcrumbEllipsis` in place of the pages a long trail leaves out.

<!-- ::demo name="breadcrumb-ellipsis" -->

```tsx
<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>
```

## Link

Use the `render` prop to pass a router's link.

```tsx
<BreadcrumbLink render={<Link to="/settings" />}>Settings</BreadcrumbLink>
```

## API Reference

| Part                  | Adds                             |
| --------------------- | -------------------------------- |
| `BreadcrumbLink`      | `render`, for a router's link    |
| `BreadcrumbPage`      | `aria-current="page"`            |
| `BreadcrumbSeparator` | `children`, to replace the arrow |

Every part takes `sx`, applied last. For `render`, see [Base UI useRender](https://base-ui.com/react/utils/use-render).
