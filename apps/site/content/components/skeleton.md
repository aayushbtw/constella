---
title: Skeleton
description: Holds the place of content that's still loading.
draft: true
---

<!-- ::demo name="skeleton" -->

```tsx
<div>
  <Skeleton sx={styles.avatar} />
  <Skeleton sx={styles.line} />
</div>
```

## Installation

<!-- ::install name="skeleton" -->

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

Give it the size and shape of what it stands in for with `sx`.

```tsx
<Skeleton sx={styles.line} />
```

## Card

Fill a [Card](/docs/components/card) with skeletons in the shape of its content.

<!-- ::demo name="skeleton-card" -->

```tsx
<Card>
  <CardHeader>
    <Skeleton sx={styles.title} />
  </CardHeader>
  <CardContent>
    <Skeleton sx={styles.image} />
  </CardContent>
</Card>
```

## Item

Keep the real layout and swap only what's loading, so nothing moves when the content arrives.

<!-- ::demo name="skeleton-item" -->

```tsx
<Item>
  <ItemMedia>
    {loading ? <Skeleton sx={styles.avatar} /> : <Avatar>…</Avatar>}
  </ItemMedia>
  <ItemContent>
    {loading ? <Skeleton sx={styles.title} /> : <ItemTitle>{name}</ItemTitle>}
  </ItemContent>
</Item>
```

## API Reference

`Skeleton` renders a `div` hidden from screen readers, and takes `sx`, applied last.
