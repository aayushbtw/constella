---
title: Sheet
description: A panel that slides in from an edge of the screen, over the page.
draft: true
---

<!-- ::demo name="sheet" -->

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you&apos;re done.
      </SheetDescription>
    </SheetHeader>
    <SheetBody>…</SheetBody>
    <SheetFooter>
      <Button variant="primary">Save changes</Button>
      <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Installation

<!-- ::install name="sheet" -->

## Usage

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
```

```tsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>This action cannot be undone.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Composition

```
Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    ├── SheetBody
    └── SheetFooter
        └── SheetClose
```

## Side

Use the `side` prop on `SheetContent` to choose the edge it slides from. It leaves the same way.

<!-- ::demo name="sheet-side" -->

| Side     | Size                  |
| -------- | --------------------- |
| `right`  | 75% wide, up to 384px |
| `left`   | 75% wide, up to 384px |
| `top`    | Its content's height  |
| `bottom` | Its content's height  |

```tsx
<SheetContent side="left">…</SheetContent>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SheetContent` | Renders the portal, backdrop and popup; `side`: `"top"`, `"right"`, `"bottom"` or `"left"`; `showCloseButton` |

Every part takes `sx`, applied last. For the rest, see [Base UI Dialog](https://base-ui.com/react/components/dialog).
