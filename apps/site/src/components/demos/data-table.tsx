import {
  Copy01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  Search01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDeferredValue, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableSelectRow,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { colors, fontSizes, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  table: { maxWidth: "100%", width: 640 },
  select: { width: sizes.media },
  actions: { textAlign: "end", width: sizes.media },
  page: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: "100%",
    width: 640,
  },
  toolbar: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "space-between",
  },
  search: { maxWidth: "100%", width: 256 },
  count: { color: colors.textSecondary, fontSize: fontSizes.sm },
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

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

const names = [
  "ken",
  "abe",
  "monserrat",
  "silas",
  "carmella",
  "dee",
  "ana",
  "ben",
  "cy",
  "jo",
];
const statuses = ["success", "processing", "failed", "pending"] as const;

const ledger: Payment[] = Array.from({ length: 36 }, (_, index) => ({
  amount: (((index + 7) * 137) % 990) + 10,
  email: `${names[index % names.length]}${index + 1}@example.com`,
  id: `pay_${String(index + 1).padStart(3, "0")}`,
  status: statuses[(index * 7) % statuses.length] ?? "pending",
}));

const fullFeatures = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
  },
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const full = createColumnHelper<typeof fullFeatures, Payment>();

function RowActions({ payment }: { payment: Payment }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button aria-label="Actions" size="icon-sm" variant="ghost" />}
      >
        <Glyph icon={MoreHorizontalIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            void navigator.clipboard.writeText(payment.id);
          }}
        >
          <Glyph icon={Copy01Icon} />
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Glyph icon={ViewIcon} />
          View customer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <Glyph icon={Delete02Icon} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const fullColumns = full.columns([
  full.display({
    cell: ({ row }) => <DataTableSelectRow row={row} />,
    enableGlobalFilter: false,
    enableSorting: false,
    header: ({ table }) => <DataTableSelectAll table={table} />,
    id: "select",
  }),
  full.accessor("status", {
    cell: ({ getValue }) => (
      <Badge status={statusBadges[getValue()]} variant="secondary">
        {getValue()}
      </Badge>
    ),
    enableGlobalFilter: false,
    enableSorting: false,
    filterFn: "equalsString",
    header: "Status",
  }),
  full.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
  full.accessor("amount", {
    cell: ({ getValue }) => money.format(getValue()),
    enableGlobalFilter: false,
    header: ({ column: amount }) => (
      <DataTableColumnHeader column={amount} title="Amount" />
    ),
    sortFn: "basic",
  }),
  full.display({
    cell: ({ row }) => <RowActions payment={row.original} />,
    enableGlobalFilter: false,
    enableSorting: false,
    header: () => null,
    id: "actions",
  }),
]);

function DataTableFilterDemo() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const globalFilter = useDeferredValue(search);
  const columnFilters = useMemo(
    () => (status === "all" ? [] : [{ id: "status", value: status }]),
    [status]
  );
  const table = useTable({
    columns: fullColumns,
    data: ledger,
    features: fullFeatures,
    getRowId,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    state: { columnFilters, globalFilter, rowSelection },
  });
  const selected = Object.keys(rowSelection).length;
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.page)}>
        <div {...stylex.props(styles.toolbar)}>
          <InputGroup sx={styles.search}>
            <InputGroupAddon>
              <Glyph icon={Search01Icon} />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search payments"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search emails"
              value={search}
            />
          </InputGroup>
          <ToggleGroup
            aria-label="Status"
            onValueChange={(next) => {
              const [picked] = next;
              if (picked !== undefined) {
                setStatus(picked);
              }
            }}
            spacing={0}
            value={[status]}
            variant="outline"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="success">Paid</ToggleGroupItem>
            <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <DataTable
          columnSx={{
            actions: styles.actions,
            amount: styles.amount,
            select: styles.select,
            status: styles.status,
          }}
          empty="No payments match."
          label="Payments"
          table={table}
        />
        <div {...stylex.props(styles.count)}>
          {selected} of {ledger.length} selected
        </div>
      </div>
    </DemoRow>
  );
}

export { DataTableDemo, DataTableFilterDemo };
