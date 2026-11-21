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

It opens at the newest message and follows a streaming answer while the reader is at the end. Scrolled up, it keeps the reader's place, even as history loads above, and shows the button to jump back. Mark each user message a `scrollAnchor`: a new question scrolls to the top, with the end of the turn before it in view, and stays there while the answer streams in below. The behavior is ui-sdk's [`createStickToBottom`](https://ui-sdk.dev/docs/core/behaviors/lists#logs-that-follow-their-end).

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

Only Scroll to end is Message Scroller's own entry. Copy, Good answer and Retry come from the example's [Message](/docs/components/message), and Message, Attach and Send from its [Prompt Input](/docs/components/prompt-input). At the end of the thread, Scroll to end is disabled. With more below, a `press` scrolls to the end.

## API Reference

| Part | Adds |
| --- | --- |
| `MessageScrollerProvider` | `defaultScrollPosition`: `"end"` (default) or `"start"` |
| `MessageScrollerItem` | `messageId`, for `scrollToMessage`; `scrollAnchor` |
| `MessageScrollerButton` | A pill that rises in while there's more below; named "Scroll to end" unless given `aria-label` |
| `useMessageScroller` | `scrollToEnd`, `scrollToStart`, `scrollToMessage(messageId)`, each taking `{ behavior }` |
| `useMessageScrollerState` | `following`, `atBottom`, `unseen` |

| Attribute | On | Present while |
| --- | --- | --- |
| `data-pending-scroll` | `MessageScrollerViewport` | The opening position isn't applied yet; the viewport stays hidden |
| `data-visible` | `MessageScrollerButton` | The reader is away from the end and not following it |
| `data-unseen` | `MessageScrollerButton` | Content arrived below while away; clears at the end |

Every part takes `sx`, applied last.
