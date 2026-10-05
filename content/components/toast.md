---
title: Toast
description: Quiet notifications that stack, follow a promise and swipe away.
status: polished
---

<!-- ::demo name="toast" -->

## Installation

<!-- ::install name="toast" -->

## Usage

Wrap the app in `Toaster` once, then add toasts from anywhere, even outside React.

```tsx
import { Toaster, toast } from "@/components/ui/toast";

<Toaster>
  <App />
</Toaster>;

toast.add({ title: "Saved", type: "success" });
```

## Composition

```txt
Toaster
└── Toast
    └── ToastContent
        ├── ToastIcon
        ├── ToastBody
        │   ├── ToastTitle
        │   └── ToastDescription
        ├── ToastAction
        └── ToastClose
```

`Toaster` renders this for every toast. To change it, render your own list inside `ToastProvider`, `ToastPortal` and `ToastViewport` with `useToastManager()`.

## Examples

### Types

`type` picks the icon and its color. Without one, the toast is text only.

<!-- ::demo name="toast-types" -->

```tsx
toast.add({ title: "Event created" });
toast.add({ title: "Saved", type: "success" });
toast.add({ title: "Couldn’t save", type: "error" });
toast.add({ title: "Running low on space", type: "warning" });
toast.add({ title: "A new version is available", type: "info" });
toast.add({ title: "Syncing…", type: "loading" });
```

### Action

One action, for the thing someone is most likely to want next.

<!-- ::demo name="toast-action" -->

```tsx
toast.add({
  title: "File deleted",
  description: "It’s in the trash for 30 days.",
  actionProps: { children: "Undo", onClick: restore },
});
```

### Promise

The toast follows the promise: the icon cross-fades, the text fades across, and the toast grows to fit.

<!-- ::demo name="toast-promise" -->

```tsx
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done", description: "3 files uploaded." },
  error: { title: "Upload failed", description: "The connection dropped." },
});
```

### Dismiss

Every toast closes from its button, a swipe down or right, or its timer. `timeout: 0` keeps it until then; `toast.close()` dismisses from code, one by id or all at once.

<!-- ::demo name="toast-dismiss" -->

```tsx
const id = toast.add({ title: "Read this", timeout: 0 });

toast.close(id);
toast.close();
```

## API

Every part takes `sx` to override its styles. The rest is [Base UI's Toast](https://base-ui.com/react/components/toast).

### Methods

| Method                           | Does                                      |
| -------------------------------- | ----------------------------------------- |
| `toast.add(options)`             | Shows a toast, returns its id             |
| `toast.update(id, options)`      | Changes a toast in place                  |
| `toast.close(id?)`               | Dismisses one toast, or all without an id |
| `toast.promise(promise, states)` | Tracks a promise through its states       |

### Options

| Option | Type | Default |
| --- | --- | --- |
| `title` | `ReactNode` |  |
| `description` | `ReactNode` |  |
| `type` | `"success" \| "error" \| "warning" \| "info" \| "loading"` |  |
| `timeout` | `number`, ms; `0` stays until dismissed | `5000` |
| `actionProps` | Button props for the action |  |
| `priority` | `"low" \| "high"`, how urgently it's announced | `"low"` |
