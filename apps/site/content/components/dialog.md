---
title: Dialog
description: Asks for a decision in a window over the page.
draft: true
---

<!-- ::demo name="dialog" -->

## Installation

<!-- ::install name="dialog" -->

## Usage

```tsx
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
```

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>Publish</DialogTrigger>
  <DialogContent>
    <DialogCloseButton />
    <DialogHeader>
      <DialogTitle>Publish changes?</DialogTitle>
      <DialogDescription>Everyone with the link will see it.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="primary" />}>Publish</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Open from Code

Use `open` and `onOpenChange` to open the dialog without a trigger, or to close it after an action finishes.

<!-- ::demo name="dialog-controlled" -->

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>…</DialogContent>
</Dialog>;
```

## Nested

Put a `Dialog` inside another's content to open one on top.

<!-- ::demo name="dialog-nested" -->

```tsx
<DialogContent>
  <Dialog>
    <DialogTrigger render={<Button />}>Reset link</DialogTrigger>
    <DialogContent>…</DialogContent>
  </Dialog>
</DialogContent>
```

## API Reference

`DialogCloseButton` is the close button in the corner; put it in `DialogContent`. Every part takes `sx`. For the rest, see [Base UI's Dialog](https://base-ui.com/react/components/dialog).
