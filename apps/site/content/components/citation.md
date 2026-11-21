---
title: Citation
description: A source's pill in an answer, opening a card with each source's publication, headline and date.
section: AI
---

<!-- ::demo name="citation" -->

```tsx
<Citations aria-label="Sources for this answer">
  <p>
    Revenue grew 12% last quarter <Citation sources={[acme, newsroom]} />.
  </p>
  <div>
    <CitationSource source={acme} />
    <CitationSource source={newsroom} />
  </div>
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
  CitationSource,
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
CitationSource
```

## Citations

Wrap an answer, or a page of them, in `Citations`. It renders the one card every citation inside opens, so the card moves to each citation as you hover it.

## Citation

Pass every source for one claim in `sources`. The pill shows the first and counts the rest (`+1`); the card lists each, linked to its page. Other props, such as `onClick`, go to the trigger link.

**The card is a preview, so list every source outside it too.** The pill links only to its first source, and the card opens on hover or focus, never on a tap. Render a [`CitationSource`](#source) per source under the answer, as the preview does, so touch and keyboard users reach the rest.

```tsx
<Citation
  onClick={(event) => {
    event.preventDefault();
    openSources(acme);
  }}
  sources={[acme]}
/>
```

### Source

Use `CitationSource` to list sources outside the card, under the answer or in a side panel. It renders the card's row, and `aria-current="true"` holds its hover fill on the one the reader opened.

<!-- ::demo name="citation-source" -->

```tsx
<div>
  <CitationSource source={acme} />
  <CitationSource aria-current="true" source={newsroom} />
  <CitationSource source={docs} />
</div>
```

## Group

List the sources a search found in a `CitationGroup`, a row that wraps. To count the ones left out, put the last citation in `CitationGroupMore` with the count. It keeps the two on one line, so the count never wraps alone.

<!-- ::demo name="citation-group" -->

```tsx
<Citations aria-label="Sources found">
  <CitationGroup>
    <Citation sources={[acme]} />
    <Citation sources={[newsroom]} />
    <CitationGroupMore count={42}>
      <Citation sources={[docs]} />
    </CitationGroupMore>
  </CitationGroup>
</Citations>
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label | Component | Actions |
| --- | --- | --- |
| Acme Business Journal, Acme Beats Forecasts as Revenue Grows 12% on New Plans, October 9, 2026 and 1 more | button | `press` |
| shadcn, Components You Copy, Own and Build On, September 24, 2026 | button | `press` |
| Sources for this answer | hover-card | `setOpen`, `press` |

A card with one pill is named by its pill. A card shared by several pills takes the name from `Citations`' `aria-label`, "Sources" by default, like the preview's "Sources for this answer". **`setOpen` on a shared card opens it empty.** No pill has picked its sources yet.

Each `CitationSource` is a button named by its source, so `press` opens that page without the card.

## API Reference

| Part | Adds |
| --- | --- |
| `Citations` | The shared `HoverCardContent`, listing a `CitationSource` per source |
| `CitationSource` | A link to the source's page, listed for agents as a button, that lights on hover and while `aria-current`: the logo and name, the headline and description each clamped to 2 lines, the date |
| `CitationGroup` | A row that wraps, `space.xxs` apart |
| `CitationGroupMore` | Its children and `{count} more` in `textMuted`, as one unit that doesn't wrap apart |
| `Citation` | A [Badge](/docs/components/badge) rendering a [Hover Card](/docs/components/hover-card) trigger link to the first source: its logo as a bare favicon, its name cut at 160px, then `+N` |

| Prop | Part | Type |
| --- | --- | --- |
| `aria-label` | `Citations` | `string`, `"Sources"` by default: names the shared card for screen readers and agents; give each answer's `Citations` its own when a page shows several |
| `aria-label` | `CitationSource` | `string`, the source's name, title and date by default, joined by commas: names the link for screen readers and agents |
| `sources` | `Citation` | At least one `{ name, title, url, description?, icon?, date? }`; a globe shows without `icon` |
| `source` | `CitationSource` | One `{ name, title, url, description?, icon?, date? }` |
| `count` | `CitationGroupMore` | `number`, the sources not shown |
| `sx` | every part | `Sx`, applied last: on the card for `Citations`, the pill for `Citation`, the link for `CitationSource`, the row for `CitationGroup` and the unit for `CitationGroupMore` |

`Citation` passes its other props to the [Hover Card](/docs/components/hover-card) trigger, and `CitationSource` its other props, `ref` among them, to a [UI SDK Button](https://ui-sdk.dev/docs/react/components/button) rendering the `<a>`; each sets `href`, `rel` and `target` itself.
