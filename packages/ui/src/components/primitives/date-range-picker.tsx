"use client";

import { Calendar03Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import type { DateRange, PropsBase } from "react-day-picker";

import { Button } from "@/components/primitives/button";
import { Calendar } from "@/components/primitives/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
import {
  controlIconSize,
  stateStyles,
  typeStyles,
} from "@/lib/constella/styles";
import {
  colors,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

interface DayRange {
  from: Date;
  to: Date;
}

interface DateRangePreset {
  label: string;
  range: DayRange;
}

const styles = stylex.create({
  // A large menu's corner, so the presets read as one.
  content: {
    borderEndEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderStartStartRadius: radii.sm,
    flexDirection: "row",
    gap: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    width: "auto",
  },
  presets: {
    borderInlineEndColor: colors.borderSubtle,
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: strokes.border,
    display: "flex",
    flexDirection: "column",
    minWidth: sizes.menu,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
  },
  // A large menu's radio item, its tick on the end.
  preset: {
    alignItems: "center",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderEndEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartEndRadius: radii.xs,
    borderStartStartRadius: radii.xs,
    color: colors.textPrimary,
    cursor: "pointer",
    display: "flex",
    gap: space.row,
    justifyContent: "space-between",
    minHeight: sizes.controlMd,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    textAlign: "start",
  },
  calendar: {
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
});

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const sameRange = (a: DayRange, b: DayRange) =>
  sameDay(a.from, b.from) && sameDay(a.to, b.to);

/** A button showing a day range, opening presets beside a two-month calendar; a pick closes it. */
function DateRangePicker({
  onValueChange,
  presets,
  value,
  ...calendar
}: Pick<
  PropsBase,
  | "disabled"
  | "endMonth"
  | "locale"
  | "startMonth"
  | "timeZone"
  | "weekStartsOn"
> & {
  onValueChange: (range: DayRange) => void;
  presets?: readonly DateRangePreset[];
  value: DayRange;
}) {
  const [open, setOpen] = useState(false);
  const popup = useRef<HTMLDivElement>(null);
  // The first day picked, until a second one ends the range.
  const [anchor, setAnchor] = useState<Date | null>(null);
  const shown: DateRange =
    anchor === null ? value : { from: anchor, to: anchor };

  const pick = (range: DayRange) => {
    onValueChange(range);
    setAnchor(null);
    setOpen(false);
  };

  return (
    <Popover
      onOpenChange={(next) => {
        setOpen(next);
        setAnchor(null);
      }}
      open={open}
    >
      <PopoverTrigger render={<Button size="sm" />}>
        <HugeiconsIcon
          aria-hidden
          data-icon="inline-start"
          icon={Calendar03Icon}
          size={controlIconSize.sm}
          strokeWidth={Number(strokes.icon)}
        />
        {new Intl.DateTimeFormat(calendar.locale?.code ?? "en-US", {
          timeZone: calendar.timeZone,
          day: "numeric",
          month: "short",
          year: "numeric",
        })
          .formatRange(value.from, value.to)
          // Node's ICU spaces the dash with thin spaces and browsers' with plain ones, so SSR would mismatch.
          .replaceAll("\u2009", " ")}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        // A pointer open focuses the popup, so no preset wears a ring it didn't earn.
        initialFocus={(openType) => openType === "keyboard" || popup.current}
        ref={popup}
        sx={styles.content}
      >
        {presets === undefined ? null : (
          <div {...stylex.props(styles.presets)}>
            {presets.map((preset) => {
              const active = sameRange(preset.range, value);
              return (
                <button
                  aria-pressed={active}
                  key={preset.label}
                  onClick={() => {
                    pick(preset.range);
                  }}
                  type="button"
                  {...stylex.props(
                    typeStyles.textSm,
                    styles.preset,
                    stateStyles.ghost
                  )}
                >
                  {preset.label}
                  {active ? (
                    <HugeiconsIcon
                      aria-hidden
                      icon={Tick02Icon}
                      size={controlIconSize.default}
                      strokeWidth={Number(strokes.icon)}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
        <Calendar
          defaultMonth={value.to}
          mode="range"
          numberOfMonths={2}
          onSelect={(_range, day) => {
            if (anchor === null) {
              setAnchor(day);
              return;
            }
            pick(
              anchor <= day
                ? { from: anchor, to: day }
                : { from: day, to: anchor }
            );
          }}
          selected={shown}
          {...calendar}
          sx={styles.calendar}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker };
export type { DateRangePreset, DayRange };
