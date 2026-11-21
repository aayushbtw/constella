import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
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
import type { QuestionnaireItemStatus } from "./questionnaire";

// jsdom has no layout. A browser draws a hidden question as `display: none`, which the bridge leaves out.
Element.prototype.checkVisibility = function checkVisibility() {
  return this.closest("[hidden]") === null;
};

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
    title: "What should the agent build first?",
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

function Plan({
  onSignals,
  onSubmit,
}: {
  onSignals?: (status: QuestionnaireItemStatus) => void;
  onSubmit?: (data: FormData) => void;
}) {
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
          onStatusChange={question.name === "signals" ? onSignals : undefined}
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
          </QuestionnaireChoices>
          {question.input === undefined ? null : (
            <QuestionnaireInput
              aria-label={question.input.label}
              placeholder={question.input.placeholder}
            />
          )}
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

const visible = () =>
  entries().map(({ actions, component, items, label }) => ({
    actions,
    component,
    items,
    label,
  }));

const navigation = () =>
  visible()
    .filter((entry) => entry.component === "button")
    .map((entry) => entry.label)
    .toSorted((a, b) => String(a).localeCompare(String(b)));

const progress = () => screen.getByRole("progressbar").textContent;

test("an agent sees every choice, the freeform answer and the navigation by name", () => {
  render(<Plan />);
  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(visible()).toEqual([
    {
      actions: [],
      component: "progress",
      items: undefined,
      label: "Questionnaire progress",
    },
    {
      actions: ["setValue"],
      component: "radio",
      items: [
        { label: "Tool call timeline", value: "tool-calls" },
        { label: "Approval checkpoints", value: "approvals" },
        { label: "Sub-agent handoffs", value: "handoffs" },
      ],
      label: "What should the agent build first?",
    },
    {
      actions: ["setValue", "clear"],
      component: "input",
      items: undefined,
      label: "Another agent feature",
    },
    {
      actions: ["press"],
      component: "button",
      items: undefined,
      label: "Next",
    },
  ]);
  expect(
    screen
      .getByRole("radio", { name: "Tool call timeline" })
      .getAttribute("aria-describedby")
  ).toBe(screen.getByText("Show what the agent ran and what came back.").id);
});

test("an agent answers each question, skips one and submits the form data", async () => {
  const onSubmit = vi.fn<(data: FormData) => void>();
  render(<Plan onSubmit={onSubmit} />);

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
  expect(navigation()).toEqual(["Next", "Previous", "Skip"]);
  expect(
    visible()
      .filter((entry) => entry.component === "checkbox")
      .map((entry) => [entry.label, entry.actions])
  ).toEqual([
    ["Progress", ["setChecked"]],
    ["Decisions", ["setChecked"]],
    ["Risks", ["setChecked"]],
    ["Next step", ["setChecked"]],
    ["What should every progress update include?", ["setValue", "setAll"]],
  ]);

  const back = await agent.act({
    steps: [{ action: "press", ref: "Previous" }],
  });
  expect(back.ok, back.error?.message).toBe(true);
  expect(progress()).toBe("Question 1 of 3");

  const skip = await agent.act({
    steps: [
      { action: "press", ref: "Next" },
      { action: "setChecked", args: [true], ref: "Risks" },
      { action: "press", ref: "Skip" },
    ],
  });
  expect(skip.ok, skip.error?.message).toBe(true);
  expect(progress()).toBe("Question 3 of 3");
  expect(navigation()).toEqual(["Previous", "Save plan"]);

  const submit = await agent.act({
    steps: [
      {
        action: "setValue",
        args: ["Start now"],
        ref: "When should work begin?",
      },
      { action: "press", ref: "Save plan" },
    ],
  });
  expect(submit.ok, submit.error?.message).toBe(true);
  expect(
    screen
      .getByRole("radio", { name: "Start now" })
      .getAttribute("aria-checked")
  ).toBe("true");
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(Object.fromEntries(onSubmit.mock.calls[0]?.[0] ?? [])).toEqual({
    direction: "Inline diff review",
    timing: "now",
  });
});

test("Enter moves on from an answered question and shows the error on an unanswered one", async () => {
  render(<Plan />);
  // ui-sdk's groups and field sets connect their parts a moment after mount.
  await act(async () => {});
  const timeline = screen.getByRole("radio", { name: "Tool call timeline" });
  fireEvent.click(timeline);
  fireEvent.keyDown(timeline, { key: "Enter" });
  expect(progress()).toBe("Question 2 of 3");
  const item = screen
    .getByRole("checkbox", { name: "Progress" })
    .closest("fieldset");
  expect(document.activeElement).toBe(item);

  const progressChoice = screen.getByRole("checkbox", { name: "Progress" });
  fireEvent.keyDown(progressChoice, { key: "Enter" });
  expect(progress()).toBe("Question 2 of 3");
  const error = screen.getByRole("alert");
  expect(error.textContent).toBe("Choose an answer or skip this question.");
  expect(item?.getAttribute("aria-describedby")?.split(" ")).toEqual([
    screen.getByText("Select all that apply, or skip this question.").id,
    error.id,
  ]);
  expect(progressChoice.getAttribute("aria-invalid")).toBe("true");
  expect(document.activeElement).toBe(progressChoice);

  fireEvent.click(progressChoice);
  expect(screen.queryByRole("alert")).toBeNull();
  fireEvent.keyDown(progressChoice, { key: "Enter", metaKey: true });
  expect(progress()).toBe("Question 3 of 3");
});

test("typing a freeform answer clears the picked choice, and picking one clears the text", () => {
  const onSubmit = vi.fn<(data: FormData) => void>();
  render(<Plan onSubmit={onSubmit} />);
  const handoffs = screen.getByRole("radio", { name: "Sub-agent handoffs" });
  const freeform = screen.getByRole("textbox", {
    name: "Another agent feature",
  });
  fireEvent.click(handoffs);
  fireEvent.input(freeform, { target: { value: "Diff review" } });
  expect(handoffs.getAttribute("aria-checked")).toBe("false");
  expect(freeform).toHaveProperty("value", "Diff review");

  fireEvent.click(handoffs);
  expect(handoffs.getAttribute("aria-checked")).toBe("true");
  expect(freeform).toHaveProperty("value", "");
  fireEvent.keyDown(freeform, { key: "ArrowDown" });
  expect(handoffs.getAttribute("aria-checked")).toBe("true");
});

test("letter shortcuts pick a choice while focus is in the form, shown as a key on each choice", () => {
  render(<Plan />);
  const approvals = screen.getByRole("radio", { name: "Approval checkpoints" });
  expect(approvals.getAttribute("aria-keyshortcuts")).toBe("B");
  expect(
    screen
      .getAllByText("B")
      .some(
        (key) =>
          key.closest("[data-slot='field-label']")?.contains(approvals) === true
      )
  ).toBe(true);
  fireEvent.keyDown(document.body, { key: "b" });
  expect(approvals.getAttribute("aria-checked")).toBe("false");

  approvals.focus();
  fireEvent.keyDown(approvals, { key: "b" });
  expect(approvals.getAttribute("aria-checked")).toBe("true");

  const freeform = screen.getByRole("textbox");
  freeform.focus();
  fireEvent.keyDown(freeform, { key: "c" });
  expect(approvals.getAttribute("aria-checked")).toBe("true");
});

test("a skip reports its status, and submitting jumps to the first unanswered question", () => {
  const onSignals = vi.fn<(status: QuestionnaireItemStatus) => void>();
  const onSubmit = vi.fn<(data: FormData) => void>();
  render(<Plan onSignals={onSignals} onSubmit={onSubmit} />);
  fireEvent.click(screen.getByRole("radio", { name: "Tool call timeline" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
  expect(onSignals).toHaveBeenLastCalledWith("skipped");

  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  fireEvent.click(screen.getByRole("radio", { name: "Tool call timeline" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Risks" }));
  expect(onSignals).toHaveBeenLastCalledWith("answered");
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.submit(
    screen.getByRole("progressbar").closest("form") ?? document.body
  );
  expect(onSubmit).not.toHaveBeenCalled();
  expect(progress()).toBe("Question 3 of 3");
  expect(screen.getByRole("alert").textContent).toBe(
    "Choose an answer to continue."
  );
});

const draft = [
  { name: "change", required: true },
  { name: "verification", required: true },
  { disabled: true, name: "environment" },
  { name: "notes" },
] as const;

function Draft({
  onChange,
}: {
  onChange?: (value: string | null, reason: string) => void;
}) {
  const [cancel, setCancel] = useState(false);
  return (
    <Questionnaire defaultItem="verification" items={draft}>
      <QuestionnaireProgress />
      <QuestionnaireItem
        defaultValue="incremental"
        name="change"
        onValueChange={(value, details) => {
          onChange?.(value, details.reason);
          if (cancel) {
            details.cancel();
          }
        }}
      >
        <QuestionnaireTitle>What kind of migration is this?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental">
            Incremental migration
          </QuestionnaireChoice>
          <QuestionnaireChoice value="cutover">
            Single cutover
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem
        defaultValue={["tests", "typecheck"]}
        multiple
        name="verification"
      >
        <QuestionnaireTitle>How should it be verified?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests">
            Run migration tests
          </QuestionnaireChoice>
          <QuestionnaireChoice value="typecheck">
            Run the typecheck
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="environment">
        <QuestionnaireTitle>Which environment?</QuestionnaireTitle>
      </QuestionnaireItem>
      <QuestionnaireItem name="notes">
        <QuestionnaireTitle>Anything else?</QuestionnaireTitle>
        <QuestionnaireInput
          aria-label="Saved note"
          defaultValue="Keep the public API stable."
        />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <button
          onClick={() => {
            setCancel(true);
          }}
          type="button"
        >
          Lock
        </button>
        <button type="reset">Reset changes</button>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}

test("defaults resume a draft, a disabled question drops out, and reset restores both", async () => {
  const onChange = vi.fn<(value: string | null, reason: string) => void>();
  render(<Draft onChange={onChange} />);
  expect(progress()).toBe("Question 2 of 3");
  const tests = screen.getByRole("checkbox", { name: "Run migration tests" });
  expect(tests.getAttribute("aria-checked")).toBe("true");
  fireEvent.click(tests);
  expect(tests.getAttribute("aria-checked")).toBe("false");

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(progress()).toBe("Question 3 of 3");
  expect(screen.getByRole("textbox", { name: "Saved note" })).toHaveProperty(
    "value",
    "Keep the public API stable."
  );

  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  const cutover = screen.getByRole("radio", { name: "Single cutover" });
  fireEvent.click(cutover);
  expect(onChange).toHaveBeenLastCalledWith("cutover", "item-press");
  expect(cutover.getAttribute("aria-checked")).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Lock" }));
  fireEvent.click(screen.getByRole("radio", { name: "Incremental migration" }));
  expect(cutover.getAttribute("aria-checked")).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Reset changes" }));
  expect(progress()).toBe("Question 2 of 3");
  // Controls read their reset values after the reset event, so they settle a tick later.
  await waitFor(() => {
    expect(tests.getAttribute("aria-checked")).toBe("true");
  });
  expect(
    screen
      .getByRole("radio", { hidden: true, name: "Incremental migration" })
      .getAttribute("aria-checked")
  ).toBe("true");
});
