---
title: Approval
description: A card asking to allow a tool call, with its arguments and answer buttons.
section: AI
draft: true
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
    <Button size="sm" variant="outline">
      Cancel
    </Button>
    <Button size="sm" variant="primary">
      Send mail
    </Button>
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
    <Button size="sm" variant="outline">
      Cancel
    </Button>
    <Button size="sm" status="danger">
      Delete file
    </Button>
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
```

## Approval Footer

Name the confirm button for the action ("Send mail"), never "Approve", and put Cancel before it.

### Busy

While the call resumes, disable both buttons and set `aria-busy` on the one pressed.

## Approval Action

Once answered, drop the footer and say what happened in a [Badge](/docs/components/badge) in `ApprovalAction`.

<!-- ::demo name="approval-decided" -->

```tsx
<ApprovalHeader>
  <ApprovalTitle>Send mail</ApprovalTitle>
  <ApprovalAction>
    <Badge status="success" variant="secondary">
      Sent
    </Badge>
  </ApprovalAction>
</ApprovalHeader>
```

| Moment   | Footer             | Action                 |
| -------- | ------------------ | ---------------------- |
| Asking   | Cancel, the action | None                   |
| Resuming | Both disabled      | None                   |
| Answered | None               | A Badge: what happened |

## API Reference

| Part | Adds |
| --- | --- |
| `Approval` | A `sm` [Card](/docs/components/card) with `role="group"`, named by its title |
| `ApprovalTitle` | The card's name; a row with the media before the text |
| `ApprovalMedia` | A tile for the tool's icon, hidden from screen readers |
| `ApprovalFields` | A `dl` grid: labels in `textSecondary`, values wrap anywhere |
| `ApprovalFooter` | The card's footer, buttons at its end |

`ApprovalHeader`, `ApprovalAction` and `ApprovalContent` are the Card's parts. Every part takes `sx`, applied last. `ApprovalField` renders a `div`, its label a `dt` and its value a `dd`.
