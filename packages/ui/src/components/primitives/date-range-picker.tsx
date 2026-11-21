"use client";

import { Calendar03Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { formatDateRange } from "@ui-sdk/react/date";
import {
  DatePickerContent as DatePickerContentPrimitive,
  DatePickerPreset as DatePickerPresetPrimitive,
  DatePicker as DatePickerPrimitive,
  DatePickerTrigger as DatePickerTriggerPrimitive,
} from "@ui-sdk/react/date-picker";
import { createContext, use, useMemo } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { CalendarMonths } from "@/components/primitives/calendar";
import { popoverStyles } from "@/components/primitives/popover";
import {
  popupMotion,
  skipsMotion,
  useSkipMotion,
} from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  stateStyles,
  typeStyles,
  withStyles,
} from "@/lib/constella/styles";
import {
  colors,
  offsets,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type DateRange = [start: string, end: string];

type PickerProps = ComponentProps<typeof DatePickerPrimitive>;

type DateRangePickerProps = Styled<
  Omit<
    PickerProps,
    "children" | "defaultValue" | "mode" | "months" | "onValueChange" | "value"
  >
> & {
  children: ReactNode;
  defaultValue?: DateRange | null;
  onValueChange?: (
    value: DateRange | null,
    details: Parameters<NonNullable<PickerProps["onValueChange"]>>[1]
  ) => void;
  value?: DateRange | null;
};

type DateRangePickerTriggerProps = Styled<
  Omit<ComponentProps<typeof DatePickerTriggerPrimitive>, "children" | "render">
> & {
  placeholder?: string;
};

type DateRangePickerPresetProps = Styled<
  Omit<
    ComponentProps<typeof DatePickerPresetPrimitive>,
    "children" | "render" | "value"
  >
> & {
  children?: ReactNode;
  value: DateRange;
};

const styles = stylex.create({
  root: {
    width: "fit-content",
  },
  // ui-sdk's date picker leaves the browser's `[popover]` border.
  content: {
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
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
  // A default menu's radio item, its tick on the end.
  preset: {
    alignItems: "center",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderEndEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartEndRadius: radii.md,
    borderStartStartRadius: radii.md,
    color: colors.textPrimary,
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    display: "flex",
    gap: space.row,
    justifyContent: "space-between",
    minHeight: sizes.controlMd,
    opacity: { default: null, ":disabled": opacities.disabled },
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    textAlign: "start",
  },
  calendar: {
    marginBlockEnd: space.md,
    marginBlockStart: space.md,
    marginInlineEnd: space.md,
    marginInlineStart: space.md,
  },
});

interface PickerState {
  locale: string | undefined;
  skip: boolean;
  value: DateRange | null;
}

const Picker = createContext<PickerState>({
  locale: undefined,
  skip: false,
  value: null,
});

function PickerProvider({
  children,
  locale,
  skip,
  value,
}: PickerState & { children: ReactNode }) {
  const state = useMemo(() => ({ locale, skip, value }), [locale, skip, value]);
  return <Picker value={state}>{children}</Picker>;
}

// A day picked by pointer closes with the popover's exit, unlike a menu's item.
const skipsPickMotion = (
  open: boolean,
  details: { reason: string; source: string }
) =>
  (details.reason !== "item-press" || details.source === "keyboard") &&
  skipsMotion(open, details);

/** ui-sdk's Date Picker picking a range across two months; its value is `[start, end]` as ISO dates, or `null`. */
function DateRangePicker({
  children,
  locale,
  onOpenChange,
  onValueChange,
  showOutsideDays = false,
  sx,
  ...props
}: DateRangePickerProps) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange, skipsPickMotion);
  return (
    <DatePickerPrimitive
      locale={locale}
      onOpenChange={handleOpenChange}
      onValueChange={(value, details) => {
        onValueChange?.(Array.isArray(value) ? value : null, details);
      }}
      showOutsideDays={showOutsideDays}
      {...withStyles(props, stylex.props(styles.root, sx))}
      mode="range"
      months={2}
    >
      {(state) => (
        <PickerProvider
          locale={locale}
          skip={skip}
          value={Array.isArray(state.value) ? state.value : null}
        >
          {children}
        </PickerProvider>
      )}
    </DatePickerPrimitive>
  );
}

/** A button showing the range; an `aria-label` names it and the dates follow. */
function DateRangePickerTrigger({
  "aria-label": label,
  placeholder = "Pick a date range",
  sx,
  ...props
}: DateRangePickerTriggerProps) {
  const { locale, value } = use(Picker);
  const text =
    value === null
      ? placeholder
      : formatDateRange(value[0], value[1], locale ?? "en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  return (
    <DatePickerTriggerPrimitive
      aria-label={label === undefined ? undefined : `${label}, ${text}`}
      render={<Button sx={sx} />}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        data-icon="inline-start"
        icon={Calendar03Icon}
        size={controlIconSize.default}
        strokeWidth={Number(strokes.icon)}
      />
      {text}
    </DatePickerTriggerPrimitive>
  );
}

function DateRangePickerContent({
  align = "start",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: Styled<ComponentProps<typeof DatePickerContentPrimitive>>) {
  const { skip } = use(Picker);
  return (
    <DatePickerContentPrimitive
      align={align}
      data-skip-motion={skip || undefined}
      sideOffset={sideOffset}
      {...withStyles(
        props,
        stylex.props(
          [popoverStyles.popup, popoverStyles.surface, styles.content],
          popupMotion.popover,
          sx
        )
      )}
    />
  );
}

function DateRangePickerPresets({
  sx,
  ...props
}: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="date-range-picker-presets"
      {...withStyles(props, stylex.props(styles.presets, sx))}
    />
  );
}

function DateRangePickerPreset({
  children,
  sx,
  value,
  ...props
}: DateRangePickerPresetProps) {
  return (
    <DatePickerPresetPrimitive
      value={value}
      {...withStyles(
        props,
        stylex.props([typeStyles.textMd, styles.preset], stateStyles.ghost, sx)
      )}
    >
      {(state) => (
        <>
          {children}
          {state.selected ? (
            <HugeiconsIcon
              aria-hidden
              icon={Tick02Icon}
              size={controlIconSize.default}
              strokeWidth={Number(strokes.icon)}
            />
          ) : null}
        </>
      )}
    </DatePickerPresetPrimitive>
  );
}

function DateRangePickerCalendar({
  sx,
  ...props
}: Omit<ComponentProps<typeof CalendarMonths>, "months">) {
  return <CalendarMonths months={2} {...props} sx={[styles.calendar, sx]} />;
}

export {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerPreset,
  DateRangePickerPresets,
  DateRangePickerTrigger,
};
export type {
  DateRange,
  DateRangePickerPresetProps,
  DateRangePickerProps,
  DateRangePickerTriggerProps,
};
