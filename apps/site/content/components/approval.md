---
title: Approval
description: A card asking to allow a tool call, with its arguments and answer buttons.
section: AI
---

<!-- ::demo name="approval" -->

```tsx
<Approval>
  <ApprovalHeader>
    <ApprovalTitle>
      <ApprovalMedia>
        <HugeiconsIcon icon={Mail01Icon} />
      </ApprovalMedia>
      Send mail
    </ApprovalTitle>
  </ApprovalHeader>
  <ApprovalContent>
    <ApprovalFields>
      <ApprovalField>
        <ApprovalFieldLabel>To</ApprovalFieldLabel>
        <ApprovalFieldValue>
          <Badge variant="secondary">alex@acme.com</Badge>
          <Badge variant="secondary">sam@acme.com</Badge>
        </ApprovalFieldValue>
      </ApprovalField>
      <ApprovalField>
        <ApprovalFieldLabel>Subject</ApprovalFieldLabel>
        <ApprovalFieldValue>Q3 forecast, revised</ApprovalFieldValue>
      </ApprovalField>
    </ApprovalFields>
  </ApprovalContent>
  <Separator />
  <ApprovalContent>
    <p>Hi both, the revised forecast is attached.</p>
  </ApprovalContent>
  <ApprovalFooter>
    <ApprovalCancel>Cancel</ApprovalCancel>
    <ApprovalConfirm data-agent-confirm="Sends “Q3 forecast, revised” to alex@acme.com and sam@acme.com">
      Send mail
    </ApprovalConfirm>
  </ApprovalFooter>
</Approval>
```

## Installation

<!-- ::install name="approval" -->

## Usage

```tsx
import {
  Approval,
  ApprovalAction,
  ApprovalCancel,
  ApprovalConfirm,
  ApprovalContent,
  ApprovalField,
  ApprovalFieldLabel,
  ApprovalFields,
  ApprovalFieldValue,
  ApprovalFooter,
  ApprovalHeader,
  ApprovalMedia,
  ApprovalTitle,
} from "@/components/ai/approval";
```

```tsx
<Approval>
  <ApprovalHeader>
    <ApprovalTitle>Delete file</ApprovalTitle>
  </ApprovalHeader>
  <ApprovalFooter>
    <ApprovalCancel>Cancel</ApprovalCancel>
    <ApprovalConfirm color="danger" variant="secondary">
      Delete file
    </ApprovalConfirm>
  </ApprovalFooter>
</Approval>
```

## Composition

```
Approval
├── ApprovalHeader
│   ├── ApprovalTitle
│   │   └── ApprovalMedia
│   └── ApprovalAction
├── ApprovalContent
│   └── ApprovalFields
│       └── ApprovalField
│           ├── ApprovalFieldLabel
│           └── ApprovalFieldValue
└── ApprovalFooter
    ├── ApprovalCancel
    └── ApprovalConfirm
```

## Approval Footer

Name the confirm button for the action ("Send mail"), never "Approve". `ApprovalCancel` sits alone at the footer's start, the action at its end, so a slip lands on the button that does nothing. Another option, such as Edit, goes just before the action.

An agent must never approve its own call, so `ApprovalConfirm` carries `data-agent-confirm` and the agent bridge asks the person first. Pass the attribute a sentence that says what the call does, built from app state. A plain [Button](/docs/components/button) opts out.

### Busy

While the call resumes, disable both buttons and set `aria-busy` on the one pressed.

## Approval Action

Once answered, drop the footer and say what happened in a [Badge](/docs/components/badge) in `ApprovalAction`.

<!-- ::demo name="approval-decided" -->

```tsx
<ApprovalHeader>
  <ApprovalTitle>Send mail</ApprovalTitle>
  <ApprovalAction>
    <Badge color="success" variant="secondary">
      Sent
    </Badge>
  </ApprovalAction>
</ApprovalHeader>
```

| Moment   | Footer                   | Action                 |
| -------- | ------------------------ | ---------------------- |
| Asking   | Cancel apart, the action | None                   |
| Resuming | Both disabled            | None                   |
| Answered | None                     | A Badge: what happened |

## API Reference

| Part | Adds |
| --- | --- |
| `Approval` | A `sm` [Card](/docs/components/card) with `role="group"`, named by its title |
| `ApprovalTitle` | The card's name; a row with the media before the text |
| `ApprovalMedia` | The tool's bare icon, centered on the title's line and hidden from screen readers |
| `ApprovalFields` | A `dl` grid: labels in `textSecondary`, values wrap anywhere |
| `ApprovalFooter` | The card's footer, buttons at its end |
| `ApprovalCancel` | An outline `sm` [Button](/docs/components/button), pushed to the footer's start |
| `ApprovalConfirm` | A primary `sm` Button marked `data-agent-confirm`, so an agent can't approve its own tool call; pass the attribute to say what it does |

`ApprovalHeader`, `ApprovalAction` and `ApprovalContent` are the Card's parts. Every part takes `sx`, applied last. `ApprovalField` renders a `div`, its label a `dt` and its value a `dd`.
