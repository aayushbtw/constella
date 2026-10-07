---
title: Avatar
description: An image element with a fallback for representing the user.
draft: true
---

<!-- ::demo name="avatar" -->

```tsx
<Avatar>
  <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
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
  <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
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

## Fallback

`AvatarFallback` shows while the image loads, and stays when it fails.

<!-- ::demo name="avatar-fallback" -->

```tsx
<Avatar>
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## Badge

Use `AvatarBadge` for a status dot on the avatar's corner. Pass `sx` to color it.

<!-- ::demo name="avatar-badge" -->

```tsx
const styles = stylex.create({
  online: { backgroundColor: colors.success },
});

<Avatar>
  <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
  <AvatarBadge sx={styles.online} />
</Avatar>;
```

## Avatar Group

Use `AvatarGroup` to overlap avatars, and `AvatarGroupCount` for the ones left out.

<!-- ::demo name="avatar-group" -->

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage alt="@maxleiter" src="https://github.com/maxleiter.png" />
    <AvatarFallback>LR</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
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
  <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## Dropdown

Render an avatar inside a [Dropdown Menu](/docs/components/dropdown-menu) trigger for an account menu.

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

`Avatar` takes `size` (`"sm"`, `"default"` or `"lg"`). Every part takes `sx`, applied last. For the rest, see [Base UI Avatar](https://base-ui.com/react/components/avatar).
