"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { announce } from "@ui-sdk/core";

import {
  Pagination,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/primitives/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import { colors, sizes, space, strokes } from "@/lib/constella/tokens.stylex";

// What the pagination feature adds to a table.
interface PaginatedTable {
  getPageCount: () => number;
  getRowCount: () => number;
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
    gap: space.xs,
  },
  steps: {
    marginInline: 0,
    width: "auto",
  },
});

function rangeOf({
  count,
  pageIndex,
  pageSize,
}: {
  count: number;
  pageIndex: number;
  pageSize: number;
}) {
  const first = pageIndex * pageSize + 1;
  const last = Math.min(first + pageSize - 1, count);
  return `${first}–${last} of ${count}`;
}

function StepIcon({ icon }: { icon: typeof ArrowLeft01Icon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      data-rtl-flip
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

/** Pages through the rows (needs `rowPaginationFeature`, and `paginatedRowModel` unless `manualPagination`): the range shown, rows per page, and first, previous, next and last. */
function DataTablePagination({
  label = "Pagination",
  pageSizes = defaultPageSizes,
  sx,
  table,
}: {
  /** Names the navigation that holds first, previous, next and last. */
  label?: string;
  /** The rows per page to offer. */
  pageSizes?: readonly number[];
  sx?: Sx;
  table: PaginatedTable;
}) {
  const { pageIndex, pageSize } = table.state.pagination;
  const count = table.getRowCount();
  if (count === 0) {
    return null;
  }
  return (
    <div
      data-slot="data-table-pagination"
      {...stylex.props(styles.pagination, sx)}
    >
      <div {...stylex.props([typeStyles.textSm, styles.range])}>
        {rangeOf({ count, pageIndex, pageSize })}
      </div>
      <div {...stylex.props(styles.pageControls)}>
        <div {...stylex.props([typeStyles.textSm, styles.pageSize])}>
          <Select
            itemToValue={String}
            items={pageSizes.map((option) => ({
              label: String(option),
              value: option,
            }))}
            onValueChange={(value) => {
              if (value === null) {
                return;
              }
              table.setPageSize(value);
              announce(
                rangeOf({
                  count,
                  pageIndex: Math.floor((pageIndex * pageSize) / value),
                  pageSize: value,
                })
              );
            }}
            value={pageSize}
          >
            <SelectLabel>Rows per page</SelectLabel>
            <SelectTrigger size="sm">
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
        <Pagination
          aria-label={label}
          onPageChange={(page) => {
            table.setPageIndex(page - 1);
            announce(rangeOf({ count, pageIndex: page - 1, pageSize }));
          }}
          page={pageIndex + 1}
          pageCount={table.getPageCount()}
          sx={styles.steps}
        >
          <PaginationList>
            <PaginationItem>
              <PaginationFirst
                aria-label="First page"
                size="icon-sm"
                variant="outline"
              >
                <StepIcon icon={ArrowLeftDoubleIcon} />
              </PaginationFirst>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                aria-label="Previous page"
                size="icon-sm"
                variant="outline"
              >
                <StepIcon icon={ArrowLeft01Icon} />
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                aria-label="Next page"
                size="icon-sm"
                variant="outline"
              >
                <StepIcon icon={ArrowRight01Icon} />
              </PaginationNext>
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                aria-label="Last page"
                size="icon-sm"
                variant="outline"
              >
                <StepIcon icon={ArrowRightDoubleIcon} />
              </PaginationLast>
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </div>
    </div>
  );
}

export { DataTablePagination };
