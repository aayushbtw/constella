---
title: Message
description: One turn of a conversation, from the user or the assistant.
draft: true
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
} from "@/components/ui/message";
```

A user's message sits at the end, in a bubble; an answer reads as the page. Put the answer's actions in `MessageActions`, like a [Copy Button](/docs/components/copy-button).

## Composition

```
Message
├── MessageContent
└── MessageActions
```

## API Reference

| Part      | Adds                              |
| --------- | --------------------------------- |
| `Message` | `from`: `"user"` or `"assistant"` |

Every part takes `sx`, applied last, and renders a `div`.
