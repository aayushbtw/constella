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
import {
  Citation,
  CitationGroup,
  CitationGroupMore,
  Citations,
} from "@/components/ai/citation";
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
├── Citation
└── CitationGroup
    ├── Citation
    └── CitationGroupMore
        └── Citation
```

## Citations

Wrap an answer, or a page of them, in `Citations`. It renders the one card every citation inside opens, so the card moves to each citation as you hover it.

## Citation

Pass every source for one claim in `sources`. The pill shows the first and counts the rest (`+1`); the card lists each, linked to its page.

## Group

List the sources a search found in a `CitationGroup`, a row that wraps. To count the ones left out, put the last citation in `CitationGroupMore` with the count. It keeps the two on one line, so the count never wraps alone.

<!-- ::demo name="citation-group" -->

```tsx
<CitationGroup>
  <Citation sources={[acme]} />
  <Citation sources={[newsroom]} />
  <CitationGroupMore count={42}>
    <Citation sources={[docs]} />
  </CitationGroupMore>
</CitationGroup>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Citations` | The shared `HoverCardContent`: per source, the logo and name, the headline and description each clamped to 2 lines, the date |
| `CitationGroup` | A row that wraps, `space.xxs` apart |
| `CitationGroupMore` | Its children and `{count} more` in `textSecondary`, as one unit that doesn't wrap apart |
| `Citation` | A [Badge](/docs/components/badge) rendering a [Hover Card](/docs/components/hover-card) trigger link to the first source: its logo in an [Avatar](/docs/components/avatar), its name cut at 160px, then `+N` |

| Prop | Part | Type |
| --- | --- | --- |
| `sources` | `Citation` | At least one `{ name, title, url, description?, icon?, date? }`; a globe shows without `icon` |
| `count` | `CitationGroupMore` | `number`, the sources not shown |
| `sx` | every part | `Sx`, applied last: on the card for `Citations`, the pill for `Citation`, the row for `CitationGroup` and the unit for `CitationGroupMore` |
