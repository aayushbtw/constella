---
title: Tabs
description: Switches between views of the same content.
---

<!-- ::demo name="tabs" -->

## Installation

<!-- ::install name="tabs" -->

## Usage

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

```tsx
<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">…</TabsContent>
  <TabsContent value="code">…</TabsContent>
</Tabs>
```

## Composition

```
Tabs
├── TabsList
│   └── TabsTrigger
└── TabsContent
```

## Variant

Use the `variant` prop on `TabsList` to choose between a pill sliding in a track and a line sliding along a baseline.

<!-- ::demo name="tabs-line" -->

```tsx
<TabsList variant="line">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="activity">Activity</TabsTrigger>
</TabsList>
```

| Variant   | Indicator                             |
| --------- | ------------------------------------- |
| `default` | A `fill` pill inside a bordered track |
| `line`    | An `accent` line on a faint baseline  |

## Size

Use the `size` prop on `TabsList`. Every trigger in the list follows it.

<!-- ::demo name="tabs-size" -->

```tsx
<TabsList size="sm">…</TabsList>
```

| Size      | Tab height  | Text |
| --------- | ----------- | ---- |
| `sm`      | `controlXs` | 13px |
| `default` | `controlSm` | 14px |
| `lg`      | `controlMd` | 14px |

## Orientation

Set `orientation="vertical"` on `Tabs` to stack the tabs beside their panels, as in a settings page. Arrow keys move up and down.

<!-- ::demo name="tabs-vertical" -->

```tsx
<Tabs defaultValue="general" orientation="vertical">
  <TabsList variant="line">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
  <TabsContent value="billing">…</TabsContent>
</Tabs>
```

## Disabled

Add `disabled` to a `TabsTrigger` to keep it in place but out of reach.

<!-- ::demo name="tabs-disabled" -->

```tsx
<TabsTrigger disabled value="agents">
  Agents
</TabsTrigger>
```

## API Reference

`TabsList` renders the indicator that slides to the active tab, and switches tabs as the arrow keys move focus; pass `activateOnFocus={false}` to switch on Enter instead. A row of tabs wider than its container scrolls sideways, and a vertical list's panel moves under it once it has less than `sizes.menu` beside it.

| Prop      | Type                        | Default     |
| --------- | --------------------------- | ----------- |
| `variant` | `"default" \| "line"`       | `"default"` |
| `size`    | `"sm" \| "default" \| "lg"` | `"default"` |

Every part takes `sx`, applied last. For the rest, see [Base UI Tabs](https://base-ui.com/react/components/tabs).
