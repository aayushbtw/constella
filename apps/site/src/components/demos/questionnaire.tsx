import * as stylex from "@stylexjs/stylex";
import { useId, useMemo, useState } from "react";
import type { ComponentProps, SubmitEvent } from "react";
import { z } from "zod";

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
import type {
  QuestionnaireItemStatus,
  QuestionnaireShortcutMode,
} from "@/components/ai/questionnaire";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/primitives/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { Progress, ProgressLabel } from "@/components/primitives/progress";
import { toast } from "@/components/primitives/toast";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { DemoRow } from "~/components/demos/frame";
import {
  action,
  actionItems,
  approach,
  approachItems,
  approval,
  brief,
  clarification,
  context,
  contextItems,
  environment,
  handoff,
  permissions,
  plan,
  planNames,
  pullRequest,
  workflow,
} from "~/components/demos/questionnaire-data";
import type { Question } from "~/components/demos/questionnaire-data";

const styles = stylex.create({
  stage: { minHeight: 360, width: "100%" },
  form: { maxWidth: 448 },
});

function QuestionItem({
  question,
  ...props
}: { question: Question } & Partial<ComponentProps<typeof QuestionnaireItem>>) {
  return (
    <QuestionnaireItem
      multiple={question.multiple}
      name={question.name}
      required={question.required}
      {...props}
    >
      <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
      {question.description === undefined ? null : (
        <QuestionnaireDescription>
          {question.description}
        </QuestionnaireDescription>
      )}
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
  );
}

const answerValues = z.array(z.string());

function report(
  title: string,
  event: SubmitEvent<HTMLFormElement>,
  names: readonly string[]
) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const answers = names.map((name) => {
    const values = answerValues
      .parse(data.getAll(name))
      .filter((value) => value !== "");
    return `${name}: ${values.join(", ") || "none"}`;
  });
  toast.add({ description: answers.join(" · "), title });
}

function QuestionnaireDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={plan}
        onSubmit={(event) => {
          report("Agent plan saved", event, planNames);
        }}
        shortcuts="letters"
        sx={styles.form}
      >
        <QuestionnaireProgress />
        {plan.map((question) => (
          <QuestionItem key={question.name} question={question} />
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireMultipleDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={contextItems}
        onSubmit={(event) => {
          report("Context selected", event, ["context"]);
        }}
        shortcuts="letters"
        sx={styles.form}
      >
        <QuestionItem question={context} />
        <QuestionnaireActions>
          <QuestionnaireSubmit>Share context</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireFreeformDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={approachItems}
        onSubmit={(event) => {
          report("Approach selected", event, ["approach"]);
        }}
        shortcuts="letters"
        sx={styles.form}
      >
        <QuestionItem question={approach} />
        <QuestionnaireActions>
          <QuestionnaireSubmit>Use this approach</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireSkipDemo() {
  const [status, setStatus] = useState<QuestionnaireItemStatus>("unanswered");
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={brief}
        onSubmit={(event) => {
          report(
            status === "skipped"
              ? "Brief sent, constraints skipped"
              : "Brief sent",
            event,
            ["task", "constraints", "review"]
          );
        }}
        sx={styles.form}
      >
        <QuestionnaireProgress />
        <QuestionItem question={brief[0]} />
        <QuestionItem onStatusChange={setStatus} question={brief[1]} />
        <QuestionItem question={brief[2]} />
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Submit brief</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

const shortcutModes = ["none", "letters", "numbers"] as const;

function isShortcutMode(
  value: string
): value is (typeof shortcutModes)[number] {
  return shortcutModes.some((mode) => mode === value);
}

function QuestionnaireShortcutsDemo() {
  const [mode, setMode] = useState<"none" | QuestionnaireShortcutMode>(
    "letters"
  );
  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <ToggleGroup
            aria-label="Shortcuts"
            onValueChange={(next) => {
              const [picked] = next;
              if (picked !== undefined && isShortcutMode(picked)) {
                setMode(picked);
              }
            }}
            size="sm"
            spacing={0}
            value={[mode]}
            variant="outline"
          >
            <ToggleGroupItem value="none">None</ToggleGroupItem>
            <ToggleGroupItem value="letters">Letters</ToggleGroupItem>
            <ToggleGroupItem value="numbers">Numbers</ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
    >
      <Questionnaire
        items={actionItems}
        onSubmit={(event) => {
          report("Next action selected", event, ["action"]);
        }}
        shortcuts={mode === "none" ? undefined : mode}
        sx={styles.form}
      >
        <QuestionItem question={action} />
        <QuestionnaireActions>
          <QuestionnaireSubmit>Confirm action</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

const answerSchema = z
  .object({
    audience: z.enum(["team", "public"]),
    detail: z.enum(["summary", "complete"]),
  })
  .superRefine((answers, issue) => {
    if (answers.audience === "public" && answers.detail === "summary") {
      issue.addIssue({
        code: "custom",
        message:
          "Public answers need enough context. Choose a complete answer.",
        path: ["detail"],
      });
    }
  });

type AnswerName = keyof z.infer<typeof answerSchema>;

function isAnswerName(value: unknown): value is AnswerName {
  return answerSchema.keyof().safeParse(value).success;
}

const answerItems = [
  { name: "detail", required: true },
  { name: "audience", required: true },
] as const;

function ValidationProgress() {
  return (
    <QuestionnaireProgress
      render={(props, state) => (
        <div {...props}>
          {state.current} / {state.total}
        </div>
      )}
    />
  );
}

function QuestionnaireValidationDemo() {
  const [item, setItem] = useState("detail");
  const titleId = useId();
  const [errors, setErrors] = useState<Partial<Record<AnswerName, string>>>({});

  function clearError(name: AnswerName) {
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = answerSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget))
    );
    if (result.success) {
      setErrors({});
      toast.add({
        description: `detail: ${result.data.detail} · audience: ${result.data.audience}`,
        title: "Answer configured",
      });
      return;
    }
    const next: Partial<Record<AnswerName, string>> = {};
    for (const { message, path } of result.error.issues) {
      const [name] = path;
      if (isAnswerName(name) && next[name] === undefined) {
        next[name] = message;
      }
    }
    setErrors(next);
    const [first] = result.error.issues[0]?.path ?? [];
    if (isAnswerName(first)) {
      setItem(first);
    }
  }

  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        item={item}
        items={answerItems}
        onItemChange={setItem}
        onSubmit={handleSubmit}
        sx={styles.form}
      >
        <Card>
          <QuestionnaireItem
            aria-labelledby={`${titleId}-detail`}
            invalid={errors.detail !== undefined}
            name="detail"
            required
          >
            <CardHeader>
              <QuestionnaireTitle id={`${titleId}-detail`}>
                How much detail should the answer include?
              </QuestionnaireTitle>
              <QuestionnaireDescription>
                Choose the response depth.
              </QuestionnaireDescription>
              <CardAction>
                <ValidationProgress />
              </CardAction>
            </CardHeader>
            <CardContent>
              <QuestionnaireChoices>
                <QuestionnaireChoice
                  onChange={() => {
                    clearError("detail");
                  }}
                  value="summary"
                >
                  Concise summary
                </QuestionnaireChoice>
                <QuestionnaireChoice
                  onChange={() => {
                    clearError("detail");
                  }}
                  value="complete"
                >
                  Complete answer
                </QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError>{errors.detail}</QuestionnaireError>
            </CardContent>
          </QuestionnaireItem>
          <QuestionnaireItem
            aria-labelledby={`${titleId}-audience`}
            invalid={errors.audience !== undefined}
            name="audience"
            required
          >
            <CardHeader>
              <QuestionnaireTitle id={`${titleId}-audience`}>
                Who will read the answer?
              </QuestionnaireTitle>
              <QuestionnaireDescription>
                Public answers require complete context.
              </QuestionnaireDescription>
              <CardAction>
                <ValidationProgress />
              </CardAction>
            </CardHeader>
            <CardContent>
              <QuestionnaireChoices>
                <QuestionnaireChoice
                  onChange={() => {
                    clearError("audience");
                  }}
                  value="team"
                >
                  My team
                </QuestionnaireChoice>
                <QuestionnaireChoice
                  onChange={() => {
                    clearError("audience");
                  }}
                  value="public"
                >
                  Public audience
                </QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError>{errors.audience}</QuestionnaireError>
            </CardContent>
          </QuestionnaireItem>
          <CardFooter>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit>Validate answers</QuestionnaireSubmit>
            </QuestionnaireActions>
          </CardFooter>
        </Card>
      </Questionnaire>
    </DemoRow>
  );
}

const workflowLabels = {
  checks: "Verification",
  output: "Output",
  scope: "Scope",
} satisfies Record<(typeof workflow)[number]["name"], string>;

function QuestionnaireControlledDemo() {
  const [item, setItem] = useState<string>("scope");
  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <ToggleGroup
            aria-label="Active question"
            onValueChange={(next) => {
              const [picked] = next;
              if (picked !== undefined) {
                setItem(picked);
              }
            }}
            size="sm"
            spacing={0}
            value={[item]}
            variant="outline"
          >
            {workflow.map((question) => (
              <ToggleGroupItem key={question.name} value={question.name}>
                {workflowLabels[question.name]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      }
    >
      <Questionnaire
        item={item}
        items={workflow}
        onItemChange={setItem}
        onSubmit={(event) => {
          report("Workflow configured", event, ["scope", "checks", "output"]);
        }}
        sx={styles.form}
      >
        <QuestionnaireProgress />
        {workflow.map((question) => (
          <QuestionItem key={question.name} question={question} />
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

const draftItems = [
  { name: "change", required: true },
  { name: "verification", required: true },
  { name: "notes" },
] as const;

function QuestionnaireResumeDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        defaultItem="verification"
        items={draftItems}
        onReset={() => {
          toast.add({ title: "Saved answers restored" });
        }}
        onSubmit={(event) => {
          report("Draft updated", event, ["change", "verification", "notes"]);
        }}
        sx={styles.form}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="change" required>
          <QuestionnaireTitle>
            What kind of migration is this?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            This answer was saved during the previous session.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice defaultChecked value="incremental">
              Incremental migration
            </QuestionnaireChoice>
            <QuestionnaireChoice value="cutover">
              Single cutover
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem multiple name="verification" required>
          <QuestionnaireTitle>
            How should the migration be verified?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            These checks were selected during the previous session.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice defaultChecked value="tests">
              Run migration tests
            </QuestionnaireChoice>
            <QuestionnaireChoice defaultChecked value="typecheck">
              Run the typecheck
            </QuestionnaireChoice>
            <QuestionnaireChoice value="manual">
              Perform a manual smoke test
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="notes">
          <QuestionnaireTitle>
            Anything else the agent should remember?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            This note was saved with the draft.
          </QuestionnaireDescription>
          <QuestionnaireInput
            aria-label="Saved migration note"
            defaultValue="Keep the existing public API stable."
          />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <Button type="reset" variant="outline">
            Reset changes
          </Button>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Update draft</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireConditionalDemo() {
  const [runtime, setRuntime] = useState("local");
  const cloud = runtime === "cloud";
  const items = useMemo(
    () => [
      { name: "runtime", required: true },
      { disabled: !cloud, name: "environment", required: true },
      { name: "approval", required: true },
    ],
    [cloud]
  );
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={items}
        onSubmit={(event) => {
          report("Execution plan saved", event, [
            "runtime",
            "environment",
            "approval",
          ]);
        }}
        sx={styles.form}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="runtime" required>
          <QuestionnaireTitle>Where should the agent run?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Cloud runs add an environment question to this flow.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice
              checked={!cloud}
              onChange={() => {
                setRuntime("local");
              }}
              value="local"
            >
              Local workspace
            </QuestionnaireChoice>
            <QuestionnaireChoice
              checked={cloud}
              onChange={() => {
                setRuntime("cloud");
              }}
              value="cloud"
            >
              Cloud workspace
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionItem disabled={!cloud} question={environment} />
        <QuestionItem question={approval} />
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Save execution plan</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireNavigationDemo() {
  const [item, setItem] = useState<string>("permission");
  const [statuses, setStatuses] = useState<
    Record<string, QuestionnaireItemStatus>
  >({});
  const unanswered = (statuses[item] ?? "unanswered") === "unanswered";
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        item={item}
        items={permissions}
        onItemChange={setItem}
        onSubmit={(event) => {
          report("Permissions saved", event, ["permission", "verification"]);
        }}
        sx={styles.form}
      >
        <QuestionnaireProgress />
        {permissions.map((question) => (
          <QuestionItem
            key={question.name}
            onStatusChange={(status) => {
              setStatuses((current) => ({
                ...current,
                [question.name]: status,
              }));
            }}
            question={question}
          />
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext disabled={unanswered} variant="secondary" />
          <QuestionnaireSubmit disabled={unanswered}>
            Save permissions
          </QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireProgressDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={pullRequest}
        onSubmit={(event) => {
          report("Pull request plan ready", event, [
            "scope",
            "strategy",
            "tests",
            "delivery",
          ]);
        }}
        sx={styles.form}
      >
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
        {pullRequest.map((question) => (
          <QuestionItem key={question.name} question={question} />
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Finish plan</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </DemoRow>
  );
}

function CardQuestion({ question }: { question: Question }) {
  const titleId = useId();
  return (
    <QuestionnaireItem
      aria-labelledby={titleId}
      name={question.name}
      required={question.required}
    >
      <CardHeader>
        <QuestionnaireTitle id={titleId}>{question.title}</QuestionnaireTitle>
        <QuestionnaireDescription>
          {question.description}
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          {question.choices.map((choice) => (
            <QuestionnaireChoice key={choice.value} value={choice.value}>
              {choice.label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
    </QuestionnaireItem>
  );
}

function QuestionnaireCardDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Questionnaire
        items={handoff}
        onSubmit={(event) => {
          report("Agent task created", event, ["task", "output"]);
        }}
        shortcuts="numbers"
        sx={styles.form}
      >
        <Card>
          {handoff.map((question) => (
            <CardQuestion key={question.name} question={question} />
          ))}
          <CardFooter>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit>Create task</QuestionnaireSubmit>
            </QuestionnaireActions>
          </CardFooter>
        </Card>
      </Questionnaire>
    </DemoRow>
  );
}

function QuestionnaireDialogDemo() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  return (
    <DemoRow>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger render={<Button variant="outline" />}>
          Open clarification
        </DialogTrigger>
        <DialogContent aria-label="Clarification">
          <Questionnaire
            items={clarification}
            onSubmit={(event) => {
              report("Clarification sent", event, ["scope", "tests"]);
              setOpen(false);
            }}
          >
            {clarification.map((question) => (
              <QuestionnaireItem
                aria-labelledby={`${titleId}-${question.name}`}
                key={question.name}
                name={question.name}
                required={question.required}
              >
                <DialogHeader>
                  <QuestionnaireProgress />
                  <QuestionnaireTitle id={`${titleId}-${question.name}`}>
                    {question.title}
                  </QuestionnaireTitle>
                  <QuestionnaireDescription>
                    {question.description}
                  </QuestionnaireDescription>
                </DialogHeader>
                <QuestionnaireChoices>
                  {question.choices.map((choice) => (
                    <QuestionnaireChoice
                      key={choice.value}
                      value={choice.value}
                    >
                      {choice.label}
                    </QuestionnaireChoice>
                  ))}
                </QuestionnaireChoices>
                <QuestionnaireError />
              </QuestionnaireItem>
            ))}
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <QuestionnaireActions>
                <QuestionnairePrevious />
                <QuestionnaireNext />
                <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
              </QuestionnaireActions>
            </DialogFooter>
          </Questionnaire>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

export {
  QuestionnaireCardDemo,
  QuestionnaireConditionalDemo,
  QuestionnaireControlledDemo,
  QuestionnaireDemo,
  QuestionnaireDialogDemo,
  QuestionnaireFreeformDemo,
  QuestionnaireMultipleDemo,
  QuestionnaireNavigationDemo,
  QuestionnaireProgressDemo,
  QuestionnaireResumeDemo,
  QuestionnaireShortcutsDemo,
  QuestionnaireSkipDemo,
  QuestionnaireValidationDemo,
};
