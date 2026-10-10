import * as stylex from "@stylexjs/stylex";
import {
  createColumnHelper,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableSelectRow,
} from "@/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fontWeights, sizes } from "@/lib/tokens.stylex";
import { peopleFor, text } from "~/components/break/fixtures";
import type { Dataset } from "~/components/break/fixtures";

const styles = stylex.create({
  wide: { maxWidth: 560, width: "100%" },
  table: { maxWidth: "100%", minWidth: 480, width: 640 },
  invoice: { width: 100 },
  end: { fontVariantNumeric: "tabular-nums", textAlign: "end" },
  strong: { fontWeight: fontWeights.medium },
  select: { width: sizes.media },
  status: { width: 128 },
  amount: { fontVariantNumeric: "tabular-nums", textAlign: "end", width: 128 },
});

const money = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

interface Invoice {
  amount: number;
  invoice: string;
  method: string;
  status: string;
}

const demoInvoices: Invoice[] = [
  { amount: 250, invoice: "INV001", method: "Credit Card", status: "Paid" },
  { amount: 150, invoice: "INV002", method: "PayPal", status: "Pending" },
  { amount: 350, invoice: "INV003", method: "Bank Transfer", status: "Unpaid" },
];

const worstInvoices: Invoice[] = [
  {
    amount: 12_345_678.9,
    invoice: text.uuid,
    method: "Bank Transfer (SEPA Instant Credit Transfer)",
    status: "Partially refunded",
  },
  {
    amount: -42.5,
    invoice: "INV-2025-000000001284",
    method: text.german,
    status: text.status,
  },
  { amount: 0, invoice: "1", method: "", status: "Paid" },
  {
    amount: 0.1 + 0.2,
    invoice: "INV004",
    method: text.url,
    status: text.markup,
  },
];

function invoicesFor(data: Dataset) {
  return {
    demo: demoInvoices,
    empty: [],
    huge: Array.from({ length: 1284 }, (_, index) => ({
      amount: ((index * 137) % 9900) + 0.99,
      invoice: `INV${String(index + 1).padStart(6, "0")}`,
      method: index % 2 === 0 ? "Credit Card" : "Bank Transfer",
      status: index % 3 === 0 ? "Pending" : "Paid",
    })),
    one: demoInvoices.slice(0, 1),
    worst: worstInvoices,
  }[data];
}

function TableBreak({ data }: { data: Dataset }) {
  const rows = invoicesFor(data);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  return (
    <div {...stylex.props(styles.wide)}>
      <Table>
        <TableCaption>
          {data === "worst"
            ? text.description2000.slice(0, 240)
            : "A list of your recent invoices."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead sx={styles.invoice}>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{data === "worst" ? text.german : "Method"}</TableHead>
            <TableHead sx={styles.end}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.invoice}>
              <TableCell sx={styles.strong}>{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell sx={styles.end}>{money.format(row.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell sx={styles.end}>{money.format(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

interface Payment {
  amount: number;
  email: string;
  id: string;
  status: "failed" | "pending" | "processing" | "success";
}

const statuses = ["success", "processing", "failed", "pending"] as const;

const statusBadges = {
  failed: "danger",
  pending: undefined,
  processing: "info",
  success: "success",
} as const;

const worstAmounts = [
  12_345_678.9,
  -42.5,
  0,
  0.1 + 0.2,
  1,
  999_999_999.99,
  316,
];

function paymentsFor(data: Dataset): Payment[] {
  return peopleFor(data).map((person, index) => ({
    amount:
      data === "worst"
        ? (worstAmounts[index] ?? 1)
        : ((index * 137) % 990) + 10,
    email: person.email,
    id: `pay_${index + 1}`,
    status: statuses[index % statuses.length] ?? "pending",
  }));
}

const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const column = createColumnHelper<typeof features, Payment>();

const columns = column.columns([
  column.display({
    cell: ({ row }) => <DataTableSelectRow numbered row={row} />,
    enableSorting: false,
    header: ({ table }) => <DataTableSelectAll table={table} />,
    id: "select",
  }),
  column.accessor("status", {
    cell: ({ getValue }) => (
      <Badge status={statusBadges[getValue()]} variant="secondary">
        {getValue()}
      </Badge>
    ),
    enableSorting: false,
    header: "Status",
  }),
  column.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
  column.accessor("amount", {
    cell: ({ getValue }) => money.format(getValue()),
    header: ({ column: amount }) => (
      <DataTableColumnHeader column={amount} title="Amount" />
    ),
    sortFn: "basic",
  }),
]);

const getRowId = (row: Payment) => row.id;

function DataTableBreak({ data }: { data: Dataset }) {
  const payments = useMemo(() => paymentsFor(data), [data]);
  const table = useTable({ columns, data: payments, features, getRowId });
  return (
    <DataTable
      columnSx={{
        amount: styles.amount,
        select: styles.select,
        status: styles.status,
      }}
      empty="No payments."
      label="Payments"
      sx={styles.table}
      table={table}
    />
  );
}

export { DataTableBreak, TableBreak };
