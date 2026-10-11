---
title: Tool Steps
description: The tool calls a run makes, each with a status and what it returned.
section: AI
draft: true
---

<!-- ::demo name="tool-steps" -->

```tsx
<ToolSteps>
  <ToolStepsTrigger>
    <WrenchIcon />
    Used 3 tools
  </ToolStepsTrigger>
  <ToolStepsContent>
    <ToolStep>
      <ToolStepHeader>
        <ToolStepIndicator />
        <ToolStepMedia>
          <GlobeIcon />
        </ToolStepMedia>
        <ToolStepTitle>Read page</ToolStepTitle>
        <ToolStepDescription>base-ui.com/react</ToolStepDescription>
      </ToolStepHeader>
    </ToolStep>
  </ToolStepsContent>
</ToolSteps>
```

## Installation

<!-- ::install name="tool-steps" -->

## Usage

```tsx
import {
  ToolStep,
  ToolStepContent,
  ToolStepDescription,
  ToolStepHeader,
  ToolStepIndicator,
  ToolStepMedia,
  ToolSteps,
  ToolStepsContent,
  ToolStepsTrigger,
  ToolStepTitle,
  ToolStepTrigger,
} from "@/components/ui/tool-steps";
```

```tsx
<ToolSteps>
  <ToolStepsTrigger>Used 1 tool</ToolStepsTrigger>
  <ToolStepsContent>
    <ToolStep status="running">
      <ToolStepHeader>
        <ToolStepIndicator />
        <ToolStepTitle>Web search</ToolStepTitle>
      </ToolStepHeader>
    </ToolStep>
  </ToolStepsContent>
</ToolSteps>
```

## Composition

```
ToolSteps
├── ToolStepsTrigger
└── ToolStepsContent
    └── ToolStep
        ├── ToolStepHeader | ToolStepTrigger
        │   ├── ToolStepIndicator
        │   ├── ToolStepMedia
        │   ├── ToolStepTitle
        │   └── ToolStepDescription
        └── ToolStepContent
```

## Status

Use the `status` prop on `ToolStep` as each call starts and ends, and say why a step failed in `ToolStepDescription`. While any step runs, swap the trigger's icon for a [Spinner](/docs/components/spinner) with a [Swap Icon](/docs/components/swap-icon) and wrap its label in a [Shimmer](/docs/components/shimmer).

<!-- ::demo name="tool-steps-status" -->

```tsx
<ToolStepsTrigger>
  <SwapIcon value={running ? "running" : "done"}>
    <SwapIconItem value="running">
      <Spinner />
    </SwapIconItem>
    <SwapIconItem value="done">
      <WrenchIcon />
    </SwapIconItem>
  </SwapIcon>
  {running ? <Shimmer>Using 3 tools</Shimmer> : "Used 3 tools"}
</ToolStepsTrigger>
```

```tsx
<ToolStep status="failed">
  <ToolStepHeader>
    <ToolStepIndicator />
    <ToolStepTitle>Check calendar</ToolStepTitle>
    <ToolStepDescription>Calendar unreachable</ToolStepDescription>
  </ToolStepHeader>
</ToolStep>
```

| Status    | Indicator   | Title    |
| --------- | ----------- | -------- |
| `running` | A spinner   | Shimmers |
| `done`    | A tick      | Plain    |
| `failed`  | A red alert | Plain    |

## Tool Step Trigger

Use `ToolStepTrigger` in place of `ToolStepHeader` for a step with results, and put them in `ToolStepContent`. The first step in the preview opens this way.

```tsx
<ToolStep>
  <ToolStepTrigger>
    <ToolStepIndicator />
    <ToolStepTitle>Web search</ToolStepTitle>
  </ToolStepTrigger>
  <ToolStepContent>…</ToolStepContent>
</ToolStep>
```

## API Reference

| Part | Adds |
| --- | --- |
| `ToolSteps` | A [Collapsible](/docs/components/collapsible) root |
| `ToolStep` | `status` (`"running"`, `"done"`, `"failed"`); a Collapsible root |
| `ToolStepsTrigger`, `ToolStepTrigger` | A chevron after the children |
| `ToolStepIndicator` | The status mark, with its status named for screen readers |
| `ToolStepTitle` | Shimmers while `running` |

Every part takes `sx`, applied last. The roots, triggers and contents take Base UI [Collapsible](https://base-ui.com/react/components/collapsible) props. `ToolStepHeader` renders a `div`; the media, title, description and indicator a `span`.
