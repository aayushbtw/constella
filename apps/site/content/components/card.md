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

## Card Action

Put a control in `CardAction` to pin it to the header's end, beside the title and description, like a [Dropdown Menu](/docs/components/dropdown-menu).

<!-- ::demo name="card-action" -->

```tsx
<CardHeader>
  <CardTitle>Weekly digest</CardTitle>
  <CardDescription>Sent every Monday to 12 people.</CardDescription>
  <CardAction>
    <DropdownMenu>…</DropdownMenu>
  </CardAction>
</CardHeader>
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

Small cards fit a grid of numbers, each with its change as a status badge.

<!-- ::demo name="card-stats" -->

```tsx
<Card size="sm">
  <CardHeader>
    <CardDescription>Messages</CardDescription>
    <CardAction>
      <Badge status="success" variant="secondary">
        +12.5%
      </Badge>
    </CardAction>
  </CardHeader>
  <CardContent>48,210</CardContent>
</Card>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Card` | `size`: `"sm"`, `"default"` or `"flush"`; `variant`: `"default"` or `"well"` |

Every part takes `sx`, applied last, and renders a `div`.
