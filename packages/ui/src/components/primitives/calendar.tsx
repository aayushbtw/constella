"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import type { DayButton, DayPickerProps } from "react-day-picker";

import { buttonStyles } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  stateStyles,
  typeStyles,
} from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const styles = stylex.create({
  root: {
    width: "fit-content",
  },
  months: {
    display: "flex",
    gap: space.lg,
    position: "relative",
  },
  month: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  // Over the captions, so its arrows sit beside the first and last month's names.
  nav: {
    alignItems: "center",
    display: "flex",
    height: sizes.controlMd,
    insetBlockStart: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    justifyContent: "space-between",
    position: "absolute",
    zIndex: 1,
  },
  navButton: {
    // DayPicker marks an arrow past `startMonth`/`endMonth` aria-disabled, not disabled.
    opacity: { default: 1, ":is([aria-disabled='true'])": opacities.disabled },
  },
  caption: {
    alignItems: "center",
    display: "flex",
    height: sizes.controlMd,
    justifyContent: "center",
    paddingInlineStart: sizes.controlMd,
    paddingInlineEnd: sizes.controlMd,
  },
  captionLabel: {
    fontWeight: fontWeights.medium,
  },
  grid: {
    borderCollapse: "collapse",
  },
  row: {
    display: "flex",
  },
  week: {
    marginBlockStart: space.xxs,
  },
  weekday: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    fontWeight: fontWeights.regular,
    height: sizes.controlMd,
    justifyContent: "center",
    width: sizes.controlMd,
  },
  day: {
    height: sizes.controlMd,
    paddingBlockStart: 0,
    paddingBlockEnd: 0,
    paddingInlineStart: 0,
    paddingInlineEnd: 0,
    width: sizes.controlMd,
  },
  rangeMiddle: {
    backgroundColor: colors.infoSubtle,
  },
  // The fill runs on under the solid end, so the band reaches its edge.
  rangeStart: {
    backgroundColor: colors.infoSubtle,
    borderEndStartRadius: radii.sm,
    borderStartStartRadius: radii.sm,
  },
  rangeEnd: {
    backgroundColor: colors.infoSubtle,
    borderEndEndRadius: radii.sm,
    borderStartEndRadius: radii.sm,
  },
  hidden: {
    visibility: "hidden",
  },
  dayButton: {
    alignItems: "center",
    borderBlockStyle: "none",
    borderInlineStyle: "none",
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: "inherit",
    cursor: { default: "pointer", ":disabled": "default" },
    display: "flex",
    fontVariantNumeric: "tabular-nums",
    height: "100%",
    justifyContent: "center",
    paddingBlockStart: 0,
    paddingBlockEnd: 0,
    paddingInlineStart: 0,
    paddingInlineEnd: 0,
    width: "100%",
  },
  today: {
    fontWeight: fontWeights.medium,
  },
  outside: {
    color: colors.textMuted,
  },
  disabled: {
    color: colors.textMuted,
    opacity: opacities.disabled,
  },
  // These replace the ghost fill whole, hover and press included, so the band and the ends stay put.
  inRange: {
    backgroundColor: "transparent",
  },
  solid: {
    backgroundColor: colors.infoSolid,
    color: colors.accentOnSolid,
  },
  // An end square on the side the band continues from.
  startEdge: {
    borderEndEndRadius: 0,
    borderStartEndRadius: 0,
  },
  endEdge: {
    borderEndStartRadius: 0,
    borderStartStartRadius: 0,
  },
});

const className = (...style: stylex.StyleXStyles[]) =>
  stylex.props(...style).className ?? "";

const classNames = {
  root: className(styles.root),
  months: className(styles.months),
  month: className(styles.month),
  nav: className(styles.nav),
  button_previous: className(
    buttonStyles({ size: "icon-sm", variant: "ghost" }),
    styles.navButton
  ),
  button_next: className(
    buttonStyles({ size: "icon-sm", variant: "ghost" }),
    styles.navButton
  ),
  month_caption: className(styles.caption),
  caption_label: className(typeStyles.textSm, styles.captionLabel),
  month_grid: className(styles.grid),
  weekdays: className(styles.row),
  weekday: className(typeStyles.captionLg, styles.weekday),
  week: className(styles.row, styles.week),
  day: className(typeStyles.textSm, styles.day),
  range_start: className(styles.rangeStart),
  range_middle: className(styles.rangeMiddle),
  range_end: className(styles.rangeEnd),
  hidden: className(styles.hidden),
};

function Chevron({ orientation }: { orientation?: string }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={orientation === "left" ? ArrowLeft01Icon : ArrowRight01Icon}
      size={controlIconSize.sm}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function CalendarDayButton({
  day: _day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null);
  // A custom day button takes over focus from DayPicker's own.
  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  const {
    range_end: end,
    range_middle: middle,
    range_start: start,
  } = modifiers;
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      {...stylex.props(
        styles.dayButton,
        stateStyles.ghost,
        modifiers.today && styles.today,
        modifiers.outside && styles.outside,
        modifiers.disabled && styles.disabled,
        middle && styles.inRange,
        (start || end || (modifiers.selected && !middle)) && styles.solid,
        start && !end && styles.startEdge,
        end && !start && styles.endEdge
      )}
    />
  );
}

/** react-day-picker's DayPicker in Constella's look; every DayPicker prop passes through. */
function Calendar({
  showOutsideDays = false,
  components,
  sx,
  ...props
}: DayPickerProps & { sx?: Sx }) {
  return (
    <DayPicker
      className={stylex.props(sx).className}
      classNames={classNames}
      components={{ Chevron, DayButton: CalendarDayButton, ...components }}
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

export { Calendar };
