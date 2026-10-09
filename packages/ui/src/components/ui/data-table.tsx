"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  ArrowUp01Icon,
  SlidersHorizontalIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
  ReactTable,
  Row,
  RowData,
  TableFeatures,
} from "@tanstack/react-table";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TableSize } from "@/components/ui/table";
import {
  colors,
  durations,
  fontSizes,
  media,
  opacities,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type DataTableQuery = Pick<
  UseQueryResult,
  "isError" | "isFetching" | "isPending" | "isPlaceholderData"
>;

interface DataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
> {
  /** The row open elsewhere, like in a Side Panel: marked current and filled like a selected one. */
  activeRowId?: string;
  /** Keyed by column id: a column's width or alignment, on its header and cells. */
  columnSx?: Readonly<Partial<Record<string, stylex.StyleXStyles>>>;
  /** Shown in one full-width row when no row is left. */
  empty: ReactNode;
  /** Shown in place of `empty` when `query` failed and no row is left. */
  error?: ReactNode;
  /** Names the table for screen readers. */
  label: string;
  /** A click on the row, outside its controls; with Cmd, Ctrl or Shift it selects instead. Put a link or button in the row too, for the keyboard. */
  onRowClick?: (row: Row<TFeatures, TData>) => void;
  /** The `useQuery` result the data comes from: skeleton rows while pending, faded while a new page loads over the old one. */
  query?: DataTableQuery;
  /** A guess the virtualizer corrects by measuring each row it renders. */
  rowHeight?: number;
  /** The element the table scrolls in, when it isn't the window, like an app's main area. */
  scrollRef?: RefObject<HTMLElement | null>;
  size?: TableSize;
  sx?: stylex.StyleXStyles;
  table: ReactTable<TFeatures, TData, TSelected>;
}

// What the sorting feature adds to a column; typed by shape, so any feature set fits.
interface SortableColumn {
  getCanSort: () => boolean;
  getIsSorted: () => false | "asc" | "desc";
  getToggleSortingHandler: () =>
    | undefined
    | ((event: MouseEvent<HTMLButtonElement>) => void);
}

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

// What the column sizing feature adds to a column.
interface SizedColumn {
  columnDef: { size?: number };
  getSize: () => number;
}

const isSized = <TColumn extends { id: string }>(
  column: TColumn
): column is TColumn & SizedColumn => "getSize" in column;

// The column visibility feature's table; without it every column shows.
const hasVisibility = <TTable extends { getAllLeafColumns: () => unknown[] }>(
  table: TTable
): table is TTable & { getVisibleLeafColumns: TTable["getAllLeafColumns"] } =>
  "getVisibleLeafColumns" in table;

const isSelectable = <TTable extends { getAllLeafColumns: () => unknown[] }>(
  table: TTable
): table is TTable & SelectableTable => "getIsSomeRowsSelected" in table;

const isSelecting = (table: { getAllLeafColumns: () => unknown[] }) =>
  isSelectable(table) &&
  (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected());

const hasSelection = <TRow extends { id: string }>(
  row: TRow | undefined
): row is TRow & SelectableRow => row !== undefined && "getIsSelected" in row;

// A click on one of these is the control's, not the row's.
const controls =
  "a, button, input, label, select, textarea, [role='button'], [role='checkbox'], [role='switch']";

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

// One row takes Tab at a time and arrows move between them, as in a list. On a focused
// row, x or Space selects it, Shift with an arrow extends the selection, and Enter opens it.
function useRowKeys<TRow extends { id: string }>({
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

const rowHovered = ":is([data-slot='table-row']:hover *)";
const selecting = ":is([data-selecting] *)";

const styles = stylex.create({
  // Fixed, as only the rows on screen render.
  fixed: {
    tableLayout: "fixed",
  },
  pad: (height: number) => ({ height }),
  width: (width: number) => ({ width }),
  body: {
    opacity: 1,
    transitionDuration: durations.hover,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
  },
  busy: {
    opacity: opacities.busy,
  },
  skeleton: {
    height: sizes.iconSm,
  },
  clickable: {
    cursor: "pointer",
  },
  // Fixed columns don't grow to fit, so text that overflows one ends in an ellipsis; a checkbox keeps its hit area.
  cell: {
    overflow: { default: "hidden", ":has([data-slot='checkbox'])": "visible" },
    textOverflow: "ellipsis",
  },
  empty: {
    color: colors.textSecondary,
    height: sizes.media,
    textAlign: "center",
  },
  // Lines its label up with the cells under it, despite the button's padding.
  sort: {
    marginInlineStart: `calc(-1 * ${space.xs})`,
  },
  sortIcon: {
    color: colors.textMuted,
    display: "flex",
  },
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
  pagination: {
    alignItems: "center",
    columnGap: space.md,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: space.xs,
  },
  range: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
  pageControls: {
    alignItems: "center",
    columnGap: space.md,
    display: "flex",
    flexWrap: "wrap",
    rowGap: space.xs,
  },
  pageSize: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
  },
  pageButtons: {
    display: "flex",
    gap: space.xxs,
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

const noColumns = {};

// The server has no window, so it renders the rows that fit a typical one.
const serverRect = { height: 900, width: 1280 };

const loadingRows = Array.from({ length: 5 }, (_, index) => index);

// Only a column that sets `size` gets a width; the rest share what's left.
const widthOf = (column: { id: string }) =>
  isSized(column) && column.columnDef.size !== undefined
    ? styles.width(column.getSize())
    : null;

// Measures now and again whenever one of the targets changes size; returns the cleanup.
const trackMargin = (measure: () => void, targets: readonly Element[]) => {
  measure();
  const observer = new ResizeObserver(measure);
  for (const target of targets) {
    observer.observe(target);
  }
  return () => {
    observer.disconnect();
  };
};

// The cleanup for an effect that tracks nothing, as the other mode does the measuring.
const keepMargin = () => null;

// Virtualizes against the window, or the element `scrollRef` names. Both hooks always run,
// as hooks can't be conditional, and only the one in use is enabled.
function useRowVirtualizer({
  body,
  rowHeight,
  rows,
  scrollRef,
}: {
  body: RefObject<HTMLTableSectionElement | null>;
  rowHeight: number;
  rows: readonly { id: string }[];
  scrollRef: RefObject<HTMLElement | null> | undefined;
}) {
  const [scrollMargin, setScrollMargin] = useState(0);

  // The body's distance from the top of what scrolls, which the scroll offset is
  // measured from; measured again whenever the content above it changes height.
  useLayoutEffect(() => {
    if (scrollRef !== undefined) {
      return keepMargin;
    }
    return trackMargin(() => {
      const top = body.current?.getBoundingClientRect().top ?? 0;
      setScrollMargin(top + window.scrollY);
    }, [document.body]);
  }, [body, scrollRef]);

  // Passive, as a parent's ref attaches only after its children's layout effects run.
  useEffect(() => {
    const scroller = scrollRef?.current;
    if (scroller === undefined || scroller === null) {
      return keepMargin;
    }
    return trackMargin(() => {
      const top = body.current?.getBoundingClientRect().top ?? 0;
      setScrollMargin(
        // `scrollTop` counts from inside the border.
        top -
          scroller.getBoundingClientRect().top -
          scroller.clientTop +
          scroller.scrollTop
      );
    }, [scroller, ...scroller.children]);
  }, [body, scrollRef]);

  const options = {
    count: rows.length,
    estimateSize: () => rowHeight,
    getItemKey: (index: number) => rows[index]?.id ?? index,
    overscan: 8,
    scrollMargin,
  };
  // oxlint-disable-next-line react/incompatible-library -- the virtualizer re-renders on scroll by design
  const onWindow = useWindowVirtualizer({
    ...options,
    enabled: scrollRef === undefined,
    initialRect: serverRect,
  });
  // oxlint-disable-next-line react/incompatible-library -- the virtualizer re-renders on scroll by design
  const inElement = useVirtualizer({
    ...options,
    enabled: scrollRef !== undefined,
    getScrollElement: () => scrollRef?.current ?? null,
  });
  const virtualizer = scrollRef === undefined ? onWindow : inElement;
  const items = virtualizer.getVirtualItems();
  const [first] = items;
  const last = items.at(-1);
  return {
    items,
    // The height of the rows not rendered above and below the ones that are.
    padAfter:
      last === undefined
        ? 0
        : virtualizer.getTotalSize() - (last.end - scrollMargin),
    padBefore: first === undefined ? 0 : first.start - scrollMargin,
    virtualizer,
  };
}

/** Renders a TanStack Table you built with `useTable`, virtualizing its rows against the window or `scrollRef`. */
function DataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>({
  activeRowId,
  columnSx = noColumns,
  empty,
  error = "Couldn't load the data.",
  label,
  onRowClick,
  query,
  rowHeight = 41,
  scrollRef,
  size,
  sx,
  table,
}: DataTableProps<TFeatures, TData, TSelected>) {
  const body = useRef<HTMLTableSectionElement>(null);
  const { rows } = table.getRowModel();
  const { handlePointerDown, handlePointerOver } = useDragSelect(rows);
  const { items, padAfter, padBefore, virtualizer } = useRowVirtualizer({
    body,
    rowHeight,
    rows,
    scrollRef,
  });
  const { handleKeyDown, rowProps } = useRowKeys({
    activeRowId,
    body,
    enabled: onRowClick !== undefined || isSelectable(table),
    items,
    onRowClick,
    rows,
    scrollToIndex: (index) => {
      virtualizer.scrollToIndex(index);
    },
  });

  const columns = hasVisibility(table)
    ? table.getVisibleLeafColumns()
    : table.getAllLeafColumns();
  const pending = query?.isPending === true;
  // The old page stays on screen while the next loads (`placeholderData: keepPreviousData`).
  const stale = query?.isFetching === true && query.isPlaceholderData;

  return (
    <Table
      aria-busy={pending || stale}
      aria-label={label}
      aria-rowcount={rows.length + 1}
      data-selecting={isSelecting(table) ? "" : undefined}
      data-slot="data-table"
      size={size}
      sx={[styles.fixed, sx]}
    >
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                sx={[
                  styles.cell,
                  widthOf(header.column),
                  columnSx[header.column.id],
                ]}
              >
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        ref={body}
        sx={[styles.body, stale && styles.busy]}
      >
        {pending &&
          loadingRows.map((index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton sx={styles.skeleton} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {padBefore > 0 && (
          <tr aria-hidden {...stylex.props(styles.pad(padBefore))} />
        )}
        {items.map((item) => {
          const row = rows[item.index];
          if (row === undefined) {
            return null;
          }
          return (
            <TableRow
              aria-rowindex={item.index + 2}
              data-index={item.index}
              key={row.id}
              ref={virtualizer.measureElement}
              {...rowProps(item.index, row)}
              sx={onRowClick && styles.clickable}
            >
              {("getVisibleCells" in row
                ? row.getVisibleCells()
                : row.getAllCells()
              ).map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={[styles.cell, columnSx[cell.column.id]]}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          );
        })}
        {padAfter > 0 && (
          <tr aria-hidden {...stylex.props(styles.pad(padAfter))} />
        )}
        {rows.length === 0 && !pending && (
          <TableRow>
            <TableCell colSpan={columns.length} sx={styles.empty}>
              {query?.isError === true ? error : empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const sortIcons = {
  asc: ArrowUp01Icon,
  desc: ArrowDown01Icon,
  none: UnfoldMoreIcon,
};

/** A header that sorts its column (needs `rowSortingFeature`); plain text if it can't sort. */
function DataTableColumnHeader({
  column,
  title,
}: {
  column: SortableColumn;
  title: string;
}) {
  if (!column.getCanSort()) {
    return title;
  }
  const sorted = column.getIsSorted();
  return (
    <Button
      onClick={column.getToggleSortingHandler()}
      size="sm"
      sx={styles.sort}
      variant="ghost"
    >
      {title}
      <span {...stylex.props(styles.sortIcon)}>
        <HugeiconsIcon
          aria-hidden
          icon={sortIcons[sorted === false ? "none" : sorted]}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      </span>
    </Button>
  );
}

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

// What the pagination feature adds to a table.
interface PaginatedTable {
  getCanNextPage: () => boolean;
  getCanPreviousPage: () => boolean;
  getPageCount: () => number;
  getRowCount: () => number;
  nextPage: () => void;
  previousPage: () => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  state: { pagination: { pageIndex: number; pageSize: number } };
}

const defaultPageSizes = [10, 20, 50, 100];

function PageButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled: boolean;
  icon: typeof ArrowLeft01Icon;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      size="icon-sm"
      variant="outline"
    >
      <HugeiconsIcon
        aria-hidden
        icon={icon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </Button>
  );
}

/** Pages through the rows (needs `rowPaginationFeature`, and `paginatedRowModel` unless `manualPagination`): the range shown, rows per page, and first, previous, next and last. */
function DataTablePagination({
  pageSizes = defaultPageSizes,
  sx,
  table,
}: {
  /** The rows per page to offer. */
  pageSizes?: readonly number[];
  sx?: stylex.StyleXStyles;
  table: PaginatedTable;
}) {
  const rowsLabel = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const count = table.getRowCount();
  if (count === 0) {
    return null;
  }
  const first = pageIndex * pageSize + 1;
  const last = Math.min(first + pageSize - 1, count);
  return (
    <div
      data-slot="data-table-pagination"
      {...stylex.props(styles.pagination, sx)}
    >
      <div aria-live="polite" {...stylex.props(styles.range)}>
        {first}–{last} of {count}
      </div>
      <div {...stylex.props(styles.pageControls)}>
        <div {...stylex.props(styles.pageSize)}>
          <span id={rowsLabel}>Rows per page</span>
          <Select
            onValueChange={(value) => {
              if (value !== null) {
                table.setPageSize(value);
              }
            }}
            value={pageSize}
          >
            <SelectTrigger aria-labelledby={rowsLabel} size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div {...stylex.props(styles.pageButtons)}>
          <PageButton
            disabled={!table.getCanPreviousPage()}
            icon={ArrowLeftDoubleIcon}
            label="First page"
            onClick={() => {
              table.setPageIndex(0);
            }}
          />
          <PageButton
            disabled={!table.getCanPreviousPage()}
            icon={ArrowLeft01Icon}
            label="Previous page"
            onClick={() => {
              table.previousPage();
            }}
          />
          <PageButton
            disabled={!table.getCanNextPage()}
            icon={ArrowRight01Icon}
            label="Next page"
            onClick={() => {
              table.nextPage();
            }}
          />
          <PageButton
            disabled={!table.getCanNextPage()}
            icon={ArrowRightDoubleIcon}
            label="Last page"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// What the column visibility feature adds to a column and a table.
interface HidingColumn {
  accessorFn?: unknown;
  getCanHide: () => boolean;
  getIsVisible: () => boolean;
  id: string;
  toggleVisibility: (value?: boolean) => void;
}

interface HidingTable {
  getAllLeafColumns: () => HidingColumn[];
}

const noLabels = {};

/** A menu that shows and hides columns (needs `columnVisibilityFeature`); lists the columns with data that can hide. */
function DataTableViewOptions({
  labels = noLabels,
  table,
}: {
  /** Keyed by column id: the name to list it by; the id otherwise. */
  labels?: Readonly<Partial<Record<string, string>>>;
  table: HidingTable;
}) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.accessorFn !== undefined && column.getCanHide());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon
          aria-hidden
          icon={SlidersHorizontalIcon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onCheckedChange={(checked) => {
                column.toggleVisibility(checked);
              }}
            >
              {labels[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableViewOptions,
  DataTableSelectAll,
  DataTableSelectRow,
};
export type { DataTableProps };
