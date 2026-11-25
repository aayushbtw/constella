---
title: Suggestions
description: Starter prompts as a scrolling row of pills, for an empty chat.
section: AI
---

<!-- ::demo name="suggestions" -->

```tsx
<Suggestions aria-label="Suggestions">
  {suggestions.map((suggestion) => (
    <Suggestion key={suggestion} onClick={send} suggestion={suggestion} />
  ))}
</Suggestions>
```

## Installation

<!-- ::install name="suggestions" -->

## Usage

```tsx
import { Suggestion, Suggestions } from "@/components/ai/suggestions";
```

```tsx
<Suggestions aria-label="Suggestions">
  <Suggestion onClick={send} suggestion="What changed since last month?" />
</Suggestions>
```

## Composition

```
Suggestions
└── Suggestion
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label                          | Component   | Actions |
| ------------------------------ | ----------- | ------- |
| Summarize this week's sales    | button      | `press` |
| What changed since last month? | button      | `press` |
| Where are we behind plan?      | button      | `press` |
| Draft a reply to Alex          | button      | `press` |
| Find invoices due this week    | button      | `press` |
| No name                        | scroll-area | None    |

Each chip is named by its text. A press reaches `onClick` with the press's details, whose `source` is `"agent"`. The unnamed entry is the row's scroll area, listed with no name and no actions.

## API Reference

| Part | Adds |
| --- | --- |
| `Suggestions` | A `role="group"` row in a [Scroll Area](/docs/components/scroll-area) with no scrollbar, its edges faded by [Scroll Fade](/docs/components/scroll-fade) |
| `Suggestion` | An `outline` `sm` [Button](/docs/components/button). Shows `suggestion` unless given children, and passes it to `onClick` with the press's details (`source`). Return a promise to keep the chip pending until it settles |

`Suggestions` takes `sx`, applied last. `Suggestion` takes every Button prop.
