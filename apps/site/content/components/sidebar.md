---
title: Sidebar
description: The app's navigation, beside the page, collapsing to icons or out of view.
---

<!-- ::demo name="sidebar" -->

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarExpandedOnly>…</SidebarExpandedOnly>
      <SidebarHeaderActions>
        <SidebarTrigger>
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
} from "@/components/primitives/sidebar";
```

`SidebarProvider` holds the open state and toggles it with no animation on ⌘B, or Ctrl+B off Apple devices. The shortcut pauses while a modal dialog is open. Put the `Sidebar` and a `SidebarInset` for the page inside it. Below 768px the sidebar opens as a [Sheet](/docs/components/sheet) instead.

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

Wrap a `SidebarMenu` of pages in a `<nav aria-label="…">`, since the sidebar renders no landmark of its own.

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

`SidebarHeader` is a row the page header's height (56px), so the two line up. Put a brand or title first and `SidebarHeaderActions` last. `SidebarTrigger` collapses the sidebar, and in the mobile sheet closes it. It's named "Toggle sidebar" in both states and reports the state with `aria-expanded`. Below 768px it also has `aria-haspopup="dialog"`, since it opens the sheet. Its `kbd` follows the label in its tooltip. Show the keys with `useShortcutHint("mod+b")` from `@ui-sdk/react/shortcuts`: Ctrl+B in the server HTML, ⌘B on Apple devices after the page loads. The trigger sets `aria-keyshortcuts` itself. Its icon is `SidebarTriggerIcon`, which picks the glyph for where it is; pass your own children to replace it. Wrap your logo in `SidebarTriggerMark` to show it in the icon rail until the trigger is pointed at or focused. Leave the trigger out of the sidebar when the page header has one, as with `offcanvas`.

Wrap anything that only fits the open sidebar in `SidebarExpandedOnly`. It stays while the width moves, so the edge passes over it, and is removed once the sidebar has narrowed to its icons. In the content it fades with the labels.

```tsx
function Header() {
  const hint = useShortcutHint("mod+b");
  return (
    <SidebarHeader>
      <SidebarExpandedOnly>
        <Brand />
      </SidebarExpandedOnly>
      <SidebarHeaderActions>
        <SidebarTrigger kbd={<Kbd>{hint.text}</Kbd>}>
          <SidebarTriggerMark>
            <Logo />
          </SidebarTriggerMark>
        </SidebarTrigger>
      </SidebarHeaderActions>
    </SidebarHeader>
  );
}
```

## Sidebar Menu Button

Use `isActive` for the current page, which also sets `aria-current="page"`, and `tooltip` to name the row in the icon rail, or when its label is cut off. The `tooltip` is also the row's accessible name, so a screen reader reads the label once, not again as a description. Pass `withEnd` when the row has a `SidebarMenuBadge`, so its label leaves room for it.

Put a shortcut after the label in a `SidebarMenuKbd`. It shows while the row is pointed at or focused. In the rail, put it in the `tooltip` instead. Give that `Kbd` `aria-hidden`, so the row's name stays its label, and name the keys with `aria-keyshortcuts` on the row.

| Size      | Height |
| --------- | ------ |
| `sm`      | 28px   |
| `default` | 32px   |
| `lg`      | 40px   |

```tsx
const hint = useShortcutHint("mod+o");

<SidebarMenuButton
  aria-keyshortcuts={hint.ariaKeyshortcuts}
  tooltip={
    <>
      New chat<Kbd aria-hidden>{hint.text}</Kbd>
    </>
  }
>
  <HugeiconsIcon icon={PencilEdit02Icon} />
  <SidebarMenuLabel>New chat</SidebarMenuLabel>
  <SidebarMenuKbd>
    <Kbd>{hint.text}</Kbd>
  </SidebarMenuKbd>
</SidebarMenuButton>;
```

## Sidebar Footer

For an account menu, render a `size="lg"` `SidebarMenuButton` as a `DropdownMenuTrigger`. The row stays lit while its menu is open, and in the icon rail it narrows to its avatar.

```tsx
<SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<SidebarMenuButton size="lg" tooltip="shadcn Pro" />}
        >
          <Avatar>…</Avatar>
          <SidebarMenuLabel>
            <span>shadcn</span>
            <span>Pro</span>
          </SidebarMenuLabel>
          <HugeiconsIcon icon={UnfoldMoreIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top">…</DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>
```

## Sidebar Menu Action

Put a `SidebarMenuAction` after a row's button for an action of its own, like a menu. It's drawn over the row's end, and the label fades out before it. With `showOnHover` it shows only while its row is hovered or focused, or its menu is open, so the label keeps the full width the rest of the time. Show `SidebarMenuSkeleton` rows while the list loads.

`SidebarMenuButton`, `SidebarMenuSubButton`, `SidebarMenuAction`, `SidebarGroupAction` and `SidebarRail` are ui-sdk Buttons, so the agent bridge lists each by its name. The bridge also matches a control by the text of the row it sits in, so a row's name matches its action too. An agent presses such a row by the `ref` that `snapshot()` gives it.

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

## Sidebar Menu Sub

Put sub rows in a `SidebarMenuSub` after the row's button, like Docs in the first demo. To open and close them, render the row through a [Collapsible](/docs/components/collapsible): the item as its root, the button as its trigger, and the sub in its `CollapsibleContent`. The button then reports its state with `aria-expanded`. Rotate a chevron in it while the button has `data-open`.

```tsx
<Collapsible defaultOpen render={<SidebarMenuItem />}>
  <CollapsibleTrigger render={<SidebarMenuButton tooltip="Docs" />}>
    <HugeiconsIcon icon={BookOpen01Icon} />
    <SidebarMenuLabel>Docs</SidebarMenuLabel>
    <HugeiconsIcon icon={ArrowRight01Icon} />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <SidebarMenuSub>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton render={<a href="/docs/introduction" />}>
          Introduction
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </CollapsibleContent>
</Collapsible>
```

## Sections

When a row leads into a section with its own sidebar, like Settings in the first demo, change it with `changeSection` from `useSidebar`. It runs your update in a view transition: the header and content slide forward into the section, or back out of it, while the trigger holds still and the page swaps at once.

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

### Router

When each section is its own route, let the router start the view transition with the type `sidebar-forward` or `sidebar-back`, and the sidebar slides with no `changeSection`. Set it in `defaultViewTransition`, which back and forward use too, and pick the direction from the two locations. Every sidebar on the page slides, since the router doesn't know which one changed.

```tsx
createRouter({
  routeTree,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      const from = sectionOf(fromLocation);
      const to = sectionOf(toLocation);
      if (fromLocation === undefined || from === to) {
        return false;
      }
      return [to === "home" ? "sidebar-back" : "sidebar-forward"];
    },
  },
});
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
| `SidebarProvider` | `open`, `defaultOpen`, `onOpenChange`; `mod+b` toggles it (⌘B on Apple, Ctrl+B elsewhere), paused under a modal |
| `Sidebar` | `side`: `"left"` or `"right"`; `collapsible`: `"offcanvas"`, `"icon"` or `"none"` |
| `SidebarTrigger` | `kbd`; named "Toggle sidebar", with `aria-expanded` and `aria-keyshortcuts` for `mod+b`; children default to `SidebarTriggerIcon` |
| `SidebarTriggerMark` | children: the mark shown in the rail |
| `SidebarMenuButton` | `isActive`, `tooltip`, `withEnd`; `variant`: `"default"` or `"outline"`; `size`: `"sm"`, `"default"` or `"lg"`; `render` |
| `SidebarMenuAction` | `showOnHover` |
| `SidebarMenuSkeleton` | `showIcon` |
| `SidebarHeader`, `SidebarContent`, `SidebarFooter` | `swap` |
| `useSidebar` | `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`, `isMobile`, `toggleSidebar`, `changeSection(direction, update)` |

Every part takes `sx`, applied last.
