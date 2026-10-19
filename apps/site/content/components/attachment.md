---
title: Attachment
description: A file or image with its name, details, upload state and actions.
section: AI
---

<!-- ::demo name="attachment" -->

```tsx
<Attachment>
  <AttachmentMedia>
    <PdfIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>q3-report.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove q3-report.pdf">
      <CancelIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Installation

<!-- ::install name="attachment" -->

## Usage

```tsx
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ai/attachment";
```

```tsx
<Attachment>
  <AttachmentMedia>
    <FileIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>notes.md</AttachmentTitle>
  </AttachmentContent>
</Attachment>
```

## Composition

```
AttachmentGroup
└── Attachment
    ├── AttachmentTrigger
    ├── AttachmentMedia
    ├── AttachmentContent
    │   ├── AttachmentTitle
    │   └── AttachmentDescription
    └── AttachmentActions
        └── AttachmentAction
```

## Size

Use the `size` prop to fit a composer or a dense list.

<!-- ::demo name="attachment-size" -->

```tsx
<Attachment size="sm">…</Attachment>
```

| Size      | Media | Text |
| --------- | ----- | ---- |
| `default` | 40px  | 14px |
| `sm`      | 32px  | 13px |
| `xs`      | 28px  | 13px |

## Media

Use `variant="image"` on `AttachmentMedia` for a picture, with `orientation="vertical"` on `Attachment` to stack it above the text. The image fills the media box and stays dimmed until the file is in.

<!-- ::demo name="attachment-image" -->

```tsx
<Attachment orientation="vertical">
  <AttachmentMedia variant="image">
    <img alt="" src={url} />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>workspace.png</AttachmentTitle>
    <AttachmentDescription>PNG · 180 KB</AttachmentDescription>
  </AttachmentContent>
</Attachment>
```

## Trigger

Add `AttachmentTrigger` to open the file from anywhere on the card. Use its `render` prop for a link or a [Dialog](/docs/components/dialog)'s trigger; the actions stay their own buttons above it.

<!-- ::demo name="attachment-trigger" -->

```tsx
<Dialog>
  <Attachment>
    <AttachmentTrigger
      aria-label="Preview q3-report.pdf"
      render={<DialogTrigger />}
    />
    …
  </Attachment>
  <DialogContent>…</DialogContent>
</Dialog>
```

## Group

Wrap several in `AttachmentGroup` for a row that scrolls and snaps, with a [Scroll Fade](/docs/components/scroll-fade) on its edges.

<!-- ::demo name="attachment-group" -->

```tsx
<AttachmentGroup>
  {files.map((file) => (
    <Attachment key={file.name}>…</Attachment>
  ))}
</AttachmentGroup>
```

## State

Use the `state` prop to show where an upload is. Say why a file failed in `AttachmentDescription`, so the error isn't color alone.

<!-- ::demo name="attachment-state" -->

```tsx
<Attachment state="uploading">
  <AttachmentMedia>
    <Spinner />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>q3-report.pdf</AttachmentTitle>
    <AttachmentDescription>Uploading · 45%</AttachmentDescription>
  </AttachmentContent>
</Attachment>
```

| State        | Looks like                           |
| ------------ | ------------------------------------ |
| `idle`       | A dashed edge, ready to upload       |
| `uploading`  | A shimmering title, a dimmed image   |
| `processing` | The same, while the server reads it  |
| `error`      | A red tint on the media and its note |
| `done`       | The default                          |

## API Reference

| Part | Adds |
| --- | --- |
| `Attachment` | `state`, `size` (`"default"`, `"sm"`, `"xs"`), `orientation` (`"horizontal"`, `"vertical"`) |
| `AttachmentMedia` | `variant`: `"default"` or `"image"` |
| `AttachmentTitle` | Shimmers while `uploading` or `processing` |
| `AttachmentAction` | A [Button](/docs/components/button), `ghost` at `icon-xs` by default |
| `AttachmentTrigger` | Base UI [`render`](https://base-ui.com/react/handbook/composition) |

Every part takes `sx`, applied last. `AttachmentTitle` and `AttachmentDescription` render a `span`, `AttachmentTrigger` a `button`, the rest a `div`.
