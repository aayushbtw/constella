---
title: Spinner
description: Shows that something is loading.
---

<!-- ::demo name="spinner" -->

## Installation

<!-- ::install name="spinner" -->

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner";
```

```tsx
<Spinner />
```

## Button

Render it inside a [Button](/docs/components/button) with `data-icon="inline-start"`.

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  Saving
</Button>
```

## API Reference

### Spinner

Takes every prop of `<output>`, plus:

| Prop         | Type                         | Default     |
| ------------ | ---------------------------- | ----------- |
| `aria-label` | `string`                     | `"Loading"` |
| `sx`         | `StyleXStyles`, applied last |             |
