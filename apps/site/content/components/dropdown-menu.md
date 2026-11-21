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
      <DropdownMenuItem shortcut="mod+shift+p">Profile</DropdownMenuItem>
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
} from "@/components/primitives/dropdown-menu";
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
    ├── DropdownMenuSeparator
    ├── DropdownMenuCheckboxItem
    ├── DropdownMenuRadioGroup
    │   └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
```

Put item actions in `onSelect`, which runs for the pointer and the keyboard. A plain item closes the menu; `closeOnSelect={false}` keeps it open. A `DropdownMenuLabel` goes inside a group or a radio group, which it names. A menu holds items only. For a searchable list, put a [Command](/docs/components/command) in a [Popover](/docs/components/popover), as [Model Picker](/docs/components/model-picker) does.

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

Use `DropdownMenuCheckboxItem` for toggles. Give each a `value` unique in the menu.

<!-- ::demo name="dropdown-menu-checkboxes" -->

```tsx
<DropdownMenuCheckboxItem
  checked={statusBar}
  onCheckedChange={setStatusBar}
  value="status-bar"
>
  Status Bar
</DropdownMenuCheckboxItem>
```

## Radio Group

Use `DropdownMenuRadioGroup` for one choice out of several. Each radio item's `value` is unique in the menu.

<!-- ::demo name="dropdown-menu-radio-group" -->

```tsx
<DropdownMenuRadioGroup onValueChange={setPosition} value={position}>
  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```

## Controller

Use `createDropdownMenuController` for one menu that several triggers share, like the actions on each row of a list. Pass it to `DropdownMenu` and each trigger as `controller`, with the row's data as `payload`, and render the content from a function of its state. The page mounts one menu instead of one per row.

<!-- ::demo name="dropdown-menu-controller" -->

```tsx
const [rowMenu] = useState(() => createDropdownMenuController<Doc>());

<DropdownMenuTrigger controller={rowMenu} payload={doc} render={<Button size="icon" variant="ghost" />}>
  <HugeiconsIcon icon={MoreHorizontalIcon} />
</DropdownMenuTrigger>

<DropdownMenu controller={rowMenu}>
  <DropdownMenuContent<Doc>>
    {({ payload }) => (
      <DropdownMenuGroup>
        <DropdownMenuLabel>{payload?.name}</DropdownMenuLabel>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenuGroup>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

## Size

Use the `size` prop on `DropdownMenuContent` to size its rows. A submenu takes its parent's size unless it sets its own. Rows, labels and the tick sit the side inset in from the popup's edge, and separators stop at it, so their text and ends line up.

<!-- ::demo name="dropdown-menu-sizes" -->

| Size      | Row  | Text | Side inset | Min width |
| --------- | ---- | ---- | ---------- | --------- |
| `sm`      | 28px | 13px | 6px        | 144px     |
| `default` | 32px | 14px | 12px       | 200px     |
| `lg`      | 36px | 16px | 16px       | 200px     |

```tsx
<DropdownMenuContent size="lg">
  <DropdownMenuItem>Profile</DropdownMenuItem>
</DropdownMenuContent>
```

## Destructive

Use `destructive` for an action that can't be undone. It colors the row red and sets `data-destructive`.

<!-- ::demo name="dropdown-menu-danger" -->

```tsx
<DropdownMenuItem destructive data-agent-confirm="Deletes this file">
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
      <AvatarImage alt="@shadcn" src="/avatars/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem destructive>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

| Part | Adds |
| --- | --- |
| `DropdownMenuContent` | Renders in place, beside its trigger, in the browser's top layer; takes `side`, `align` and their offsets; `size`: `"sm"`, `"default"` or `"lg"` rows |
| `DropdownMenuItem` | `destructive`, drawn red; `shortcut`, like `"mod+shift+p"`, shown at the row's end for the platform and set as `aria-keyshortcuts` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSubTrigger`, checkbox and radio items | `inset`, to line up with rows that have an icon |
| `DropdownMenu`, `DropdownMenuTrigger` | `controller`; `payload` on the trigger |
| `createDropdownMenuController` | A controller shared by `DropdownMenu` and its triggers |

Every part takes `sx`. When the trigger renders a `Button`, put `sx` on the `Button`, the part that draws. For the rest, see [UI SDK Menu](https://ui-sdk.dev/docs/react/components/menu).
