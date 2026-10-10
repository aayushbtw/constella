---
title: Avatar
description: An image element with a fallback for representing the user.
---

<!-- ::demo name="avatar" -->

```tsx
<Avatar>
  <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
  <AvatarFallback>AY</AvatarFallback>
</Avatar>
```

## Installation

<!-- ::install name="avatar" -->

## Usage

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
```

```tsx
<Avatar>
  <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
  <AvatarFallback>AY</AvatarFallback>
</Avatar>
```

## Composition

```
AvatarGroup
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
└── AvatarGroupCount
```

## Size

Use the `size` prop to match the controls beside it.

<!-- ::demo name="avatar-size" -->

| Size      | Diameter |
| --------- | -------- |
| `sm`      | 24px     |
| `default` | 32px     |
| `lg`      | 36px     |

```tsx
<Avatar size="sm">
  <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
  <AvatarFallback>AY</AvatarFallback>
</Avatar>
```

## Fallback

`AvatarFallback` shows while the image loads, and stays when it fails.

<!-- ::demo name="avatar-fallback" -->

```tsx
<Avatar>
  <AvatarFallback>AY</AvatarFallback>
</Avatar>
```

## Badge

Use `AvatarBadge` for a dot on the avatar's corner. Its `status` prop colors it and names it for screen readers; pass `aria-label` to rename it.

<!-- ::demo name="avatar-badge" -->

| Status    | Color | Label     |
| --------- | ----- | --------- |
| `online`  | Green | "Online"  |
| `away`    | Amber | "Away"    |
| `busy`    | Red   | "Busy"    |
| `offline` | Gray  | "Offline" |

```tsx
<Avatar>
  <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
  <AvatarFallback>AY</AvatarFallback>
  <AvatarBadge status="busy" />
</Avatar>
```

### With Icon

Put an icon inside `AvatarBadge`, with or without a `status`.

<!-- ::demo name="avatar-badge-icon" -->

```tsx
<Avatar>
  <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
  <AvatarFallback>AY</AvatarFallback>
  <AvatarBadge status="online">
    <HugeiconsIcon icon={Tick02Icon} size={sizes.iconXxs} />
  </AvatarBadge>
</Avatar>
```

## Avatar Group

Use `AvatarGroup` to overlap avatars.

<!-- ::demo name="avatar-group" -->

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage alt="@evilrabbit" src="https://github.com/evilrabbit.png" />
    <AvatarFallback>ER</AvatarFallback>
  </Avatar>
</AvatarGroup>
```

### Count

Use `AvatarGroupCount` for the avatars left out.

<!-- ::demo name="avatar-group-count" -->

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage alt="@evilrabbit" src="https://github.com/evilrabbit.png" />
    <AvatarFallback>ER</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
```

### With Icon

Put an icon inside `AvatarGroupCount` in place of the number.

<!-- ::demo name="avatar-group-icon" -->

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>
    <HugeiconsIcon icon={Add01Icon} size={sizes.icon} />
  </AvatarGroupCount>
</AvatarGroup>
```

## Dropdown Menu

Render an avatar inside a [Dropdown Menu](/docs/components/dropdown-menu) trigger for an account menu.

<!-- ::demo name="avatar-dropdown" -->

```tsx
<DropdownMenu>
  <DropdownMenuTrigger
    render={<Button aria-label="Account" size="icon" variant="ghost" />}
  >
    <Avatar>
      <AvatarImage alt="@aayushbtw" src="https://github.com/aayushbtw.png" />
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem variant="danger">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

`Avatar` takes `size` (`"sm"`, `"default"` or `"lg"`). `AvatarBadge` takes `status`. Every part takes `sx`, applied last. For the rest, see [Base UI Avatar](https://base-ui.com/react/components/avatar).
