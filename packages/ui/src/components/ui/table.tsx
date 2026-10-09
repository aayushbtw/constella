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

const marked = ":is([data-state='selected'], [aria-current='true'])";
const open = "[aria-current='true']";
const checked = "[data-state='selected']";
const idle = ":not([data-state='selected'], [aria-current='true'])";
// As in the sidebar: an inset shadow, not a second fill, so hover stacks on a marked row's fill and still fades.
const lit = `inset 0 0 0 100vmax ${colors.fillSubtle}`;
const unlit = "inset 0 0 0 100vmax transparent";
const lastRow = ":is(tbody > :last-child > *, tfoot > :last-child > *)";
// A cell holding a checkbox hugs it, so the column stays as narrow as the box.
const checkbox = ":has([data-slot='checkbox'])";

const styles = stylex.create({
  container: {
    overflowX: "auto",
    position: "relative",
    width: "100%",
  },
  // Separate, so the cells draw the dividers: collapsed, Chrome hides them under a selected row's fill in a cell that clips.
  table: {
    borderCollapse: "separate",
    borderSpacing: 0,
    captionSide: "bottom",
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    width: "100%",
  },
  footer: {
    backgroundColor: colors.fillSubtle,
    fontWeight: fontWeights.medium,
  },
  // Rows are divided by the faint edge; the last row of a body or footer needs none.
  divider: {
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: { default: strokes.border, [lastRow]: 0 },
  },
  row: {
    backgroundColor: {
      default: "transparent",
      [media.hover]: {
        default: "transparent",
        [`:hover${idle}`]: colors.fillSubtle,
        [checked]: colors.fill,
        [open]: colors.fillStrong,
      },
      [`:has([aria-expanded='true'])${idle}`]: colors.fillSubtle,
      [`:active${idle}`]: colors.fillSubtle,
      [checked]: colors.fill,
      // One row at a time, so it can stand a step above the checked ones.
      [open]: colors.fillStrong,
    },
    boxShadow: {
      default: null,
      [marked]: {
        default: unlit,
        [media.hover]: { default: unlit, ":hover": lit },
        ":has([aria-expanded='true'])": lit,
      },
    },
    // A row selected from the keyboard fills at once.
    transitionDuration: { default: durations.hover, ":focus-visible": "0s" },
    transitionProperty: "background-color, box-shadow",
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
    // The footer's top edge; a row group can't draw a border in the separate model.
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: {
      default: 0,
      ":is(tfoot > :first-child > *)": strokes.border,
    },
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
      {...stylex.props(
        styles.divider,
        styles.head,
        size === "sm" && styles.headSm,
        sx
      )}
    />
  );
}

function TableCell({ sx, ...props }: Styled<ComponentProps<"td">>) {
  const size = use(TableSizeContext);
  return (
    <td
      data-slot="table-cell"
      {...props}
      {...stylex.props(
        styles.divider,
        styles.cell,
        size === "sm" && styles.cellSm,
        sx
      )}
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
