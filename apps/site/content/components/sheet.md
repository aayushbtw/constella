---
title: Sheet
description: A panel that slides in from an edge of the screen, over the page.
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
} from "@/components/primitives/sheet";
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

Use the `side` prop on `Sheet` to choose the edge it slides from. It leaves the same way, and a swipe toward that edge from its header or footer closes it.

<!-- ::demo name="sheet-side" -->

| Side     | Size                                     |
| -------- | ---------------------------------------- |
| `right`  | 75% wide, up to 384px                    |
| `left`   | 75% wide, up to 384px                    |
| `top`    | Its content's height, up to the screen's |
| `bottom` | Its content's height, up to the screen's |

```tsx
<Sheet side="left">…</Sheet>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Sheet` | `side`: `"top"`, `"right"` (the default), `"bottom"` or `"left"`, or `"start"` and `"end"`, which follow the text direction |
| `SheetContent` | Renders the backdrop and sheet; `showCloseButton` |
| `SheetBody` | Scrolls content too long for the sheet, which doesn't scroll itself. A drag on it selects text instead of moving the sheet |

Every part takes `sx`, applied last. For the rest, see [UI SDK Drawer](https://ui-sdk.dev/docs/react/components/drawer).
