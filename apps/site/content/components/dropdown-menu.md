---
title: Dropdown Menu
description: Displays a menu of actions or options, triggered by a button.
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
DropdownMenuFilterProvider (optional)
└── DropdownMenu
    ├── DropdownMenuTrigger
    └── DropdownMenuContent
        ├── DropdownMenuInput
        ├── DropdownMenuEmpty
        └── DropdownMenuList
            └── items, as below
```

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

## With Icon

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

## Filter

Wrap the menu in `DropdownMenuFilterProvider`, add `DropdownMenuInput`, and put the items in `DropdownMenuList`. Typing narrows the items and highlights the first match, so Enter runs it. Filtering is a [Base UI preview](https://base-ui.com/react/components/menu), so its API may change.

<!-- ::demo name="dropdown-menu-filter" -->

```tsx
<DropdownMenuFilterProvider>
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" />}>
      Open
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuInput aria-label="Filter actions" placeholder="Filter..." />
      <DropdownMenuEmpty>No actions found.</DropdownMenuEmpty>
      <DropdownMenuList>
        <DropdownMenuItem>New file</DropdownMenuItem>
        <DropdownMenuItem>Save</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenuContent>
  </DropdownMenu>
</DropdownMenuFilterProvider>
```

## Size

Use the `size` prop on `DropdownMenuContent` to size its rows. A submenu takes its parent's size unless it sets its own.

<!-- ::demo name="dropdown-menu-sizes" -->

| Size      | Row  |
| --------- | ---- |
| `sm`      | 24px |
| `default` | 28px |
| `lg`      | 32px |

```tsx
<DropdownMenuContent size="lg">
  <DropdownMenuItem>Profile</DropdownMenuItem>
</DropdownMenuContent>
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

## Avatar

Render an [Avatar](/docs/components/avatar) inside the trigger for an account menu.

<!-- ::demo name="avatar-dropdown" -->

```tsx
<DropdownMenu>
  <DropdownMenuTrigger
    render={<Button aria-label="Account" size="icon" variant="ghost" />}
  >
    <Avatar>
      <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem variant="danger">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

| Part | Adds |
| --- | --- |
| `DropdownMenuContent` | Renders the portal, positioner and popup; takes `side`, `align` and their offsets; `size`: `"sm"`, `"default"` or `"lg"` rows |
| `DropdownMenuItem` | `variant`: `"default"` or `"danger"` |
| `DropdownMenuFilterProvider` | `autoHighlight` defaults to `true` |
| `DropdownMenuInput` | A search field sized with the content's `size`; label it with `aria-label` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSubTrigger`, checkbox and radio items | `inset`, to line up with rows that have an icon |

Every part takes `sx`, applied last. For the rest, see [Base UI Menu](https://base-ui.com/react/components/menu).
