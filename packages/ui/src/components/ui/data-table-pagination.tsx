"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colors, fontSizes, sizes, space, strokes } from "@/lib/tokens.stylex";

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

const styles = stylex.create({
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
});

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

export { DataTablePagination };
