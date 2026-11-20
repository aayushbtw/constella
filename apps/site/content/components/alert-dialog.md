---
title: Alert Dialog
description: A dialog that asks to confirm an action before it happens.
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
      <AlertDialogAction data-agent-confirm="Deletes your account and its data">
        Continue
      </AlertDialogAction>
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
} from "@/components/primitives/alert-dialog";
```

`AlertDialogCancel` and `AlertDialogAction` both close the dialog. Put Cancel first: opening the dialog focuses it.

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

Use `AlertDialogMedia` for an icon above the title. Pass `color="danger"` to `AlertDialogAction` for an action that can't be undone.

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
  <AlertDialogAction
    color="danger"
    data-agent-confirm="Deletes the chat and its files"
  >
    Delete forever
  </AlertDialogAction>
</AlertDialogFooter>
```

## Alert Dialog Action

Pass `action` to `AlertDialogAction` for async work. A returned Promise keeps the dialog open and marks the action `data-pending`; Cancel and Escape do nothing until it settles. It closes once the Promise resolves, and a rejection keeps it open. Read `state.pending` in a function child to show a [Spinner](/docs/components/spinner), and set `pendingAnnouncement` for screen readers.

<!-- ::demo name="alert-dialog-async" -->

```tsx
<AlertDialog pendingAnnouncement="Revoking key">
  …
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction
      action={revoke}
      color="danger"
      data-agent-confirm="Revokes the API key, so apps using it stop working"
    >
      {(state) =>
        state.pending ? (
          <>
            <Spinner data-icon="inline-start" />
            Revoking
          </>
        ) : (
          "Revoke now"
        )
      }
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>
```

## API Reference

| Part | Adds |
| --- | --- |
| `AlertDialogContent` | Renders the backdrop and the content in place, with no portal or viewport; `size`: `"sm"` or `"default"` |
| `AlertDialogAction` | A Close part with `value="confirm"`, rendered as a `primary` `Button` |
| `AlertDialogCancel` | A Close part, rendered as an `outline` `Button` |

Every part takes `sx`, applied last. For the rest, see [UI SDK Alert Dialog](https://ui-sdk.dev/docs/react/components/alert-dialog).
