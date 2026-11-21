---
title: Message
description: One turn of a conversation, from the user or the assistant.
section: AI
---

<!-- ::demo name="message" -->

```tsx
<Message from="user">
  <MessageContent>What is Constella?</MessageContent>
</Message>
<Message from="assistant">
  <MessageContent>{answer}</MessageContent>
  <MessageActions>
    <CopyButton value={answer} />
  </MessageActions>
</Message>
```

## Installation

<!-- ::install name="message" -->

## Usage

```tsx
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/components/ai/message";
```

A user's message sits at the end, in a bubble; an answer reads as the page. Put the answer's actions in `MessageActions`, like a [Copy Button](/docs/components/copy-button).

## Composition

```
Message
├── MessageContent
└── MessageActions
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label       | Component | Actions |
| ----------- | --------- | ------- |
| Copy        | button    | `press` |
| Good answer | button    | `press` |
| Retry       | button    | `press` |

Give each action a name, like the example's Copy, Good answer and Retry. In a [Message Scroller](/docs/components/message-scroller), each `MessageScrollerItem` is a row, so an action's row text is its reply's opening words, and `press` "Copy Constella" copies the reply that starts "Constella". A bare "Copy" matches every reply's button and fails. **A standalone Message has no row**, so press its actions by the `ref` from the snapshot. Two replies that open with the same words need a `ref` too.

## API Reference

| Part      | Adds                              |
| --------- | --------------------------------- |
| `Message` | `from`: `"user"` or `"assistant"` |

Every part takes `sx`, applied last, and renders a `div`.
