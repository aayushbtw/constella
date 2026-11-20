"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
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
import { createParts, usePart, usePrimitive } from "@ui-sdk/react/primitive";
import { Fragment, useMemo, useRef, useSyncExternalStore } from "react";
import type { MouseEvent, ReactNode, RefObject } from "react";

import { Button } from "@/components/primitives/button";
import { Skeleton } from "@/components/primitives/skeleton";
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import type { TableSize } from "@/components/primitives/table";
import {
  DataTableContext,
  dataTable,
} from "@/components/tanstack/data-table-rows";
import {
  hasSelection,
  isSelectable,
  isSelecting,
  useDragSelect,
} from "@/components/tanstack/data-table-selection";
import { useDataTableVirtualizer } from "@/components/tanstack/use-data-table-virtualizer";
import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  lineHeights,
  opacities,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type DataTableQuery = Pick<
  UseQueryResult,
  "isError" | "isFetching" | "isPending" | "isPlaceholderData"
>;

interface DataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
> {
  /** The row open elsewhere, like in a Side Panel: marked current and filled a step above a selected one. */
  activeRowId?: string;
  /** Keyed by column id: a column's width, on its header and cells. A column aligns to its end, like figures, with `meta: { align: "end" }`, and loads as a checkbox with `meta: { skeleton: "checkbox" }`. */
  columnSx?: Readonly<Partial<Record<string, Sx>>>;
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
  sx?: Sx;
  table: ReactTable<TFeatures, TData, TSelected>;
}

// What the sorting feature adds to a column; typed by shape, so any feature set fits.
interface SortableColumn {
  getCanSort: () => boolean;
  getIsSorted: () => false | "asc" | "desc";
  getToggleSortingHandler: () =>
    | undefined
    | ((event: MouseEvent<HTMLElement>) => void);
}

// A column's `meta`, read by shape, as TanStack leaves its type to the table.
interface MetaColumn {
  columnDef: { meta?: object };
}

const alignsEnd = ({ columnDef: { meta } }: MetaColumn) =>
  meta !== undefined && "align" in meta && meta.align === "end";

const loadsAsCheckbox = ({ columnDef: { meta } }: MetaColumn) =>
  meta !== undefined && "skeleton" in meta && meta.skeleton === "checkbox";

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

const styles = stylex.create({
  // Fixed, as only the rows on screen render.
  fixed: {
    tableLayout: "fixed",
  },
  // Never the browser's scroll anchor: as the virtualizer grows the one above, holding this in view would scroll on and on.
  pad: (height: number) => ({ height, overflowAnchor: "none" }),
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
  // Inline, so a column's alignment places it; its margins fill the text's line, so a loading row is as tall as a loaded one.
  skeleton: {
    display: "inline-block",
    height: sizes.iconSm,
    marginBlock: `calc((${lineHeights.textSm} - ${sizes.iconSm}) / 2)`,
    verticalAlign: "top",
    width: "60%",
  },
  skeletonCheckbox: {
    height: sizes.icon,
    marginBlock: `calc((${lineHeights.textSm} - ${sizes.icon}) / 2)`,
    width: sizes.icon,
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
  // Lines its label up with the cells under it, despite the button's padding and border.
  sort: {
    marginInlineStart: `calc(-1 * (${space.popup} + ${strokes.border}))`,
  },
  sortEnd: {
    marginInlineEnd: `calc(-1 * (${space.popup} + ${strokes.border}))`,
  },
  sortIcon: {
    color: colors.textMuted,
  },
  end: {
    textAlign: "end",
  },
});

const { Row: DataTableRow } = createParts(dataTable, { row: "tr" });

const noColumns = {};

const noSelection: Readonly<Record<string, boolean>> = {};

const noFocus = () => null;

const loadingRows = Array.from({ length: 5 }, (_, index) => index);

// Only a column that sets `size` gets a width; the rest share what's left.
const widthOf = (column: { id: string }) =>
  isSized(column) && column.columnDef.size !== undefined
    ? styles.width(column.getSize())
    : null;

function useRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>(
  table: ReactTable<TFeatures, TData, TSelected>,
  onRowClick: ((row: Row<TFeatures, TData>) => void) | undefined
) {
  const { rows } = table.getRowModel();
  const ids = useMemo(() => rows.map((row) => row.id), [rows]);
  const indexOf = useMemo(
    () => new Map(rows.map((row, index) => [row.id, index])),
    [rows]
  );
  const rowOf = (id: string) => rows[indexOf.get(id) ?? -1];
  const selectable = isSelectable(table) ? table : undefined;
  const rowSelection = selectable?.atoms.rowSelection?.get() ?? noSelection;
  const handle = usePrimitive(dataTable, {
    ids,
    multiple: (id) => {
      const row = rowOf(id);
      return hasSelection(row) && row.getCanMultiSelect();
    },
    onRowOpen:
      onRowClick &&
      ((id) => {
        const row = rowOf(id);
        if (row !== undefined) {
          onRowClick(row);
        }
      }),
    onSelectedChange: (selected) => {
      selectable?.setRowSelection(
        Object.fromEntries(selected.map((id) => [id, true] as const))
      );
    },
    selectable:
      selectable &&
      ((id) => {
        const row = rowOf(id);
        return hasSelection(row) && row.getCanSelect();
      }),
    selected: Object.keys(rowSelection).filter((id) => rowSelection[id]),
  });
  // A key that moves to an unrendered row waits one task for it, so this re-renders on the move.
  const focused = useSyncExternalStore(
    handle.instance.subscribe,
    () => handle.instance.get().focused,
    noFocus
  );
  return {
    handle,
    indexOf,
    keep: focused === null ? undefined : indexOf.get(focused),
    rows,
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
  const { handle, indexOf, keep, rows } = useRows(table, onRowClick);
  const { handlePointerDown, handlePointerOver } = useDragSelect(
    rows,
    handle.api.selection.setAnchor
  );
  const { items, padAfter, spaceBefore, virtualizer } = useDataTableVirtualizer(
    {
      body,
      keep,
      rowHeight,
      rows,
      scrollRef,
    }
  );
  // Bubbles from the row after its own keydown has moved the focus.
  const scrollToFocusedRow = () => {
    const moved = handle.instance.get().focused;
    const index = moved === null ? undefined : indexOf.get(moved);
    if (index !== undefined && index !== keep) {
      virtualizer.scrollToIndex(index);
    }
  };

  const columns = hasVisibility(table)
    ? table.getVisibleLeafColumns()
    : table.getAllLeafColumns();
  const pending = query?.isPending === true;
  // The old page stays on screen while the next loads (`placeholderData: keepPreviousData`).
  const stale = query?.isFetching === true && query.isPlaceholderData;

  const content = (
    <>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                sx={[
                  styles.cell,
                  widthOf(header.column),
                  alignsEnd(header.column) && styles.end,
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
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        ref={body}
        sx={[styles.body, stale && styles.busy]}
      >
        {pending &&
          loadingRows.map((index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={[alignsEnd(column) && styles.end, columnSx[column.id]]}
                >
                  <Skeleton
                    sx={[
                      styles.skeleton,
                      loadsAsCheckbox(column) && styles.skeletonCheckbox,
                    ]}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {items.map((item, at) => {
          const row = rows[item.index];
          const gap = spaceBefore[at] ?? 0;
          if (row === undefined) {
            return null;
          }
          return (
            <Fragment key={row.id}>
              {gap > 0 && <tr aria-hidden {...stylex.props(styles.pad(gap))} />}
              <DataTableRow
                aria-current={row.id === activeRowId ? "true" : undefined}
                aria-rowindex={item.index + 2}
                data-index={item.index}
                index={item.index}
                ref={virtualizer.measureElement}
                render={<TableRow sx={onRowClick && styles.clickable} />}
                value={row.id}
              >
                {("getVisibleCells" in row
                  ? row.getVisibleCells()
                  : row.getAllCells()
                ).map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={[
                      styles.cell,
                      alignsEnd(cell.column) && styles.end,
                      columnSx[cell.column.id],
                    ]}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </DataTableRow>
            </Fragment>
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
    </>
  );

  const grid = usePart(
    handle,
    "root",
    {},
    {
      "aria-busy": pending || stale,
      "aria-label": label,
      "aria-rowcount": rows.length + 1,
      children: content,
      onKeyDown: scrollToFocusedRow,
      render: (
        <Table
          data-selecting={isSelecting(table) ? "" : undefined}
          size={size}
          sx={[styles.fixed, sx]}
        />
      ),
    },
    "table"
  );

  return <DataTableContext value={handle.api}>{grid}</DataTableContext>;
}

const sortIcons = {
  asc: ArrowUp01Icon,
  desc: ArrowDown01Icon,
  none: UnfoldMoreIcon,
};

/** A header that sorts its column (needs `rowSortingFeature`); plain text if it can't sort. In a column aligned to its end, the icon leads, so the label ends over the cells. */
function DataTableColumnHeader({
  column,
  sx,
  title,
}: {
  column: MetaColumn & SortableColumn;
  sx?: Sx;
  title: string;
}) {
  if (!column.getCanSort()) {
    return (
      <span data-slot="data-table-column-header" {...stylex.props(sx)}>
        {title}
      </span>
    );
  }
  const sorted = column.getIsSorted();
  const end = alignsEnd(column);
  const sortIcon = (
    <SwapIcon
      aria-hidden
      sx={styles.sortIcon}
      value={sorted === false ? "none" : sorted}
    >
      {Object.entries(sortIcons).map(([value, icon]) => (
        <SwapIconItem key={value} value={value}>
          <HugeiconsIcon
            icon={icon}
            size={sizes.iconSm}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
      ))}
    </SwapIcon>
  );
  return (
    <Button
      data-slot="data-table-column-header"
      onClick={column.getToggleSortingHandler()}
      size="sm"
      sx={[end ? styles.sortEnd : styles.sort, sx]}
      variant="ghost"
    >
      {end && sortIcon}
      {title}
      {!end && sortIcon}
    </Button>
  );
}

export { DataTable, DataTableColumnHeader };
export { DataTableActionBar } from "@/components/tanstack/data-table-action-bar";
export { DataTablePagination } from "@/components/tanstack/data-table-pagination";
export {
  DataTableSelectAll,
  DataTableSelectRow,
} from "@/components/tanstack/data-table-selection";
export { DataTableViewOptions } from "@/components/tanstack/data-table-view-options";
export type { DataTableProps };
