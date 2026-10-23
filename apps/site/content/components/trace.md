---
title: Trace
description: The steps an agent takes, on one rail, each with a status, what it acted on and what it found.
section: AI
---

<!-- ::demo name="trace" -->

```tsx
<TraceCollapsible defaultOpen>
  <TraceCollapsibleTrigger>
    <TraceTitle>
      <SwapText>{running ? "Working" : "Worked"}</SwapText>
    </TraceTitle>
    <TraceDescription>
      <SwapText>{String(seconds)}</SwapText>s
    </TraceDescription>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>
      <TraceStep state="running">
        <TraceLine>
          <TraceMarker>
            <DatabaseIcon />
          </TraceMarker>
          <TraceTitle>
            <SwapText>Reading</SwapText>
          </TraceTitle>
          <TraceSubject>Swedish orders</TraceSubject>
        </TraceLine>
      </TraceStep>
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
```

## Installation

<!-- ::install name="trace" -->

## Usage

```tsx
import {
  Trace,
  TraceLine,
  TraceMarker,
  TraceStep,
  TraceTitle,
} from "@/components/ai/trace";
```

```tsx
<Trace>
  <TraceStep>
    <TraceLine>
      <TraceMarker>
        <SearchIcon />
      </TraceMarker>
      <TraceTitle>Searched the web</TraceTitle>
    </TraceLine>
  </TraceStep>
</Trace>
```

## Composition

```text
TraceCollapsible
├── TraceCollapsibleTrigger
│   ├── TraceTitle
│   └── TraceDescription
└── TraceCollapsibleContent
    └── Trace
        └── TraceStep
            ├── TraceLine or TraceStepTrigger
            │   ├── TraceMarker
            │   ├── TraceTitle
            │   ├── TraceSubject
            │   ├── TraceDescription
            │   └── TraceIcon
            └── TraceStepContent
                ├── TraceReasoning
                └── TraceSubsteps
                    └── TraceSubstep
                        ├── TraceMarker
                        ├── TraceTitle
                        └── TraceSubject
```

A `Trace` is one rail; each `TraceStep` is a node on it, marked by its icon. The rail runs from step to step, stops at each marker and ends on the last step. Steps that arrive after the `Trace` is on screen grow in; steps it mounts with don't. So mount a run read back from history with its steps, not before they load, or every step arrives at once.

## Trace Step

A step's `TraceLine` reads as a sentence: its icon in `TraceMarker`, a verb in `TraceTitle` ("Read"), then what it acted on in `TraceSubject`. The marker is hidden from screen readers, so the title and subject carry the meaning. Put a count or a duration in `TraceDescription`.

<!-- ::demo name="trace-step" -->

```tsx
<TraceStep>
  <TraceLine>
    <TraceMarker>
      <DatabaseIcon />
    </TraceMarker>
    <TraceTitle>Read</TraceTitle>
    <TraceSubject>Swedish orders</TraceSubject>
  </TraceLine>
</TraceStep>
```

### Content

What a step found or did opens under it in `TraceStepContent`, lined up with the title, and the rail runs on beside it. It shows by default; pass `open` to the step to show it while the step runs and shut it once the step settles.

```tsx
<TraceStep open={state === "running"} state={state}>
  <TraceLine>…</TraceLine>
  <TraceStepContent>…</TraceStepContent>
</TraceStep>
```

### Trigger

To let the reader open a step's content, use a `TraceStepTrigger` in place of its `TraceLine`, with the same parts in it. Its marker turns into a chevron while it's pointed at or focused, and the chevron turns as the content opens. The step takes `open`, `defaultOpen` and `onOpenChange`, like a [Collapsible](/docs/components/collapsible); pass `defaultOpen={false}` to start it shut. A step with `open` needs `onOpenChange` too, or its trigger can't toggle it.

<!-- ::demo name="trace-step-trigger" -->

```tsx
<TraceStep defaultOpen={false}>
  <TraceStepTrigger>
    <TraceMarker>
      <SearchIcon />
    </TraceMarker>
    <TraceTitle>Searched the web</TraceTitle>
    <TraceDescription>2 searches</TraceDescription>
  </TraceStepTrigger>
  <TraceStepContent>…</TraceStepContent>
</TraceStep>
```

To open a step while it runs and still let the reader toggle it, keep their choice and fall back to the state:

```tsx
const [open, setOpen] = useState<boolean>();

<TraceStep onOpenChange={setOpen} open={open ?? running} state={state}>
  …
</TraceStep>;
```

## State

Set `state` on `TraceStep` while it runs, if it failed or before it starts. A step without one is done. The marker and title follow the state, so say it in the title too. To change tense as it settles ("Reading" to "Read"), put the title in a [Swap Text](/docs/components/swap-text).

| State     | Marker                         | Title                          |
| --------- | ------------------------------ | ------------------------------ |
| none      | Its icon                       | Done: "Ran pnpm install"       |
| `running` | Its icon                       | Shimmers: "Running pnpm build" |
| `error`   | Its icon, in red               | "Failed to run pnpm lint"      |
| `pending` | Its icon, dimmed with the line | Dimmed: "Run pnpm test"        |

Put why a step failed in a `TraceDescription` inside `TraceStepContent`, under the title. It turns `dangerText` on a failed step.

<!-- ::demo name="trace-state" -->

```tsx
<TraceStep state="running">
  <TraceLine>
    <TraceMarker>
      <TerminalIcon />
    </TraceMarker>
    <TraceTitle>
      <SwapText>{running ? "Running pnpm build" : "Ran pnpm build"}</SwapText>
    </TraceTitle>
  </TraceLine>
</TraceStep>
<TraceStep state="error">
  <TraceLine>
    <TraceMarker>
      <TerminalIcon />
    </TraceMarker>
    <TraceTitle>Failed to run pnpm lint</TraceTitle>
  </TraceLine>
  <TraceStepContent>
    <TraceDescription>Exit code 1 · 3 errors</TraceDescription>
  </TraceStepContent>
</TraceStep>
```

## Trace Marker

`TraceMarker` puts the step's icon on the rail, in the line's color: a 14px icon (`sizes.iconSm`) in a 24px box, so the rail stops short of it. Pick the icon for what the step does: a search, a read, a command. End a run on a tick.

<!-- ::demo name="trace-marker" -->

```tsx
<TraceStep>
  <TraceLine>
    <TraceMarker>
      <TickIcon />
    </TraceMarker>
    <TraceTitle>Finished working</TraceTitle>
  </TraceLine>
</TraceStep>
```

## Run

Put a run's `Trace` in a `TraceCollapsible`. `TraceCollapsibleTrigger` is a row with the chevron after its text. Give it a `TraceTitle` and a `TraceDescription`, and a [Swap Text](/docs/components/swap-text) in each to morph "Working" into "Worked" and roll the seconds. The content stays mounted while shut, so reopening it doesn't make its steps arrive again.

See the demo at the top of the page.

## Reasoning

Stream the model's reasoning into `TraceReasoning`, a string. It shows a window of the newest four lines. Each new word morphs in, the block glides up a line as one wraps, and the oldest fades under the top edge. A line break in the text starts a new line. It shows while the model thinks and shuts once it's done; a finished thought is a plain line, not one to open.

<!-- ::demo name="trace-reasoning" -->

```tsx
<TraceStep open={running} state={running ? "running" : undefined}>
  <TraceLine>
    <TraceMarker>
      <IdeaIcon />
    </TraceMarker>
    <TraceTitle>
      <SwapText>{running ? "Thinking" : "Thought for 3s"}</SwapText>
    </TraceTitle>
  </TraceLine>
  <TraceStepContent>
    <TraceReasoning>{reasoning}</TraceReasoning>
  </TraceStepContent>
</TraceStep>
```

## Tool

For a tool that runs smaller steps, list them in `TraceSubsteps`. Each `TraceSubstep` is a row like a step's line: a `state`, a `TraceMarker` with its icon, a `TraceTitle` and what it acted on.

<!-- ::demo name="trace-tool" -->

```tsx
<TraceStepContent>
  <TraceSubsteps>
    <TraceSubstep state={pulling ? "running" : undefined}>
      <TraceMarker>
        <DatabaseIcon />
      </TraceMarker>
      <TraceTitle>
        <SwapText>
          {pulling ? "Pulling order history" : "Pulled order history"}
        </SwapText>
      </TraceTitle>
    </TraceSubstep>
  </TraceSubsteps>
</TraceStepContent>
```

## Sources

Put what a search found in a [Citation Group](/docs/components/citation#group), and the count it left out in `CitationGroupMore`.

<!-- ::demo name="trace-sources" -->

```tsx
<TraceStepContent>
  <CitationGroup>
    <Citation sources={[scb]} />
    <CitationGroupMore count={42}>
      <Citation sources={[statista]} />
    </CitationGroupMore>
  </CitationGroup>
</TraceStepContent>
```

## File

Show a file a step made as an [Attachment](/docs/components/attachment) at `xs`.

<!-- ::demo name="trace-file" -->

```tsx
<TraceStepContent>
  <Attachment size="xs">
    <AttachmentMedia>
      <FileIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>sweden-launch</AttachmentTitle>
    </AttachmentContent>
  </Attachment>
</TraceStepContent>
```

## Link

Wrap the `TraceLine` in a link styled with `traceActionStyles()`. For a new tab, end the line with an arrow in a `TraceIcon`.

<!-- ::demo name="trace-link" -->

```tsx
<TraceStep>
  <a
    href="https://acme.com/docs/ci"
    target="_blank"
    {...stylex.props(traceActionStyles())}
  >
    <TraceLine>
      <TraceMarker>
        <GlobeIcon />
      </TraceMarker>
      <TraceTitle>Read</TraceTitle>
      <TraceSubject>Continuous integration</TraceSubject>
      <TraceIcon>
        <ArrowUpRightIcon />
      </TraceIcon>
    </TraceLine>
  </a>
</TraceStep>
```

## Dialog

Wrap the `TraceLine` in a [Dialog](/docs/components/dialog)'s trigger, rendered as a button styled with `traceActionStyles()`. The dialog owns its open state, Escape and focus return.

<!-- ::demo name="trace-dialog" -->

```tsx
<DialogTrigger
  render={<button type="button" {...stylex.props(traceActionStyles())} />}
>
  <TraceLine>…</TraceLine>
</DialogTrigger>
```

## Sheet

Wrap the `TraceLine` in a [Sheet](/docs/components/sheet)'s trigger the same way.

<!-- ::demo name="trace-sheet" -->

```tsx
<SheetTrigger
  render={<button type="button" {...stylex.props(traceActionStyles())} />}
>
  <TraceLine>…</TraceLine>
</SheetTrigger>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Trace` | One rail of steps; steps that arrive after it mounts grow in |
| `TraceStep` | `state`: `running`, `error` or `pending`; none is done. `open`, `defaultOpen` (true) and `onOpenChange` for its content. A node on the rail, which stops at its marker |
| `TraceLine` | The step's row, `textSecondary`; `textPrimary` on hover inside a link or trigger, dimmed when pending |
| `TraceStepTrigger` | A `TraceLine` that opens and shuts the step's content; its marker shows a chevron while pointed at or focused |
| `TraceMarker` | A 24px box holding the step's 14px icon (`sizes.iconSm`) on the rail, in the line's color; `dangerText` when the step failed |
| `TraceTitle` | The verb, `textSecondary`, cut short; it shimmers while the step runs |
| `TraceSubject` | What the step acted on, `textMuted`, cut short |
| `TraceDescription` | Muted, tabular numbers; doesn't truncate. `dangerText` on a failed step |
| `TraceIcon` | A 14px slot after the title, hidden from screen readers: a link's arrow, say |
| `TraceStepContent` | What opens under the step, lined up with its title; it stays mounted while shut |
| `TraceReasoning` | A string, shown as a window of its newest four lines |
| `TraceSubsteps` | The rows of a tool's smaller steps |
| `TraceSubstep` | `state`, as on a step: a row of a `TraceMarker`, a `TraceTitle` and what it acted on |
| `TraceCollapsible` | A [Collapsible](/docs/components/collapsible) root; `open` needs `onOpenChange` |
| `TraceCollapsibleTrigger` | The run's row, with the chevron after its text |
| `TraceCollapsibleContent` | The panel; it stays mounted while shut |
| `traceActionStyles()` | Styles for a link or trigger that wraps a `TraceLine` |

Every part takes `sx`, applied last. The collapsible parts take Base UI [Collapsible](https://base-ui.com/react/components/collapsible) props.
