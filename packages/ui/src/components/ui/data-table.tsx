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
import { useRef } from "react";
import type { MouseEvent, ReactNode, RefObject } from "react";

import { Button } from "@/components/ui/button";
import {
  isSelectable,
  isSelecting,
  useDragSelect,
} from "@/components/ui/data-table-selection";
import { Skeleton } from "@/components/ui/skeleton";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TableSize } from "@/components/ui/table";
import { useDataTableKeys } from "@/components/ui/use-data-table-keys";
import { useDataTableVirtualizer } from "@/components/ui/use-data-table-virtualizer";
import {
  colors,
  durations,
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
  /** The row open elsewhere, like in a Side Panel: marked current and filled a step above a selected one. */
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
  },
});

const noColumns = {};

const loadingRows = Array.from({ length: 5 }, (_, index) => index);

// Only a column that sets `size` gets a width; the rest share what's left.
const widthOf = (column: { id: string }) =>
  isSized(column) && column.columnDef.size !== undefined
    ? styles.width(column.getSize())
    : null;

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
  const { items, padAfter, padBefore, virtualizer } = useDataTableVirtualizer({
    body,
    rowHeight,
    rows,
    scrollRef,
  });
  const { handleKeyDown, rowProps } = useDataTableKeys({
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
    </Button>
  );
}

export { DataTable, DataTableColumnHeader };
export { DataTablePagination } from "@/components/ui/data-table-pagination";
export {
  DataTableSelectAll,
  DataTableSelectRow,
} from "@/components/ui/data-table-selection";
export { DataTableViewOptions } from "@/components/ui/data-table-view-options";
export type { DataTableProps };
