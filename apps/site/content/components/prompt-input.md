---
title: Prompt Input
description: The chat composer, growing with its text.
---

<!-- ::demo name="prompt-input" -->

```tsx
<PromptInput onSubmit={send}>
  <PromptInputTextarea
    onChange={(event) => setText(event.target.value)}
    value={text}
  />
  <PromptInputFooter>
    <PromptInputTools>
      <InputGroupButton aria-label="Attach" size="icon-sm">
        <HugeiconsIcon icon={Attachment01Icon} />
      </InputGroupButton>
    </PromptInputTools>
    <PromptInputSubmit onStop={stop} status={status} />
  </PromptInputFooter>
</PromptInput>
```

## Installation

<!-- ::install name="prompt-input" -->

## Usage

```tsx
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
```

`PromptInput` is a form around an [Input Group](/docs/components/input-group). Enter submits it; Shift+Enter, and Enter while an IME is composing, add a line. The text grows to six lines, then scrolls.

## Composition

```
PromptInput
├── PromptInputHeader
├── PromptInputTextarea
└── PromptInputFooter
    ├── PromptInputTools
    └── PromptInputSubmit
```

## Prompt Input Header

Put attachments in a `PromptInputHeader`, above the text. A submit can send files with no text.

<!-- ::demo name="prompt-input-header" -->

```tsx
<PromptInput onSubmit={send}>
  <PromptInputHeader>
    {files.map((file) => (
      <Badge key={file} variant="outline">
        {file}
      </Badge>
    ))}
  </PromptInputHeader>
  <PromptInputTextarea />
  <PromptInputFooter>…</PromptInputFooter>
</PromptInput>
```

## Prompt Input Submit

Pass the answer's `status`. While it's `streaming`, the arrow swaps to a stop square and the button calls `onStop`.

| Status      | Button     |
| ----------- | ---------- |
| `ready`     | Send       |
| `submitted` | Send, busy |
| `streaming` | Stop       |

```tsx
<PromptInputSubmit onStop={stop} status={status} />
```

## API Reference

| Part | Adds |
| --- | --- |
| `PromptInputTextarea` | Submits on Enter |
| `PromptInputHeader` | Above the text, for attachments |
| `PromptInputSubmit` | `status`: `"ready"`, `"submitted"` or `"streaming"`; `onStop` |

Every part takes `sx`, applied last.
