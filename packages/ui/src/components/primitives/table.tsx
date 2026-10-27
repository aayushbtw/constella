"use client";

import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import { scrollFade } from "@/lib/constella/scroll-fade";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import { tableVars } from "@/lib/constella/table.stylex";
import {
  colors,
  durations,
  fontWeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const tableSizes = ["sm", "default"] as const;

type TableSize = (typeof tableSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type TableProps = Styled<ComponentProps<"table">> & {
  interactive?: boolean;
  size?: TableSize;
};

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
    scrollbarWidth: "none",
    width: "100%",
  },
  // Separate, so the cells draw the dividers: collapsed, Chrome hides them under a selected row's fill in a cell that clips.
  table: {
    borderCollapse: "separate",
    borderSpacing: 0,
    captionSide: "bottom",
    color: colors.textPrimary,
    fontVariantNumeric: "tabular-nums",
    width: "100%",
  },
  footer: {
    backgroundColor: colors.fillSubtle,
    fontWeight: fontWeights.medium,
  },
  // Rows are divided by the faint edge; the last row of a body or footer needs none.
  divider: {
    borderBlockEndColor: colors.borderSubtle,
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
  // Reference tables a reader only reads: rows keep their marked fills but don't answer the pointer.
  rowStatic: {
    backgroundColor: {
      default: "transparent",
      [checked]: colors.fill,
      [open]: colors.fillStrong,
    },
    boxShadow: null,
  },
  head: {
    color: colors.textSecondary,
    fontWeight: fontWeights.regular,
    height: `calc(${sizes.controlLg} + ${space.xxs})`,
    paddingBlock: 0,
    paddingInlineEnd: {
      default: space.sm,
      [checkbox]: 0,
      ":last-child": tableVars.inset,
    },
    paddingInlineStart: { default: space.sm, ":first-child": tableVars.inset },
    textAlign: "start",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  cell: {
    // The footer's top edge; a row group can't draw a border in the separate model.
    borderBlockStartColor: colors.borderSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: {
      default: 0,
      ":is(tfoot > :first-child > *)": strokes.border,
    },
    paddingBlock: space.xs,
    paddingInlineEnd: {
      default: space.sm,
      [checkbox]: 0,
      ":last-child": tableVars.inset,
    },
    paddingInlineStart: { default: space.sm, ":first-child": tableVars.inset },
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
    marginBlockStart: space.md,
  },
});

const TableSizeContext = createContext<TableSize>("default");
const TableInteractiveContext = createContext(true);

function Table({
  interactive = true,
  size = "default",
  sx,
  ...props
}: TableProps) {
  return (
    <TableInteractiveContext value={interactive}>
      <TableSizeContext value={size}>
        <div
          data-slot="table-container"
          {...stylex.props(styles.container, scrollFade.x)}
        >
          <table
            data-size={size}
            data-slot="table"
            {...props}
            {...stylex.props([typeStyles.textMd, styles.table], sx)}
          />
        </div>
      </TableSizeContext>
    </TableInteractiveContext>
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
  const interactive = use(TableInteractiveContext);
  return (
    <tr
      data-slot="table-row"
      {...props}
      {...stylex.props(styles.row, !interactive && styles.rowStatic, sx)}
    />
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
      {...stylex.props([typeStyles.textSm, styles.caption], sx)}
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
