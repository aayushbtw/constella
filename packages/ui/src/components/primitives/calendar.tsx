"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  CalendarDay as CalendarDayPrimitive,
  CalendarGrid as CalendarGridPrimitive,
  CalendarHeading as CalendarHeadingPrimitive,
  CalendarNext as CalendarNextPrimitive,
  CalendarPrevious as CalendarPreviousPrimitive,
  Calendar as CalendarPrimitive,
  CalendarWeekday as CalendarWeekdayPrimitive,
  CalendarWeekdays as CalendarWeekdaysPrimitive,
  CalendarWeeks as CalendarWeeksPrimitive,
} from "@ui-sdk/react/calendar";
import type { CalendarGridCell } from "@ui-sdk/react/calendar";
import type { ComponentProps, ReactNode } from "react";

import { buttonStyles } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  typeStyles,
  visuallyHidden,
  withStyles,
} from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type StepProps = Styled<
  Omit<ComponentProps<typeof CalendarPreviousPrimitive>, "render">
>;

const rtl = ":is([dir='rtl'], [dir='rtl'] *)";
const inMonths = ":is([data-slot='calendar-months'] > *)";

const solid =
  ":is([data-range-start], [data-range-end], [data-selected]:not([data-range-middle]))";
const band = ":is([data-range-middle])";
const startOnly = ":is([data-range-start]):not([data-range-end])";
const endOnly = ":is([data-range-end]):not([data-range-start])";
const muted = ":is([data-outside], [data-disabled]):not([data-selected])";
const idle = ":not([data-disabled], [data-selected])";

const dayFill = {
  default: "transparent",
  [band]: colors.infoSubtle,
  [solid]: colors.infoSolid,
  [`:active${idle}`]: colors.fillSubtle,
};

const styles = stylex.create({
  root: {
    width: "fit-content",
  },
  months: {
    alignItems: "flex-start",
    display: "flex",
    gap: space.lg,
    position: "relative",
  },
  heading: {
    fontWeight: fontWeights.medium,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0,
  },
  step: {
    insetBlockStart: {
      default: null,
      [inMonths]: `calc((${sizes.controlMd} - ${sizes.controlSm}) / 2)`,
    },
    position: { default: null, [inMonths]: "absolute" },
  },
  previous: {
    insetInlineStart: { default: null, [inMonths]: 0 },
  },
  next: {
    insetInlineEnd: { default: null, [inMonths]: 0 },
  },
  arrow: {
    transform: { default: null, [rtl]: "scaleX(-1)" },
  },
  // Separate borders, so a day's corners round.
  grid: {
    borderCollapse: "separate",
    borderSpacing: `0 ${space.xxs}`,
    marginBlockEnd: `calc(-1 * ${space.xxs})`,
  },
  caption: {
    fontWeight: fontWeights.medium,
    height: sizes.controlMd,
    lineHeight: sizes.controlMd,
    marginBlockEnd: `calc(${space.sm} - ${space.xxs})`,
    paddingInlineEnd: sizes.controlMd,
    paddingInlineStart: sizes.controlMd,
    textAlign: "center",
  },
  weekday: {
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
    height: sizes.controlMd,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    textAlign: "center",
    verticalAlign: "middle",
    width: sizes.controlMd,
  },
  day: {
    backgroundColor: {
      ...dayFill,
      [media.hover]: {
        ...dayFill,
        [`:hover${idle}`]: colors.fillSubtle,
      },
    },
    borderEndEndRadius: { default: radii.sm, [band]: 0, [startOnly]: 0 },
    borderEndStartRadius: { default: radii.sm, [band]: 0, [endOnly]: 0 },
    borderStartEndRadius: { default: radii.sm, [band]: 0, [startOnly]: 0 },
    borderStartStartRadius: { default: radii.sm, [band]: 0, [endOnly]: 0 },
    color: {
      default: "inherit",
      [muted]: colors.textMuted,
      [solid]: colors.infoOnSolid,
    },
    cursor: { default: "pointer", "[data-disabled]": "not-allowed" },
    fontVariantNumeric: "tabular-nums",
    fontWeight: { default: null, "[data-today]": fontWeights.medium },
    height: sizes.controlMd,
    opacity: { default: null, "[data-disabled]": opacities.disabled },
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    textAlign: "center",
    userSelect: "none",
    verticalAlign: "middle",
    width: sizes.controlMd,
  },
});

/** ui-sdk's Calendar root; every option passes through. Shows one month, or `months` side by side, unless given parts. */
function Calendar({
  children,
  months = 1,
  showOutsideDays = false,
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarPrimitive>>) {
  return (
    <CalendarPrimitive
      months={months}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- ui-sdk renders a div; a fieldset would bring its own border and padding
      role="group"
      showOutsideDays={showOutsideDays}
      {...withStyles(props, stylex.props(styles.root, sx))}
    >
      {children ?? <CalendarMonths months={months} />}
    </CalendarPrimitive>
  );
}

/** The months side by side, their arrows over the first and last month's names; the heading stays for screen readers. */
function CalendarMonths({
  months = 1,
  sx,
  ...props
}: Styled<Omit<ComponentProps<"div">, "children">> & { months?: number }) {
  const offsets = Array.from({ length: months }, (_, offset) => offset);
  return (
    <div
      data-slot="calendar-months"
      {...withStyles(props, stylex.props(styles.months, sx))}
    >
      <CalendarPrevious />
      <CalendarHeading sx={visuallyHidden.base} />
      <CalendarNext />
      {offsets.map((offset) => (
        <CalendarGrid key={offset} offset={offset} />
      ))}
    </div>
  );
}

function CalendarHeading({
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarHeadingPrimitive>>) {
  return (
    <CalendarHeadingPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.heading], sx)
      )}
    />
  );
}

function Arrow({ icon }: { icon: typeof ArrowLeft01Icon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={controlIconSize["icon-sm"]}
      strokeWidth={Number(strokes.icon)}
      {...stylex.props(styles.arrow)}
    />
  );
}

function CalendarPrevious({ children, sx, ...props }: StepProps) {
  return (
    <CalendarPreviousPrimitive
      {...withStyles(
        props,
        stylex.props(
          buttonStyles({ size: "icon-sm", variant: "ghost" }),
          styles.step,
          styles.previous,
          sx
        )
      )}
    >
      {children ?? <Arrow icon={ArrowLeft01Icon} />}
    </CalendarPreviousPrimitive>
  );
}

function CalendarNext({ children, sx, ...props }: StepProps) {
  return (
    <CalendarNextPrimitive
      {...withStyles(
        props,
        stylex.props(
          buttonStyles({ size: "icon-sm", variant: "ghost" }),
          styles.step,
          styles.next,
          sx
        )
      )}
    >
      {children ?? <Arrow icon={ArrowRight01Icon} />}
    </CalendarNextPrimitive>
  );
}

/** One month's table, named by ui-sdk; its caption shows the month and stays out of the accessibility tree. */
function CalendarGrid({
  children,
  sx,
  ...props
}: Styled<Omit<ComponentProps<typeof CalendarGridPrimitive>, "children">> & {
  children?: ReactNode;
}) {
  return (
    <CalendarGridPrimitive
      {...withStyles(props, stylex.props(styles.grid, sx))}
    >
      {(state) => (
        <>
          <caption
            aria-hidden
            data-slot="calendar-caption"
            {...stylex.props(typeStyles.textSm, styles.caption)}
          >
            {state.label}
          </caption>
          {children ?? (
            <>
              <CalendarWeekdays />
              <CalendarWeeks />
            </>
          )}
        </>
      )}
    </CalendarGridPrimitive>
  );
}

function weekday(index: number) {
  return <CalendarWeekday index={index} />;
}

function CalendarWeekdays({
  children = weekday,
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarWeekdaysPrimitive>>) {
  return (
    <CalendarWeekdaysPrimitive {...withStyles(props, stylex.props(sx))}>
      {children}
    </CalendarWeekdaysPrimitive>
  );
}

function CalendarWeekday({
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarWeekdayPrimitive>>) {
  return (
    <CalendarWeekdayPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.captionLg, styles.weekday], sx)
      )}
    />
  );
}

function day(cell: CalendarGridCell) {
  return <CalendarDay value={cell.date} />;
}

function CalendarWeeks({
  children = day,
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarWeeksPrimitive>>) {
  return (
    <CalendarWeeksPrimitive {...withStyles(props, stylex.props(sx))}>
      {children}
    </CalendarWeeksPrimitive>
  );
}

function CalendarDay({
  sx,
  ...props
}: Styled<ComponentProps<typeof CalendarDayPrimitive>>) {
  return (
    <CalendarDayPrimitive
      {...withStyles(props, stylex.props([typeStyles.textSm, styles.day], sx))}
    />
  );
}

export { createCalendarController } from "@ui-sdk/react/calendar";
export type {
  CalendarController,
  CalendarValue,
  DateMatchers,
} from "@ui-sdk/react/calendar";
export {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarMonths,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
};
