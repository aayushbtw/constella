---
title: Trace
description: The steps an agent takes, one line each, that open, link or show a status.
section: AI
---

<!-- ::demo name="trace" -->

```tsx
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <BrainIcon />
        </TraceIcon>
        <TraceTitle>Thought for 5s</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>{reasoning}</TraceCollapsibleContent>
  </TraceCollapsible>
  <TraceLine>
    <TraceIcon>
      <CheckIcon />
    </TraceIcon>
    <TraceTitle>Ran pnpm --version</TraceTitle>
  </TraceLine>
</Trace>
```

## Installation

<!-- ::install name="trace" -->

## Usage

```tsx
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ai/trace";
```

```tsx
<Trace>
  <TraceLine>
    <TraceIcon>
      <GlobeIcon />
    </TraceIcon>
    <TraceTitle>Searched the web</TraceTitle>
  </TraceLine>
</Trace>
```

## Composition

```text
Trace
├── TraceLine
│   ├── TraceIcon
│   ├── TraceTitle
│   ├── TraceDescription
│   └── TraceIcon (indicator)
└── TraceCollapsible
    ├── TraceCollapsibleTrigger
    │   └── TraceLine
    └── TraceCollapsibleContent
```

Every step is a `TraceLine`. To make one open, link or show a dialog, wrap it in that element.

## Trace Line

Use a `TraceLine` on its own for a step with nothing more to show. It reads as plain text, not a tab stop. `TraceIcon` is hidden from screen readers, so write the title as a sentence: "Edited trace.tsx", not "trace.tsx".

<!-- ::demo name="trace-line" -->

```tsx
<TraceLine>
  <TraceIcon>
    <GlobeIcon />
  </TraceIcon>
  <TraceTitle>Searched the web</TraceTitle>
</TraceLine>
```

## Status

Set `status` on `TraceLine` when a step is running, has failed or hasn't started. Status shows as color and motion, so say it in the title too.

| Status    | Use for                                                        |
| --------- | -------------------------------------------------------------- |
| none      | Work that is done: "Ran pnpm install"                          |
| `running` | Work in progress, in the present tense: "Running pnpm build"   |
| `error`   | Work that failed, said in the title: "Failed to run pnpm lint" |
| `pending` | Work that hasn't started, such as a plan step: "Run pnpm test" |

<!-- ::demo name="trace-status" -->

```tsx
<TraceLine status="running">
  <TraceIcon>
    <Spinner aria-hidden />
  </TraceIcon>
  <TraceTitle>Running pnpm build</TraceTitle>
</TraceLine>
```

## Trace Description

Put a count, a duration or a diff stat in a `TraceDescription` after the title. It doesn't truncate.

<!-- ::demo name="trace-description" -->

```tsx
<TraceLine>
  <TraceIcon>
    <FileEditIcon />
  </TraceIcon>
  <TraceTitle>Edited trace.tsx</TraceTitle>
  <TraceDescription>+42 −8</TraceDescription>
</TraceLine>
```

## Trace Collapsible

Wrap the line in a `TraceCollapsible` to show more when it opens. Put the `TraceLine` in `TraceCollapsibleTrigger` and the detail in `TraceCollapsibleContent`. Use `defaultOpen` to start open.

<!-- ::demo name="trace-collapsible" -->

```tsx
<TraceCollapsible defaultOpen>
  <TraceCollapsibleTrigger>
    <TraceLine>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>Thought for 5s</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{reasoning}</TraceCollapsibleContent>
</TraceCollapsible>
```

### Controlled

Use `open` with `onOpenChange`. To open a line while it runs and let the reader's click win, pass `open ?? running`, as [Reasoning](#reasoning) does.

```tsx
const [open, setOpen] = useState<boolean>();

<TraceCollapsible onOpenChange={setOpen} open={open ?? running}>
  …
</TraceCollapsible>;
```

## Group

Put lines that sit together in a `Trace`.

<!-- ::demo name="trace-group" -->

```tsx
<Trace>
  <TraceLine>…</TraceLine>
  <TraceLine>…</TraceLine>
  <TraceLine>…</TraceLine>
</Trace>
```

## Link

Wrap the `TraceLine` in a link styled with `traceActionStyles()`. For a new tab, end the line with an arrow icon.

<!-- ::demo name="trace-link" -->

```tsx
<a
  href="https://acme.com/docs/ci"
  target="_blank"
  {...stylex.props(traceActionStyles())}
>
  <TraceLine>
    <TraceIcon>
      <GlobeIcon />
    </TraceIcon>
    <TraceTitle>Continuous integration</TraceTitle>
    <TraceIcon>
      <ArrowUpRightIcon />
    </TraceIcon>
  </TraceLine>
</a>
```

## Reasoning

Use a [controlled](#controlled) `TraceCollapsible` for the model's thinking, so it opens while the model thinks and closes once the answer starts.

<!-- ::demo name="trace-reasoning" -->

```tsx
<TraceCollapsible onOpenChange={setOpen} open={open ?? running}>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought for 5s"}</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>{reasoning}</TraceCollapsibleContent>
</TraceCollapsible>
```

## Tool

Put a `Trace` of tool calls in a `TraceCollapsible`, set each line's `status` as its call starts and ends, and swap its icon with a [Swap Icon](/docs/components/swap-icon). A finished call has no status.

<!-- ::demo name="trace-tool" -->

```tsx
<TraceCollapsible defaultOpen>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        <WrenchIcon />
      </TraceIcon>
      <TraceTitle>{running ? "Using 3 tools" : "Used 3 tools"}</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>
      <TraceLine status={status === "done" ? undefined : status}>
        <TraceIcon>
          <SwapIcon value={status}>
            <SwapIconItem value="running">
              <Spinner aria-hidden />
            </SwapIconItem>
            <SwapIconItem value="done">
              <CalendarIcon />
            </SwapIconItem>
            <SwapIconItem value="error">
              <AlertIcon />
            </SwapIconItem>
          </SwapIcon>
        </TraceIcon>
        <TraceTitle>{titles[status]}</TraceTitle>
        <TraceDescription>March 2027</TraceDescription>
      </TraceLine>
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

## Dialog

Wrap the `TraceLine` in a [Dialog](/docs/components/dialog)'s trigger, rendered as a button styled with `traceActionStyles()`. The dialog owns its open state, Escape and focus return.

<!-- ::demo name="trace-dialog" -->

```tsx
<Dialog>
  <DialogTrigger
    render={<button type="button" {...stylex.props(traceActionStyles())} />}
  >
    <TraceLine>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>Ran git diff --stat</TraceTitle>
    </TraceLine>
  </DialogTrigger>
  <DialogContent>{output}</DialogContent>
</Dialog>
```

## Sheet

Wrap the `TraceLine` in a [Sheet](/docs/components/sheet)'s trigger, rendered as a button styled with `traceActionStyles()`.

<!-- ::demo name="trace-sheet" -->

```tsx
<Sheet>
  <SheetTrigger
    render={<button type="button" {...stylex.props(traceActionStyles())} />}
  >
    <TraceLine>
      <TraceIcon>
        <FileEditIcon />
      </TraceIcon>
      <TraceTitle>Edited package.json</TraceTitle>
      <TraceDescription>+1 −1</TraceDescription>
    </TraceLine>
  </SheetTrigger>
  <SheetContent>{diff}</SheetContent>
</Sheet>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Trace` | A column of lines |
| `TraceLine` | `status`: `running` shimmers the title, `error` turns it `dangerText`, `pending` dims it |
| `TraceIcon` | A 16px slot hidden from screen readers; after the title it's the indicator |
| `TraceTitle` | One line, cut short |
| `TraceDescription` | Muted, tabular numbers; doesn't truncate |
| `TraceCollapsible` | A [Collapsible](/docs/components/collapsible) root; `open` needs `onOpenChange` |
| `TraceCollapsibleTrigger` | A chevron after the line, and the rail's start while open |
| `TraceCollapsibleContent` | Secondary text on a rail, lined up with the title |
| `traceActionStyles()` | Styles for a link or trigger that wraps a `TraceLine` |

Every part takes `sx`, applied last. The collapsible parts take Base UI [Collapsible](https://base-ui.com/react/components/collapsible) props.
