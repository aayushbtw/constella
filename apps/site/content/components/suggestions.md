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

## API Reference

| Part | Adds |
| --- | --- |
| `Suggestions` | A `role="group"` row in a [Scroll Area](/docs/components/scroll-area) with no scrollbar, its edges faded by [Scroll Fade](/docs/components/scroll-fade) |
| `Suggestion` | An `outline` `sm` [Button](/docs/components/button). Shows `suggestion` unless given children, and passes it to `onClick` |

`Suggestions` takes `sx`, applied last. `Suggestion` takes every Button prop.
