import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  functionalUpdate,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { RowSelectionState } from "@tanstack/react-table";
import { render, screen, within } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { ObservedChange } from "@ui-sdk/react/observe";
import { createContext, use, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { beforeEach, expect, test } from "vite-plus/test";

import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/primitives/input-group";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";

import {
  DataTable,
  DataTableActionBar,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableViewOptions,
} from "./data-table";

globalThis.scrollTo = () => {};

let approve = false;
const agent = createAgent({
  allow: (step) => step.confirm === undefined || approve,
});

beforeEach(() => {
  approve = false;
});

interface Payment {
  amount: number;
  email: string;
  id: string;
  status: "failed" | "success";
}

const payments: Payment[] = [
  { amount: 316, email: "ken@acme.com", id: "p1", status: "success" },
  { amount: 242, email: "abe@acme.com", id: "p2", status: "failed" },
  { amount: 837, email: "dee@acme.com", id: "p3", status: "success" },
];

const getRowId = (row: Payment) => row.id;

function onPage() {
  return agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
}

function expectNamed(labels: string[]) {
  const entries = onPage();
  expect(
    entries
      .filter((entry) => (entry.label ?? "") === "")
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([{ actions: [], component: "scroll-area" }]);
  const found = entries.map((entry) => entry.label);
  for (const label of labels) {
    expect(found, `${label} is missing from the snapshot`).toContain(label);
  }
  return entries;
}

async function run(
  ...steps: { action: string; args?: unknown[]; ref: string }[]
) {
  const result = await agent.act({ steps });
  expect(result.ok, result.error?.message).toBe(true);
  return result;
}

function emails() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole("cell")
        .map((cell) => cell.textContent)
        .find((text) => text?.endsWith("@acme.com"))
    );
}

function checkboxIn(email: string) {
  return screen.getByRole("checkbox", { name: `Select ${email}` });
}

const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const column = createColumnHelper<typeof features, Payment>();

const selectColumn = column.display({
  cell: ({ row }) => (
    <DataTableSelectRow label={`Select ${row.original.email}`} row={row} />
  ),
  enableSorting: false,
  header: ({ table }) => <DataTableSelectAll table={table} />,
  id: "select",
});

const amountColumn = column.accessor("amount", {
  header: ({ column: amount }) => (
    <DataTableColumnHeader column={amount} title="Amount" />
  ),
  sortFn: "basic",
});

const columns = column.columns([
  selectColumn,
  column.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
  amountColumn,
]);

function Basic() {
  const table = useTable({ columns, data: payments, features, getRowId });
  return <DataTable empty="No payments." label="Payments" table={table} />;
}

test("an agent sorts by a column, and selects one row or all of them", async () => {
  render(<Basic />);
  const entries = expectNamed([
    "Select all",
    "Select dee@acme.com",
    "Email",
    "Amount",
  ]);

  const email = entries.find(
    (entry) => entry.component === "button" && entry.label === "Email"
  );
  await run({ action: "press", ref: email?.ref ?? "" });
  expect(emails()).toEqual(["abe@acme.com", "dee@acme.com", "ken@acme.com"]);

  await run({ action: "setChecked", args: [true], ref: "dee@acme.com" });
  expect(checkboxIn("dee@acme.com").getAttribute("aria-checked")).toBe("true");
  expect(checkboxIn("abe@acme.com").getAttribute("aria-checked")).toBe("false");
  expect(checkboxIn("ken@acme.com").getAttribute("aria-checked")).toBe("false");

  await run({ action: "setChecked", args: [true], ref: "Select all" });
  for (const row of payments) {
    expect(checkboxIn(row.email).getAttribute("aria-checked")).toBe("true");
  }
});

// ui-sdk treats the header row as a row, so its text puts "Email" on every header control.
test.fails("an agent presses a column header by its title", async () => {
  render(<Basic />);
  await run({ action: "press", ref: "Email" });
});

const filterFeatures = tableFeatures({
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

const filtered = createColumnHelper<typeof filterFeatures, Payment>();

const SetRows = createContext<Dispatch<SetStateAction<Payment[]>>>(() => {});

function RowActions({ payment }: { payment: Payment }) {
  const setRows = use(SetRows);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`Actions for ${payment.email}`}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        ...
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          color="danger"
          data-agent-confirm={`Deletes the payment from ${payment.email}`}
          onSelect={() => {
            setRows((current) =>
              current.filter((row) => row.id !== payment.id)
            );
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const filterColumns = filtered.columns([
  filtered.display({
    cell: ({ row }) => (
      <DataTableSelectRow
        label={`Select ${row.original.email}`}
        numbered
        row={row}
      />
    ),
    enableGlobalFilter: false,
    enableSorting: false,
    header: ({ table }) => <DataTableSelectAll table={table} />,
    id: "select",
  }),
  filtered.accessor("status", {
    enableGlobalFilter: false,
    enableSorting: false,
    filterFn: "equalsString",
    header: "Status",
  }),
  filtered.accessor("email", {
    header: ({ column: email }) => (
      <DataTableColumnHeader column={email} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
  filtered.accessor("amount", {
    enableGlobalFilter: false,
    header: ({ column: amount }) => (
      <DataTableColumnHeader column={amount} title="Amount" />
    ),
    sortFn: "basic",
  }),
  filtered.display({
    cell: ({ row }) => <RowActions payment={row.original} />,
    enableGlobalFilter: false,
    enableSorting: false,
    header: () => null,
    id: "actions",
  }),
]);

function Filters() {
  const [rows, setRows] = useState(payments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columnFilters = useMemo(
    () => (status === "all" ? [] : [{ id: "status", value: status }]),
    [status]
  );
  const table = useTable({
    columns: filterColumns,
    data: rows,
    features: filterFeatures,
    getRowId,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    state: { columnFilters, globalFilter: search, rowSelection },
  });
  return (
    <SetRows value={setRows}>
      <InputGroup>
        <InputGroupInput
          aria-label="Search payments"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          value={search}
        />
      </InputGroup>
      <ToggleGroup
        aria-label="Status"
        deselectable={false}
        onValueChange={(next) => {
          const [picked] = next;
          setStatus(picked);
        }}
        value={[status]}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="success">Paid</ToggleGroupItem>
        <ToggleGroupItem value="failed">Failed</ToggleGroupItem>
      </ToggleGroup>
      <DataTableViewOptions
        labels={{ amount: "Amount", email: "Email", status: "Status" }}
        table={table}
      />
      <DataTable empty="No payments match." label="Payments" table={table} />
    </SetRows>
  );
}

test("an agent searches, filters, hides a column, and deletes a row only once a person allows it", async () => {
  render(<Filters />);
  expectNamed([
    "Search payments",
    "Status",
    "View",
    "Actions for ken@acme.com",
    "Select dee@acme.com",
  ]);

  await run({ action: "setValue", args: ["e@acme"], ref: "Search payments" });
  expect(emails()).toEqual(["abe@acme.com", "dee@acme.com"]);
  await run({ action: "setValue", args: [""], ref: "Search payments" });

  await run({ action: "setPressed", args: [true], ref: "Paid" });
  expect(emails()).toEqual(["ken@acme.com", "dee@acme.com"]);

  await run({ action: "press", args: ["Amount"], ref: "View" });
  expect(screen.queryByRole("columnheader", { name: "Amount" })).toBeNull();

  const remove = {
    steps: [
      { action: "press", args: ["Delete"], ref: "Actions for dee@acme.com" },
    ],
  };
  const refused = await agent.act(remove);
  expect(refused.ok, "the delete ran without a person").toBe(false);
  expect(refused.error?.message).toContain(
    "Deletes the payment from dee@acme.com"
  );
  expect(emails()).toEqual(["ken@acme.com", "dee@acme.com"]);
  approve = true;
  const removed = await agent.act(remove);
  expect(removed.ok, removed.error?.message).toBe(true);
  expect(emails()).toEqual(["ken@acme.com"]);
});

test("an agent checks a row by its text or by its checkbox's own name", async () => {
  render(<Filters />);
  const labels = onPage()
    .filter((entry) => entry.component === "checkbox")
    .map((entry) => entry.label);
  expect(new Set(labels).size, labels.join(", ")).toBe(labels.length);

  await run({ action: "setChecked", args: [true], ref: "dee@acme.com" });
  expect(checkboxIn("dee@acme.com").getAttribute("aria-checked")).toBe("true");
  expect(checkboxIn("abe@acme.com").getAttribute("aria-checked")).toBe("false");

  await run({ action: "setChecked", args: [true], ref: "Select abe@acme.com" });
  expect(checkboxIn("abe@acme.com").getAttribute("aria-checked")).toBe("true");
  expect(checkboxIn("ken@acme.com").getAttribute("aria-checked")).toBe("false");
});

const ledger: Payment[] = Array.from({ length: 25 }, (_, index) => ({
  amount: index + 1,
  email: `user${index + 1}@acme.com`,
  id: `p${index + 1}`,
  status: "success",
}));

const pagedFeatures = tableFeatures({
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
});

const paged = createColumnHelper<typeof pagedFeatures, Payment>();

const pagedColumns = paged.columns([
  paged.accessor("email", { header: "Email" }),
  paged.accessor("amount", { header: "Amount" }),
]);

function Pages() {
  const table = useTable({
    columns: pagedColumns,
    data: ledger,
    features: pagedFeatures,
    getRowId,
  });
  return (
    <>
      <DataTable empty="No payments." label="Payments" table={table} />
      <DataTablePagination pageSizes={[10, 20, 50]} table={table} />
    </>
  );
}

test("an agent pages through the rows and changes how many show", async () => {
  render(<Pages />);
  const entries = expectNamed([
    "Rows per page",
    "First page",
    "Previous page",
    "Next page",
    "Last page",
  ]);
  for (const label of ["First page", "Previous page"]) {
    expect(entries.find((entry) => entry.label === label)).toMatchObject({
      actions: [],
      disabled: true,
    });
  }

  await run({ action: "press", ref: "Next page" });
  expect(screen.getByText("11–20 of 25")).toBeTruthy();

  await run({ action: "setValue", args: ["20"], ref: "Rows per page" });
  expect(screen.getByText("1–20 of 25")).toBeTruthy();

  await run({ action: "press", ref: "Last page" });
  expect(screen.getByText("21–25 of 25")).toBeTruthy();
});

function Bar() {
  const [rows, setRows] = useState(payments);
  const table = useTable({ columns, data: rows, features, getRowId });
  const selected = table.getSelectedRowIds().length;
  return (
    <>
      <DataTable empty="No payments." label="Payments" table={table} />
      <DataTableActionBar label="Payment actions" table={table}>
        <Button>Copy emails</Button>
        <Button
          data-agent-confirm={`Deletes ${selected} selected payments`}
          onClick={() => {
            const ids = new Set(table.getSelectedRowIds());
            setRows((current) => current.filter(({ id }) => !ids.has(id)));
            table.resetRowSelection(true);
          }}
        >
          Delete
        </Button>
      </DataTableActionBar>
    </>
  );
}

test("an agent acts on the selected rows from the action bar, deleting only once a person allows it", async () => {
  render(<Bar />);
  await run({ action: "setChecked", args: [true], ref: "abe@acme.com" });
  expectNamed(["Copy emails", "Delete", "Clear selection"]);

  const remove = { steps: [{ action: "press", ref: "Delete" }] };
  const refused = await agent.act(remove);
  expect(refused.ok, "the delete ran without a person").toBe(false);
  expect(refused.error?.message).toContain("Deletes 1 selected payments");
  expect(emails()).toEqual(payments.map((row) => row.email));
  approve = true;
  const removed = await agent.act(remove);
  expect(removed.ok, removed.error?.message).toBe(true);
  expect(emails()).toEqual(["ken@acme.com", "dee@acme.com"]);

  await run({ action: "setChecked", args: [true], ref: "ken@acme.com" });
  await run({ action: "press", ref: "Clear selection" });
  expect(checkboxIn("ken@acme.com").getAttribute("aria-checked")).toBe("false");
});

test("an agent can't reach the action bar while no row is selected", async () => {
  render(<Bar />);
  const barActions = () =>
    agent
      .snapshot()
      .filter(
        (entry) => entry.label === "Delete" || entry.label === "Clear selection"
      );
  const closed = barActions();
  expect(closed).toHaveLength(2);
  for (const entry of closed) {
    expect(entry).toMatchObject({ actions: [], disabled: true });
  }
  const cleared = await agent.act({
    steps: [{ action: "press", ref: "Clear selection" }],
  });
  expect(cleared.ok, "pressed Clear on a closed bar").toBe(false);

  await run({ action: "setChecked", args: [true], ref: "abe@acme.com" });
  for (const entry of barActions()) {
    expect(entry.disabled).not.toBe(true);
    expect(entry.actions).toContain("press");
  }
});

const OpenPayment = createContext<(id: string) => void>(() => {});

function PaymentLink({ payment }: { payment: Payment }) {
  const open = use(OpenPayment);
  return (
    <Button
      aria-label={`Open ${payment.email}`}
      onClick={() => {
        open(payment.id);
      }}
      variant="link"
    >
      {payment.email}
    </Button>
  );
}

const clickColumns = column.columns([
  selectColumn,
  column.accessor("email", {
    cell: ({ row }) => <PaymentLink payment={row.original} />,
    header: "Email",
  }),
  amountColumn,
]);

function RowClick() {
  const [openId, setOpenId] = useState<string | undefined>();
  const table = useTable({
    columns: clickColumns,
    data: payments,
    features,
    getRowId,
  });
  return (
    <OpenPayment value={setOpenId}>
      <DataTable
        activeRowId={openId}
        empty="No payments."
        label="Payments"
        onRowClick={(row) => {
          setOpenId(row.id);
        }}
        table={table}
      />
      <output>{openId}</output>
    </OpenPayment>
  );
}

function Selection({
  apply,
  selections,
}: {
  apply: boolean;
  selections: RowSelectionState[];
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useTable({
    columns,
    data: payments,
    features,
    getRowId,
    onRowSelectionChange: (updater) => {
      const next = functionalUpdate(updater, rowSelection);
      selections.push(next);
      if (apply) {
        setRowSelection(next);
      }
    },
    state: { rowSelection },
  });
  return <DataTable empty="No payments." label="Payments" table={table} />;
}

test("an agent's row check reaches onRowSelectionChange, and the bridge reports it as the agent's", async () => {
  const selections: RowSelectionState[] = [];
  const changes: ObservedChange[] = [];
  const stop = agent.subscribe((change) => {
    changes.push(change);
  });
  render(<Selection apply selections={selections} />);

  await run({ action: "setChecked", args: [true], ref: "dee@acme.com" });
  stop();
  expect(selections).toEqual([{ p3: true }]);
  expect(checkboxIn("dee@acme.com").getAttribute("aria-checked")).toBe("true");
  expect(
    changes.map(({ key, source, value }) => ({ key, source, value }))
  ).toEqual([{ key: "checked", source: "agent", value: true }]);
});

test("a controlled table that ignores the agent's row check leaves the row unchecked", async () => {
  const selections: RowSelectionState[] = [];
  render(<Selection apply={false} selections={selections} />);

  await run({ action: "setChecked", args: [true], ref: "dee@acme.com" });
  expect(selections).toEqual([{ p3: true }]);
  expect(checkboxIn("dee@acme.com").getAttribute("aria-checked")).toBe("false");
});

test("an agent opens a row through its named link, as a row click would", async () => {
  render(<RowClick />);
  expectNamed(["Open abe@acme.com"]);

  await run({ action: "press", ref: "Open abe@acme.com" });
  expect(screen.getByRole("status").textContent).toBe("p2");
});
