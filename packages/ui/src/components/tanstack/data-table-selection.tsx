"use client";

import * as stylex from "@stylexjs/stylex";
import { announce } from "@ui-sdk/core";
import { use, useEffect, useRef } from "react";
import type { PointerEvent } from "react";

import { Checkbox } from "@/components/primitives/checkbox";
import { DataTableContext } from "@/components/tanstack/data-table-rows";
import type { Sx } from "@/lib/constella/styles";
import { colors, durations, media } from "@/lib/constella/tokens.stylex";

// What the row selection feature adds to a row and a table.
interface SelectableRow {
  getCanMultiSelect: () => boolean;
  getCanSelect: () => boolean;
  getDisplayIndex: () => number;
  getIsSelected: () => boolean;
  getToggleSelectedHandler: () => (event: ToggleEvent) => void;
  id: string;
  toggleSelected: (value?: boolean) => void;
}

// What the selection handler reads: Shift picks a range.
interface ToggleEvent {
  shiftKey: boolean;
  target: { checked: boolean };
}

interface SelectableTable {
  // Read for the ids mapped to `true`, as `getSelectedRowIds` also returns those mapped to `false`.
  atoms: { rowSelection?: { get: () => Readonly<Record<string, boolean>> } };
  getIsAllRowsSelected: () => boolean;
  getIsSomeRowsSelected: () => boolean;
  getRowModel: () => { rows: readonly unknown[] };
  setRowSelection: (selection: Record<string, true>) => void;
  toggleAllRowsSelected: (value?: boolean) => void;
}

const announceSelection = (table: SelectableTable) => {
  // Controlled selection has no new count to read until the parent commits it.
  queueMicrotask(() => {
    const selection = table.atoms.rowSelection?.get() ?? {};
    const count = Object.values(selection).filter(Boolean).length;
    if (count > 0) {
      announce(`${count} selected`);
    }
  });
};

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
  endId: string;
  from: number;
  to: number;
  value: boolean;
  // Each row the drag has set, with the state to restore if it leaves the range.
  was: Map<number, boolean>;
}

// Gives the rows from the range's start to `to` its value, and restores the rows it set before that fall outside.
function paintRange(rows: readonly { id: string }[], range: Drag, to: number) {
  range.to = to;
  range.endId = rows[to]?.id ?? range.endId;
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
}

function useDragSelect({
  onDragEnd,
  rows,
  table,
}: {
  onDragEnd: (id: string) => void;
  rows: readonly { id: string }[];
  table: SelectableTable | undefined;
}) {
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
        onDragEnd(drag.current.endId);
        if (table !== undefined) {
          announceSelection(table);
        }
      }
      drag.current = null;
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [onDragEnd, table]);

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
      endId: row.id,
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

const rowHovered =
  ":is(:is([data-slot='table-row'], [data-slot='data-table-row']):hover *)";
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
    transitionDuration: {
      default: 0,
      [media.hover]: { default: 0, [rowHovered]: durations.hover },
    },
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
function DataTableSelectAll({
  sx,
  table,
}: {
  sx?: Sx;
  table: SelectableTable;
}) {
  return (
    <Checkbox
      aria-label="Select all"
      checked={
        table.getIsAllRowsSelected() ||
        (table.getIsSomeRowsSelected() && "indeterminate")
      }
      disabled={table.getRowModel().rows.length === 0}
      onCheckedChange={(checked) => {
        table.toggleAllRowsSelected(checked === true);
        announceSelection(table);
      }}
      sx={sx}
    />
  );
}

/** A row's checkbox (needs `rowSelectionFeature`); Shift selects the range from the last one. `numbered` shows the row's number until the row is pointed at or any row is selected. */
function DataTableSelectRow({
  label,
  numbered = false,
  row,
  sx,
}: {
  /** Names the checkbox by its row, such as "Select ken@acme.com". */
  label: string;
  numbered?: boolean;
  row: SelectableRow;
  sx?: Sx;
}) {
  const table = use(DataTableContext);
  const toggle = row.getToggleSelectedHandler();
  const checkbox = (
    <Checkbox
      aria-label={label}
      checked={row.getIsSelected()}
      data-row-select=""
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked, { event }) => {
        const shiftKey =
          (event instanceof globalThis.MouseEvent ||
            event instanceof globalThis.KeyboardEvent) &&
          event.shiftKey;
        if (table === null) {
          toggle({ shiftKey, target: { checked: checked === true } });
        } else if (shiftKey) {
          table.selection.extend(row.id, {
            event,
            from: null,
            reason: "item-press",
          });
        } else {
          table.selection.toggle(row.id, { event, reason: "item-press" });
        }
      }}
      sx={numbered ? [styles.stacked, styles.revealed] : sx}
    />
  );
  if (!numbered) {
    return checkbox;
  }
  return (
    <span data-slot="data-table-select" {...stylex.props(styles.numbered, sx)}>
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
  useDragSelect,
};
