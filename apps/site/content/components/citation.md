---
title: Citation
description: A source's pill in an answer, opening a card with its publication, headline and date.
section: AI
---

<!-- ::demo name="citation" -->

```tsx
<p>
  Revenue grew 12% last quarter <Citation source={acme} />.
</p>
<CitationCard />
```

## Installation

<!-- ::install name="citation" -->

## Usage

```tsx
import { Citation, CitationCard } from "@/components/ai/citation";
```

```tsx
<Citation
  source={{
    date: "October 9, 2026",
    name: "Acme Business Journal",
    title: "Acme Beats Forecasts as Revenue Grows 12%",
    url: "https://acme.com",
  }}
/>
<CitationCard />
```

## Composition

```
Citation
CitationCard
```

## Citation Card

Render one `CitationCard` per page. Every citation opens it, so it moves to each citation as you hover it.

## API Reference

| Part | Adds |
| --- | --- |
| `Citation` | A [Badge](/docs/components/badge) rendering a [Hover Card](/docs/components/hover-card) trigger link: the logo in an [Avatar](/docs/components/avatar), the name cut at 160px |
| `CitationCard` | The `HoverCardContent` every citation opens: the logo and name, the headline clamped to 2 lines, the date |

| Prop | Type |
| --- | --- |
| `source` | `{ name, title, url, icon?, date? }`; the name's first letter shows without `icon` |
| `sx` | `StyleXStyles`, applied last, on both parts |
