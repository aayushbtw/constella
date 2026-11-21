"use client";

import * as stylex from "@stylexjs/stylex";
import { createCheckboxGroupController } from "@ui-sdk/react/checkbox";
import type { CheckboxGroupController } from "@ui-sdk/react/checkbox";
import { createInputController } from "@ui-sdk/react/input";
import type { InputController } from "@ui-sdk/react/input";
import { Progress as ProgressPrimitive } from "@ui-sdk/react/progress";
import { createRadioGroupController } from "@ui-sdk/react/radio";
import type { RadioGroupController } from "@ui-sdk/react/radio";
import {
  ariaKeyshortcuts,
  shortcuts as shortcutScopes,
  useShortcut,
} from "@ui-sdk/react/shortcuts";
import {
  createContext,
  use,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComponentProps,
  FocusEvent,
  ReactNode,
  RefObject,
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
import { ProgressValue } from "@/components/primitives/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/primitives/radio-group";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, withStyles } from "@/lib/constella/styles";
import {
  fontWeights,
  lineHeights,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type QuestionnaireShortcutMode = "letters" | "numbers";

type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped";

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
    String.fromCodePoint(97 + index)
  ),
  numbers: Array.from({ length: 9 }, (_, index) => String(index + 1)),
} satisfies Record<QuestionnaireShortcutMode, string[]>;

interface ItemHandle {
  clear: () => void;
  focus: () => void;
  valid: () => boolean;
}

const none: ReadonlySet<string> = new Set();

const activeItem = "[data-slot='field-set'][data-active]";

interface QuestionnaireContextValue {
  attempted: ReadonlySet<string>;
  current: QuestionnaireItemDefinition | undefined;
  definitions: ReadonlyMap<string, QuestionnaireItemDefinition>;
  form: RefObject<HTMLFormElement | null>;
  goPrevious: () => void;
  handles: Map<string, ItemHandle>;
  index: number;
  scope: string;
  shortcuts: QuestionnaireShortcutMode | undefined;
  skip: () => void;
  skipped: ReadonlySet<string>;
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

interface ItemControllers {
  many: CheckboxGroupController;
  one: RadioGroupController;
  text: InputController;
}

// A controller warns when its control isn't rendered, so each write first checks there's an answer to clear.
function clearChoices({ many, one }: ItemControllers) {
  if ((one.getValue() ?? null) !== null) {
    one.setValue(null);
  }
  if ((many.getValue()?.length ?? 0) > 0) {
    many.setValue([]);
  }
}

function clearText({ text }: ItemControllers) {
  if ((text.getValue() ?? "") !== "") {
    text.clear();
  }
}

function statusOf(
  answered: boolean,
  skipped: boolean
): QuestionnaireItemStatus {
  if (answered) {
    return "answered";
  }
  return skipped ? "skipped" : "unanswered";
}

interface QuestionnaireItemContextValue {
  active: boolean;
  chooseMany: (...change: MultipleChange) => void;
  chooseOne: (...change: SingleChange) => void;
  controllers: ItemControllers;
  defaults: readonly string[];
  definition: QuestionnaireItemDefinition;
  ids: { error: string; title: string };
  invalid: boolean;
  multiple: boolean;
  name: string;
  setTyped: (typed: boolean) => void;
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
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontWeight: fontWeights.medium,
    gap: space.sm,
    minHeight: lineHeights.textSm,
  },
  // Alone, the step reads before the title, not across from it as beside a bar.
  step: { marginInlineStart: 0 },
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
  onBlur,
  onFocus,
  onItemChange,
  onReset,
  onSubmit,
  shortcuts,
  sx,
  ...props
}: QuestionnaireProps) {
  const [ownItem, setOwnItem] = useState(defaultItem);
  const [skipped, setSkipped] = useState(none);
  const [attempted, setAttempted] = useState(none);
  // oxlint-disable-next-line react/hook-use-state -- created once and never set; items register their handles in it
  const [handles] = useState(() => new Map<string, ItemHandle>());
  const scope = `questionnaire-${useId()}`;
  const form = useRef<HTMLFormElement>(null);
  const focusRequest = useRef<{ control: boolean; name: string } | null>(null);
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
      if (request.control) {
        handles.get(current.name)?.focus();
      }
      if (!element.contains(document.activeElement)) {
        element.focus();
      }
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

  useEffect(
    () => () => {
      shortcutScopes.setScope(scope, false);
    },
    [scope]
  );

  useShortcut(
    "mod+enter",
    () => {
      form.current?.requestSubmit();
    },
    { layer: form, scope }
  );

  const steps = useMemo(() => {
    const after = enabled.at(index + 1);

    function go(name: string, control = false) {
      focusRequest.current = { control, name };
      if (name === current?.name) {
        return;
      }
      if (item === undefined) {
        setOwnItem(name);
      }
      onItemChange?.(name);
    }

    function attempt(name: string) {
      setAttempted((names) => new Set(names).add(name));
      go(name, true);
    }

    function valid(name: string) {
      return handles.get(name)?.valid() ?? true;
    }

    return {
      after,
      attempt,
      go,
      goPrevious: () => {
        const before = enabled.at(index - 1);
        if (index > 0 && before !== undefined) {
          go(before.name);
        }
      },
      restart: () => {
        const start =
          enabled.find((definition) => definition.name === defaultItem) ??
          enabled.at(0);
        if (start !== undefined) {
          go(start.name);
        }
      },
      skip: () => {
        if (current === undefined || current.required === true) {
          return;
        }
        handles.get(current.name)?.clear();
        setSkipped((names) => new Set(names).add(current.name));
        if (after === undefined) {
          queueMicrotask(() => form.current?.requestSubmit());
        } else {
          go(after.name);
        }
      },
      valid,
    };
  }, [current, defaultItem, enabled, handles, index, item, onItemChange]);

  const context = useMemo(
    () => ({
      attempted,
      current,
      definitions,
      form,
      goPrevious: steps.goPrevious,
      handles,
      index,
      scope,
      shortcuts,
      skip: steps.skip,
      skipped,
      total,
    }),
    [
      attempted,
      current,
      definitions,
      handles,
      index,
      scope,
      shortcuts,
      skipped,
      steps,
      total,
    ]
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const { after, attempt, go, valid } = steps;
    if (current !== undefined && after !== undefined) {
      event.preventDefault();
      if (valid(current.name)) {
        go(after.name);
      } else {
        attempt(current.name);
      }
      return;
    }
    const invalid = enabled.find((definition) => !valid(definition.name));
    if (invalid !== undefined) {
      event.preventDefault();
      attempt(invalid.name);
      return;
    }
    onSubmit?.(event);
  }

  function handleReset(event: SyntheticEvent<HTMLFormElement>) {
    onReset?.(event);
    if (!event.defaultPrevented) {
      setSkipped(none);
      setAttempted(none);
      steps.restart();
    }
  }

  function handleFocus(event: FocusEvent<HTMLFormElement>) {
    onFocus?.(event);
    shortcutScopes.setScope(scope, true);
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      shortcutScopes.setScope(scope, false);
    }
  }

  return (
    <QuestionnaireContext value={context}>
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the choice keys and ⌘ Enter turn on while focus is in this form, so questionnaires on one page don't share them */}
      <form
        data-shortcuts={shortcuts}
        data-slot="questionnaire"
        noValidate
        onBlur={handleBlur}
        onFocus={handleFocus}
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

function QuestionnaireProgress({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof ProgressPrimitive>>) {
  const { index, total } = useQuestionnaire("QuestionnaireProgress");
  const step = (current: number | null) =>
    `Question ${current ?? index + 1} of ${total}`;
  return (
    <ProgressPrimitive
      aria-label="Questionnaire progress"
      format={step}
      getValueLabel={step}
      max={total}
      value={index + 1}
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.progress], sx)
      )}
    >
      {children ?? <ProgressValue sx={styles.step} />}
    </ProgressPrimitive>
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
    defaultValue,
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
  const defaults = useMemo(() => [defaultValue ?? []].flat(), [defaultValue]);
  const { attempted, current, definitions, handles, skipped } =
    useQuestionnaire("QuestionnaireItem");
  const id = useId();
  // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
  const [controllers] = useState<ItemControllers>(() => ({
    many: createCheckboxGroupController(),
    one: createRadioGroupController(),
    text: createInputController(),
  }));
  // Seeds once from the default, like the groups it renders.
  const [picked, setPicked] = useState(() => defaults.length > 0);
  const [typed, setTyped] = useState(false);
  const definition = useMemo(
    () => definitions.get(name) ?? { name },
    [definitions, name]
  );
  const status = statusOf(picked || typed, skipped.has(name));
  const valid = status === "skipped" || (status === "answered" && !invalid);
  const shownInvalid = !valid && (invalid || attempted.has(name));
  const active = current?.name === name;
  const reported = useRef(status);

  useLayoutEffect(() => {
    handles.set(name, {
      clear: () => {
        clearChoices(controllers);
        clearText(controllers);
      },
      focus: () => {
        const group = multiple ? controllers.many : controllers.one;
        if (group.getValue() === undefined) {
          controllers.text.focus();
        } else {
          group.focus();
        }
      },
      valid: () => valid,
    });
    return () => {
      handles.delete(name);
    };
  });

  useLayoutEffect(() => {
    if (reported.current !== status) {
      reported.current = status;
      onStatusChange?.(status);
    }
  }, [onStatusChange, status]);

  const context = useMemo(
    () => ({
      active,
      chooseMany: (...[values, details]: MultipleChange) => {
        if (details.reason !== "reset") {
          onMany?.(values, details);
          if (details.canceled) {
            return;
          }
        }
        setPicked(values.length > 0);
      },
      chooseOne: (...[value, details]: SingleChange) => {
        if (details.reason !== "reset") {
          onOne?.(value, details);
          if (details.canceled) {
            return;
          }
          if (value !== null) {
            clearText(controllers);
          }
        }
        setPicked(value !== null);
      },
      controllers,
      defaults,
      definition,
      ids: { error: `${id}-error`, title: `${id}-title` },
      invalid: shownInvalid,
      multiple,
      name,
      setTyped,
    }),
    [
      active,
      controllers,
      defaults,
      definition,
      id,
      multiple,
      name,
      onMany,
      onOne,
      shownInvalid,
    ]
  );
  const { ids } = context;

  return (
    <QuestionnaireItemContext value={context}>
      <FieldSet
        data-active={active ? "" : undefined}
        data-status={status}
        disabled={definition.disabled}
        hidden={!active}
        inert={!active}
        // The set owns aria-describedby for its description, so the error joins it here.
        render={(set: ComponentProps<"fieldset">) => (
          <fieldset
            {...set}
            aria-describedby={
              shownInvalid
                ? [set["aria-describedby"], ids.error].join(" ").trim()
                : set["aria-describedby"]
            }
          />
        )}
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
  props: ComponentProps<typeof FieldDescription>
) {
  return <FieldDescription {...props} />;
}

type QuestionnaireChoicesProps = Styled<
  Omit<
    ComponentProps<"div">,
    "children" | "defaultChecked" | "defaultValue" | "onChange" | "onSelect"
  >
> & { children?: ReactNode };

function QuestionnaireChoices(props: QuestionnaireChoicesProps) {
  const { chooseMany, chooseOne, controllers, defaults, ids, multiple, name } =
    useQuestionnaireItem("QuestionnaireChoices");
  // A legend names its fieldset, not the group inside it.
  if (multiple) {
    return (
      <CheckboxGroup
        aria-labelledby={ids.title}
        controller={controllers.many}
        defaultValue={[...defaults]}
        name={name}
        onValueChange={chooseMany}
        {...props}
      />
    );
  }
  return (
    <RadioGroup
      aria-labelledby={ids.title}
      controller={controllers.one}
      defaultValue={defaults.at(0) ?? null}
      name={name}
      onValueChange={chooseOne}
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
  const { form, scope, shortcuts } = useQuestionnaire("QuestionnaireChoice");
  const { active, definition, invalid, multiple } = useQuestionnaireItem(
    "QuestionnaireChoice"
  );
  const control = useRef<HTMLButtonElement>(null);
  const keyed =
    definition.choices?.filter((choice) => choice.disabled !== true) ?? [];
  const shortcut =
    shortcuts === undefined
      ? undefined
      : shortcutKeys[shortcuts].at(
          keyed.findIndex((choice) => choice.value === value)
        );
  const disabled = definition.choices?.some(
    (choice) => choice.value === value && choice.disabled === true
  );
  // Only the shown question's keys register, so its siblings' A and B don't compete.
  useShortcut(
    active ? shortcut : null,
    () => {
      control.current?.focus();
      control.current?.click();
    },
    { layer: form, scope }
  );
  const keys = shortcut === undefined ? undefined : ariaKeyshortcuts(shortcut);
  const Control = multiple ? Checkbox : RadioGroupItem;
  return (
    <Field disabled={disabled} invalid={invalid}>
      <FieldLabel {...props}>
        <Control aria-keyshortcuts={keys} ref={control} value={value} />
        <FieldContent>{children}</FieldContent>
        {keys === undefined ? null : (
          <Kbd aria-hidden sx={styles.shortcut}>
            {keys}
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
}: Omit<
  ComponentProps<typeof Input>,
  "controller" | "defaultValue" | "name" | "value"
> & {
  defaultValue?: string;
}) {
  const { controllers, invalid, multiple, name, setTyped } =
    useQuestionnaireItem("QuestionnaireInput");
  const [text, setText] = useState(defaultValue);
  const filled = text.trim() !== "";

  useLayoutEffect(() => {
    setTyped(filled);
    return () => {
      setTyped(false);
    };
  }, [filled, setTyped]);

  return (
    <Input
      aria-invalid={invalid || undefined}
      controller={controllers.text}
      defaultValue={defaultValue}
      name={filled ? name : undefined}
      onValueChange={(...change: TextChange) => {
        const [next, details] = change;
        if (details.reason !== "reset") {
          onValueChange?.(...change);
          if (details.canceled) {
            return;
          }
          if (!multiple && next.trim() !== "") {
            clearChoices(controllers);
          }
        }
        setText(next);
      }}
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

// A submit button, so Enter in an answer presses it; the form's submit steps forward until the last question.
function QuestionnaireNext({
  children = "Next",
  sx,
  variant = "primary",
  ...props
}: NavigationProps) {
  const { index, total } = useQuestionnaire("QuestionnaireNext");
  if (index >= total - 1) {
    return null;
  }
  return (
    <Button
      data-slot="questionnaire-next"
      sx={[styles.forward, sx]}
      type="submit"
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
};
export type {
  QuestionnaireChoiceDefinition,
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireShortcutMode,
};
