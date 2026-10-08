---
title: Alert Dialog
description: A dialog that asks to confirm an action before it happens.
draft: true
---

<!-- ::demo name="alert-dialog" -->

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Installation

<!-- ::install name="alert-dialog" -->

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

`AlertDialogAction` doesn't close the dialog, so you can close it once the action is done. `AlertDialogCancel` does.

## Composition

```
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

## Size

Use `size="sm"` on `AlertDialogContent` for a short confirm: centered text over two equal buttons.

<!-- ::demo name="alert-dialog-size" -->

| Size      | Width |
| --------- | ----- |
| `default` | 384px |
| `sm`      | 320px |

```tsx
<AlertDialogContent size="sm">…</AlertDialogContent>
```

## Alert Dialog Media

Use `AlertDialogMedia` for an icon above the title. Pass `variant="danger"` to `AlertDialogAction` for an action that can't be undone.

<!-- ::demo name="alert-dialog-danger" -->

```tsx
<AlertDialogHeader>
  <AlertDialogMedia>
    <HugeiconsIcon icon={Delete02Icon} />
  </AlertDialogMedia>
  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
</AlertDialogHeader>
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction variant="danger">Delete</AlertDialogAction>
</AlertDialogFooter>
```

## API Reference

| Part | Adds |
| --- | --- |
| `AlertDialogContent` | Renders the portal, backdrop, viewport and popup; `size`: `"sm"` or `"default"` |
| `AlertDialogAction` | A `Button`, `primary` by default |
| `AlertDialogCancel` | A `Button` that closes, `outline` by default |

Every part takes `sx`, applied last. For the rest, see [Base UI Alert Dialog](https://base-ui.com/react/components/alert-dialog).
