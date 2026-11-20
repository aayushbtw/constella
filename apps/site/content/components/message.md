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

The agent sees a reply's actions, not its text. Give each action a name, like the example's Copy, Good answer and Retry. **The actions repeat on every reply in a chat**, so a press by name matches each reply's button and fails. Press by the `ref` from the snapshot instead.

## API Reference

| Part      | Adds                              |
| --------- | --------------------------------- |
| `Message` | `from`: `"user"` or `"assistant"` |

Every part takes `sx`, applied last, and renders a `div`.
