---
title: Sidebar
description: The app's navigation, beside the page, collapsing to icons or out of view.
draft: true
---

<!-- ::demo name="sidebar" -->

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>…</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Chats">
                <HugeiconsIcon icon={BubbleChatIcon} />
                <span>Chats</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>…</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />…
  </SidebarInset>
</SidebarProvider>
```

## Installation

<!-- ::install name="sidebar" -->

## Usage

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
```

`SidebarProvider` holds the open state and toggles it on ⌘B or Ctrl+B. Put the `Sidebar` and a `SidebarInset` for the page inside it. Below 768px the sidebar opens as a [Sheet](/docs/components/sheet) instead.

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarContent>…</SidebarContent>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
  </SidebarInset>
</SidebarProvider>
```

Put each row's label last, in a `<span>`, so it fades as the sidebar narrows to its icons.

## Composition

```
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   └── SidebarGroup
│   │       ├── SidebarGroupLabel
│   │       ├── SidebarGroupAction
│   │       └── SidebarGroupContent
│   │           └── SidebarMenu
│   │               └── SidebarMenuItem
│   │                   ├── SidebarMenuButton
│   │                   ├── SidebarMenuAction
│   │                   ├── SidebarMenuBadge
│   │                   └── SidebarMenuSub
│   │                       └── SidebarMenuSubItem
│   │                           └── SidebarMenuSubButton
│   ├── SidebarFooter
│   └── SidebarRail
└── SidebarInset
    └── SidebarTrigger
```

## Sidebar Menu Button

Use `isActive` for the current page and `tooltip` to name the row when collapsed. Pass `withEnd` when the row has a `SidebarMenuAction` or `SidebarMenuBadge`, so its label leaves room for it.

| Size      | Height |
| --------- | ------ |
| `sm`      | 28px   |
| `default` | 32px   |
| `lg`      | 40px   |

```tsx
<SidebarMenuButton isActive tooltip="Chats" withEnd>
  <HugeiconsIcon icon={BubbleChatIcon} />
  <span>Chats</span>
</SidebarMenuButton>
<SidebarMenuBadge>12</SidebarMenuBadge>
```

## Sidebar Menu Action

Put a `SidebarMenuAction` after a row's button for an action of its own, like a menu. With `showOnHover` it shows only while its row is hovered or focused, or its menu is open. Show `SidebarMenuSkeleton` rows while the list loads.

<!-- ::demo name="sidebar-action" -->

```tsx
<SidebarMenuItem>
  <SidebarMenuButton isActive withEnd>
    <span>Quarterly revenue summary</span>
  </SidebarMenuButton>
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<SidebarMenuAction aria-label="More" showOnHover />}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right">…</DropdownMenuContent>
  </DropdownMenu>
</SidebarMenuItem>
```

## Side

Use `side="right"` to put the sidebar after the page. It collapses toward its own edge.

<!-- ::demo name="sidebar-right" -->

```tsx
<SidebarProvider>
  <SidebarInset>…</SidebarInset>
  <Sidebar collapsible="icon" side="right">
    …
  </Sidebar>
</SidebarProvider>
```

## Collapsible

Use the `collapsible` prop on `Sidebar` to choose how it closes. Collapsed to icons, a row shows its `tooltip`.

<!-- ::demo name="sidebar-offcanvas" -->

| Collapsible | Closed               |
| ----------- | -------------------- |
| `offcanvas` | Out of view          |
| `icon`      | 48px, its icons only |
| `none`      | Never closes         |

```tsx
<Sidebar collapsible="offcanvas">…</Sidebar>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SidebarProvider` | `open`, `defaultOpen`, `onOpenChange`; ⌘B / Ctrl+B |
| `Sidebar` | `side`: `"left"` or `"right"`; `collapsible`: `"offcanvas"`, `"icon"` or `"none"` |
| `SidebarMenuButton` | `isActive`, `tooltip`, `withEnd`; `variant`: `"default"` or `"outline"`; `size`: `"sm"`, `"default"` or `"lg"`; `render` |
| `SidebarMenuAction` | `showOnHover` |
| `SidebarMenuSkeleton` | `showIcon` |
| `useSidebar` | `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`, `isMobile`, `toggleSidebar` |

Every part takes `sx`, applied last.
