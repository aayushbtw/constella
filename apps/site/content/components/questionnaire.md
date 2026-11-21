---
title: Questionnaire
description: Questions the model asks one at a time, with fixed choices, a freeform answer and skips.
section: AI
---

<!-- ::demo name="questionnaire" -->

```tsx
<Questionnaire items={items} onSubmit={handleSubmit} shortcuts="letters">
  <QuestionnaireProgress />
  {items.map((question) => (
    <QuestionnaireItem
      key={question.name}
      multiple={question.multiple}
      name={question.name}
    >
      <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
      <QuestionnaireDescription>
        {question.description}
      </QuestionnaireDescription>
      <QuestionnaireChoices>
        {question.choices.map((choice) => (
          <QuestionnaireChoice key={choice.value} value={choice.value}>
            {choice.label}
            <QuestionnaireChoiceDescription>
              {choice.description}
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        ))}
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>
  ))}
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
  </QuestionnaireActions>
</Questionnaire>
```

## Installation

<!-- ::install name="questionnaire" -->

## Usage

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ai/questionnaire";
```

```tsx
const items = [
  {
    name: "direction",
    required: true,
    choices: [{ value: "delegation" }, { value: "questions" }],
  },
  { name: "detail", choices: [{ value: "focused" }, { value: "complete" }] },
] as const;
```

Define the questions once: pass them to `Questionnaire` as `items` so progress, actions and shortcuts render on the server, then map them into the parts. The answers arrive as the form's data on submit, one entry per answered `name`; `getAll` reads a `multiple` question.

```tsx
function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();
  const answers = new FormData(event.currentTarget);
}
```

## Composition

```
Questionnaire
├── QuestionnaireProgress
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   └── QuestionnaireChoice
│   │       └── QuestionnaireChoiceDescription
│   ├── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

Questionnaire owns the order, the active question, the answers, validation and navigation. The page, card or dialog around it owns closing, saving, sending and branching. A single-answer question's choices are a [Radio Group](/docs/components/radio-group), and a `multiple` one's are checkboxes in a [Checkbox](/docs/components/checkbox) group.

## Multiple

Use the `multiple` prop on an item that takes more than one answer. Its choices become checkboxes, and its `defaultValue` and `onValueChange` take a list.

<!-- ::demo name="questionnaire-multiple" -->

```tsx
<QuestionnaireItem multiple name="context">
  <QuestionnaireTitle>
    What context should the agent inspect?
  </QuestionnaireTitle>
  <QuestionnaireChoices>
    <QuestionnaireChoice value="source">
      Relevant source files
    </QuestionnaireChoice>
    <QuestionnaireChoice value="tests">Existing tests</QuestionnaireChoice>
  </QuestionnaireChoices>
  <QuestionnaireError />
</QuestionnaireItem>
```

## Questionnaire Input

Add a `QuestionnaireInput` after the choices for an answer of the user's own. In a single-answer question, typing in it clears the picked choice and picking a choice clears the text. Give it an `aria-label`; a placeholder is not a label.

<!-- ::demo name="questionnaire-freeform" -->

```tsx
<QuestionnaireChoices>
  <QuestionnaireChoice value="incremental">
    Make the smallest safe change
  </QuestionnaireChoice>
</QuestionnaireChoices>
<QuestionnaireInput
  aria-label="Another refactoring approach"
  placeholder="Describe another approach…"
/>
```

## Questionnaire Skip

Add a `QuestionnaireSkip` to let an optional item be left unanswered on purpose. It shows only on questions without `required` in `items`; `onStatusChange` tells skipped apart from unanswered.

<!-- ::demo name="questionnaire-skip" -->

```tsx
<QuestionnaireItem name="constraints" onStatusChange={setStatus}>
  …
</QuestionnaireItem>
<QuestionnaireActions>
  <QuestionnairePrevious />
  <QuestionnaireSkip />
  <QuestionnaireNext />
  <QuestionnaireSubmit />
</QuestionnaireActions>
```

## Shortcuts

Use the `shortcuts` prop to give each answer a letter or number key, shown as a Kbd on the choice. Keys work only while focus is in the questionnaire, so two on one page don't share them.

<!-- ::demo name="questionnaire-shortcuts" -->

```tsx
<Questionnaire items={items} shortcuts="numbers">
  …
</Questionnaire>
```

| Key | Where | Does |
| --- | --- | --- |
| A to Z, or 1 to 9 | Anywhere in the form | Picks the choice, in the order of the item's `choices` in `items` |
| Enter | A choice or the freeform answer | Moves on |
| ⌘ Enter (Ctrl Enter off Apple platforms) | Anywhere in the form | Moves on |
| Arrow keys | A single-answer question's choices | Moves between them |

## Questionnaire Progress

Add a `ProgressTrack` from [Progress](/docs/components/progress) to show the step as a bar. The part is a Progress whose value is the question's number, so its children replace the "Question 2 of 3" text, and `format` changes that text while screen readers still hear "Question 2 of 3".

<!-- ::demo name="questionnaire-progress" -->

```tsx
<QuestionnaireProgress>
  <ProgressValue />
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</QuestionnaireProgress>
```

## Reset

Use `defaultItem`, an item's `defaultValue` and an input's `defaultValue` to resume a saved draft. A `type="reset"` button restores those answers and returns to the saved question.

<!-- ::demo name="questionnaire-resume" -->

```tsx
<Questionnaire defaultItem="verification" items={items}>
  <QuestionnaireItem defaultValue="incremental" name="change">
    <QuestionnaireChoices>
      <QuestionnaireChoice value="incremental">
        Incremental migration
      </QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  …
  <QuestionnaireActions>
    <Button type="reset" variant="outline">
      Reset changes
    </Button>
    <QuestionnairePrevious />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

## Controlled

Use `item` and `onItemChange` to hold the active question in your own state.

<!-- ::demo name="questionnaire-controlled" -->

```tsx
const [item, setItem] = useState("scope");

<Questionnaire item={item} items={items} onItemChange={setItem}>
  …
</Questionnaire>;
```

## Disabled

### Questionnaire Item

Set `disabled` on a question's entry in `items` to drop it when it doesn't apply. Progress and navigation skip it. Read an answer with the item's `onValueChange`, which passes ui-sdk's change `details` on.

<!-- ::demo name="questionnaire-conditional" -->

```tsx
const items = [
  { name: "runtime", required: true },
  { disabled: runtime !== "cloud", name: "environment", required: true },
];

<QuestionnaireItem
  defaultValue="local"
  name="runtime"
  onValueChange={(value) => setRuntime(value ?? "local")}
>
  …
</QuestionnaireItem>;
```

### Questionnaire Next

Read each item's status with `onStatusChange` to disable Next until it has an answer. By default Next stays enabled and shows the error instead.

<!-- ::demo name="questionnaire-navigation" -->

```tsx
<QuestionnaireNext disabled={unanswered} variant="secondary" />
<QuestionnaireSubmit disabled={unanswered} />
```

## Invalid

Use the `invalid` prop with your own schema, such as Zod, and pass the message to `QuestionnaireError`. An invalid question blocks Next and submit. Move to it with `item`, and clear the error in `onValueChange`.

<!-- ::demo name="questionnaire-validation" -->

```tsx
<QuestionnaireItem
  invalid={errors.detail !== undefined}
  name="detail"
  onValueChange={() => clearError("detail")}
>
  …<QuestionnaireError>{errors.detail}</QuestionnaireError>
</QuestionnaireItem>
```

## Card

Wrap the items in a [Card](/docs/components/card), each question's title in its `CardHeader` and the actions in its `CardFooter`. The title names its question wherever it sits.

<!-- ::demo name="questionnaire-card" -->

```tsx
<Questionnaire items={items}>
  <Card>
    <QuestionnaireItem name="task">
      <CardHeader>
        <QuestionnaireTitle>What should the agent work on?</QuestionnaireTitle>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>…</CardContent>
    </QuestionnaireItem>
    <CardFooter>
      <QuestionnaireActions>…</QuestionnaireActions>
    </CardFooter>
  </Card>
</Questionnaire>
```

## Dialog

Put the questionnaire in a [Dialog](/docs/components/dialog) and close it from `onSubmit`. Cancel is a `DialogClose`, not part of the questionnaire.

<!-- ::demo name="questionnaire-dialog" -->

```tsx
<DialogContent aria-label="Clarification">
  <Questionnaire items={items} onSubmit={handleSubmit}>
    …
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <QuestionnaireActions>…</QuestionnaireActions>
    </DialogFooter>
  </Questionnaire>
</DialogContent>
```

## Agent

What `agent.snapshot()` lists for the preview example:

| Label                              | Component | Actions             |
| ---------------------------------- | --------- | ------------------- |
| Questionnaire progress             | progress  | None                |
| What should the agent build first? | radio     | `setValue`          |
| Another agent feature              | input     | `setValue`, `clear` |
| Next                               | button    | `press`             |

Only the active question is listed. The agent passes a choice's label or value to `setValue` on the question's group, and a `multiple` question also lists each checkbox by its label, with `setChecked`.

**Keep the buttons' words out of a title.** A title like "What should the agent build next?" makes "Next" name two components, so the agent can press Next only by its ref.

## API Reference

Every part takes `sx`, applied last.

| Part | Adds |
| --- | --- |
| `Questionnaire` | A `<form>` that validates on submit and jumps to the first unanswered question. Takes `items`, `defaultItem`, `item` and `onItemChange`, and `shortcuts` (`"letters"` or `"numbers"`) |
| `QuestionnaireProgress` | A [Progress](/docs/components/progress) at the question's number out of the number of questions, reading "Question 2 of 3" through a `ProgressValue` unless you pass children |
| `QuestionnaireItem` | A [Field Set](/docs/components/field) shown while it's the active question. Takes `name`, `multiple`, `defaultValue`, `onValueChange`, `invalid` and `onStatusChange` |
| `QuestionnaireTitle`, `Description` | A Field Legend and Field Description that name and describe the question |
| `QuestionnaireChoices` | A [Radio Group](/docs/components/radio-group), or a [Checkbox](/docs/components/checkbox) group in a `multiple` question, named by the title |
| `QuestionnaireChoice` | A choice card: a Field Label around the radio or checkbox, the label and the shortcut's Kbd. Takes `value` |
| `QuestionnaireChoiceDescription` | A secondary line under the choice's label, which describes its control |
| `QuestionnaireInput` | An [Input](/docs/components/input) for a freeform answer. Takes `defaultValue` and `onValueChange` |
| `QuestionnaireError` | Shown while the question is invalid, with a default message per `required` |
| `QuestionnaireActions` | A row: Previous at the start, the rest at the end |
| `QuestionnairePrevious`, `Skip` | A [Button](/docs/components/button), shown when it applies; `size` and `variant`, `outline` by default |
| `QuestionnaireNext`, `Submit` | A [Button](/docs/components/button), shown when it applies; `size` and `variant`, `primary` by default |

An entry in `items`:

| Field | Type | Does |
| --- | --- | --- |
| `name` | `string` | Matches the item's `name` and its form data |
| `required` | `boolean` | Hides Skip and needs an answer |
| `disabled` | `boolean` | Drops the question from progress and navigation |
| `choices` | `{ value, disabled? }[]` | Orders the shortcut keys; a `disabled` choice gets none and can't be picked |

`QuestionnaireItem` value props, by `multiple`:

| Prop | Single answer | `multiple` |
| --- | --- | --- |
| `defaultValue` | `string` | `string[]` |
| `onValueChange` | `(value: string \| null, details)` | `(value: string[], details)` |
