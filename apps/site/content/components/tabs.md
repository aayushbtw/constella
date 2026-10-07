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

## API Reference

`TabsList` renders the indicator that slides to the active tab, and switches tabs as the arrow keys move focus; pass `activateOnFocus={false}` to switch on Enter instead. Every part takes `sx`, applied last. For the rest, see [Base UI Tabs](https://base-ui.com/react/components/tabs).
