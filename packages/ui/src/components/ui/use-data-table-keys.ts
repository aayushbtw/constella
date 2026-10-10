"use client";

import { useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, MouseEvent, RefObject } from "react";

import { hasSelection, paintRange } from "@/components/ui/data-table-selection";
import type { Drag } from "@/components/ui/data-table-selection";

// A click on one of these is the control's, not the row's.
const controls =
  "a, button, input, label, select, textarea, [role='button'], [role='checkbox'], [role='switch']";

// Where a key moves the row focus from `index`, if it moves it.
const keyTarget = (key: string, index: number, last: number) => {
  switch (key) {
    case "ArrowDown": {
      return Math.min(index + 1, last);
    }
    case "ArrowUp": {
      return Math.max(index - 1, 0);
    }
    case "End": {
      return last;
    }
    case "Home": {
      return 0;
    }
    default: {
      return null;
    }
  }
};

// Cmd, Ctrl or Shift on a row selects it (Shift through to the last one), as in a file list.
function clickRow<TRow extends { id: string }>(
  event: MouseEvent<HTMLTableRowElement>,
  row: TRow,
  onRowClick: (row: TRow) => void
) {
  const { target } = event;
  if (
    !(target instanceof Element) ||
    // A click in a popup opened from the row reaches it through React, not the page.
    !event.currentTarget.contains(target) ||
    target.closest(controls) !== null
  ) {
    return;
  }
  if (
    (event.metaKey || event.ctrlKey || event.shiftKey) &&
    hasSelection(row) &&
    row.getCanSelect()
  ) {
    // Shift-click also extends the page's text selection.
    getSelection()?.removeAllRanges();
    row.getToggleSelectedHandler()({
      shiftKey: event.shiftKey,
      target: { checked: !row.getIsSelected() },
    });
    return;
  }
  // The pointer was selecting text, not opening the row.
  if (getSelection()?.isCollapsed === false) {
    return;
  }
  onRowClick(row);
}

// One row takes Tab at a time and arrows move between them, as in a list. On a focused
// row, x or Space selects it, Shift with an arrow extends the selection, and Enter opens it.
function useDataTableKeys<TRow extends { id: string }>({
  activeRowId,
  body,
  enabled,
  items,
  onRowClick,
  rows,
  scrollToIndex,
}: {
  activeRowId: string | undefined;
  body: RefObject<HTMLTableSectionElement | null>;
  enabled: boolean;
  items: readonly { index: number }[];
  onRowClick: ((row: TRow) => void) | undefined;
  rows: readonly TRow[];
  scrollToIndex: (index: number) => void;
}) {
  const [focusIndex, setFocusIndex] = useState(0);
  const extending = useRef<Drag | null>(null);

  const focusRow = (index: number) => {
    setFocusIndex(index);
    const find = () =>
      body.current?.querySelector<HTMLElement>(`tr[data-index="${index}"]`);
    const mounted = find();
    if (mounted) {
      mounted.focus();
      return;
    }
    // Far rows mount only once the virtualizer has scrolled to them, which can take a few frames.
    scrollToIndex(index);
    let frames = 0;
    const retry = () => {
      const target = find();
      if (target) {
        target.focus({ preventScroll: true });
      } else if (frames < 10) {
        frames += 1;
        requestAnimationFrame(retry);
      }
    };
    requestAnimationFrame(retry);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const { target } = event;
    if (!(target instanceof HTMLTableRowElement)) {
      return;
    }
    const index = Number(target.dataset.index);
    const row = rows[index];
    const next = keyTarget(event.key, index, rows.length - 1);
    if (row === undefined) {
      return;
    }
    if (next !== null) {
      event.preventDefault();
      const stepping = event.key === "ArrowDown" || event.key === "ArrowUp";
      if (event.shiftKey && stepping) {
        const range = extending.current ?? {
          from: index,
          to: index,
          value: true,
          was: new Map<number, boolean>(),
        };
        extending.current = range;
        paintRange(rows, range, next);
      } else {
        extending.current = null;
      }
      focusRow(next);
      return;
    }
    if (event.key !== "Shift") {
      extending.current = null;
    }
    if (
      (event.key === "x" || event.key === " ") &&
      hasSelection(row) &&
      row.getCanSelect()
    ) {
      event.preventDefault();
      row.getToggleSelectedHandler()({
        shiftKey: false,
        target: { checked: !row.getIsSelected() },
      });
    } else if (event.key === "Enter" && onRowClick !== undefined) {
      event.preventDefault();
      onRowClick(row);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    const index = Number(event.currentTarget.dataset.index);
    // Focus landing anywhere but where Shift and an arrow just went starts a new range.
    if (index !== extending.current?.to) {
      extending.current = null;
    }
    setFocusIndex(index);
  };

  // The row that takes Tab, kept among the rendered ones so scrolling never leaves none.
  const first = items[0]?.index ?? 0;
  const tabbable = Math.max(
    first,
    Math.min(focusIndex, items.at(-1)?.index ?? 0)
  );

  // A row's state, focus and click props; one row takes Tab, and none when rows can't be acted on.
  const rowProps = (index: number, row: TRow) => {
    const selected = hasSelection(row) ? row.getIsSelected() : undefined;
    return {
      "aria-current": row.id === activeRowId ? ("true" as const) : undefined,
      "data-state": selected === true ? "selected" : undefined,
      ...(enabled && {
        onFocus: handleFocus,
        tabIndex: index === tabbable ? 0 : -1,
      }),
      ...(onRowClick !== undefined && {
        onClick: (event: MouseEvent<HTMLTableRowElement>) => {
          clickRow(event, row, onRowClick);
        },
      }),
    };
  };

  return { handleKeyDown, rowProps };
}

export { useDataTableKeys };
