---
title: Reasoning
description: The model's thinking before it answers, closed to one line.
section: AI
draft: true
---

<!-- ::demo name="reasoning" -->

```tsx
<Reasoning>
  <ReasoningTrigger>
    <BrainIcon />
    Thought for 4s
  </ReasoningTrigger>
  <ReasoningContent>{reasoning}</ReasoningContent>
</Reasoning>
```

## Installation

<!-- ::install name="reasoning" -->

## Usage

```tsx
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
```

```tsx
<Reasoning>
  <ReasoningTrigger>Thought for 4s</ReasoningTrigger>
  <ReasoningContent>{reasoning}</ReasoningContent>
</Reasoning>
```

## Composition

```
Reasoning
├── ReasoningTrigger
└── ReasoningContent
```

## Controlled

Use `open` and `onOpenChange` to open it while the model thinks and close it once the answer starts. Wrap the label in a [Shimmer](/docs/components/shimmer) while it runs.

<!-- ::demo name="reasoning-controlled" -->

```tsx
<Reasoning onOpenChange={setOpen} open={open}>
  <ReasoningTrigger>
    {thinking ? <Shimmer>Thinking</Shimmer> : `Thought for ${seconds}s`}
  </ReasoningTrigger>
  <ReasoningContent>{reasoning}</ReasoningContent>
</Reasoning>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Reasoning` | A [Collapsible](/docs/components/collapsible) root |
| `ReasoningTrigger` | A chevron after the children |
| `ReasoningContent` | Secondary text on a rail, lined up with the trigger's label |

Every part takes `sx`, applied last, and Base UI [Collapsible](https://base-ui.com/react/components/collapsible) props.
