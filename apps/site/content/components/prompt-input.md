---
title: Prompt Input
description: The chat composer, growing with its text.
section: AI
---

<!-- ::demo name="prompt-input" -->

```tsx
<PromptInput onSubmit={send}>
  <PromptInputTextarea onValueChange={setText} value={text} />
  <PromptInputFooter>
    <PromptInputTools>
      <InputGroupButton aria-label="Attach" size="icon-sm">
        <HugeiconsIcon icon={Attachment01Icon} />
      </InputGroupButton>
    </PromptInputTools>
    <PromptInputSubmit onStop={stop} state={status} />
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
} from "@/components/ai/prompt-input";
```

`PromptInput` is a form around an [Input Group](/docs/components/input-group). Enter submits it; Shift+Enter, and Enter while an IME is composing, add a line. The text grows to six lines, then scrolls.

## Composition

```
PromptInputWell
├── PromptInputBar
│   └── PromptInputBarButton
├── PromptInput
│   ├── PromptInputHeader
│   ├── PromptInputTextarea
│   └── PromptInputFooter
│       ├── PromptInputTools
│       └── PromptInputSubmit
└── PromptInputBar

PromptInputCommand
├── PromptInput
│   ├── PromptInputCommandTextarea
│   └── PromptInputFooter
└── PromptInputCommandContent
    ├── PromptInputCommandEmpty
    └── PromptInputCommandList
        └── PromptInputCommandItem
            └── PromptInputCommandItemIcon
```

## History

Each prompt you send joins the composer's history, like a terminal's. ArrowUp brings back the one before, and ArrowDown goes forward again, back to the draft you were typing. It's on, with nothing to pass, and each `PromptInput` keeps its own. A prompt joins it when it submits while `PromptInputSubmit` can send. While Send is disabled or busy, or Stop has taken its place, Enter does nothing, so a prompt typed while an answer streams stays out.

| Key | Where the caret is | Does |
| --- | --- | --- |
| ArrowUp | First line, or an empty field | Brings back the previous prompt |
| ArrowDown | Last line | Brings back the next prompt, then the draft |

On any other line the arrows move the caret. They also stand aside while a command list is open, while text is selected, while an IME is composing, and with a modifier held. A recalled prompt is set through `onValueChange`, so a controlled draft follows it. **To use ArrowUp for something else, like editing the last message, call `event.preventDefault()` in `onKeyDown`;** history leaves a handled key alone.

## Prompt Input Command

Wrap the prompt input in a `PromptInputCommand`, swap its textarea for `PromptInputCommandTextarea`, and put a `PromptInputCommandList` in a `PromptInputCommandContent` to open slash commands over the composer. The list looks like a [Command](/docs/components/command). A `/` at the start of the draft opens it, and typing narrows it. Enter, Tab or a click inserts the pick into the draft, and undo brings the query back. Esc closes the list until the `/` is typed again. The `triggers` are ui-sdk Trigger Menu's, so `@` mentions work the same way.

<!-- ::demo name="prompt-input-command" -->

```tsx
<PromptInputCommand
  triggers={[
    { boundary: "start", char: "/", insert: (item) => `/${item.value} ` },
  ]}
>
  <PromptInput onSubmit={send}>
    <PromptInputCommandTextarea
      onValueChange={setText}
      placeholder="Ask anything, or type / for commands…"
      value={text}
    />
    <PromptInputFooter>…</PromptInputFooter>
  </PromptInput>
  <PromptInputCommandContent>
    <PromptInputCommandList>
      {commands.map((command) => (
        <PromptInputCommandItem
          key={command.value}
          label={command.label}
          value={command.value}
        >
          {command.label}
        </PromptInputCommandItem>
      ))}
    </PromptInputCommandList>
  </PromptInputCommandContent>
</PromptInputCommand>
```

## Prompt Input Header

Put an [Attachment](/docs/components/attachment) group in a `PromptInputHeader`, above the text. A submit can send files with no text.

<!-- ::demo name="prompt-input-header" -->

```tsx
<PromptInput onSubmit={send}>
  <PromptInputHeader>
    <AttachmentGroup>
      {files.map((file) => (
        <Attachment key={file} size="sm">
          …
        </Attachment>
      ))}
    </AttachmentGroup>
  </PromptInputHeader>
  <PromptInputTextarea />
  <PromptInputFooter>…</PromptInputFooter>
</PromptInput>
```

## Prompt Input Well

Put the prompt input in a `PromptInputWell`, a tinted tray, when it needs context around it, like a project or connected apps. A `PromptInputBar` is a row above or below it, usually on one side. Its controls line up with the composer's.

<!-- ::demo name="prompt-input-well" -->

```tsx
<PromptInputWell>
  <PromptInputBar>
    <PromptInputBarButton>
      <HugeiconsIcon data-icon="inline-start" icon={Folder01Icon} />
      Select a project
    </PromptInputBarButton>
  </PromptInputBar>
  <PromptInput onSubmit={send}>…</PromptInput>
</PromptInputWell>
```

## Prompt Input Submit

Pass the chat's `status` as `state`. While it's `streaming`, a separate Stop button takes Send's place and calls `onStop`. Name it with `stopLabel`. If the leaving button held focus, focus moves to the new one, or to the textarea when Send comes back disabled. Enter sends only while Send is shown, enabled and not busy, so `onSubmit` needn't check `status`.

| State       | Button     |
| ----------- | ---------- |
| `ready`     | Send       |
| `submitted` | Send, busy |
| `streaming` | Stop       |

```tsx
<PromptInputSubmit onStop={stop} state={status} />
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label   | Component | Actions             |
| ------- | --------- | ------------------- |
| Message | textarea  | `setValue`, `clear` |
| Attach  | button    | `press`             |
| Send    | button    | None while disabled |

Name the textarea with `aria-label`, like the example's "Message". The agent sets it with `setValue`, then presses Send. While the answer streams, Send leaves the snapshot and the agent finds Stop by its name. In the example, Send is disabled until the message has text. **The agent can't insert a slash command yet.** ui-sdk beta.13's `insert` puts the raw text in place of the query and skips the command's own `insert`.

## API Reference

| Part | Adds |
| --- | --- |
| `PromptInput` | Skips a submit while its `PromptInputSubmit` can't send, and records each prompt that goes through for its textarea's history |
| `PromptInputTextarea` | Submits on Enter. ArrowUp and ArrowDown step through earlier prompts. Takes every Textarea prop but `controller`, which the history writes through |
| `PromptInputCommand` | ui-sdk's [Trigger Menu](https://ui-sdk.dev/docs/react/components/trigger-menu) root. Takes `triggers`, and holds a visually hidden status that tells screen readers how many commands match |
| `PromptInputCommandTextarea` | `PromptInputTextarea` as the trigger menu's field. While the list is open, the arrows move the highlight, Enter and Tab pick, and Esc closes the list and keeps the text. Only plain Enter picks. Enter sends, and so do Ctrl+Enter on a Mac and Meta+Enter elsewhere; other modified Enters do neither. Control it with `value` and `onValueChange`, not `onChange`: a draft synced in `onChange` loses the typed `/`, so `value` requires `onValueChange` |
| `PromptInputCommandContent` | The popup on the composer, as wide as it, above it or below it when there's no room. Takes `side` (default `"top"`), `align` (default `"start"`) and `sideOffset` |
| `PromptInputCommandList` | Trigger Menu's list, drawn as a Command list |
| `PromptInputCommandItem` | A Command row. A pick runs its `onSelect`, then inserts what the trigger's `insert` returns, or `/`, its `label` and a space |
| `PromptInputCommandItemIcon` | The command's icon, before its text and kept from shrinking. Screen readers, filtering and the inserted text skip it. `mirror` flips it in right-to-left text |
| `PromptInputCommandEmpty` | Command's empty message, shown while nothing matches. Rendered, it keeps the list open with no match, so Enter doesn't send until Esc closes the list. Without it, the list closes and Enter sends |
| `PromptInputHeader` | Above the text, for attachments |
| `PromptInputWell` | A tray around the prompt input and its bars |
| `PromptInputBar` | A row in the well |
| `PromptInputBarButton` | A ghost `sm` pill in secondary text |
| `PromptInputSubmit` | `state`: `"ready"`, `"submitted"` or `"streaming"`; `onStop`; `stopLabel`, Stop's name (default `"Stop"`). Stop takes only `size`, `variant` and `sx`; other props go to Send. The form submits only while Send is shown, enabled and not busy |

Every part takes `sx`, applied last.
