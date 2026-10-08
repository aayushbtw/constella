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

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableSelectRow,
} from "@/components/ui/data-table";
import { sizes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  table: { maxWidth: "100%", width: 640 },
  select: { width: sizes.media },
  status: { width: 128 },
  amount: { fontVariantNumeric: "tabular-nums", textAlign: "end", width: 128 },
});

interface Payment {
  amount: number;
  email: string;
  id: string;
  status: "failed" | "pending" | "processing" | "success";
}

const payments: Payment[] = [
  {
    amount: 316,
    email: "ken99@example.com",
    id: "m5gr84i9",
    status: "success",
  },
  {
    amount: 242,
    email: "abe45@example.com",
    id: "3u1reuv4",
    status: "success",
  },
  {
    amount: 837,
    email: "monserrat44@example.com",
    id: "derv1ws0",
    status: "processing",
  },
  {
    amount: 874,
    email: "silas22@example.com",
    id: "5kma53ae",
    status: "success",
  },
  {
    amount: 721,
    email: "carmella@example.com",
    id: "bhqecj4p",
    status: "failed",
  },
  { amount: 129, email: "dee@example.com", id: "p0q8x2nz", status: "pending" },
];

const statusBadges = {
  failed: "danger",
  pending: undefined,
  processing: "info",
  success: "success",
} as const;

const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const column = createColumnHelper<typeof features, Payment>();

const money = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const columns = column.columns([
  column.display({
    cell: ({ row }) => <DataTableSelectRow row={row} />,
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

function DataTableDemo() {
  const table = useTable({ columns, data: payments, features, getRowId });
  return (
    <DemoRow sx={styles.stage}>
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
    </DemoRow>
  );
}

export { DataTableDemo };
