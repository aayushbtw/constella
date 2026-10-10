---
title: Alert
description: Calls out something the reader should know, inline with the page.
---

<!-- ::demo name="alert" -->

```tsx
<Alert>
  <HugeiconsIcon icon={CheckmarkCircle02Icon} />
  <AlertTitle>Payment successful</AlertTitle>
  <AlertDescription>
    Your payment of $29.99 has been processed. A receipt has been sent to your
    email address.
  </AlertDescription>
</Alert>
```

## Installation

<!-- ::install name="alert" -->

## Usage

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
```

```tsx
<Alert>
  <HugeiconsIcon icon={InformationCircleIcon} />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the CLI.
  </AlertDescription>
</Alert>
```

## Composition

```
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

## Status

Use the `status` prop to color the icon. The title and description stay neutral.

<!-- ::demo name="alert-status" -->

| Status    | Icon color |
| --------- | ---------- |
| `success` | Green      |
| `info`    | Blue       |
| `warning` | Amber      |
| `danger`  | Red        |

```tsx
<Alert status="danger">
  <HugeiconsIcon icon={AlertCircleIcon} />
  <AlertTitle>Payment failed</AlertTitle>
</Alert>
```

## Alert Title

An alert can be a title alone, a description alone, or skip the icon; the text takes the room that's left.

<!-- ::demo name="alert-title" -->

```tsx
<Alert status="success">
  <HugeiconsIcon icon={CheckmarkCircle02Icon} />
  <AlertTitle>Your changes are live.</AlertTitle>
</Alert>
```

## Alert Action

Use `AlertAction` for a button at the alert's end.

<!-- ::demo name="alert-action" -->

```tsx
<Alert>
  <AlertTitle>Dark mode is now available</AlertTitle>
  <AlertAction>
    <Button size="sm" variant="outline">
      Enable
    </Button>
  </AlertAction>
</Alert>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Alert` | `status`: `"success"`, `"info"`, `"warning"` or `"danger"`; `role="alert"` |

Every part takes `sx`, applied last, and renders a `div`.
