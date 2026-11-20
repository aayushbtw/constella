import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

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
} from "./questionnaire";

const agent = createAgent();

interface Question {
  choices: readonly { description?: string; label: string; value: string }[];
  description?: string;
  input?: { label: string; placeholder: string };
  multiple?: boolean;
  name: string;
  required?: boolean;
  title: string;
}

const plan = [
  {
    choices: [
      {
        description: "Show what the agent ran and what came back.",
        label: "Tool call timeline",
        value: "tool-calls",
      },
      {
        description: "Ask before sensitive or destructive actions.",
        label: "Approval checkpoints",
        value: "approvals",
      },
      {
        description: "Make delegated work and results easier to follow.",
        label: "Sub-agent handoffs",
        value: "handoffs",
      },
    ],
    description: "Choose a direction or describe another task.",
    input: {
      label: "Another agent feature",
      placeholder: "Describe another feature…",
    },
    name: "direction",
    required: true,
    title: "What should the agent build next?",
  },
  {
    choices: [
      { label: "Progress", value: "progress" },
      { label: "Decisions", value: "decisions" },
      { label: "Risks", value: "risks" },
      { label: "Next step", value: "next-step" },
    ],
    description: "Select all that apply, or skip this question.",
    multiple: true,
    name: "signals",
    title: "What should every progress update include?",
  },
  {
    choices: [
      { label: "Start now", value: "now" },
      { label: "Next development cycle", value: "next-cycle" },
      { label: "Add it to the backlog", value: "backlog" },
    ],
    description: "Choose when the agent should begin the work.",
    name: "timing",
    required: true,
    title: "When should work begin?",
  },
] as const satisfies readonly Question[];

function Plan({ onSubmit }: { onSubmit?: (data: FormData) => void }) {
  return (
    <Questionnaire
      items={plan}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(new FormData(event.currentTarget));
      }}
      shortcuts="letters"
    >
      <QuestionnaireProgress />
      {plan.map((question: Question) => (
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
                {choice.description === undefined ? null : (
                  <QuestionnaireChoiceDescription>
                    {choice.description}
                  </QuestionnaireChoiceDescription>
                )}
              </QuestionnaireChoice>
            ))}
            {question.input === undefined ? null : (
              <QuestionnaireInput
                aria-label={question.input.label}
                placeholder={question.input.placeholder}
              />
            )}
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
  );
}

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const navigation = () =>
  entries()
    .filter((entry) => entry.component === "button")
    .map((entry) => entry.label);

const progress = () => screen.getByRole("progressbar").textContent;

// The choices aren't in the snapshot. @shadcn/react 0.3.1's ChoiceInput must be a native input: Questionnaire reads its `checked` and `validity` and moves radios with arrow keys by `instanceof HTMLInputElement`, so it can't render as ui-sdk's Checkbox or Radio.
test("an agent finds the navigation by name and walks the questionnaire to submit", async () => {
  const onSubmit = vi.fn<(data: FormData) => void>();
  render(<Plan onSubmit={onSubmit} />);

  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(
    entries().map(({ actions, component, label }) => ({
      actions,
      component,
      label,
    }))
  ).toEqual([
    {
      actions: ["setValue", "clear"],
      component: "input",
      label: "Another agent feature",
    },
    { actions: ["press"], component: "button", label: "Next" },
  ]);

  const first = await agent.act({
    steps: [
      {
        action: "setValue",
        args: ["Inline diff review"],
        ref: "Another agent feature",
      },
      { action: "press", ref: "Next" },
    ],
  });
  expect(first.ok, first.error?.message).toBe(true);
  expect(progress()).toBe("Question 2 of 3");
  expect(navigation()).toEqual(["Previous", "Skip", "Next"]);

  const back = await agent.act({
    steps: [{ action: "press", ref: "Previous" }],
  });
  expect(back.ok, back.error?.message).toBe(true);
  expect(progress()).toBe("Question 1 of 3");

  const skip = await agent.act({
    steps: [
      { action: "press", ref: "Next" },
      { action: "press", ref: "Skip" },
    ],
  });
  expect(skip.ok, skip.error?.message).toBe(true);
  expect(progress()).toBe("Question 3 of 3");
  expect(navigation()).toEqual(["Previous", "Save plan"]);

  fireEvent.click(screen.getByRole("radio", { name: "Start now" }));
  const submit = await agent.act({
    steps: [{ action: "press", ref: "Save plan" }],
  });
  expect(submit.ok, submit.error?.message).toBe(true);
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(Object.fromEntries(onSubmit.mock.calls[0]?.[0] ?? [])).toEqual({
    direction: "Inline diff review",
    timing: "now",
  });
});
