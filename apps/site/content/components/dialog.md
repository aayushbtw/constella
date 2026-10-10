---
title: Dialog
description: Asks for a decision in a window over the page.
---

<!-- ::demo name="dialog" -->

## Installation

<!-- ::install name="dialog" -->

## Usage

```tsx
import {
  Dialog,
  DialogBody,
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
  <DialogTrigger render={<Button variant="outline" />}>
    Edit profile
  </DialogTrigger>
  <DialogContent>
    <DialogCloseButton />
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <FieldGroup>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input defaultValue="Pedro Duarte" name="name" />
      </Field>
    </FieldGroup>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="primary" />}>
        Save changes
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Composition

```
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogCloseButton
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    ├── DialogBody
    └── DialogFooter
        └── DialogClose
```

## Size

Use the `size` prop on `DialogContent`. The content sets the height, except at `full`, which fills the window inside its margin.

<!-- ::demo name="dialog-size" -->

```tsx
<DialogContent size="lg">…</DialogContent>
```

| Size      | Width                        |
| --------- | ---------------------------- |
| `sm`      | 320px                        |
| `default` | 384px                        |
| `lg`      | 512px                        |
| `full`    | The window, less 16px a side |

## Scrollable Content

Give `DialogContent` a `maxHeight` and put the content in `DialogBody`. The body scrolls between the header and footer.

<!-- ::demo name="dialog-scrollable" -->

```tsx
<DialogContent sx={styles.short}>
  <DialogHeader>…</DialogHeader>
  <DialogBody>…</DialogBody>
  <DialogFooter>…</DialogFooter>
</DialogContent>
```

## Controlled

Use `open` and `onOpenChange` to open the dialog without a trigger, or to close it after an action finishes.

<!-- ::demo name="dialog-controlled" -->

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>…</DialogContent>
</Dialog>;
```

## API Reference

`DialogCloseButton` is the close button in the corner; put it in `DialogContent`. `DialogBody` scrolls once the popup hits its `maxHeight`. Every part takes `sx`. For the rest, see [Base UI's Dialog](https://base-ui.com/react/components/dialog).
