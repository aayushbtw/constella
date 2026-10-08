---
title: Message Scroller
description: Scrolls a conversation, sticking to the newest message as it streams.
draft: true
---

<!-- ::demo name="chat" -->

```tsx
<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport aria-label="Conversation">
      <MessageScrollerContent>
        {turns.map((turn) => (
          <MessageScrollerItem
            key={turn.id}
            messageId={turn.id}
            scrollAnchor={turn.from === "user"}
          >
            <Message from={turn.from}>…</Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

## Installation

<!-- ::install name="message-scroller" -->

## Usage

```tsx
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
```

It opens at the newest message and follows a streaming answer while the reader is at the end; scrolled up, it stays put and shows the button to jump back. History loaded above keeps the reader's place. Mark each user message a `scrollAnchor`, so a new question scrolls to the top. The behavior is shadcn's `@shadcn/react/message-scroller`.

## Composition

```
MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       └── MessageScrollerItem
    └── MessageScrollerButton
```

## API Reference

| Part                    | Adds                                              |
| ----------------------- | ------------------------------------------------- |
| `MessageScrollerItem`   | `messageId`; `scrollAnchor`                       |
| `MessageScrollerButton` | A pill that rises in while there's more below     |
| `useMessageScroller`    | `scrollToEnd`, `scrollToStart`, `scrollToMessage` |

Every part takes `sx`, applied last.
