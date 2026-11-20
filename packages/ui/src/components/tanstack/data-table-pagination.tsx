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
import { useEffect, useRef } from "react";

import { Button } from "@/components/primitives/button";
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
        data-rtl-flip
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
  sx?: Sx;
  table: PaginatedTable;
}) {
  const { pageIndex, pageSize } = table.state.pagination;
  const count = table.getRowCount();
  const first = pageIndex * pageSize + 1;
  const last = Math.min(first + pageSize - 1, count);
  const range = count === 0 ? "" : `${first}–${last} of ${count}`;
  const announced = useRef(range);
  useEffect(() => {
    const previous = announced.current;
    announced.current = range;
    // The first range arrives with the data, not from the user.
    if (previous && range && range !== previous) {
      announce(range);
    }
  }, [range]);
  if (count === 0) {
    return null;
  }
  return (
    <div
      data-slot="data-table-pagination"
      {...stylex.props(styles.pagination, sx)}
    >
      <div {...stylex.props([typeStyles.textSm, styles.range])}>{range}</div>
      <div {...stylex.props(styles.pageControls)}>
        <div {...stylex.props([typeStyles.textSm, styles.pageSize])}>
          <Select
            itemToValue={String}
            items={pageSizes.map((option) => ({
              label: String(option),
              value: option,
            }))}
            onValueChange={(value) => {
              if (value !== null) {
                table.setPageSize(value);
              }
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
