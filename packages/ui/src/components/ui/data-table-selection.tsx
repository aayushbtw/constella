"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { colors, durations, media } from "@/lib/tokens.stylex";

// What the row selection feature adds to a row and a table.
interface SelectableRow {
  getCanSelect: () => boolean;
  getDisplayIndex: () => number;
  getIsSelected: () => boolean;
  getToggleSelectedHandler: () => (event: ToggleEvent) => void;
  toggleSelected: (value?: boolean) => void;
}

// What the selection handler reads: Shift picks a range.
interface ToggleEvent {
  shiftKey: boolean;
  target: { checked: boolean };
}

interface SelectableTable {
  getIsAllRowsSelected: () => boolean;
  getIsSomeRowsSelected: () => boolean;
  toggleAllRowsSelected: (value?: boolean) => void;
}

const isSelectable = <TTable extends { getAllLeafColumns: () => unknown[] }>(
  table: TTable
): table is TTable & SelectableTable => "getIsSomeRowsSelected" in table;

const isSelecting = (table: { getAllLeafColumns: () => unknown[] }) =>
  isSelectable(table) &&
  (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected());

const hasSelection = <TRow extends { id: string }>(
  row: TRow | undefined
): row is TRow & SelectableRow => row !== undefined && "getIsSelected" in row;

const rowIndexOf = (target: EventTarget) =>
  target instanceof Element
    ? Number(target.closest<HTMLElement>("tr[data-index]")?.dataset.index)
    : Number.NaN;

interface Drag {
  from: number;
  to: number;
  value: boolean;
  // Each row the drag has set, with the state to restore if it leaves the range.
  was: Map<number, boolean>;
}

// Gives the rows from the range's start to `to` its value, and restores the rows it set before that fall outside.
function paintRange(rows: readonly { id: string }[], range: Drag, to: number) {
  range.to = to;
  const low = Math.min(range.from, to);
  const high = Math.max(range.from, to);
  for (const [index, was] of range.was) {
    const row = rows[index];
    if ((index < low || index > high) && hasSelection(row)) {
      row.toggleSelected(was);
      range.was.delete(index);
    }
  }
  for (let index = low; index <= high; index += 1) {
    const row = rows[index];
    if (hasSelection(row) && row.getCanSelect()) {
      if (!range.was.has(index)) {
        range.was.set(index, row.getIsSelected());
      }
      row.toggleSelected(range.value);
    }
  }
  // Through the handler, so a later Shift-click ranges from where this ended.
  const end = rows[to];
  if (hasSelection(end) && end.getCanSelect()) {
    end.getToggleSelectedHandler()({
      shiftKey: false,
      target: { checked: range.value },
    });
  }
}

// Drag from a row's checkbox across others to give them all its new state; dragging back restores them.
function useDragSelect(rows: readonly { id: string }[]) {
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    // The checkbox under the release would toggle again, so its click is dropped.
    const swallow = (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    const end = () => {
      if (drag.current !== null && drag.current.was.size > 0) {
        window.addEventListener("click", swallow, { capture: true });
        setTimeout(() => {
          window.removeEventListener("click", swallow, { capture: true });
        }, 0);
      }
      drag.current = null;
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    const from = rowIndexOf(event.target);
    const row = rows[from];
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      event.shiftKey ||
      !(event.target instanceof Element) ||
      event.target.closest("[data-row-select]") === null ||
      !hasSelection(row) ||
      !row.getCanSelect()
    ) {
      return;
    }
    drag.current = {
      from,
      to: from,
      value: !row.getIsSelected(),
      was: new Map(),
    };
  };

  const handlePointerOver = (event: PointerEvent<HTMLElement>) => {
    const { current } = drag;
    const to = rowIndexOf(event.target);
    if (current === null || Number.isNaN(to) || to === current.to) {
      return;
    }
    paintRange(rows, current, to);
    getSelection()?.removeAllRanges();
  };

  return { handlePointerDown, handlePointerOver };
}

const rowHovered = ":is([data-slot='table-row']:hover *)";
const selecting = ":is([data-selecting] *)";

const styles = stylex.create({
  // The number and the checkbox share one spot; the checkbox sits on top, so a click on the number selects.
  numbered: {
    display: "inline-grid",
    justifyItems: "center",
    alignItems: "center",
  },
  // Fades only for the pointer; a swap the keyboard causes is instant.
  stacked: {
    gridArea: "1 / 1",
    transitionDuration: { default: "0s", [rowHovered]: durations.hover },
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
  },
  // Touch has no hover to reveal the checkbox, so it always shows there.
  number: {
    color: colors.textMuted,
    fontVariantNumeric: "tabular-nums",
    opacity: {
      default: 0,
      [media.hover]: {
        default: 1,
        [rowHovered]: 0,
        [selecting]: 0,
        ":is([data-slot='data-table-select']:has(:focus-visible) *)": 0,
      },
    },
    pointerEvents: "none",
  },
  revealed: {
    opacity: {
      default: 1,
      [media.hover]: {
        default: 0,
        [rowHovered]: 1,
        [selecting]: 1,
        ":focus-visible": 1,
      },
    },
  },
});

/** The header's checkbox: selects every row (needs `rowSelectionFeature`). */
function DataTableSelectAll({ table }: { table: SelectableTable }) {
  return (
    <Checkbox
      aria-label="Select all"
      checked={table.getIsAllRowsSelected()}
      indeterminate={
        table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
      }
      onCheckedChange={(checked) => {
        table.toggleAllRowsSelected(checked);
      }}
    />
  );
}

/** A row's checkbox (needs `rowSelectionFeature`); Shift selects the range from the last one. `numbered` shows the row's number until the row is pointed at or any row is selected. */
function DataTableSelectRow({
  numbered = false,
  row,
}: {
  numbered?: boolean;
  row: SelectableRow;
}) {
  const toggle = row.getToggleSelectedHandler();
  const checkbox = (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected()}
      data-row-select=""
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked, { event }) => {
        toggle({
          shiftKey:
            (event instanceof globalThis.MouseEvent ||
              event instanceof globalThis.KeyboardEvent) &&
            event.shiftKey,
          target: { checked },
        });
      }}
      sx={numbered ? [styles.stacked, styles.revealed] : undefined}
    />
  );
  if (!numbered) {
    return checkbox;
  }
  return (
    <span data-slot="data-table-select" {...stylex.props(styles.numbered)}>
      <span aria-hidden {...stylex.props(styles.stacked, styles.number)}>
        {row.getDisplayIndex() + 1}
      </span>
      {checkbox}
    </span>
  );
}

export {
  DataTableSelectAll,
  DataTableSelectRow,
  hasSelection,
  isSelectable,
  isSelecting,
  paintRange,
  useDragSelect,
};
export type { Drag };
