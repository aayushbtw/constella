---
title: Data Table
description: A Table driven by TanStack Table, with sorting, selection, pagination, column visibility and TanStack Query states.
draft: true
section: TanStack
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

When the table sits in an element that scrolls on its own, like an app's main area beside a sidebar, pass that element as `scrollRef`, as the Row Click example does with a ScrollArea's `viewportRef`.

The table's layout is fixed, as only the rows on screen render, so set narrow columns' widths with `columnSx`. Text too long for its column ends in an ellipsis. Give the table a `minWidth` in `sx`. On a narrow screen it then scrolls sideways, and a column without a width keeps its room.

**Keep `features` and `columns` outside the component.** A new array each render rebuilds every row model.

## Composition

```
DataTable
├── DataTableColumnHeader
├── DataTableSelectAll
├── DataTableSelectRow
├── DataTablePagination
└── DataTableViewOptions
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

Add `globalFilteringFeature` for a search across columns and `columnFilteringFeature` for one column's filter, with a `filteredRowModel`, and pass both through `state`. When nothing is left, `empty` fills the table. Put a row's actions in a last display column, here a [Dropdown Menu](/docs/components/dropdown-menu). Add `columnVisibilityFeature` and `DataTableViewOptions` to let people hide columns; it lists those with data, named by `labels`.

<!-- ::demo name="data-table-filter" -->

```tsx
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
  },
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

## Row Click

`onRowClick` gets a click anywhere on a row except its controls, so a checkbox or menu in the row keeps its own click. Open the row from there, here in a [Side Panel](/docs/components/side-panel), and pass its id as `activeRowId` to mark it. Enter on a focused row opens it the same way.

With Cmd, Ctrl or Shift, a click on a row selects it instead, Shift through to the last one. Dragging from a row's checkbox across others gives them all its new state; dragging back puts them back.

<!-- ::demo name="data-table-row-click" -->

```tsx
<DataTable
  activeRowId={openId}
  onRowClick={(row) => {
    setOpenId(row.id);
  }}
  table={table}
  {...props}
/>
```

## Keyboard

When rows can be selected or clicked, one row takes Tab and the arrow keys move between them.

| Key       | Does                                           |
| --------- | ---------------------------------------------- |
| ↑ ↓       | The previous or next row                       |
| Home, End | The first or last row                          |
| X, Space  | Selects the row, or clears it                  |
| Shift ↑ ↓ | Extends the selection; back over it shrinks it |
| Enter     | Opens the row through `onRowClick`             |

## Query

Pass the `useQuery` result as `query`. While it's pending the body holds skeleton rows. With `placeholderData: keepPreviousData`, the old rows stay on screen and fade while the next ones load. If it fails with no row left, `error` takes the place of `empty`. The same table runs client-side, as here, or server-side with `manualSorting`, `manualPagination` and `rowCount`, with the state in the `queryKey`.

<!-- ::demo name="data-table-query" -->

```tsx
const query = useQuery({
  placeholderData: keepPreviousData,
  queryFn: async () => await fetchPayments(search),
  queryKey: ["payments", search],
});

const table = useTable({ columns, data: query.data ?? noPayments, features });

<DataTable
  empty="No payments match."
  label="Payments"
  query={query}
  table={table}
/>;
```

## Pagination

Put `DataTablePagination` under the table and register `rowPaginationFeature`. On the client, add `paginatedRowModel: createPaginatedRowModel()` and it pages the rows itself. On a server, as here, set `manualPagination` and `manualSorting`, pass the total as `rowCount`, and put the pagination and sorting state in the `queryKey`.

<!-- ::demo name="data-table-pagination" -->

```tsx
const query = useQuery({
  placeholderData: keepPreviousData,
  queryFn: async () => await fetchPage(pagination, sorting),
  queryKey: ["payments", pagination, sorting],
});

const table = useTable({
  columns,
  data: query.data?.rows ?? noPayments,
  features: tableFeatures({ rowPaginationFeature, rowSortingFeature }),
  manualPagination: true,
  manualSorting: true,
  onPaginationChange: setPagination,
  onSortingChange: setSorting,
  rowCount: query.data?.total ?? 0,
  state: { pagination, sorting },
});

<DataTable label="Payments" query={query} table={table} {...props} />
<DataTablePagination table={table} />;
```

## API Reference

| Part | Adds |
| --- | --- |
| `DataTable` | `table`, `label`, `empty`; `onRowClick`; `activeRowId`, the open row; `query`, a `useQuery` result; `error`, shown when it fails; `columnSx`, each column's width or alignment by id; `rowHeight`, a guess for the virtualizer; `scrollRef`, the element it scrolls in when not the window; `size` |
| `DataTableColumnHeader` | `column`, `title` |
| `DataTablePagination` | `table`; `pageSizes`, the rows per page to offer, 10, 20, 50 and 100 by default |
| `DataTableSelectAll` | `table` |
| `DataTableViewOptions` | `table`; `labels`, each column's name by id |
| `DataTableSelectRow` | `row`; `numbered`, the row's number until it's pointed at or any row is selected |
