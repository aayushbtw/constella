"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { buttonStyles } from "@/components/ui/button";
import type { ButtonStyleOptions } from "@/components/ui/button";
import { inputStyles } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  motion,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type NavigationProps<T> = Styled<T> &
  Pick<ButtonStyleOptions, "size" | "variant">;

// The primitive hides inactive items and unused buttons with `hidden`, which any `display` overrides.
const hidden = ":is([hidden])";
const checked = ":is([data-checked] *)";
const radio = ":is([data-type='radio'] *)";
const invalid = ":is([data-invalid])";
const disabled = ":is([data-disabled])";
const firstLineInset = `calc((${lineHeights.text} - ${sizes.icon}) / 2)`;
const noDescription = ":not(:has(~ [data-slot='questionnaire-description']))";

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
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.row,
    minHeight: lineHeights.row,
  },
  item: {
    borderBlockWidth: 0,
    borderInlineWidth: 0,
    display: { default: "flex", [hidden]: "none" },
    flexDirection: "column",
    gap: space.md,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    minWidth: 0,
    paddingBlock: 0,
    paddingInline: 0,
  },
  // A legend sits outside the fieldset's flex gap, so it spaces itself.
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    marginBlockEnd: { default: space.xxs, [noDescription]: space.md },
    paddingBlock: 0,
    paddingInline: 0,
    textWrap: "pretty",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    textWrap: "pretty",
  },
  choices: {
    display: "grid",
    gap: space.xs,
    minWidth: 0,
  },
  choice: {
    alignItems: "flex-start",
    backgroundColor: {
      default: "transparent",
      ":is([data-checked])": colors.fillSubtle,
      [media.hover]: {
        default: "transparent",
        ":hover:not([data-disabled])": colors.fillSubtle,
        ":is([data-checked])": colors.fillSubtle,
      },
      ":active:not([data-disabled])": colors.fillSubtle,
    },
    borderBlockColor: {
      default: colors.edge,
      ":is([data-checked]):not([data-invalid])": colors.accent,
      [invalid]: colors.danger,
    },
    borderInlineColor: {
      default: colors.edge,
      ":is([data-checked]):not([data-invalid])": colors.accent,
      [invalid]: colors.danger,
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    color: colors.textPrimary,
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.sm,
    lineHeight: lineHeights.text,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingBlock: space.sm,
    paddingInline: space.sm,
    position: "relative",
    textAlign: "start",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: "ease",
    userSelect: "none",
  },
  choiceInput: {
    cursor: "inherit",
    height: "100%",
    insetBlockStart: 0,
    insetInlineStart: 0,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    opacity: 0,
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
  // Checkbox's box, or Radio's circle; the primitive needs a native input, so neither component fits.
  indicator: {
    alignItems: "center",
    backgroundClip: { default: "padding-box", [checked]: "border-box" },
    backgroundColor: { default: colors.fillSubtle, [checked]: colors.accent },
    borderBlockColor: { default: colors.edge, [checked]: colors.accent },
    borderInlineColor: { default: colors.edge, [checked]: colors.accent },
    borderStartStartRadius: { default: radii.xs, [radio]: radii.full },
    borderStartEndRadius: { default: radii.xs, [radio]: radii.full },
    borderEndStartRadius: { default: radii.xs, [radio]: radii.full },
    borderEndEndRadius: { default: radii.xs, [radio]: radii.full },
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    boxShadow: shadows.control,
    color: colors.onAccent,
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    justifyContent: "center",
    marginBlockEnd: firstLineInset,
    marginBlockStart: firstLineInset,
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: "ease",
    width: sizes.icon,
  },
  // The tick draws in from its start; unchecking is the system answering, so it's quick.
  tick: {
    clipPath: { default: "inset(0 100% 0 0)", [checked]: "inset(0)" },
    display: { default: "block", [radio]: "none" },
    opacity: { default: 0, [checked]: 1 },
    transitionDuration: { default: durations.hover, [checked]: durations.move },
    transitionProperty: {
      default: "clip-path, opacity",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  dot: {
    backgroundColor: colors.onAccent,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    display: { default: "none", [radio]: "block" },
    height: `calc(${sizes.icon} / 2)`,
    opacity: { default: 0, [checked]: 1 },
    transform: { default: `scale(${motion.dotScale})`, [checked]: "scale(1)" },
    transitionDuration: durations.popover,
    transitionProperty: {
      default: "transform, opacity",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: `${easings.overshoot}, ${easings.out}`,
    width: `calc(${sizes.icon} / 2)`,
  },
  choiceLabel: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    fontWeight: fontWeights.medium,
    gap: space.xxxs,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  choiceDescription: {
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
  },
  shortcut: {
    display: { default: "inline-flex", [hidden]: "none" },
    flexShrink: 0,
    marginInlineStart: "auto",
  },
  error: {
    color: colors.danger,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
    overflowWrap: "anywhere",
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
  navigation: {
    display: { default: "inline-flex", [hidden]: "none" },
    gridRowStart: 1,
  },
  previous: { gridColumnStart: 1, justifySelf: "start" },
  skip: { gridColumnStart: 2, justifySelf: "end" },
  forward: { gridColumnStart: 3, justifySelf: "end" },
});

function Questionnaire({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Root>>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      {...props}
      {...stylex.props(styles.root, sx)}
    />
  );
}

function QuestionnaireProgress({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Progress>>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      {...props}
      {...stylex.props(styles.progress, sx)}
    />
  );
}

function QuestionnaireItem({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Item>>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

function QuestionnaireTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Title>>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function QuestionnaireDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Description>>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function QuestionnaireChoices({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Choices>>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      {...props}
      {...stylex.props(styles.choices, sx)}
    />
  );
}

function QuestionnaireChoice({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Choice>>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      {...props}
      {...stylex.props(styles.choice, sx)}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        {...stylex.props(styles.choiceInput)}
      />
      <span
        aria-hidden
        data-slot="questionnaire-choice-indicator"
        {...stylex.props(styles.indicator)}
      >
        <HugeiconsIcon
          aria-hidden
          icon={Tick02Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
          {...stylex.props(styles.tick)}
        />
        <span {...stylex.props(styles.dot)} />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        {...stylex.props(styles.choiceLabel)}
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        render={<Kbd sx={styles.shortcut} />}
      />
    </QuestionnairePrimitive.Choice>
  );
}

function QuestionnaireChoiceDescription({
  sx,
  ...props
}: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      {...props}
      {...stylex.props(styles.choiceDescription, sx)}
    />
  );
}

function QuestionnaireInput({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Input>>) {
  return (
    <QuestionnairePrimitive.Input
      data-slot="questionnaire-input"
      {...props}
      {...stylex.props(inputStyles(), sx)}
    />
  );
}

function QuestionnaireError({
  sx,
  ...props
}: Styled<ComponentProps<typeof QuestionnairePrimitive.Error>>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      {...props}
      {...stylex.props(styles.error, sx)}
    />
  );
}

function QuestionnaireActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="questionnaire-actions"
      {...props}
      {...stylex.props(styles.actions, sx)}
    />
  );
}

function QuestionnairePrevious({
  children = "Previous",
  size = "default",
  sx,
  variant = "outline",
  ...props
}: NavigationProps<ComponentProps<typeof QuestionnairePrimitive.Previous>>) {
  return (
    <QuestionnairePrimitive.Previous
      data-size={size}
      data-slot="questionnaire-previous"
      data-variant={variant}
      {...props}
      {...stylex.props(
        buttonStyles({ size, variant }),
        styles.navigation,
        styles.previous,
        sx
      )}
    >
      {children}
    </QuestionnairePrimitive.Previous>
  );
}

function QuestionnaireSkip({
  children = "Skip",
  size = "default",
  sx,
  variant = "outline",
  ...props
}: NavigationProps<ComponentProps<typeof QuestionnairePrimitive.Skip>>) {
  return (
    <QuestionnairePrimitive.Skip
      data-size={size}
      data-slot="questionnaire-skip"
      data-variant={variant}
      {...props}
      {...stylex.props(
        buttonStyles({ size, variant }),
        styles.navigation,
        styles.skip,
        sx
      )}
    >
      {children}
    </QuestionnairePrimitive.Skip>
  );
}

function QuestionnaireNext({
  children = "Next",
  size = "default",
  sx,
  variant = "primary",
  ...props
}: NavigationProps<ComponentProps<typeof QuestionnairePrimitive.Next>>) {
  return (
    <QuestionnairePrimitive.Next
      data-size={size}
      data-slot="questionnaire-next"
      data-variant={variant}
      {...props}
      {...stylex.props(
        buttonStyles({ size, variant }),
        styles.navigation,
        styles.forward,
        sx
      )}
    >
      {children}
    </QuestionnairePrimitive.Next>
  );
}

function QuestionnaireSubmit({
  children = "Submit",
  size = "default",
  sx,
  variant = "primary",
  ...props
}: NavigationProps<ComponentProps<typeof QuestionnairePrimitive.Submit>>) {
  return (
    <QuestionnairePrimitive.Submit
      data-size={size}
      data-slot="questionnaire-submit"
      data-variant={variant}
      {...props}
      {...stylex.props(
        buttonStyles({ size, variant }),
        styles.navigation,
        styles.forward,
        sx
      )}
    >
      {children}
    </QuestionnairePrimitive.Submit>
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
} from "@shadcn/react/questionnaire";
