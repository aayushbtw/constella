---
title: Installation
description: Add components with the shadcn CLI and configure your framework to compile StyleX.
---

**Constella is in beta.** Component APIs and styles may change before 1.0. Components you already added remain unchanged until you install them again.

## Choose your framework

<!-- ::frameworks -->

## Fonts

Constella applies `--font-sans` to the page and `--font-mono` to code. Components inherit both tokens. The default theme lists Inter and Geist Mono, but Constella does not ship font files. Load them with packages such as `@fontsource-variable/inter` and `@fontsource-variable/geist-mono`, or put your own font names first in `theme.stylex.ts`.

## Dark mode

Add the `dark` class to `<html>`. `next-themes` and the default shadcn theme setup already do this.

## RTL

Set `dir="rtl"` on `<html>`. Components read this attribute on initial render and when it changes at runtime, so you do not need a separate RTL provider. Add `data-rtl-flip` to directional icons such as arrows and chevrons so they flip with the text direction.

```tsx
<Button aria-label="Next" size="icon">
  <ArrowRightIcon data-rtl-flip />
</Button>
```
