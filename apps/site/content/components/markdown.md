---
title: Markdown
description: An answer's markdown, with tables and code blocks.
section: AI
---

<!-- ::demo name="markdown" -->

```tsx
<Message from="assistant">
  <MessageContent>
    <Markdown highlighter={highlightCode}>{answer}</Markdown>
  </MessageContent>
</Message>
```

## Installation

<!-- ::install name="markdown" -->

## Usage

```tsx
import { Markdown } from "@/components/ai/markdown";
```

```tsx
<Markdown>{answer}</Markdown>
```

Tables render on [Table](/docs/components/table). Code blocks get a [Copy Button](/docs/components/copy-button). Links open in a new tab.

## Streaming

Set `streaming` while the answer arrives. Unclosed code blocks, lists and emphasis render as if they were closed.

<!-- ::demo name="markdown-streaming" -->

```tsx
<Markdown streaming={status === "streaming"}>{text}</Markdown>
```

## Highlighter

Pass a `highlighter` from [TanStack Highlight](https://tanstack.com/highlight) to color code blocks. Add its theme CSS once on the page.

```tsx
import { createHighlighter } from "@tanstack/highlight/core";
import { json, shell, ts } from "@tanstack/highlight/languages";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";

const highlighter = createTanStackMarkdownHighlighter(
  createHighlighter({ languages: [json, shell, ts] })
);

<Markdown highlighter={highlighter}>{answer}</Markdown>;
```

## Components

Use `components` to replace a tag, or render a custom tag from an extension, such as a citation.

```tsx
<Markdown
  components={{ "md-citation": AnswerCitation }}
  extensions={[citations]}
>
  {answer}
</Markdown>
```

## API Reference

| Prop        | Adds                                                  |
| ----------- | ----------------------------------------------------- |
| `streaming` | Renders unclosed syntax as closed while text arrives. |
| `sx`        | Styles on the wrapping `div`, applied last.           |

Headings start at `h3`, under the page's own. For the rest, see [TanStack Markdown](https://tanstack.com/markdown).
