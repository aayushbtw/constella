---
title: Dropdown Menu
description: Displays a menu of actions or options, triggered by a button.
draft: true
---

<!-- ::demo name="dropdown-menu" -->

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem>
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Installation

<!-- ::install name="dropdown-menu" -->

## Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Composition

```
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuItem
    │       └── DropdownMenuShortcut
    ├── DropdownMenuSeparator
    ├── DropdownMenuCheckboxItem
    ├── DropdownMenuRadioGroup
    │   └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
```

## Submenu

Use `DropdownMenuSub` to nest secondary actions. The submenu opens beside its trigger, with its first item level with it.

<!-- ::demo name="dropdown-menu-submenu" -->

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Email</DropdownMenuItem>
    <DropdownMenuItem>Message</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

## Icons

Put an icon before the label for quick scanning. Add `inset` to a row without one to line its text up.

<!-- ::demo name="dropdown-menu-icons" -->

```tsx
<DropdownMenuItem>
  <HugeiconsIcon icon={UserIcon} />
  Profile
</DropdownMenuItem>
```

## Checkboxes

Use `DropdownMenuCheckboxItem` for toggles.

<!-- ::demo name="dropdown-menu-checkboxes" -->

```tsx
<DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
  Status Bar
</DropdownMenuCheckboxItem>
```

## Radio Group

Use `DropdownMenuRadioGroup` for one choice out of several.

<!-- ::demo name="dropdown-menu-radio-group" -->

```tsx
<DropdownMenuRadioGroup onValueChange={setPosition} value={position}>
  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```

## Danger

Use `variant="danger"` for an action that can't be undone.

<!-- ::demo name="dropdown-menu-danger" -->

```tsx
<DropdownMenuItem variant="danger">
  <HugeiconsIcon icon={Delete02Icon} />
  Delete
</DropdownMenuItem>
```

## API Reference

| Part | Adds |
| --- | --- |
| `DropdownMenuContent` | Renders the portal, positioner and popup; takes `side`, `align` and their offsets |
| `DropdownMenuItem` | `variant`: `"default"` or `"danger"` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSubTrigger`, checkbox and radio items | `inset`, to line up with rows that have an icon |

Every part takes `sx`, applied last. For the rest, see [Base UI Menu](https://base-ui.com/react/components/menu).

## Pending

Blocked on missing components. Remove this section before the page leaves draft.

- Avatar: add shadcn's Avatar example (account switcher).
