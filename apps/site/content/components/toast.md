---
title: Toast
description: Shows a brief message that stacks, follows a promise and swipes away.
---

<!-- ::demo name="toast" -->

## Installation

<!-- ::install name="toast" -->

## Usage

Render `Toaster` once, around your app.

```tsx
import { Toaster } from "@/components/ui/toast";

<Toaster>
  <App />
</Toaster>;
```

Then call `toast.add` from anywhere, even outside React.

```tsx
import { toast } from "@/components/ui/toast";

toast.add({ title: "Saved", type: "success" });
```

## Composition

```
ToastProvider
└── ToastPortal
    └── ToastViewport
        └── Toast
            └── ToastContent
                ├── ToastIcon
                ├── ToastBody
                │   ├── ToastTitle
                │   └── ToastDescription
                ├── ToastAction
                └── ToastClose
```

## Types

Use `type` to add an icon. Leave it out for text only.

<!-- ::demo name="toast-types" -->

```tsx
toast.add({ title: "Event created" });
toast.add({ title: "Saved", type: "success" });
toast.add({ title: "Couldn’t save", type: "error" });
toast.add({ title: "Running low on space", type: "warning" });
toast.add({ title: "A new version is available", type: "info" });
toast.add({ title: "Syncing…", type: "loading" });
```

## Action

Use `actionProps` to add a button. Keep it to one action. A label too long to sit beside the text drops under it.

<!-- ::demo name="toast-action" -->

```tsx
toast.add({
  title: "File deleted",
  description: "It’s in the trash for 30 days.",
  actionProps: { children: "Undo", onClick: restore },
});
```

## Promise

Use `toast.promise` to show a loading toast that turns into success or error.

<!-- ::demo name="toast-promise" -->

```tsx
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done", description: "3 files uploaded." },
  error: { title: "Upload failed", description: "The connection dropped." },
});
```

## Dismiss

Use `timeout: 0` to keep a toast until it's closed. Use `toast.close` to close one by id, or all of them.

<!-- ::demo name="toast-dismiss" -->

```tsx
const id = toast.add({ title: "Read this", timeout: 0 });

toast.close(id);
toast.close();
```

## Custom Layout

`Toaster` renders the Composition tree for every toast. To change it, render your own list inside `ToastViewport` with `useToastManager()`.

## API Reference

Every part takes `sx` to override its styles. The rest is [Base UI's Toast](https://base-ui.com/react/components/toast).

### toast

| Method                           | Does                                   |
| -------------------------------- | -------------------------------------- |
| `toast.add(options)`             | Shows a toast, returns its id          |
| `toast.update(id, options)`      | Changes a toast in place               |
| `toast.close(id?)`               | Closes one toast, or all without an id |
| `toast.promise(promise, states)` | Follows a promise through its states   |

### Options

| Option | Type | Default |
| --- | --- | --- |
| `title` | `ReactNode` |  |
| `description` | `ReactNode` |  |
| `type` | `"success" \| "error" \| "warning" \| "info" \| "loading"` |  |
| `timeout` | `number`, in ms; `0` stays until closed | `5000` |
| `actionProps` | Button props for the action |  |
| `priority` | `"low" \| "high"`, how urgently it's announced | `"low"` |
