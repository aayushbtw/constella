"use client";

import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  fontSizes,
  fontWeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const tableSizes = ["sm", "default"] as const;

type TableSize = (typeof tableSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type TableProps = Styled<ComponentProps<"table">> & { size?: TableSize };

const selected = ":is([data-state='selected'])";
// A cell holding a checkbox hugs it, so the column stays as narrow as the box.
const checkbox = ":has([data-slot='checkbox'])";

const styles = stylex.create({
  container: {
    overflowX: "auto",
    position: "relative",
    width: "100%",
  },
  table: {
    borderCollapse: "collapse",
    captionSide: "bottom",
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    width: "100%",
  },
  footer: {
    backgroundColor: colors.fillSubtle,
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    fontWeight: fontWeights.medium,
  },
  // Rows are divided by the faint edge; the last row of a body or footer needs none.
  row: {
    backgroundColor: {
      default: "transparent",
      ":has([aria-expanded='true'])": colors.fillSubtle,
      [selected]: colors.fill,
      [media.hover]: {
        default: "transparent",
        ":hover": colors.fillSubtle,
        [selected]: colors.fill,
      },
      ":active": colors.fillSubtle,
    },
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: {
      default: strokes.border,
      ":is(tbody > :last-child, tfoot > :last-child)": 0,
    },
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
  },
  head: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
    height: `calc(${sizes.controlLg} + ${space.xxs})`,
    paddingBlock: 0,
    paddingInlineEnd: { default: space.xs, [checkbox]: 0 },
    paddingInlineStart: space.xs,
    textAlign: "start",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  cell: {
    paddingBlock: space.xs,
    paddingInlineEnd: { default: space.xs, [checkbox]: 0 },
    paddingInlineStart: space.xs,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  // Dense rows for data a reader scans, like logs and usage.
  headSm: {
    height: sizes.controlMd,
  },
  cellSm: {
    paddingBlock: space.xxs,
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginBlockStart: space.md,
  },
});

const TableSizeContext = createContext<TableSize>("default");

function Table({ size = "default", sx, ...props }: TableProps) {
  return (
    <TableSizeContext value={size}>
      <div data-slot="table-container" {...stylex.props(styles.container)}>
        <table
          data-size={size}
          data-slot="table"
          {...props}
          {...stylex.props(styles.table, sx)}
        />
      </div>
    </TableSizeContext>
  );
}

function TableHeader({ sx, ...props }: Styled<ComponentProps<"thead">>) {
  return <thead data-slot="table-header" {...props} {...stylex.props(sx)} />;
}

function TableBody({ sx, ...props }: Styled<ComponentProps<"tbody">>) {
  return <tbody data-slot="table-body" {...props} {...stylex.props(sx)} />;
}

function TableFooter({ sx, ...props }: Styled<ComponentProps<"tfoot">>) {
  return (
    <tfoot
      data-slot="table-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

function TableRow({ sx, ...props }: Styled<ComponentProps<"tr">>) {
  return (
    <tr data-slot="table-row" {...props} {...stylex.props(styles.row, sx)} />
  );
}

function TableHead({ sx, ...props }: Styled<ComponentProps<"th">>) {
  const size = use(TableSizeContext);
  return (
    <th
      data-slot="table-head"
      {...props}
      {...stylex.props(styles.head, size === "sm" && styles.headSm, sx)}
    />
  );
}

function TableCell({ sx, ...props }: Styled<ComponentProps<"td">>) {
  const size = use(TableSizeContext);
  return (
    <td
      data-slot="table-cell"
      {...props}
      {...stylex.props(styles.cell, size === "sm" && styles.cellSm, sx)}
    />
  );
}

function TableCaption({ sx, ...props }: Styled<ComponentProps<"caption">>) {
  return (
    <caption
      data-slot="table-caption"
      {...props}
      {...stylex.props(styles.caption, sx)}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  tableSizes,
};
export type { TableProps, TableSize };
