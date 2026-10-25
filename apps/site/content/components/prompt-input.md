---
title: Prompt Input
description: The chat composer, growing with its text.
section: AI
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
    ├── CommandEmpty
    └── CommandList
        └── CommandItem
```

## Prompt Input Command

Wrap the prompt input in a `PromptInputCommand`, swap its textarea for `PromptInputCommandTextarea`, and put a [Command](/docs/components/command) list in a `PromptInputCommandContent` to open slash commands over the composer. You set `open` and `query` from the draft, and a pick runs the item's `onClick` and leaves the draft to you.

<!-- ::demo name="prompt-input-command" -->

```tsx
// query = /^\/(?<query>\S*)$/u.exec(text)?.groups?.query
<PromptInputCommand
  items={commands}
  onOpenChange={(open) => {
    if (!open) setDismissed(true);
  }}
  onValueChange={(value) => {
    setText(value);
    setDismissed(false);
  }}
  open={query !== undefined && !dismissed}
  query={query ?? ""}
  value={text}
>
  <PromptInput onSubmit={send}>
    <PromptInputCommandTextarea placeholder="Ask anything, or type / for commands…" />
    <PromptInputFooter>…</PromptInputFooter>
  </PromptInput>
  <PromptInputCommandContent>
    <CommandEmpty>No commands found.</CommandEmpty>
    <CommandList>
      {(command: SlashCommand) => (
        <CommandItem
          key={command.value}
          onClick={() => setText(`/${command.value} `)}
          value={command}
        >
          {command.label}
        </CommandItem>
      )}
    </CommandList>
  </PromptInputCommandContent>
</PromptInputCommand>
```

**Find the textarea by its label, not its role:** while the list is open it's a `combobox`, with `aria-expanded` and the highlighted item as `aria-activedescendant`; closed, it's a plain `textbox`.

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

Pass the chat's `status` as `state`. While it's `streaming`, the arrow swaps to a stop square and the button calls `onStop`.

| State       | Button     |
| ----------- | ---------- |
| `ready`     | Send       |
| `submitted` | Send, busy |
| `streaming` | Stop       |

```tsx
<PromptInputSubmit onStop={stop} state={status} />
```

## API Reference

| Part | Adds |
| --- | --- |
| `PromptInputTextarea` | Submits on Enter |
| `PromptInputCommand` | Base UI's [Autocomplete](https://base-ui.com/react/components/autocomplete) root, its first item highlighted. `open`, `query` and `value` are required, and a pick never writes the item into `value` |
| `PromptInputCommandTextarea` | `PromptInputTextarea` as the autocomplete's input, a plain textarea while closed. While open, the arrows move the highlight, Enter, Cmd/Ctrl/Alt+Enter and Tab pick, and Esc closes the list and keeps the text. Enter with no match closes the list and sends the draft |
| `PromptInputCommandContent` | The popup on the composer, as wide as it, above it or below it when there's no room. Takes `side` (default `"top"`), `align` (default `"start"`) and `sideOffset` |
| `PromptInputHeader` | Above the text, for attachments |
| `PromptInputWell` | A tray around the prompt input and its bars |
| `PromptInputBar` | A row in the well |
| `PromptInputBarButton` | A ghost `sm` pill in secondary text |
| `PromptInputSubmit` | `state`: `"ready"`, `"submitted"` or `"streaming"`; `onStop` |

Every part takes `sx`, applied last.
