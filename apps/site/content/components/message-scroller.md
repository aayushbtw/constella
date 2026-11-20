---
title: Message Scroller
description: Scrolls a conversation, sticking to the newest message as it streams.
section: AI
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
} from "@/components/ai/message-scroller";
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

## Agent

What `agent.snapshot()` lists for the preview example:

| Label         | Component | Actions             |
| ------------- | --------- | ------------------- |
| Copy          | button    | `press`             |
| Good answer   | button    | `press`             |
| Retry         | button    | `press`             |
| Scroll to end | button    | None while disabled |
| Message       | textarea  | `setValue`, `clear` |
| Attach        | button    | `press`             |
| Send          | button    | None while disabled |

Only Scroll to end is Message Scroller's own entry. Copy, Good answer and Retry come from the example's [Message](/docs/components/message), and Message, Attach and Send from its [Prompt Input](/docs/components/prompt-input). At the end of the thread, Scroll to end is disabled. With more below, a `press` scrolls to the end. Message Scroller is built on `@shadcn/react`, so it doesn't pass ui-sdk's change `details` on.

## API Reference

| Part | Adds |
| --- | --- |
| `MessageScrollerItem` | `messageId`; `scrollAnchor` |
| `MessageScrollerButton` | A pill that rises in while there's more below; named "Scroll to end" unless given `aria-label` |
| `useMessageScroller` | `scrollToEnd`, `scrollToStart`, `scrollToMessage` |

Every part takes `sx`, applied last.
