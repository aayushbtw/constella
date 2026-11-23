"use client";

import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  layers,
  media,
  motion,
  radii,
  shadows,
  space,
} from "@/lib/constella/tokens.stylex";

// What the row selection feature adds to a table.
interface ActionBarTable {
  getSelectedRowIds: () => string[];
  resetRowSelection: (defaultState?: boolean) => void;
}

interface FocusOrigin {
  element: HTMLElement | null;
  row: number | null;
  table: HTMLElement | null;
}

const noOrigin: FocusOrigin = { element: null, row: null, table: null };

const rowInPlaceOf = ({ row, table }: FocusOrigin) => {
  const rows = [
    ...(table?.querySelectorAll<HTMLElement>("tr[data-index]") ?? []),
  ];
  return (
    (row === null
      ? undefined
      : rows.findLast((candidate) => Number(candidate.dataset.index) <= row)) ??
    table?.querySelector<HTMLElement>("tr[tabindex='0']") ??
    table
  );
};

const closed = ":is([data-closed])";
// A key in the table, or in the bar itself, moved it: the keyboard never animates.
const byKeyboard =
  ":is(:root:has([data-slot='data-table'] :focus-visible) *, :has(:focus-visible))";

const styles = stylex.create({
  // Centered by its auto margins between both edges, so the transform is free for the motion.
  bar: {
    alignItems: "center",
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    insetBlockEnd: space.lg,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    justifyContent: "center",
    marginInlineEnd: "auto",
    marginInlineStart: "auto",
    maxWidth: `calc(100% - 2 * ${space.md})`,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    position: "fixed",
    width: "fit-content",
    zIndex: layers.bar,
  },
  motion: {
    opacity: { default: 1, [closed]: 0 },
    transform: {
      default: "none",
      [closed]: {
        default: `translateY(${motion.exitOffset}) scale(${motion.popoverScale})`,
        [media.reducedMotion]: "none",
      },
    },
    transformOrigin: "bottom center",
    transitionDuration: {
      default: durations.popover,
      [closed]: durations.popoverExit,
      [byKeyboard]: "0s",
    },
    transitionProperty: "opacity, transform, visibility",
    transitionTimingFunction: easings.out,
    // Hidden once it has faded, which drops the bar from an agent's snapshot; `inert` alone lists its buttons as disabled.
    visibility: { default: "visible", [closed]: "hidden" },
  },
  count: {
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    paddingInlineEnd: space.popup,
    paddingInlineStart: space.popup,
    whiteSpace: "nowrap",
  },
});

/** A bar of actions for the selected rows (needs `rowSelectionFeature`), floating at the bottom of the window while any row is selected: the count, `children`, then a Clear button. */
function DataTableActionBar({
  children,
  label,
  sx,
  table,
}: {
  /** The actions, such as Buttons or a Dropdown Menu trigger. */
  children?: ReactNode;
  /** Names the bar for screen readers. */
  label: string;
  sx?: Sx;
  table: ActionBarTable;
}) {
  const count = table.getSelectedRowIds().length;
  const open = count > 0;
  // The last count stays on screen while the bar leaves.
  const [held, setHeld] = useState(count);
  if (count > 0 && count !== held) {
    setHeld(count);
  }
  const bar = useRef<HTMLDivElement>(null);
  const origin = useRef<FocusOrigin>(noOrigin);
  // Closing inerts the bar, which would drop a focused Clear or action to the page.
  useLayoutEffect(() => {
    if (open || bar.current?.contains(document.activeElement) !== true) {
      return;
    }
    const { element } = origin.current;
    if (element?.isConnected === true) {
      element.focus();
    }
    if (document.activeElement !== element) {
      rowInPlaceOf(origin.current)?.focus();
    }
  }, [open]);
  return (
    <div
      aria-label={label}
      data-closed={open ? undefined : ""}
      data-slot="data-table-action-bar"
      inert={!open}
      onFocus={({ currentTarget, relatedTarget }) => {
        if (!currentTarget.contains(relatedTarget)) {
          const row =
            relatedTarget?.closest<HTMLElement>("tr[data-index]")?.dataset
              .index;
          origin.current = {
            element:
              relatedTarget instanceof HTMLElement ? relatedTarget : null,
            row: row === undefined ? null : Number(row),
            table:
              relatedTarget?.closest<HTMLElement>("[data-slot='data-table']") ??
              null,
          };
        }
      }}
      ref={bar}
      role="toolbar"
      {...stylex.props([typeStyles.textSm, styles.bar], styles.motion, sx)}
    >
      <span {...stylex.props(styles.count)}>
        {count > 0 ? count : held} selected
      </span>
      {children}
      <Button
        aria-label="Clear selection"
        corners="rounded"
        onClick={() => {
          table.resetRowSelection(true);
        }}
        size="sm"
        variant="ghost"
      >
        Clear
      </Button>
    </div>
  );
}

export { DataTableActionBar };
