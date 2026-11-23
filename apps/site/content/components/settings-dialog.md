---
title: Settings Dialog
description: A dialog laid out as a nav beside a page, for settings with several pages.
---

<!-- ::demo name="settings-dialog" -->

```tsx
<SettingsDialog>
  <SettingsDialogTrigger render={<Button variant="outline" />}>
    Settings
  </SettingsDialogTrigger>
  <SettingsDialogContent>
    <SettingsDialogNav label="Settings" title="Acme">
      <SidebarMenuItem>
        <SidebarMenuButton isActive>
          <SidebarMenuLabel>General</SidebarMenuLabel>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SettingsDialogNav>
    <SettingsDialogPage title="General">…</SettingsDialogPage>
  </SettingsDialogContent>
</SettingsDialog>
```

## Installation

<!-- ::install name="settings-dialog" -->

## Usage

```tsx
import {
  SettingsDialog,
  SettingsDialogContent,
  SettingsDialogNav,
  SettingsDialogPage,
  SettingsDialogTrigger,
} from "@/components/primitives/settings-dialog";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLabel,
} from "@/components/primitives/sidebar";
```

```tsx
const [page, setPage] = useState("general");

<SettingsDialog>
  <SettingsDialogTrigger render={<Button variant="outline" />}>
    Settings
  </SettingsDialogTrigger>
  <SettingsDialogContent>
    <SettingsDialogNav label="Settings">
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={page === "general"}
          onClick={() => setPage("general")}
        >
          <SidebarMenuLabel>General</SidebarMenuLabel>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SettingsDialogNav>
    <SettingsDialogPage
      description="How Acme shows up for everyone in it."
      title="General"
    >
      …
    </SettingsDialogPage>
  </SettingsDialogContent>
</SettingsDialog>;
```

`SettingsDialog`, `SettingsDialogTrigger` and `SettingsDialogContent` work like [Dialog](/docs/components/dialog)'s root, trigger and content. `SettingsDialogContent` draws its own close button. Open it from code with `open` and `onOpenChange` instead of a trigger, or keep the page in the URL so a reload keeps it.

## Composition

```
SettingsDialog
├── SettingsDialogTrigger
└── SettingsDialogContent
    ├── SettingsDialogNav
    │   └── SidebarMenuItem
    │       └── SidebarMenuButton
    └── SettingsDialogPage
```

## Settings Dialog Nav

Give `SettingsDialogNav` a `label` for screen readers and an optional `title` above its pages. It's a [Sidebar](/docs/components/sidebar) that doesn't collapse, so its rows are `SidebarMenuItem`s; mark the open page with `isActive`.

```tsx
<SettingsDialogNav label="Workspace settings" title="Acme">
  …
</SettingsDialogNav>
```

## Settings Dialog Page

`SettingsDialogPage` names the page with `title` and an optional `description`, then scrolls its children on its own. Give it a `key` per page, so switching pages starts at the top.

```tsx
<SettingsDialogPage
  description="Choose what reaches you, and where."
  key="notifications"
  title="Notifications"
>
  …
</SettingsDialogPage>
```

Put a back button before the title with `leading`, and controls at the end of its line with `action`; the title line always centres on the close button.

```tsx
<SettingsDialogPage action={<Button size="sm">Invite</Button>} title="Members">
  …
</SettingsDialogPage>
```

**Keep the last page while the dialog closes.** If the page comes from state that clears on close (a URL param), the page empties mid-fade; hold on to the last one shown until the dialog is closed.

## Field

Build each setting from [Field](/docs/components/field): a choice card with a `Switch`, in a `FieldGroup` inside a `flush` `Card`, lists them as rows of one card.

```tsx
<Card size="flush">
  <FieldGroup>
    <Field>
      <FieldLabel>
        <FieldContent>
          <FieldTitle>Mentions</FieldTitle>
          <FieldDescription>When someone @mentions you.</FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </FieldLabel>
    </Field>
  </FieldGroup>
</Card>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SettingsDialog` | `Dialog`, unchanged |
| `SettingsDialogTrigger` | `DialogTrigger`, unchanged |
| `SettingsDialogContent` | Renders `DialogContent` with the nav beside the page, stacked on narrow screens, and a `DialogCloseButton`; takes no `size`; `sx` goes to the popup |
| `SettingsDialogNav` | `label` (required) names the nav; `title` labels its group; `sx` goes to the `Sidebar` |
| `SettingsDialogPage` | `title` (required) and `description` render as `DialogTitle` and `DialogDescription`; `leading` sits before the title and `action` at the end of its line |

Every part but `SettingsDialog` takes `sx`, applied last. For the rest, see [Dialog](/docs/components/dialog) and [Sidebar](/docs/components/sidebar).
