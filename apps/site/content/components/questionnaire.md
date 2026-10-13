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
      required={question.required}
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

**Patch `@shadcn/react` 0.3.1 if you server-render.** On React 19.3, a question with a `QuestionnaireInput` loops on hydration ("Maximum update depth exceeded"); apply [Constella's patch](https://github.com/aayushbtw/constella/blob/main/patches/@shadcn__react@0.3.1.patch) with `pnpm patch` until a fixed release ships.

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
} from "@/components/ui/questionnaire";
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

Define the questions once: pass them to `Questionnaire` as `items` so progress, actions and shortcuts render on the server, then map them into the parts. The answers arrive as the form's data on submit, one entry per `name`; `getAll` reads a `multiple` question.

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
│   │   ├── QuestionnaireChoice
│   │   │   └── QuestionnaireChoiceDescription
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

Questionnaire owns the order, the active question, the answers, validation and navigation. The page, card or dialog around it owns closing, saving, sending and branching.

## Multiple

Use the `multiple` prop on an item that takes more than one answer. Its choices become checkboxes.

<!-- ::demo name="questionnaire-multiple" -->

```tsx
<QuestionnaireItem multiple name="context" required>
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

Add a `QuestionnaireInput` after the choices for an answer of the user's own. Typing in it clears the picked choice. Give it an `aria-label`; a placeholder is not a label.

<!-- ::demo name="questionnaire-freeform" -->

```tsx
<QuestionnaireChoices>
  <QuestionnaireChoice value="incremental">
    Make the smallest safe change
  </QuestionnaireChoice>
  <QuestionnaireInput
    aria-label="Another refactoring approach"
    placeholder="Describe another approach…"
  />
</QuestionnaireChoices>
```

## Questionnaire Skip

Add a `QuestionnaireSkip` to let an optional item be left unanswered on purpose. It shows only on items without `required`; `onStatusChange` tells skipped apart from unanswered.

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

Use the `shortcuts` prop to give each answer a letter or number key, shown as a Kbd on the choice. Enter moves on, and arrow keys move between answers and questions.

<!-- ::demo name="questionnaire-shortcuts" -->

```tsx
<Questionnaire items={items} shortcuts="numbers">
  …
</Questionnaire>
```

## Questionnaire Progress

Use the `render` prop for your own progress, from `state.current` and `state.total`. A [Progress](/docs/components/progress) bar inside it is `aria-hidden`, since the part already reports the step.

<!-- ::demo name="questionnaire-progress" -->

```tsx
<QuestionnaireProgress
  render={(props, state) => (
    <div {...props}>
      <Progress aria-hidden max={state.total} value={state.current}>
        <ProgressLabel>
          Step {state.current} of {state.total}
        </ProgressLabel>
      </Progress>
    </div>
  )}
/>
```

## Reset

Use `defaultItem` and `defaultChecked` to resume a saved draft. A `type="reset"` button restores those answers and returns to the saved question.

<!-- ::demo name="questionnaire-resume" -->

```tsx
<Questionnaire defaultItem="verification" items={items}>
  <QuestionnaireItem name="change" required>
    <QuestionnaireChoice defaultChecked value="incremental">
      Incremental migration
    </QuestionnaireChoice>
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

Use the `disabled` prop on an item, and on its entry in `items`, to drop a question that doesn't apply. Progress and navigation skip it.

<!-- ::demo name="questionnaire-conditional" -->

```tsx
const items = [
  { name: "runtime", required: true },
  { disabled: runtime !== "cloud", name: "environment", required: true },
];

<QuestionnaireItem disabled={runtime !== "cloud"} name="environment" required>
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

Use the `invalid` prop with your own schema, such as Zod, and pass the message to `QuestionnaireError`. Move to the invalid question with `item`.

<!-- ::demo name="questionnaire-validation" -->

```tsx
<QuestionnaireItem invalid={errors.detail !== undefined} name="detail" required>
  …<QuestionnaireError>{errors.detail}</QuestionnaireError>
</QuestionnaireItem>
```

## Card

Wrap the items in a [Card](/docs/components/card), each question's title in its `CardHeader` and the actions in its `CardFooter`. Point the item's `aria-labelledby` at the title, since it no longer sits first in the fieldset.

<!-- ::demo name="questionnaire-card" -->

```tsx
<Questionnaire items={items}>
  <Card>
    <QuestionnaireItem aria-labelledby={titleId} name="task" required>
      <CardHeader>
        <QuestionnaireTitle id={titleId}>
          What should the agent work on?
        </QuestionnaireTitle>
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

## API Reference

Every part takes `sx`, applied last. The rest is [shadcn's Questionnaire](https://ui.shadcn.com/docs/react/questionnaire#api-reference).

| Part | Adds |
| --- | --- |
| `QuestionnaireChoice` | A card holding the radio or checkbox, label and shortcut |
| `QuestionnaireChoiceDescription` | A secondary line under the choice's label |
| `QuestionnaireActions` | A row: Previous at the start, the rest at the end |
| `QuestionnairePrevious`, `Skip` | Button's `size` and `variant`; `outline` by default |
| `QuestionnaireNext`, `Submit` | Button's `size` and `variant`; `primary` by default |
