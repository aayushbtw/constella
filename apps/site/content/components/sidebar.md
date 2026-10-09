---
title: Sidebar
description: The app's navigation, beside the page, collapsing to icons or out of view.
draft: true
---

<!-- ::demo name="sidebar" -->

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarExpandedOnly>…</SidebarExpandedOnly>
      <SidebarHeaderActions>
        <SidebarTrigger kbd={<Kbd>⌘B</Kbd>}>
          <SidebarTriggerMark>
            <Logo />
          </SidebarTriggerMark>
        </SidebarTrigger>
      </SidebarHeaderActions>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive tooltip="Chats">
            <HugeiconsIcon icon={BubbleChatIcon} />
            <SidebarMenuLabel>Chats</SidebarMenuLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>…</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>…</SidebarInset>
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

`SidebarProvider` holds the open state and toggles it on ⌘B or Ctrl+B with no animation. Put the `Sidebar` and a `SidebarInset` for the page inside it. Below 768px the sidebar opens as a [Sheet](/docs/components/sheet) instead.

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

Put each row's text in a `SidebarMenuLabel`. A label too long for the row fades at its edge, and the row's `tooltip` shows it whole. As the sidebar narrows to its icons, the label fades out with the width.

## Composition

```
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   │   ├── SidebarExpandedOnly
│   │   └── SidebarHeaderActions
│   │       └── SidebarTrigger
│   │           └── SidebarTriggerMark
│   ├── SidebarContent
│   │   └── SidebarGroup
│   │       ├── SidebarGroupLabel
│   │       ├── SidebarGroupAction
│   │       └── SidebarGroupContent
│   │           └── SidebarMenu
│   │               └── SidebarMenuItem
│   │                   ├── SidebarMenuButton
│   │                   │   ├── SidebarMenuLabel
│   │                   │   └── SidebarMenuKbd
│   │                   ├── SidebarMenuAction
│   │                   ├── SidebarMenuBadge
│   │                   └── SidebarMenuSub
│   │                       └── SidebarMenuSubItem
│   │                           └── SidebarMenuSubButton
│   ├── SidebarFooter
│   └── SidebarRail
└── SidebarInset
```

## Sidebar Header

`SidebarHeader` is a row the page header's height (48px), so the two line up. Put a brand or title first and `SidebarHeaderActions` last. `SidebarTrigger` collapses the sidebar, and in the mobile sheet closes it. Its `kbd` follows the label in its tooltip. Its icon is `SidebarTriggerIcon`, which picks the glyph for where it is; pass your own children to replace it. Wrap your logo in `SidebarTriggerMark` to show it in the icon rail until the trigger is pointed at or focused. Leave the trigger out of the sidebar when the page header has one, as with `offcanvas`.

Wrap anything that only fits the open sidebar in `SidebarExpandedOnly`. It stays while the width moves, so the edge passes over it, and is removed once the sidebar has narrowed to its icons. In the content it fades with the labels.

```tsx
<SidebarHeader>
  <SidebarExpandedOnly>
    <Brand />
  </SidebarExpandedOnly>
  <SidebarHeaderActions>
    <SidebarTrigger kbd={<Kbd>⌘B</Kbd>}>
      <SidebarTriggerMark>
        <Logo />
      </SidebarTriggerMark>
    </SidebarTrigger>
  </SidebarHeaderActions>
</SidebarHeader>
```

## Sidebar Menu Button

Use `isActive` for the current page and `tooltip` to name the row in the icon rail, or when its label is cut off. Pass `withEnd` when the row has a `SidebarMenuBadge`, so its label leaves room for it.

Put a shortcut after the label in a `SidebarMenuKbd`. It shows while the row is pointed at or focused. In the rail, put it in the `tooltip` instead.

| Size      | Height |
| --------- | ------ |
| `sm`      | 28px   |
| `default` | 32px   |
| `lg`      | 40px   |

```tsx
<SidebarMenuButton
  tooltip={
    <>
      New chat<Kbd>⌘O</Kbd>
    </>
  }
>
  <HugeiconsIcon icon={PencilEdit02Icon} />
  <SidebarMenuLabel>New chat</SidebarMenuLabel>
  <SidebarMenuKbd>
    <Kbd>⌘O</Kbd>
  </SidebarMenuKbd>
</SidebarMenuButton>
```

## Sidebar Menu Action

Put a `SidebarMenuAction` after a row's button for an action of its own, like a menu. It's drawn over the row's end, and the label fades out before it. With `showOnHover` it shows only while its row is hovered or focused, or its menu is open, so the label keeps the full width the rest of the time. Show `SidebarMenuSkeleton` rows while the list loads.

<!-- ::demo name="sidebar-action" -->

```tsx
<SidebarMenuItem>
  <SidebarMenuButton isActive tooltip="Quarterly revenue summary">
    <SidebarMenuLabel>Quarterly revenue summary</SidebarMenuLabel>
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

## Sections

When a row leads into a section with its own sidebar, like Settings in the first demo, change it with `changeSection` from `useSidebar`. It runs your update in a view transition: the header and content slide forward into the section, or back out of it, and the page swaps at once.

```tsx
const { changeSection } = useSidebar();

<SidebarMenuButton
  onClick={() => {
    changeSection("forward", () => setSection("settings"));
  }}
>
  …
</SidebarMenuButton>;
```

`update` can return a promise, like a router's `navigate`; the new section is captured when it settles. Only the provider that changed slides, so another sidebar on the page stays put.

| Region           | Slides by default | Change it      |
| ---------------- | ----------------- | -------------- |
| `SidebarHeader`  | Yes               | `swap={false}` |
| `SidebarContent` | Yes               | `swap={false}` |
| `SidebarFooter`  | No                | `swap`         |

Browsers without view transition types swap at once.

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
| `SidebarTrigger` | `kbd`; children default to `SidebarTriggerIcon` |
| `SidebarTriggerMark` | children: the mark shown in the rail |
| `SidebarMenuButton` | `isActive`, `tooltip`, `withEnd`; `variant`: `"default"` or `"outline"`; `size`: `"sm"`, `"default"` or `"lg"`; `render` |
| `SidebarMenuAction` | `showOnHover` |
| `SidebarMenuSkeleton` | `showIcon` |
| `SidebarHeader`, `SidebarContent`, `SidebarFooter` | `swap` |
| `useSidebar` | `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`, `isMobile`, `toggleSidebar`, `changeSection(direction, update)` |

Every part takes `sx`, applied last.
