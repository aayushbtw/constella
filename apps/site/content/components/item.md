---
title: Item
description: A row of media, a title, a description and actions, alone or in a list.
draft: true
---

<!-- ::demo name="item" -->

```tsx
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Basic Item</ItemTitle>
    <ItemDescription>A simple item with title and description.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm" variant="outline">
      Action
    </Button>
  </ItemActions>
</Item>
```

## Installation

<!-- ::install name="item" -->

## Usage

```tsx
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
```

```tsx
<Item>
  <ItemMedia variant="icon">
    <HugeiconsIcon icon={Notification01Icon} />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Title</ItemTitle>
    <ItemDescription>Description</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button>Action</Button>
  </ItemActions>
</Item>
```

## Composition

```
ItemGroup
├── Item
│   ├── ItemHeader
│   ├── ItemMedia
│   ├── ItemContent
│   │   ├── ItemTitle
│   │   └── ItemDescription
│   ├── ItemActions
│   └── ItemFooter
└── ItemSeparator
```

## Variant

Use the `variant` prop on `Item` to set its surface.

<!-- ::demo name="item-variant" -->

| Variant   | Surface             |
| --------- | ------------------- |
| `default` | None                |
| `outline` | An `edge` border    |
| `muted`   | A `fillSubtle` fill |

```tsx
<Item variant="outline">…</Item>
```

## Size

Use the `size` prop on `Item` to set its padding and its media's size.

<!-- ::demo name="item-size" -->

| Size      | Padding     | Image |
| --------- | ----------- | ----- |
| `default` | 10px × 12px | 40px  |
| `sm`      | 10px × 12px | 32px  |
| `xs`      | 8px × 10px  | 24px  |

```tsx
<Item size="sm">…</Item>
```

## With Icon

Use `ItemMedia` with `variant="icon"` for an icon. With a description, the media lines up with the title.

<!-- ::demo name="item-icon" -->

```tsx
<ItemMedia variant="icon">
  <HugeiconsIcon icon={Shield01Icon} />
</ItemMedia>
```

## Item Group

Use `ItemGroup` for a list of items, and `ItemSeparator` between them.

<!-- ::demo name="item-group" -->

```tsx
<ItemGroup>
  <Item>…</Item>
  <ItemSeparator />
  <Item>…</Item>
</ItemGroup>
```

## Item Header

Use `ItemHeader` and `ItemFooter` for full-width rows above and below the content, like a title with a tag and a footer with a date and an action.

<!-- ::demo name="item-header" -->

```tsx
<Item variant="outline">
  <ItemHeader>
    <ItemTitle>v0.9.0</ItemTitle>
    <Badge variant="secondary">Latest</Badge>
  </ItemHeader>
  <ItemContent>
    <ItemDescription>Hover cards glide between triggers.</ItemDescription>
  </ItemContent>
  <ItemFooter>
    Today
    <Button size="sm" variant="ghost">
      Read notes
    </Button>
  </ItemFooter>
</Item>
```

## Link

Use the `render` prop to render an item as a link. Only a link or a button answers hover and press.

<!-- ::demo name="item-link" -->

```tsx
<Item render={<a href="/docs" />}>
  <ItemContent>
    <ItemTitle>Visit our documentation</ItemTitle>
  </ItemContent>
</Item>
```

## Avatar

Put an [Avatar](/docs/components/avatar) in `ItemMedia`. Use `variant="image"` for a plain `<img>`, which fills the media box.

<!-- ::demo name="item-avatar" -->

```tsx
<ItemMedia>
  <Avatar size="lg">
    <AvatarImage alt="" src="https://github.com/shadcn.png" />
    <AvatarFallback>SC</AvatarFallback>
  </Avatar>
</ItemMedia>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Item` | `variant`: `"default"`, `"outline"` or `"muted"`; `size`: `"default"`, `"sm"` or `"xs"`; `render` |
| `ItemMedia` | `variant`: `"default"`, `"icon"` or `"image"` |

Every part takes `sx`, applied last. For `render`, see [Base UI useRender](https://base-ui.com/react/utils/use-render).
