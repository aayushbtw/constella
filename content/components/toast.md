---
title: Toast
description: Stacked notifications that expand on hover and swipe to dismiss.
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

toast.add({ title: "Saved", description: "Your changes are live." });
```

## Composition

```txt
Toaster
└── Toast
    └── ToastContent
        ├── ToastBody
        │   ├── ToastTitle
        │   └── ToastDescription
        ├── ToastAction
        └── ToastClose
```

`Toaster` renders this for every toast. To change the layout, render your own list inside `ToastProvider`, `ToastPortal` and `ToastViewport` with `useToastManager()`.

## Examples

### Action

```tsx
toast.add({
  title: "File deleted",
  actionProps: { children: "Undo", onClick: restore },
});
```

### Promise

The toast follows the promise from loading to success or error.

```tsx
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done" },
  error: { title: "Upload failed" },
});
```

## API

Every part takes `sx` to override its styles. The rest is [Base UI's Toast](https://base-ui.com/react/components/toast).

| Method                           | Does                          |
| -------------------------------- | ----------------------------- |
| `toast.add(options)`             | Shows a toast, returns its id |
| `toast.update(id, options)`      | Changes a toast in place      |
| `toast.close(id)`                | Dismisses a toast             |
| `toast.promise(promise, states)` | Tracks a promise              |
