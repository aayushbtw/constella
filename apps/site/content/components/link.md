---
title: Link
description: A link inside running text.
section: Typography
---

<!-- ::demo name="link" -->

```tsx
<Text color="secondary">
  Your trial ends in 3 days. <Link href="#billing">Choose a plan</Link> to keep
  your projects.
</Text>
```

## Installation

<!-- ::install name="link" -->

## Usage

```tsx
import { Link } from "@/components/typography/link";
```

```tsx
<Link href="/billing">Choose a plan</Link>
```

## Router Link

Pass your router's link as `render`. It keeps its navigation; Link adds the look.

```tsx
import { Link as RouterLink } from "@tanstack/react-router";

<Link render={<RouterLink to="/billing" />}>Choose a plan</Link>;
```

For a link that looks like a button, use `buttonStyles` from [Button](/docs/components/button).

## API Reference

| Prop     | Type                         | Default |
| -------- | ---------------------------- | ------- |
| `render` | `ReactElement \| function`   | `<a>`   |
| `sx`     | `StyleXStyles`, applied last | -       |
