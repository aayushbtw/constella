---
title: Copy Button
description: Copies text, and shows a tick for a moment after.
---

<!-- ::demo name="copy-button" -->

```tsx
<CopyButton value="pnpm dlx shadcn add card" />
```

## Installation

<!-- ::install name="copy-button" -->

## Usage

```tsx
import { CopyButton } from "@/components/primitives/copy-button";
```

```tsx
<CopyButton value={code} />
```

The icon swaps to a tick with a [Swap Icon](/docs/components/swap-icon), holds for 1.5s, and swaps back. Its accessible name doesn't change, and a status region announces "Copied" to screen readers.

## HTML

Pass `html` with the same content as markup, and the clipboard carries both. A target that takes HTML, like a spreadsheet or a doc, pastes it rich; anywhere else pastes the text.

```tsx
<CopyButton html={() => tableHtml(rows)} value={() => tableTsv(rows)} />
```

## Variant

`CopyButton` is a [Button](/docs/components/button): pass its `variant` and `size`. It's `ghost` at `icon-sm` by default.

<!-- ::demo name="copy-button-variant" -->

```tsx
<CopyButton value="Hello" variant="outline" />
```

## Label

Pass `children` for a visible label after the icon. It names the button, and the size defaults to `sm`.

<!-- ::demo name="copy-button-label" -->

```tsx
<CopyButton value="Hello" variant="outline">
  Copy
</CopyButton>
```

## API Reference

| Part | Adds |
| --- | --- |
| `CopyButton` | `value`: the text to copy, or a function that returns it at the press; `html`: the same as markup, as a string or a function; a `Button`'s props but `onClick` |
