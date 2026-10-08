---
title: Card
description: Groups related content and actions on one surface.
draft: true
---

<!-- ::demo name="card" -->

```tsx
<Card>
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>
      Enter your email below to login to your account
    </CardDescription>
    <CardAction>
      <Button variant="link">Sign Up</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" placeholder="m@example.com" type="email" />
      </Field>
    </FieldGroup>
  </CardContent>
  <CardFooter>
    <Button>Login</Button>
  </CardFooter>
</Card>
```

## Installation

<!-- ::install name="card" -->

## Usage

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>Card Content</CardContent>
  <CardFooter>Card Footer</CardFooter>
</Card>
```

## Composition

```
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

## Size

Use the `size` prop on `Card` to set its padding. `flush` drops it, for rows that run edge to edge and pad themselves.

<!-- ::demo name="card-size" -->

| Size      | Padding |
| --------- | ------- |
| `default` | 16px    |
| `sm`      | 12px    |
| `flush`   | 0       |

```tsx
<Card size="sm">
  <CardHeader>
    <CardTitle>Scheduled reports</CardTitle>
  </CardHeader>
</Card>
```

## Variant

Use `variant="well"` for a tinted tray around a card and the header that labels it. The card inside takes the next corner down, so the two stay concentric.

<!-- ::demo name="card-well" -->

```tsx
<Card variant="well">
  <CardHeader>
    <CardTitle>Models</CardTitle>
    <CardDescription>Available to everyone in the workspace.</CardDescription>
  </CardHeader>
  <Card size="flush">{rows}</Card>
</Card>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Card` | `size`: `"sm"`, `"default"` or `"flush"`; `variant`: `"default"` or `"well"` |

Every part takes `sx`, applied last, and renders a `div`.
