---
title: Toast
description: Shows a brief message that stacks, follows a promise and swipes away.
---

<!-- ::demo name="toast" -->

## Installation

<!-- ::install name="toast" -->

## Usage

Render `Toaster` once near the root, beside your app.

```tsx
import { Toaster } from "@/components/primitives/toast";

<>
  <App />
  <Toaster />
</>;
```

Then call `toast` from anywhere, even outside React.

```tsx
import { toast } from "@/components/primitives/toast";

toast.success({ title: "Saved" });
```

## Composition

```
Toaster
└── ToastRegion
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

Use `toast.success`, `.error`, `.warning`, `.info` or `.loading` to add an icon. Call `toast` itself for text only. A loading toast stays until it's updated or dismissed, unless you give it a `duration`.

<!-- ::demo name="toast-types" -->

```tsx
toast({ title: "Event created" });
toast.success({ title: "Saved" });
toast.error({ title: "Couldn’t save" });
toast.warning({ title: "Running low on space" });
toast.info({ title: "A new version is available" });
toast.loading({ title: "Syncing…", duration: 5000 });
```

## Action

Use `action` to add a button. Pressing it dismisses the toast. Give it an `href` to render a link instead. A toast takes one action, and a label too long to sit beside the text drops under it.

<!-- ::demo name="toast-action" -->

```tsx
toast({
  title: "File deleted",
  description: "It’s in the trash for 30 days.",
  action: { label: "Undo", onAction: restore },
});
```

## Promise

Use `toast.promise` to show a loading toast that turns into success or error. It returns the toast's id.

<!-- ::demo name="toast-promise" -->

```tsx
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done", description: "3 files uploaded." },
  error: { title: "Upload failed", description: "The connection dropped." },
});
```

## Dismiss

Use `duration: Infinity` to keep a toast until it's dismissed. Use `toast.dismiss` to close one by id, or all of them. Set `dismissible: false` to hide the close button and ignore swipes and Escape.

<!-- ::demo name="toast-dismiss" -->

```tsx
const id = toast({ title: "Read this", duration: Infinity });

toast.dismiss(id);
toast.dismiss();
```

## Custom Layout

`Toaster` renders the Composition tree for every toast. To change it, render your own `ToastRegion` and pass it a function that builds each toast from the parts.

```tsx
<ToastRegion>
  {(data) => (
    <Toast>
      <ToastContent>
        {data.type !== "default" && <ToastIcon type={data.type} />}
        <ToastBody>
          <ToastTitle />
          <ToastDescription />
        </ToastBody>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  )}
</ToastRegion>
```

## API Reference

`Toaster` sits at the bottom end of the page, in the browser's top layer, and takes UI SDK `ToastRegion`'s props except `side`, `align` and `children`.

| Behavior | Value |
| --- | --- |
| Visible at once | 3; set `maxVisible` on `Toaster`. The rest wait, timers stopped |
| Keyboard | F6 moves focus to the newest toast, and again back. Escape dismisses the focused toast |
| Timers pause | On hover, on focus, on a hidden page and on an inactive window |
| Swipe | Down, or toward the end edge, which follows the writing direction |

Every part takes `sx`, applied last. For the rest, see [UI SDK Toast](https://ui-sdk.dev/docs/components/toast).

### toast

| Method | Does |
| --- | --- |
| `toast(options)` | Shows a toast, returns its id |
| `toast.success(options)`, `.error`, `.warning`, `.info`, `.loading` | Shows a toast of that type, returns its id |
| `toast.update(id, options)` | Changes a toast in place, returns whether it was still showing |
| `toast.dismiss(id?)` | Closes one toast, or all without an id |
| `toast.promise(promise, states)` | Follows a promise through its states, returns the id |

### Options

| Option | Type | Default |
| --- | --- | --- |
| `title` | `ReactNode` |  |
| `description` | `ReactNode` |  |
| `type` | `"default" \| "success" \| "error" \| "warning" \| "info" \| "loading"` | `"default"` |
| `duration` | `number`, in ms; `Infinity` stays until dismissed | `5000`; `Infinity` for `loading` |
| `action` | `{ label, onAction }`, or `{ label, href }` for a link |  |
| `dismissible` | `boolean` | `true` |
| `priority` | `"polite" \| "assertive"`, how it's announced | `"polite"`; `"assertive"` for `error` |
| `id` | `string`; a toast with this id that's still showing is updated |  |
| `onDismiss` | `(details) => void`, runs when it closes |  |
| `cancel` | A dismiss button, for custom layouts; `Toaster` doesn't render it |  |
