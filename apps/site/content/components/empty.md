---
title: Empty
description: Shows that there's nothing here yet, and what to do about it.
draft: true
---

<!-- ::demo name="empty" -->

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <HugeiconsIcon icon={Folder01Icon} />
    </EmptyMedia>
    <EmptyTitle>No Projects Yet</EmptyTitle>
    <EmptyDescription>
      You haven&apos;t created any projects yet. Get started by creating your
      first project.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="primary">Create Project</Button>
  </EmptyContent>
</Empty>
```

## Installation

<!-- ::install name="empty" -->

## Usage

```tsx
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
```

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <HugeiconsIcon icon={Folder01Icon} />
    </EmptyMedia>
    <EmptyTitle>No data</EmptyTitle>
    <EmptyDescription>No data found</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Add data</Button>
  </EmptyContent>
</Empty>
```

## Composition

```
Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent
```

## Empty Media

Use `variant="icon"` on `EmptyMedia` to set an icon on a `fill` tile. Leave the default to show anything else, like an avatar.

| Variant   | Shows                    |
| --------- | ------------------------ |
| `default` | Its children as they are |
| `icon`    | A 32px `fill` tile       |

## Card

Put an empty state in a [Card](/docs/components/card) to hold a section's place.

<!-- ::demo name="empty-card" -->

```tsx
<Card>
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No Notifications</EmptyTitle>
    </EmptyHeader>
  </Empty>
</Card>
```

## Avatar

Put an [Avatar](/docs/components/avatar) in `EmptyMedia`.

<!-- ::demo name="empty-avatar" -->

```tsx
<EmptyMedia>
  <Avatar size="lg">
    <AvatarImage alt="" src="https://github.com/shadcn.png" />
    <AvatarFallback>SC</AvatarFallback>
  </Avatar>
</EmptyMedia>
```

## API Reference

| Part         | Adds                               |
| ------------ | ---------------------------------- |
| `EmptyMedia` | `variant`: `"default"` or `"icon"` |

Every part takes `sx`, applied last, and renders a `div`.
