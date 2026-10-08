---
title: Data Table
description: A Table driven by TanStack Table, with sorting and row selection.
draft: true
---

<!-- ::demo name="data-table" -->

```tsx
const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const column = createColumnHelper<typeof features, Payment>();

const columns = column.columns([
  column.display({
    id: "select",
    header: ({ table }) => <DataTableSelectAll table={table} />,
    cell: ({ row }) => <DataTableSelectRow row={row} />,
    enableSorting: false,
  }),
  column.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
]);

const table = useTable({ columns, data, features });

<DataTable empty="No payments." label="Payments" table={table} />;
```

## Installation

<!-- ::install name="data-table" -->

## Usage

```tsx
import { DataTable } from "@/components/ui/data-table";
```

Build the table with [TanStack Table](https://tanstack.com/table)'s `useTable`, with the features you need, and pass it to `DataTable`. It renders the headers and rows as a [Table](/docs/components/table), and only the rows on screen, against the window's scroll.

The table's layout is fixed, as only the rows on screen render, so set narrow columns' widths with `columnSx`.

**Keep `features` and `columns` outside the component.** A new array each render rebuilds every row model.

## Composition

```
DataTable
├── DataTableColumnHeader
├── DataTableSelectAll
└── DataTableSelectRow
```

## Data Table Column Header

Use `DataTableColumnHeader` in a column's `header` to sort by it, ascending, descending, then off. Register `rowSortingFeature` and a `sortedRowModel`.

```tsx
header: ({ column }) => (
  <DataTableColumnHeader column={column} title="Amount" />
);
```

## Data Table Select All

Use `DataTableSelectAll` in a `select` column's header and `DataTableSelectRow` in its cells. Register `rowSelectionFeature`. A selected row takes the `fill` of a selected table row.

```tsx
column.display({
  id: "select",
  header: ({ table }) => <DataTableSelectAll table={table} />,
  cell: ({ row }) => <DataTableSelectRow row={row} />,
});
```

## Filtering

Add `globalFilteringFeature` for a search across columns and `columnFilteringFeature` for one column's filter, with a `filteredRowModel`, and pass both through `state`. When nothing is left, `empty` fills the table. Put a row's actions in a last display column, here a [Dropdown Menu](/docs/components/dropdown-menu).

<!-- ::demo name="data-table-filter" -->

```tsx
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { equalsString: filterFn_equalsString, includesString: filterFn_includesString },
});

const table = useTable({
  columns,
  data,
  features,
  globalFilterFn: "includesString",
  onRowSelectionChange: setRowSelection,
  state: { columnFilters, globalFilter, rowSelection },
});
```

## API Reference

| Part | Adds |
| --- | --- |
| `DataTable` | `table`, `label`, `empty`; `columnSx`, each column's width or alignment by id; `rowHeight`, a guess for the virtualizer; `size` |
| `DataTableColumnHeader` | `column`, `title` |
| `DataTableSelectAll` | `table` |
| `DataTableSelectRow` | `row` |
