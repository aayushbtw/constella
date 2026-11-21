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

It opens at the newest message and follows a streaming answer while the reader is at the end. Scrolled up, it keeps the reader's place and shows the button to jump back. Mark each user message a `scrollAnchor`. A new question then scrolls to the top, with the end of the turn before it in view, and stays there while the answer streams in below. The behavior is ui-sdk's [`createStickToBottom`](https://ui-sdk.dev/docs/core/behaviors/lists#logs-that-follow-their-end), on a [Scroll Area](/docs/components/scroll-area) viewport.

## Composition

```
MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       └── MessageScrollerItem
    └── MessageScrollerButton
```

## Older Messages

Call `prepend` from `useMessageScroller` right before adding older messages above, so the message in view stays where it is. At the end, the thread stays at the end.

```tsx
const { prepend } = useMessageScroller();

async function loadOlder() {
  const older = await fetchOlderTurns();
  prepend();
  setTurns((turns) => [...older, ...turns]);
}
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label         | Component   | Actions             |
| ------------- | ----------- | ------------------- |
| Copy          | button      | `press`             |
| Good answer   | button      | `press`             |
| Retry         | button      | `press`             |
| Conversation  | scroll-area | None                |
| Scroll to end | button      | None while disabled |
| Message       | textarea    | `setValue`, `clear` |
| Attach        | button      | `press`             |
| Send          | button      | None while disabled |

Conversation and Scroll to end are Message Scroller's own entries. Conversation is its Scroll Area, named by the viewport's `aria-label`, with nothing to act on. Copy, Good answer and Retry come from the example's [Message](/docs/components/message), and Message, Attach and Send from its [Prompt Input](/docs/components/prompt-input). At the end of the thread, Scroll to end is disabled. With more below, a `press` scrolls to the end.

Each `MessageScrollerItem` is a row, so a reply's actions carry its opening words: `press` "Copy Constella" copies the reply that starts "Constella". Those words also join every action's name, so a reply that says "send" makes a bare "Send" match its actions too.

## API Reference

| Part | Adds |
| --- | --- |
| `MessageScrollerProvider` | `defaultScrollPosition`: `"end"` (default) or `"start"` |
| `MessageScrollerViewport` | Scroll Area's bar; a tab stop only while it overflows and holds no control |
| `MessageScrollerContent` | An `ol` that announces each new turn (`aria-live="polite"`); **hold only `MessageScrollerItem`s in it**, since a list takes no other children |
| `MessageScrollerItem` | An `li`; `messageId`, for `scrollToMessage`; `scrollAnchor` |
| `MessageScrollerButton` | A pill that rises in while there's more below; named "Scroll to end" unless given `aria-label` |
| `useMessageScroller` | `scrollToEnd`, `scrollToStart`, `scrollToMessage(messageId)`, each taking `{ behavior }`; `prepend()` |
| `useMessageScrollerState` | `following`, `atBottom`, `unseen` |

| Attribute | On | Present while |
| --- | --- | --- |
| `data-pending-scroll` | `MessageScrollerViewport` | The opening position isn't applied yet; the viewport stays hidden |
| `data-visible` | `MessageScrollerButton` | The reader is away from the end and not following it |
| `data-unseen` | `MessageScrollerButton` | Content arrived below while away; clears at the end |

Every part takes `sx`, applied last. For the rest, see [UI SDK Scroll Area](https://ui-sdk.dev/docs/react/components/scroll-area).
