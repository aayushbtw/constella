import {
  Copy01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  Refresh01Icon,
  Search01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  createContext,
  use,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableViewOptions,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "@/components/ui/side-panel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  table: { maxWidth: "100%", minWidth: 480, width: 640 },
  // Narrower than its columns, the table scrolls rather than squeezing the email to nothing.
  wide: { minWidth: 480 },
  select: { width: sizes.media },
  // The icon-sm button and the cell's padding on both sides.
  actions: {
    textAlign: "end",
    width: `calc(${sizes.controlSm} + 2 * ${space.xs})`,
  },
  page: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: "100%",
    width: 640,
  },
  controls: { display: "flex", gap: space.xs },
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
  frame: {
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    backgroundColor: colors.background,
    display: "flex",
    height: 360,
    overflow: "hidden",
    width: "100%",
  },
  main: { flexGrow: 1, minWidth: 0 },
  // The docs column is narrower than an app, so a slimmer panel leaves the table room.
  panel: { width: 288 },
  content: {
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
  // Sits on the row's baseline like the text around it.
  link: { height: "auto", paddingInlineEnd: 0, paddingInlineStart: 0 },
  facts: {
    display: "grid",
    gap: space.xs,
    gridTemplateColumns: "auto 1fr",
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
  term: { color: colors.textSecondary },
  value: { marginInlineStart: 0 },
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
  columnVisibilityFeature,
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
    cell: ({ row }) => <DataTableSelectRow numbered row={row} />,
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
          <div {...stylex.props(styles.controls)}>
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
            <DataTableViewOptions
              labels={{ amount: "Amount", email: "Email", status: "Status" }}
              table={table}
            />
          </div>
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
          sx={styles.wide}
          table={table}
        />
        <div {...stylex.props(styles.count)}>
          {selected} of {ledger.length} selected
        </div>
      </div>
    </DemoRow>
  );
}

const queryFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const queried = createColumnHelper<typeof queryFeatures, Payment>();

const queryColumns = queried.columns([
  queried.accessor("status", {
    cell: ({ getValue }) => (
      <Badge status={statusBadges[getValue()]} variant="secondary">
        {getValue()}
      </Badge>
    ),
    enableSorting: false,
    header: "Status",
  }),
  queried.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
  queried.accessor("amount", {
    cell: ({ getValue }) => money.format(getValue()),
    header: ({ column: amount }) => (
      <DataTableColumnHeader column={amount} title="Amount" />
    ),
    sortFn: "basic",
  }),
]);

const noPayments: Payment[] = [];

// Stands in for a server: answers a search after a short wait.
async function fetchPayments(search: string) {
  const wait = Promise.withResolvers<boolean>();
  setTimeout(() => {
    wait.resolve(true);
  }, 800);
  await wait.promise;
  return ledger.filter((payment) => payment.email.includes(search));
}

function PaymentsQuery() {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => await fetchPayments(search),
    queryKey: ["payments", search],
  });
  const table = useTable({
    columns: queryColumns,
    data: query.data ?? noPayments,
    features: queryFeatures,
    getRowId,
  });
  return (
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
        <Button
          onClick={() => {
            void client.resetQueries({ queryKey: ["payments"] });
          }}
          variant="outline"
        >
          <Glyph icon={Refresh01Icon} />
          Reload
        </Button>
      </div>
      <DataTable
        columnSx={{ amount: styles.amount, status: styles.status }}
        empty="No payments match."
        label="Payments"
        sx={styles.wide}
        query={query}
        table={table}
      />
    </div>
  );
}

const pagedFeatures = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
});

const paged = createColumnHelper<typeof pagedFeatures, Payment>();

const pagedColumns = paged.columns([
  paged.accessor("status", {
    cell: ({ getValue }) => (
      <Badge status={statusBadges[getValue()]} variant="secondary">
        {getValue()}
      </Badge>
    ),
    enableSorting: false,
    header: "Status",
  }),
  paged.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
  }),
  paged.accessor("amount", {
    cell: ({ getValue }) => money.format(getValue()),
    header: ({ column: amount }) => (
      <DataTableColumnHeader column={amount} title="Amount" />
    ),
  }),
]);

const compare = {
  amount: (a: Payment, b: Payment) => a.amount - b.amount,
  email: (a: Payment, b: Payment) => a.email.localeCompare(b.email),
};

// Stands in for a server: sorts and pages the ledger after a short wait.
async function fetchPage(pagination: PaginationState, sorting: SortingState) {
  const wait = Promise.withResolvers<boolean>();
  setTimeout(() => {
    wait.resolve(true);
  }, 500);
  await wait.promise;
  const sort = sorting.at(0);
  const by =
    sort?.id === "amount" || sort?.id === "email"
      ? compare[sort.id]
      : undefined;
  const sorted =
    by === undefined
      ? ledger
      : ledger.toSorted((a, b) => (sort?.desc === true ? by(b, a) : by(a, b)));
  const start = pagination.pageIndex * pagination.pageSize;
  return {
    rows: sorted.slice(start, start + pagination.pageSize),
    total: ledger.length,
  };
}

function PaymentPages() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => await fetchPage(pagination, sorting),
    queryKey: ["payment-pages", pagination, sorting],
  });
  const table = useTable({
    columns: pagedColumns,
    data: query.data?.rows ?? noPayments,
    features: pagedFeatures,
    getRowId,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    // A new order starts from its first page.
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
    },
    rowCount: query.data?.total ?? 0,
    state: { pagination, sorting },
  });
  return (
    <div {...stylex.props(styles.page)}>
      <DataTable
        columnSx={{ amount: styles.amount, status: styles.status }}
        empty="No payments."
        label="Payments"
        query={query}
        sx={styles.wide}
        table={table}
      />
      <DataTablePagination pageSizes={[10, 20, 50]} table={table} />
    </div>
  );
}

const queryClient = new QueryClient();

function DataTablePaginationDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <QueryClientProvider client={queryClient}>
        <PaymentPages />
      </QueryClientProvider>
    </DemoRow>
  );
}

function DataTableQueryDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <QueryClientProvider client={queryClient}>
        <PaymentsQuery />
      </QueryClientProvider>
    </DemoRow>
  );
}

const OpenPayment = createContext<(id: string) => void>(() => {
  // Replaced by the demo's provider.
});

function PaymentLink({ payment }: { payment: Payment }) {
  const open = use(OpenPayment);
  return (
    <Button
      onClick={() => {
        open(payment.id);
      }}
      sx={styles.link}
      variant="link"
    >
      {payment.email}
    </Button>
  );
}

const clickColumns = column.columns([
  column.display({
    cell: ({ row }) => <DataTableSelectRow numbered row={row} />,
    enableSorting: false,
    header: ({ table }) => <DataTableSelectAll table={table} />,
    id: "select",
  }),
  column.accessor("email", {
    cell: ({ row }) => <PaymentLink payment={row.original} />,
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

function DataTableRowClickDemo() {
  const slot = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | undefined>();
  const table = useTable({
    columns: clickColumns,
    data: ledger,
    features,
    getRowId,
  });
  const payment = ledger.find(({ id }) => id === openId);
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.frame)}>
        <ScrollArea sx={styles.main} viewportRef={main}>
          <div {...stylex.props(styles.content)}>
            <OpenPayment value={setOpenId}>
              <DataTable
                activeRowId={openId}
                columnSx={{
                  amount: styles.amount,
                  select: styles.select,
                }}
                empty="No payments."
                label="Payments"
                scrollRef={main}
                onRowClick={(row) => {
                  setOpenId(row.id);
                }}
                table={table}
              />
            </OpenPayment>
          </div>
        </ScrollArea>
        <SidePanelSlot ref={slot} />
        <SidePanel
          onOpenChange={(open) => {
            if (!open) {
              setOpenId(undefined);
            }
          }}
          open={payment !== undefined}
        >
          <SidePanelContent container={slot} sx={styles.panel}>
            <SidePanelHeader>
              <SidePanelTitle>{payment?.email}</SidePanelTitle>
            </SidePanelHeader>
            <SidePanelBody>
              <dl {...stylex.props(styles.facts)}>
                <dt {...stylex.props(styles.term)}>Amount</dt>
                <dd {...stylex.props(styles.value)}>
                  {payment && money.format(payment.amount)}
                </dd>
                <dt {...stylex.props(styles.term)}>Status</dt>
                <dd {...stylex.props(styles.value)}>{payment?.status}</dd>
                <dt {...stylex.props(styles.term)}>ID</dt>
                <dd {...stylex.props(styles.value)}>{payment?.id}</dd>
              </dl>
            </SidePanelBody>
          </SidePanelContent>
        </SidePanel>
      </div>
    </DemoRow>
  );
}

export {
  DataTableDemo,
  DataTableFilterDemo,
  DataTablePaginationDemo,
  DataTableQueryDemo,
  DataTableRowClickDemo,
};
