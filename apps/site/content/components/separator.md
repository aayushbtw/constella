---
title: Separator
description: Divides content, across or down.
---

<!-- ::demo name="separator" -->

```tsx
<div>
  <div>Constella</div>
  <div>Components with the details done</div>
</div>
<Separator />
<div>
  Accessible components built on Base UI and StyleX, ready to copy into your
  app.
</div>
```

## Installation

<!-- ::install name="separator" -->

## Usage

```tsx
import { Separator } from "@/components/ui/separator";
```

```tsx
<Separator />
```

## Vertical

Use `orientation="vertical"` for a vertical separator. It stretches to the height of its row.

<!-- ::demo name="separator-vertical" -->

```tsx
<div>Blog</div>
<Separator orientation="vertical" />
<div>Docs</div>
<Separator orientation="vertical" />
<div>Source</div>
```

## Menu

Vertical separators between menu items with descriptions.

<!-- ::demo name="separator-menu" -->

```tsx
<div>
  <span>Settings</span>
  <span>Manage preferences</span>
</div>
<Separator orientation="vertical" />
<div>
  <span>Account</span>
  <span>Profile & security</span>
</div>
```

## List

Horizontal separators between list items.

<!-- ::demo name="separator-list" -->

```tsx
<dl>
  <dt>Item 1</dt>
  <dd>Value 1</dd>
</dl>
<Separator />
<dl>
  <dt>Item 2</dt>
  <dd>Value 2</dd>
</dl>
```

## API Reference

`Separator` takes every prop of [Base UI's Separator](https://base-ui.com/react/components/separator#api-reference), plus `sx`, applied last.

| Prop          | Values                         | Default        |
| ------------- | ------------------------------ | -------------- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` |
