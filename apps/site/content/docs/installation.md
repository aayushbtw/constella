---
title: Installation
description: Add components with the shadcn CLI, then let your framework compile StyleX.
---

## Choose your framework

<!-- ::frameworks -->

## Fonts

Constella sets the page in `--font-sans` and code in `--font-mono`, and components inherit them. The theme names Inter and Geist Mono there but doesn't ship them: load them (for example `@fontsource-variable/inter` and `@fontsource-variable/geist-mono`), or put your own first in `theme.stylex.ts`.

## Dark mode

Add a `dark` class to `<html>`. next-themes and shadcn's theme setup already do this.

## RTL

Set `dir="rtl"` on `<html>` and wrap the app in Base UI's [`DirectionProvider`](https://base-ui.com/react/utils/direction-provider). Add `data-rtl-flip` to an icon that points along the line, like an arrow or a chevron, so it turns with the text.

```tsx
<Button aria-label="Next" size="icon">
  <ArrowRightIcon data-rtl-flip />
</Button>
```
