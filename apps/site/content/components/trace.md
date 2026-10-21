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
          <TraceMarker />
          <TraceTitle>
            <SwapText>Reading</SwapText>
          </TraceTitle>
          <TraceIcon>
            <DatabaseIcon />
          </TraceIcon>
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
      <TraceMarker />
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
            ├── TraceLine
            │   ├── TraceMarker
            │   ├── TraceTitle
            │   ├── TraceIcon
            │   ├── TraceSubject
            │   └── TraceDescription
            └── TraceStepContent
                ├── TraceReasoning
                └── TraceSubsteps
                    └── TraceSubstep
                        ├── TraceMarker
                        └── TraceTitle
```

A `Trace` is one rail; each `TraceStep` is a node on it. The rail runs from step to step, stops short of each marker and ends on the last step. Steps that arrive after the `Trace` is on screen grow in; steps it mounts with don't. So mount a run read back from history with its steps, not before they load, or every step arrives at once.

## Trace Step

A step's `TraceLine` reads as a sentence: a verb in `TraceTitle` ("Read"), then what it acted on in `TraceSubject`, after its `TraceIcon`. `TraceIcon` is hidden from screen readers, so the title and subject carry the meaning. Put a count or a duration in `TraceDescription`.

<!-- ::demo name="trace-step" -->

```tsx
<TraceStep>
  <TraceLine>
    <TraceMarker />
    <TraceTitle>Read</TraceTitle>
    <TraceIcon>
      <DatabaseIcon />
    </TraceIcon>
    <TraceSubject>Swedish orders</TraceSubject>
  </TraceLine>
</TraceStep>
```

### Content

What a step found or did opens under it in `TraceStepContent`, lined up with the title. Pass `open` to show it while the step runs and shut it once the step settles. It grows open and fades in, and fades out before it shuts.

```tsx
<TraceStep state={state}>
  <TraceLine>…</TraceLine>
  <TraceStepContent open={state === "running"}>…</TraceStepContent>
</TraceStep>
```

## State

Set `state` on `TraceStep` while it runs, if it failed or before it starts. A step without one is done. The marker and title follow the state, so say it in the title too. To change tense as it settles ("Reading" to "Read"), put the title in a [Swap Text](/docs/components/swap-text).

| State     | Marker  | Title                                   |
| --------- | ------- | --------------------------------------- |
| none      | A dot   | Done: "Ran pnpm install"                |
| `running` | Spinner | Shimmers: "Running pnpm build"          |
| `error`   | Alert   | `dangerText`: "Failed to run pnpm lint" |
| `pending` | A dot   | Dimmed: "Run pnpm test"                 |

<!-- ::demo name="trace-state" -->

```tsx
<TraceStep state="running">
  <TraceLine>
    <TraceMarker />
    <TraceTitle>
      <SwapText>{running ? "Running pnpm build" : "Ran pnpm build"}</SwapText>
    </TraceTitle>
  </TraceLine>
</TraceStep>
```

## Trace Marker

`TraceMarker` draws the step's state on the rail. End a run on `variant="check"`. Children replace the mark.

<!-- ::demo name="trace-marker" -->

```tsx
<TraceStep>
  <TraceLine>
    <TraceMarker variant="check" />
    <TraceTitle>Finished working</TraceTitle>
  </TraceLine>
</TraceStep>
```

## Run

Put a run's `Trace` in a `TraceCollapsible`. `TraceCollapsibleTrigger` puts the chevron on the rail's column, so the rail starts under it. Give it a `TraceTitle` and a `TraceDescription`, and a [Swap Text](/docs/components/swap-text) in each to morph "Working" into "Worked" and roll the seconds. The content stays mounted while shut, so reopening it doesn't make its steps arrive again.

See the demo at the top of the page.

## Reasoning

Stream the model's reasoning into `TraceReasoning`, a string. It shows a window of the newest four lines. Each new word morphs in, the block glides up a line as one wraps, and the oldest fades under the top edge. A line break in the text starts a new line.

<!-- ::demo name="trace-reasoning" -->

```tsx
<TraceStep state={running ? "running" : undefined}>
  <TraceLine>
    <TraceMarker />
    <TraceTitle>
      <SwapText>{running ? "Thinking" : "Thought for 3s"}</SwapText>
    </TraceTitle>
  </TraceLine>
  <TraceStepContent open={running}>
    <TraceReasoning>{reasoning}</TraceReasoning>
  </TraceStepContent>
</TraceStep>
```

## Tool

For a tool that runs smaller steps, list them in `TraceSubsteps`. Each `TraceSubstep` takes a `state`, a `TraceMarker` (a spinner that settles to a check) and a `TraceTitle`.

<!-- ::demo name="trace-tool" -->

```tsx
<TraceStepContent open={state === "running"}>
  <TraceSubsteps>
    <TraceSubstep state={pulling ? "running" : undefined}>
      <TraceMarker />
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
      <AttachmentDescription>PDF</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
</TraceStepContent>
```

## Link

Wrap the `TraceLine` in a link styled with `traceActionStyles()`. For a new tab, end the line with an arrow icon.

<!-- ::demo name="trace-link" -->

```tsx
<TraceStep>
  <a
    href="https://acme.com/docs/ci"
    target="_blank"
    {...stylex.props(traceActionStyles())}
  >
    <TraceLine>
      <TraceMarker />
      <TraceTitle>Read</TraceTitle>
      <TraceIcon>
        <GlobeIcon />
      </TraceIcon>
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
| `TraceStep` | `state`: `running`, `error` or `pending`; none is done. A node on the rail, which stops short of its marker |
| `TraceLine` | The step's row, `textMuted`; `textPrimary` on hover inside a link or trigger, `dangerText` when the step failed, dimmed when pending |
| `TraceMarker` | The state on the rail: a dot, a spinner, an alert; a check circle in a substep. `variant="check"` ends a run; children replace it |
| `TraceTitle` | The verb, cut short; it shimmers while the step runs. Medium `textSecondary` in a trigger |
| `TraceIcon` | A 16px slot hidden from screen readers: before a subject, or after the title as the indicator |
| `TraceSubject` | What the step acted on, medium `textSecondary`, cut short |
| `TraceDescription` | Muted, tabular numbers; doesn't truncate |
| `TraceStepContent` | `open`, true by default: what opens under the step, lined up with its title |
| `TraceReasoning` | A string, shown as a window of its newest four lines |
| `TraceSubsteps` | A card of substeps |
| `TraceSubstep` | `state`, as on a step: a row of a `TraceMarker` and a `TraceTitle` |
| `TraceCollapsible` | A [Collapsible](/docs/components/collapsible) root; `open` needs `onOpenChange` |
| `TraceCollapsibleTrigger` | A row with the chevron on the rail's column, and the rail's start while open |
| `TraceCollapsibleContent` | The panel; it stays mounted while shut |
| `traceActionStyles()` | Styles for a link or trigger that wraps a `TraceLine` |

Every part takes `sx`, applied last. The collapsible parts take Base UI [Collapsible](https://base-ui.com/react/components/collapsible) props.
