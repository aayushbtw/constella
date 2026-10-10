---
title: Table
description: A responsive table component.
---

<!-- ::demo name="table" -->

```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead sx={styles.end}>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((row) => (
      <TableRow key={row.invoice}>
        <TableCell>{row.invoice}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.method}</TableCell>
        <TableCell sx={styles.end}>{row.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Installation

<!-- ::install name="table" -->

## Usage

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Composition

```
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       └── TableHead
├── TableBody
│   └── TableRow
│       └── TableCell
└── TableFooter
    └── TableRow
        └── TableCell
```

## Size

Use the `size` prop on `Table` for denser rows, for data a reader scans rather than reads: logs, usage, runs.

<!-- ::demo name="table-size" -->

```tsx
<Table size="sm">…</Table>
```

| Size      | Header height | Cell padding |
| --------- | ------------- | ------------ |
| `sm`      | 32px          | 4px          |
| `default` | 40px          | 8px          |

## Footer

Use `TableFooter` for a totals row.

<!-- ::demo name="table-footer" -->

```tsx
<TableFooter>
  <TableRow>
    <TableCell colSpan={3}>Total</TableCell>
    <TableCell sx={styles.end}>$2,500.00</TableCell>
  </TableRow>
</TableFooter>
```

## Actions

Put a [Dropdown Menu](/docs/components/dropdown-menu) in the last cell for row actions.

<!-- ::demo name="table-actions" -->

```tsx
<TableCell sx={styles.end}>
  <DropdownMenu>
    <DropdownMenuTrigger
      render={<Button aria-label="Open menu" size="icon" variant="ghost" />}
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
```

## Selected Rows

Add `data-state="selected"` to a `TableRow` to mark it. See [Checkbox](/docs/components/checkbox) for a table with a checkbox per row.

## API Reference

Each part renders its HTML element (`Table` wraps the `<table>` in a scrolling container) and takes every prop of it, plus `sx`, applied last.
