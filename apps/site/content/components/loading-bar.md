---
title: Loading Bar
description: Shows a line along the window's top while a slow page loads.
---

<!-- ::demo name="loading-bar" -->

```tsx
<LoadingBar aria-label="Loading page" loading={loading} />
```

## Installation

<!-- ::install name="loading-bar" -->

## Usage

```tsx
import { LoadingBar } from "@/components/primitives/loading-bar";
```

```tsx
<LoadingBar aria-label="Loading page" loading={loading} />
```

Render one at the root of the app and set `loading` while a page loads. It shows only once a load outlasts 150ms, so a fast one never flashes, then creeps toward its end until `loading` turns false.

## Router

Pass the router's loading state to `loading`. With [TanStack Router](https://tanstack.com/router), read it with `useRouterState` in the root route.

```tsx
import { useRouterState } from "@tanstack/react-router";

function RouteLoadingBar() {
  const loading = useRouterState({ select: (state) => state.isLoading });
  return <LoadingBar aria-label="Loading page" loading={loading} />;
}
```

## API Reference

### LoadingBar

Takes every prop of [UI SDK Progress](https://ui-sdk.dev/docs/components/progress)'s root except `value`, `min`, `max`, `format` and `locale`, plus:

| Prop         | Type               | Default |
| ------------ | ------------------ | ------- |
| `loading`    | `boolean`          |         |
| `aria-label` | `string`           |         |
| `sx`         | `Sx`, applied last |         |

It renders a `progressbar` with no value. Name it with `aria-label`.
