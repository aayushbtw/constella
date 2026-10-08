"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactTable, RowData, TableFeatures } from "@tanstack/react-table";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TableSize } from "@/components/ui/table";
import { colors, sizes, space, strokes } from "@/lib/tokens.stylex";

interface DataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
> {
  /** Keyed by column id: a column's width or alignment, on its header and cells. */
  columnSx?: Readonly<Partial<Record<string, stylex.StyleXStyles>>>;
  /** Shown in one full-width row when no row is left. */
  empty: ReactNode;
  /** Names the table for screen readers. */
  label: string;
  /** A guess the virtualizer corrects by measuring each row it renders. */
  rowHeight?: number;
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
  getIsSelected: () => boolean;
  toggleSelected: (value?: boolean) => void;
}

interface SelectableTable {
  getIsAllRowsSelected: () => boolean;
  getIsSomeRowsSelected: () => boolean;
  toggleAllRowsSelected: (value?: boolean) => void;
}

const styles = stylex.create({
  // Fixed, as only the rows on screen render.
  fixed: {
    tableLayout: "fixed",
  },
  pad: (height: number) => ({ height }),
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
});

const noColumns = {};

// The server has no window, so it renders the rows that fit a typical one.
const serverRect = { height: 900, width: 1280 };

/** Renders a TanStack Table you built with `useTable`, virtualizing its rows against the window. */
function DataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
>({
  columnSx = noColumns,
  empty,
  label,
  rowHeight = 41,
  size,
  sx,
  table,
}: DataTableProps<TFeatures, TData, TSelected>) {
  const body = useRef<HTMLTableSectionElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  // The body's distance from the top of the document, which the window's scroll is
  // measured from; measured again whenever the page above it changes height.
  useLayoutEffect(() => {
    const measure = () => {
      const top = body.current?.getBoundingClientRect().top ?? 0;
      setScrollMargin(top + window.scrollY);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);

  const { rows } = table.getRowModel();
  // oxlint-disable-next-line react/incompatible-library -- the virtualizer re-renders on scroll by design
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    getItemKey: (index) => rows[index]?.id ?? index,
    initialRect: serverRect,
    overscan: 8,
    scrollMargin,
  });
  const items = virtualizer.getVirtualItems();
  const [first] = items;
  const last = items.at(-1);
  const padBefore = first === undefined ? 0 : first.start - scrollMargin;
  const padAfter =
    last === undefined
      ? 0
      : virtualizer.getTotalSize() - (last.end - scrollMargin);

  return (
    <Table
      aria-label={label}
      aria-rowcount={rows.length + 1}
      data-slot="data-table"
      size={size}
      sx={[styles.fixed, sx]}
    >
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id} sx={columnSx[header.column.id]}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody ref={body}>
        {padBefore > 0 && (
          <tr aria-hidden {...stylex.props(styles.pad(padBefore))} />
        )}
        {items.map((item) => {
          const row = rows[item.index];
          if (row === undefined) {
            return null;
          }
          const selectable = "getIsSelected" in row;
          const selected = selectable && row.getIsSelected();
          return (
            <TableRow
              aria-rowindex={item.index + 2}
              aria-selected={selectable ? selected : undefined}
              data-index={item.index}
              data-state={selected ? "selected" : undefined}
              key={row.id}
              ref={virtualizer.measureElement}
            >
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id} sx={columnSx[cell.column.id]}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          );
        })}
        {padAfter > 0 && (
          <tr aria-hidden {...stylex.props(styles.pad(padAfter))} />
        )}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={table.getAllLeafColumns().length}
              sx={styles.empty}
            >
              {empty}
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

/** A row's checkbox (needs `rowSelectionFeature`). */
function DataTableSelectRow({ row }: { row: SelectableRow }) {
  return (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked) => {
        row.toggleSelected(checked);
      }}
    />
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableSelectRow,
};
export type { DataTableProps };
