---
title: Citation
description: A source's pill in an answer, opening a card with each source's publication, headline and date.
section: AI
---

<!-- ::demo name="citation" -->

```tsx
<Citations>
  <p>
    Revenue grew 12% last quarter <Citation sources={[acme, newsroom]} />.
  </p>
</Citations>
```

## Installation

<!-- ::install name="citation" -->

## Usage

```tsx
import { Citation, Citations } from "@/components/ai/citation";
```

```tsx
<Citations>
  <Citation
    sources={[
      {
        date: "October 9, 2026",
        name: "Acme Business Journal",
        title: "Acme Beats Forecasts as Revenue Grows 12%",
        url: "https://acme.com",
      },
    ]}
  />
</Citations>
```

## Composition

```
Citations
└── Citation
```

## Citations

Wrap an answer, or a page of them, in `Citations`. It renders the one card every citation inside opens, so the card moves to each citation as you hover it.

## Citation

Pass every source for one claim in `sources`. The pill shows the first and counts the rest (`+1`); the card lists each, linked to its page.

## API Reference

| Part | Adds |
| --- | --- |
| `Citations` | The shared `HoverCardContent`: per source, the logo and name, the headline and description each clamped to 2 lines, the date |
| `Citation` | A [Badge](/docs/components/badge) rendering a [Hover Card](/docs/components/hover-card) trigger link to the first source: its logo in an [Avatar](/docs/components/avatar), its name cut at 160px, then `+N` |

| Prop | Part | Type |
| --- | --- | --- |
| `sources` | `Citation` | At least one `{ name, title, url, description?, icon?, date? }`; the name's first letter shows without `icon` |
| `sx` | both | `Sx`, applied last: on the card for `Citations`, on the pill for `Citation` |
