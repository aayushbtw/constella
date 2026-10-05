---
title: Toast
description: Quiet notifications that stack, follow a promise and swipe away.
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

`type` picks the icon: `success`, `error`, `info` or `loading`. Changing it on a live toast cross-fades the icon.

```tsx
const id = toast.add({ title: "Saving…", type: "loading", timeout: 0 });

toast.update(id, { title: "Saved", type: "success" });
```

### Action

```tsx
toast.add({
  title: "File deleted",
  actionProps: { children: "Undo", onClick: restore },
});
```

### Promise

The toast follows the promise: the icon cross-fades, the text fades in, and the height eases to fit.

```tsx
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done", description: "3 files uploaded." },
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
