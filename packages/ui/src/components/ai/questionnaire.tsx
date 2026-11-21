"use client";

import * as stylex from "@stylexjs/stylex";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";
import {
  createContext,
  use,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type {
  ComponentProps,
  KeyboardEvent,
  ReactNode,
  SubmitEvent,
  SyntheticEvent,
} from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonStyleOptions } from "@/components/primitives/button";
import { Checkbox, CheckboxGroup } from "@/components/primitives/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Kbd } from "@/components/primitives/kbd";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/primitives/radio-group";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  lineHeights,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const questionnaireShortcutModes = ["letters", "numbers"] as const;
type QuestionnaireShortcutMode = (typeof questionnaireShortcutModes)[number];

const questionnaireItemStatuses = [
  "unanswered",
  "answered",
  "skipped",
] as const;
type QuestionnaireItemStatus = (typeof questionnaireItemStatuses)[number];

interface QuestionnaireChoiceDefinition {
  disabled?: boolean;
  value: string;
}

interface QuestionnaireItemDefinition {
  choices?: readonly QuestionnaireChoiceDefinition[];
  disabled?: boolean;
  name: string;
  required?: boolean;
}

const shortcutKeys = {
  letters: Array.from({ length: 26 }, (_, index) =>
    String.fromCodePoint(65 + index)
  ),
  numbers: Array.from({ length: 9 }, (_, index) => String(index + 1)),
} satisfies Record<QuestionnaireShortcutMode, string[]>;

interface Given {
  choices: readonly string[];
  text: string;
}

type Answer = { kind: "skipped" } | ({ kind: "given" } & Given);

interface Entry {
  answer: Answer;
  attempted: boolean;
  invalid: boolean;
  touched: boolean;
}

interface Answers {
  defaults: Partial<Record<string, Given>>;
  entries: Partial<Record<string, Entry>>;
}

type AnswersAction =
  | { name: string; seed: Partial<Given>; type: "seed" }
  | {
      choices: readonly string[];
      multiple: boolean;
      name: string;
      type: "choose";
    }
  | { multiple: boolean; name: string; text: string; type: "type" }
  | { name: string; type: "skip" }
  | { name: string; type: "attempt" }
  | { invalid: boolean; name: string; type: "mark" }
  | { type: "reset" };

const blank: Given = { choices: [], text: "" };

function entryOf(answers: Answers, name: string): Entry {
  return (
    answers.entries[name] ?? {
      answer: { kind: "given", ...(answers.defaults[name] ?? blank) },
      attempted: false,
      invalid: false,
      touched: false,
    }
  );
}

function givenOf(answers: Answers, name: string): Given {
  const { answer } = entryOf(answers, name);
  return answer.kind === "given" ? answer : blank;
}

function withEntry(answers: Answers, name: string, entry: Entry): Answers {
  return { ...answers, entries: { ...answers.entries, [name]: entry } };
}

function withAnswer(answers: Answers, name: string, answer: Answer): Answers {
  const entry = entryOf(answers, name);
  return withEntry(answers, name, {
    ...entry,
    answer,
    attempted: answer.kind === "given" && entry.attempted,
    touched: true,
  });
}

function answersReducer(answers: Answers, action: AnswersAction): Answers {
  switch (action.type) {
    case "seed": {
      const entry = entryOf(answers, action.name);
      const seeded = {
        ...answers,
        defaults: {
          ...answers.defaults,
          [action.name]: {
            ...(answers.defaults[action.name] ?? blank),
            ...action.seed,
          },
        },
      };
      return entry.touched
        ? seeded
        : withEntry(seeded, action.name, {
            ...entry,
            answer: {
              kind: "given",
              ...givenOf(answers, action.name),
              ...action.seed,
            },
          });
    }
    case "choose": {
      const replaces = !action.multiple && action.choices.length > 0;
      return withAnswer(answers, action.name, {
        choices: action.choices,
        kind: "given",
        text: replaces ? "" : givenOf(answers, action.name).text,
      });
    }
    case "type": {
      const replaces = !action.multiple && action.text.trim() !== "";
      return withAnswer(answers, action.name, {
        choices: replaces ? [] : givenOf(answers, action.name).choices,
        kind: "given",
        text: action.text,
      });
    }
    case "skip": {
      return withAnswer(answers, action.name, { kind: "skipped" });
    }
    case "attempt": {
      return withEntry(answers, action.name, {
        ...entryOf(answers, action.name),
        attempted: true,
      });
    }
    case "mark": {
      return withEntry(answers, action.name, {
        ...entryOf(answers, action.name),
        invalid: action.invalid,
      });
    }
    case "reset": {
      return {
        defaults: answers.defaults,
        entries: Object.fromEntries(
          Object.entries(answers.defaults).map(([name, defaults]) => [
            name,
            {
              answer: { kind: "given", ...(defaults ?? blank) },
              attempted: false,
              invalid: entryOf(answers, name).invalid,
              touched: false,
            },
          ])
        ),
      };
    }
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

function statusOf(answer: Answer): QuestionnaireItemStatus {
  if (answer.kind === "skipped") {
    return "skipped";
  }
  return answer.choices.length > 0 || answer.text.trim() !== ""
    ? "answered"
    : "unanswered";
}

function isValid(definition: QuestionnaireItemDefinition, entry: Entry) {
  if (definition.disabled === true) {
    return true;
  }
  const status = statusOf(entry.answer);
  return status === "skipped" || (!entry.invalid && status === "answered");
}

function isTextEntry(target: EventTarget) {
  if (target instanceof HTMLInputElement) {
    return !["button", "checkbox", "radio", "reset", "submit"].includes(
      target.type
    );
  }
  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

const activeItem = "[data-slot='field-set'][data-active]";
const answerControl = "[role='radio'], [role='checkbox'], input";
const firstControl =
  "[role='radio'][tabindex='0']:not(:disabled), [role='checkbox']:not(:disabled), input:not([type='hidden']):not(:disabled)";

type FocusTarget = "item" | "control";

interface QuestionnaireContextValue {
  answers: Answers;
  current: QuestionnaireItemDefinition | undefined;
  definitions: ReadonlyMap<string, QuestionnaireItemDefinition>;
  dispatch: (action: AnswersAction) => void;
  goNext: () => void;
  goPrevious: () => void;
  index: number;
  shortcuts: QuestionnaireShortcutMode | undefined;
  skip: () => void;
  total: number;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null
);

function useQuestionnaire(part: string) {
  const context = use(QuestionnaireContext);
  if (context === null) {
    throw new Error(`${part} must be used inside Questionnaire.`);
  }
  return context;
}

type SingleChange = Parameters<
  NonNullable<ComponentProps<typeof RadioGroup>["onValueChange"]>
>;
type MultipleChange = Parameters<
  NonNullable<ComponentProps<typeof CheckboxGroup>["onValueChange"]>
>;
type TextChange = Parameters<
  NonNullable<ComponentProps<typeof Input>["onValueChange"]>
>;

interface QuestionnaireItemContextValue {
  chooseMany: (...change: MultipleChange) => void;
  chooseOne: (...change: SingleChange) => void;
  definition: QuestionnaireItemDefinition;
  given: Given;
  ids: { description: string; error: string; title: string };
  invalid: boolean;
  multiple: boolean;
  name: string;
  setDescribed: (described: boolean) => void;
  shortcutOf: (value: string) => string | undefined;
  type: (text: string) => void;
}

const QuestionnaireItemContext =
  createContext<QuestionnaireItemContextValue | null>(null);

function useQuestionnaireItem(part: string) {
  const context = use(QuestionnaireItemContext);
  if (context === null) {
    throw new Error(`${part} must be used inside QuestionnaireItem.`);
  }
  return context;
}

const noDescription = ":not(:has(~ [data-slot='field-description']))";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    minWidth: 0,
    width: "100%",
  },
  progress: {
    color: colors.textSecondary,
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    minHeight: lineHeights.textSm,
  },
  item: {
    display: { default: "flex", ":is([hidden])": "none" },
    gap: space.md,
  },
  // A legend sits outside the fieldset's flex gap, so it spaces itself.
  title: {
    marginBlockEnd: { default: space.xxs, [noDescription]: space.md },
    textWrap: "pretty",
  },
  shortcut: {
    flexShrink: 0,
    marginInlineStart: "auto",
  },
  actions: {
    alignItems: "center",
    display: "grid",
    gap: space.xs,
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    justifyItems: "start",
    minHeight: sizes.controlMd,
    width: "100%",
  },
  previous: { gridColumnStart: "1", gridRowStart: "1", justifySelf: "start" },
  skip: { gridColumnStart: "2", gridRowStart: "1", justifySelf: "end" },
  forward: { gridColumnStart: "3", gridRowStart: "1", justifySelf: "end" },
});

type QuestionnaireProps = Styled<
  Omit<ComponentProps<"form">, "defaultValue" | "noValidate">
> & {
  defaultItem?: string;
  item?: string;
  items: readonly QuestionnaireItemDefinition[];
  onItemChange?: (item: string) => void;
  shortcuts?: QuestionnaireShortcutMode;
};

function Questionnaire({
  children,
  defaultItem,
  item,
  items,
  onItemChange,
  onKeyDown,
  onKeyDownCapture,
  onReset,
  onSubmit,
  shortcuts,
  sx,
  ...props
}: QuestionnaireProps) {
  const [answers, dispatch] = useReducer(answersReducer, {
    defaults: {},
    entries: {},
  });
  const [ownItem, setOwnItem] = useState(defaultItem);
  const form = useRef<HTMLFormElement>(null);
  const focusRequest = useRef<{ name: string; target: FocusTarget } | null>(
    null
  );
  const enabled = useMemo(
    () => items.filter((definition) => definition.disabled !== true),
    [items]
  );
  const definitions = useMemo(
    () => new Map(items.map((definition) => [definition.name, definition])),
    [items]
  );
  const active = item ?? ownItem;
  const index = Math.max(
    0,
    enabled.findIndex((definition) => definition.name === active)
  );
  const current = enabled.at(index);
  const total = enabled.length;
  const shown = useRef(current?.name);

  // Focuses the question a step moved to, or the one the owner moved to while focus was in the form.
  useLayoutEffect(() => {
    const request = focusRequest.current;
    const moved = shown.current !== current?.name;
    shown.current = current?.name;
    const element = form.current?.querySelector<HTMLElement>(activeItem);
    if (current === undefined || element === null || element === undefined) {
      return;
    }
    if (request?.name === current.name) {
      focusRequest.current = null;
      const control =
        request.target === "control"
          ? element.querySelector<HTMLElement>(firstControl)
          : null;
      (control ?? element).focus();
      return;
    }
    const focused = document.activeElement;
    if (
      moved &&
      (focused === document.body || form.current?.contains(focused) === true)
    ) {
      element.focus();
    }
  });

  const steps = useMemo(() => {
    function go(name: string, target: FocusTarget) {
      focusRequest.current = { name, target };
      if (name === current?.name) {
        return;
      }
      if (item === undefined) {
        setOwnItem(name);
      }
      onItemChange?.(name);
    }

    function attempt(definition: QuestionnaireItemDefinition) {
      dispatch({ name: definition.name, type: "attempt" });
      go(definition.name, "control");
    }

    function validates(definition: QuestionnaireItemDefinition) {
      return isValid(definition, entryOf(answers, definition.name));
    }

    function goPrevious() {
      const before = enabled.at(index - 1);
      if (index > 0 && before !== undefined) {
        go(before.name, "item");
      }
    }

    function goNext() {
      const after = enabled.at(index + 1);
      if (current === undefined || after === undefined) {
        return;
      }
      if (validates(current)) {
        go(after.name, "item");
      } else {
        attempt(current);
      }
    }

    function forward() {
      if (current === undefined) {
        return;
      }
      if (!validates(current)) {
        attempt(current);
      } else if (index === total - 1) {
        form.current?.requestSubmit();
      } else {
        goNext();
      }
    }

    function skip() {
      if (current === undefined || current.required === true) {
        return;
      }
      dispatch({ name: current.name, type: "skip" });
      const after = enabled.at(index + 1);
      if (after === undefined) {
        queueMicrotask(() => form.current?.requestSubmit());
      } else {
        go(after.name, "item");
      }
    }

    function restart() {
      const start =
        enabled.find((definition) => definition.name === defaultItem) ??
        enabled.at(0);
      if (start !== undefined) {
        go(start.name, "item");
      }
    }

    function firstInvalid() {
      return enabled.find((definition) => !validates(definition));
    }

    return {
      attempt,
      firstInvalid,
      forward,
      goNext,
      goPrevious,
      restart,
      skip,
    };
  }, [
    answers,
    current,
    defaultItem,
    enabled,
    index,
    item,
    onItemChange,
    total,
  ]);

  const context = useMemo(
    () => ({
      answers,
      current,
      definitions,
      dispatch,
      goNext: steps.goNext,
      goPrevious: steps.goPrevious,
      index,
      shortcuts,
      skip: steps.skip,
      total,
    }),
    [answers, current, definitions, index, shortcuts, steps, total]
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const invalid = steps.firstInvalid();
    if (invalid !== undefined) {
      event.preventDefault();
      steps.attempt(invalid);
      return;
    }
    onSubmit?.(event);
  }

  function handleReset(event: SyntheticEvent<HTMLFormElement>) {
    onReset?.(event);
    if (!event.defaultPrevented) {
      dispatch({ type: "reset" });
      steps.restart();
    }
  }

  // Enter moves on before a focused choice or input can submit the form.
  function handleKeyDownCapture(event: KeyboardEvent<HTMLFormElement>) {
    onKeyDownCapture?.(event);
    const { altKey, ctrlKey, key, metaKey, nativeEvent, shiftKey, target } =
      event;
    if (
      event.defaultPrevented ||
      key !== "Enter" ||
      altKey ||
      shiftKey ||
      nativeEvent.isComposing ||
      !(target instanceof Element)
    ) {
      return;
    }
    const answering =
      target.closest(activeItem) !== null && target.matches(answerControl);
    if (metaKey || ctrlKey || answering) {
      event.preventDefault();
      if (!event.repeat) {
        steps.forward();
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    onKeyDown?.(event);
    const { altKey, ctrlKey, key, metaKey, target } = event;
    if (
      shortcuts === undefined ||
      event.defaultPrevented ||
      altKey ||
      ctrlKey ||
      metaKey ||
      isTextEntry(target)
    ) {
      return;
    }
    const shortcut = shortcutKeys[shortcuts].find(
      (candidate) => candidate === key.toUpperCase()
    );
    const control =
      shortcut === undefined
        ? null
        : form.current
            ?.querySelector(activeItem)
            ?.querySelector<HTMLElement>(`[aria-keyshortcuts='${shortcut}']`);
    if (control === null || control === undefined) {
      return;
    }
    event.preventDefault();
    if (!event.repeat) {
      control.focus();
      control.click();
    }
  }

  return (
    <QuestionnaireContext value={context}>
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Enter and the choice keys are scoped to this form, so questionnaires on one page don't share them */}
      <form
        data-shortcuts={shortcuts}
        data-slot="questionnaire"
        noValidate
        onKeyDown={handleKeyDown}
        onKeyDownCapture={handleKeyDownCapture}
        onReset={handleReset}
        onSubmit={handleSubmit}
        ref={form}
        {...withStyles(props, stylex.props(styles.root, sx))}
      >
        {children}
      </form>
    </QuestionnaireContext>
  );
}

interface QuestionnaireProgressState {
  current: number;
  first: boolean;
  last: boolean;
  total: number;
}

function QuestionnaireProgress({
  children,
  render,
  sx,
  ...props
}: Styled<PartProps<"div", QuestionnaireProgressState>>) {
  const { index, total } = useQuestionnaire("QuestionnaireProgress");
  const current = total > 0 ? index + 1 : 0;
  const text = total > 0 ? `Question ${current} of ${total}` : undefined;
  return renderElement(
    "div",
    mergeProps(
      {
        "aria-label": "Questionnaire progress",
        "aria-live": "polite",
        "aria-valuemax": total > 0 ? total : undefined,
        "aria-valuemin": total > 0 ? 1 : undefined,
        "aria-valuenow": total > 0 ? current : undefined,
        "aria-valuetext": text,
        children: children ?? text,
        "data-slot": "questionnaire-progress",
        role: "progressbar",
      },
      withStyles(props, stylex.props([typeStyles.textSm, styles.progress], sx))
    ),
    render,
    {
      current,
      first: index === 0,
      last: index === total - 1,
      total,
    } satisfies QuestionnaireProgressState
  );
}

type ItemValueProps =
  | {
      defaultValue?: string;
      multiple?: false;
      onValueChange?: (...change: SingleChange) => void;
    }
  | {
      defaultValue?: readonly string[];
      multiple: true;
      onValueChange?: (...change: MultipleChange) => void;
    };

type QuestionnaireItemProps = Omit<
  ComponentProps<typeof FieldSet>,
  "defaultValue" | "disabled" | "name"
> & {
  invalid?: boolean;
  name: string;
  onStatusChange?: (status: QuestionnaireItemStatus) => void;
} & ItemValueProps;

function QuestionnaireItem(props: QuestionnaireItemProps) {
  const {
    children,
    defaultValue: _defaultValue,
    invalid = false,
    multiple = false,
    name,
    onStatusChange,
    onValueChange: _onValueChange,
    sx,
    ...rest
  } = props;
  const onMany = props.multiple === true ? props.onValueChange : undefined;
  const onOne = props.multiple === true ? undefined : props.onValueChange;
  const { answers, current, definitions, dispatch, shortcuts } =
    useQuestionnaire("QuestionnaireItem");
  const id = useId();
  const [described, setDescribed] = useState(false);
  // oxlint-disable-next-line react/hook-use-state -- only the first default seeds, like a native defaultValue
  const [defaults] = useState<readonly string[]>(() => {
    if (props.multiple === true) {
      return props.defaultValue ?? [];
    }
    return props.defaultValue === undefined ? [] : [props.defaultValue];
  });
  const definition = useMemo(
    () => definitions.get(name) ?? { name },
    [definitions, name]
  );
  const stored = answers.entries[name];
  const storedAnswer = stored?.answer;
  const answer = useMemo<Answer>(
    () => storedAnswer ?? { choices: defaults, kind: "given", text: "" },
    [defaults, storedAnswer]
  );
  const entry: Entry = {
    answer,
    attempted: stored?.attempted ?? false,
    invalid,
    touched: stored?.touched ?? false,
  };
  const status = statusOf(entry.answer);
  const shownInvalid =
    !isValid(definition, entry) && (invalid || entry.attempted);
  const active = current?.name === name;
  const reported = useRef(status);

  useLayoutEffect(() => {
    dispatch({ name, seed: { choices: defaults }, type: "seed" });
  }, [defaults, dispatch, name]);

  useLayoutEffect(() => {
    dispatch({ invalid, name, type: "mark" });
  }, [dispatch, invalid, name]);

  useLayoutEffect(() => {
    if (reported.current !== status) {
      reported.current = status;
      onStatusChange?.(status);
    }
  }, [onStatusChange, status]);

  const given = entry.answer.kind === "given" ? entry.answer : blank;
  const context = useMemo(() => {
    const keys = shortcuts === undefined ? [] : shortcutKeys[shortcuts];
    const keyed =
      definition.choices?.filter((choice) => choice.disabled !== true) ?? [];
    return {
      chooseMany: (...[values, details]: MultipleChange) => {
        if (details.reason === "reset") {
          return;
        }
        onMany?.(values, details);
        if (!details.canceled) {
          dispatch({ choices: values, multiple, name, type: "choose" });
        }
      },
      chooseOne: (...[value, details]: SingleChange) => {
        if (details.reason === "reset") {
          return;
        }
        onOne?.(value, details);
        if (!details.canceled) {
          dispatch({
            choices: value === null ? [] : [value],
            multiple,
            name,
            type: "choose",
          });
        }
      },
      definition,
      given,
      ids: {
        description: `${id}-description`,
        error: `${id}-error`,
        title: `${id}-title`,
      },
      invalid: shownInvalid,
      multiple,
      name,
      setDescribed,
      shortcutOf: (value: string) =>
        keys.at(keyed.findIndex((choice) => choice.value === value)),
      type: (text: string) => {
        dispatch({ multiple, name, text, type: "type" });
      },
    };
  }, [
    definition,
    dispatch,
    given,
    id,
    multiple,
    name,
    onMany,
    onOne,
    shortcuts,
    shownInvalid,
  ]);
  const { ids } = context;

  return (
    <QuestionnaireItemContext value={context}>
      <FieldSet
        aria-describedby={
          [
            described ? ids.description : undefined,
            shownInvalid ? ids.error : undefined,
          ]
            .filter((reference) => reference !== undefined)
            .join(" ") || undefined
        }
        aria-labelledby={ids.title}
        data-active={active ? "" : undefined}
        data-status={status}
        disabled={definition.disabled}
        hidden={!active}
        inert={!active}
        sx={[styles.item, sx]}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </FieldSet>
    </QuestionnaireItemContext>
  );
}

function QuestionnaireTitle({
  sx,
  ...props
}: Omit<ComponentProps<typeof FieldLegend>, "id" | "variant">) {
  const { ids } = useQuestionnaireItem("QuestionnaireTitle");
  return <FieldLegend id={ids.title} sx={[styles.title, sx]} {...props} />;
}

function QuestionnaireDescription(
  props: Omit<ComponentProps<typeof FieldDescription>, "id">
) {
  const { ids, setDescribed } = useQuestionnaireItem(
    "QuestionnaireDescription"
  );
  useLayoutEffect(() => {
    setDescribed(true);
    return () => {
      setDescribed(false);
    };
  }, [setDescribed]);
  return <FieldDescription id={ids.description} {...props} />;
}

type QuestionnaireChoicesProps = Styled<
  Omit<
    ComponentProps<"div">,
    "children" | "defaultChecked" | "defaultValue" | "onChange" | "onSelect"
  >
> & { children?: ReactNode };

function QuestionnaireChoices(props: QuestionnaireChoicesProps) {
  const { chooseMany, chooseOne, given, ids, multiple, name } =
    useQuestionnaireItem("QuestionnaireChoices");
  if (multiple) {
    return (
      <CheckboxGroup
        aria-labelledby={ids.title}
        name={name}
        onValueChange={chooseMany}
        value={[...given.choices]}
        {...props}
      />
    );
  }
  return (
    <RadioGroup
      aria-labelledby={ids.title}
      name={name}
      onValueChange={chooseOne}
      value={given.choices.at(0) ?? null}
      {...props}
    />
  );
}

function QuestionnaireChoice({
  children,
  value,
  ...props
}: Omit<ComponentProps<typeof FieldLabel>, "children"> & {
  children?: ReactNode;
  value: string;
}) {
  const { definition, invalid, multiple, shortcutOf } = useQuestionnaireItem(
    "QuestionnaireChoice"
  );
  const shortcut = shortcutOf(value);
  const disabled = definition.choices?.some(
    (choice) => choice.value === value && choice.disabled === true
  );
  const Control = multiple ? Checkbox : RadioGroupItem;
  return (
    <Field disabled={disabled} invalid={invalid}>
      <FieldLabel {...props}>
        <Control aria-keyshortcuts={shortcut} value={value} />
        <FieldContent>{children}</FieldContent>
        {shortcut === undefined ? null : (
          <Kbd aria-hidden sx={styles.shortcut}>
            {shortcut}
          </Kbd>
        )}
      </FieldLabel>
    </Field>
  );
}

// Hidden from the label's text, so the choice is named by its label alone; its field still describes the control with it.
function QuestionnaireChoiceDescription(
  props: ComponentProps<typeof FieldDescription>
) {
  return <FieldDescription aria-hidden {...props} />;
}

function QuestionnaireInput({
  defaultValue = "",
  onValueChange,
  ...props
}: Omit<ComponentProps<typeof Input>, "defaultValue" | "name" | "value"> & {
  defaultValue?: string;
}) {
  const { dispatch } = useQuestionnaire("QuestionnaireInput");
  const { given, invalid, name, type } =
    useQuestionnaireItem("QuestionnaireInput");
  useLayoutEffect(() => {
    dispatch({ name, seed: { text: defaultValue }, type: "seed" });
  }, [defaultValue, dispatch, name]);
  return (
    <Input
      aria-invalid={invalid || undefined}
      name={given.text.trim() === "" ? undefined : name}
      onValueChange={(...change: TextChange) => {
        const [text, details] = change;
        if (details.reason === "reset") {
          return;
        }
        onValueChange?.(...change);
        if (!details.canceled) {
          type(text);
        }
      }}
      value={given.text}
      {...props}
    />
  );
}

function QuestionnaireError({
  children,
  ...props
}: Omit<ComponentProps<typeof FieldError>, "errors" | "id" | "match">) {
  const { definition, ids, invalid } =
    useQuestionnaireItem("QuestionnaireError");
  if (!invalid) {
    return null;
  }
  return (
    <FieldError id={ids.error} match role="alert" {...props}>
      {children ??
        (definition.required === true
          ? "Choose an answer to continue."
          : "Choose an answer or skip this question.")}
    </FieldError>
  );
}

function QuestionnaireActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="questionnaire-actions"
      {...withStyles(props, stylex.props(styles.actions, sx))}
    />
  );
}

type NavigationProps = Omit<
  ComponentProps<typeof Button>,
  "data-slot" | "render" | "type"
> &
  Pick<ButtonStyleOptions, "size" | "variant">;

function QuestionnairePrevious({
  children = "Previous",
  onClick,
  sx,
  variant = "outline",
  ...props
}: NavigationProps) {
  const { goPrevious, index } = useQuestionnaire("QuestionnairePrevious");
  if (index === 0) {
    return null;
  }
  return (
    <Button
      data-slot="questionnaire-previous"
      onClick={(event, details) => {
        onClick?.(event, details);
        if (!event.defaultPrevented) {
          goPrevious();
        }
      }}
      sx={[styles.previous, sx]}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}

function QuestionnaireSkip({
  children = "Skip",
  onClick,
  sx,
  variant = "outline",
  ...props
}: NavigationProps) {
  const { current, skip } = useQuestionnaire("QuestionnaireSkip");
  if (current === undefined || current.required === true) {
    return null;
  }
  return (
    <Button
      data-slot="questionnaire-skip"
      onClick={(event, details) => {
        onClick?.(event, details);
        if (!event.defaultPrevented) {
          skip();
        }
      }}
      sx={[styles.skip, sx]}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}

function QuestionnaireNext({
  children = "Next",
  onClick,
  sx,
  variant = "primary",
  ...props
}: NavigationProps) {
  const { goNext, index, total } = useQuestionnaire("QuestionnaireNext");
  if (index >= total - 1) {
    return null;
  }
  return (
    <Button
      data-slot="questionnaire-next"
      onClick={(event, details) => {
        onClick?.(event, details);
        if (!event.defaultPrevented) {
          goNext();
        }
      }}
      sx={[styles.forward, sx]}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}

function QuestionnaireSubmit({
  children = "Submit",
  sx,
  variant = "primary",
  ...props
}: NavigationProps) {
  const { index, total } = useQuestionnaire("QuestionnaireSubmit");
  if (total === 0 || index !== total - 1) {
    return null;
  }
  return (
    <Button
      data-slot="questionnaire-submit"
      sx={[styles.forward, sx]}
      type="submit"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}

export {
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
  questionnaireItemStatuses,
  questionnaireShortcutModes,
};
export type {
  QuestionnaireChoiceDefinition,
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireProgressState,
  QuestionnaireShortcutMode,
};
