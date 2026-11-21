import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ChangeDetails } from "@ui-sdk/core";
import { createAgent } from "@ui-sdk/react/agent";
import type {
  ListData,
  SelectProps,
  SelectValueChangeReason,
} from "@ui-sdk/react/select";
import { renderToString } from "react-dom/server";
import { expect, test } from "vite-plus/test";

import { Field, FieldDescription, FieldLabel } from "./field";
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
import type { SelectSize } from "./select";

const agent = createAgent();

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function Fruit({
  alignItemWithTrigger = false,
  defaultValue = null,
  keepMounted = false,
  onOpenChange,
  onValueChange,
  size = "default",
}: {
  alignItemWithTrigger?: boolean;
  defaultValue?: string | null;
  keepMounted?: boolean;
  onOpenChange?: SelectProps["onOpenChange"];
  onValueChange?: (
    value: string | null,
    details: ChangeDetails<SelectValueChangeReason>
  ) => void;
  size?: SelectSize;
}) {
  return (
    <Select
      defaultValue={defaultValue}
      items={fruits}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      placeholder="Pick a fruit"
    >
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger size={size}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={alignItemWithTrigger}
        keepMounted={keepMounted}
        size={size}
      >
        <SelectGroup>
          <SelectGroupLabel>Fruits</SelectGroupLabel>
          {fruits.slice(0, 2).map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

function trigger() {
  return screen.getByRole("combobox", { name: "Fruit" });
}

async function open() {
  fireEvent.click(trigger());
  const listbox = await screen.findByRole("listbox");
  const content = listbox.closest<HTMLElement>("[data-slot='select-content']");
  if (content === null) {
    throw new Error("The listbox isn't inside the select's content");
  }
  return content;
}

test("the label names the trigger, which opens sized content whose parts carry their slots", async () => {
  render(<Fruit size="sm" />);
  expect(trigger().dataset).toMatchObject({
    size: "sm",
    slot: "select-trigger",
  });
  expect(screen.getByText("Fruit").dataset.slot).toBe("select-label");

  const content = await open();
  expect(content.dataset.size).toBe("sm");
  expect(screen.getByText("Fruits").dataset.slot).toBe("select-group-label");
  expect(screen.getByRole("option", { name: "Apple" }).dataset.slot).toBe(
    "select-item"
  );
  expect(
    content.querySelector("[data-slot='select-separator']")
  ).not.toBeNull();
});

test("a pointer open animates, and a pointer pick closes at once", async () => {
  render(<Fruit keepMounted />);
  const content = await open();
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(false);

  fireEvent.click(screen.getByRole("option", { name: "Banana" }));
  await waitFor(() => {
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(true);
  expect(trigger().textContent).toContain("Banana");
});

test("content aligned over the trigger opens in place, with no motion", async () => {
  render(<Fruit alignItemWithTrigger defaultValue="banana" />);
  const content = await open();
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(true);
});

test("a closed select shows its value's label from the server's HTML on, and typing on it picks the next match", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(<Fruit defaultValue="banana" />);
  expect(server.querySelector("[role='combobox']")?.textContent).toContain(
    "Banana"
  );

  render(<Fruit defaultValue="banana" />);
  expect(trigger().textContent).toContain("Banana");
  trigger().focus();
  fireEvent.keyDown(trigger(), { key: "c" });
  expect(trigger().textContent).toContain("Cherry");
  expect(screen.queryByRole("listbox")).toBeNull();
});

function Looping({ loop }: { loop?: boolean }) {
  return (
    <Select defaultValue="cherry" items={fruits} loop={loop}>
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

async function arrowDownFromLast() {
  await open();
  const last = screen.getByRole("option", { name: "Cherry" });
  await waitFor(() => {
    expect(Object.hasOwn(last.dataset, "highlighted")).toBe(true);
  });
  fireEvent.keyDown(document.activeElement ?? last, { key: "ArrowDown" });
}

test("ArrowDown on the last item stays there, unless the select loops", async () => {
  const { unmount } = render(<Looping />);
  await arrowDownFromLast();
  expect(
    Object.hasOwn(
      screen.getByRole("option", { name: "Cherry" }).dataset,
      "highlighted"
    )
  ).toBe(true);
  unmount();

  render(<Looping loop />);
  await arrowDownFromLast();
  await waitFor(() => {
    expect(
      Object.hasOwn(
        screen.getByRole("option", { name: "Apple" }).dataset,
        "highlighted"
      )
    ).toBe(true);
  });
});

function Department({ disabled = false, invalid = false }) {
  return (
    <Field disabled={disabled} invalid={invalid} name="department">
      <FieldLabel>Department</FieldLabel>
      <Select items={[{ label: "Design", value: "design" }]}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="design">Design</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Where you work.</FieldDescription>
    </Field>
  );
}

test("in a Field, the select takes its label, description, name and state, from the server's HTML on", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(<Department />);
  const label = server.querySelector("label");
  expect(
    server
      .querySelector(`#${CSS.escape(label?.htmlFor ?? "")}`)
      ?.getAttribute("role")
  ).toBe("combobox");

  const { rerender } = render(<Department />);
  const combobox = screen.getByRole("combobox", { name: "Department" });
  expect(combobox.getAttribute("aria-describedby")).toBe(
    screen.getByText("Where you work.").id
  );
  expect(
    document.querySelector<HTMLElement>("textarea[name='department']")?.dataset
      .slot
  ).toBe("select-form-input");
  for (const attribute of ["aria-invalid", "data-invalid", "disabled"]) {
    expect(combobox.hasAttribute(attribute), attribute).toBe(false);
  }

  rerender(<Department disabled invalid />);
  expect(combobox.matches(":disabled[data-disabled]")).toBe(true);
  expect(combobox.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
});

test("pressing the Field's label opens the select", async () => {
  render(<Department />);
  fireEvent.click(screen.getByText("Department"));
  expect(
    await screen.findByRole("listbox", { name: "Department" })
  ).toBeTruthy();
});

test("an agent finds the select and its items while it's closed, and names every control once it's open", async () => {
  render(<Fruit />);

  const closed = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  const select = closed.find((entry) => entry.label === "Fruit");
  expect(select?.items?.map((item) => item.label)).toEqual([
    "Apple",
    "Banana",
    "Cherry",
  ]);

  await open();
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toContain("Fruit");

  const picked = await agent.act({
    steps: [{ action: "setValue", args: ["Cherry"], ref: "Fruit" }],
  });
  expect(picked.ok, picked.error?.message).toBe(true);
  expect(trigger().textContent).toContain("Cherry");
});

test("an agent's pick reaches onValueChange as the agent's, and a cancel keeps the value", async () => {
  const seen: [string | null, string][] = [];
  render(
    <Fruit
      defaultValue="banana"
      onValueChange={(value, details) => {
        seen.push([value, details.source]);
        details.cancel();
      }}
    />
  );

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["Cherry"], ref: "Fruit" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(seen).toEqual([["cherry", "agent"]]);
  expect(trigger().textContent).toContain("Banana");
});

test("an agent's open reaches onOpenChange as the agent's, and a cancel keeps the select closed", async () => {
  const seen: [boolean, string][] = [];
  render(
    <Fruit
      onOpenChange={(next, details) => {
        seen.push([next, details.source]);
        details.cancel();
      }}
    />
  );

  const result = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Fruit" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(seen).toEqual([[true, "agent"]]);
  expect(trigger().getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("listbox")).toBeNull();
});

const timezones = [
  {
    items: [
      { label: "Eastern Standard Time", value: "est" },
      { label: "Pacific Standard Time", value: "pst" },
    ],
    label: "North America",
    type: "group" as const,
  },
  {
    items: [
      { label: "Japan Standard Time", value: "jst" },
      { label: "Moscow Time", value: "msk" },
    ],
    label: "Asia",
    type: "group" as const,
  },
];

function Options({ entries }: { entries: ListData<unknown> }) {
  return entries.map((entry) => {
    const item =
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- a plain string is an item in ui-sdk's ListData
      typeof entry === "string" ? { label: entry, value: entry } : entry;
    if ("type" in item) {
      return item.type === "group" ? (
        <SelectGroup key={item.label}>
          <SelectGroupLabel>{item.label}</SelectGroupLabel>
          <Options entries={item.items} />
        </SelectGroup>
      ) : null;
    }
    return (
      <SelectItem key={item.label} label={item.label} value={item.value}>
        <SelectItemText />
      </SelectItem>
    );
  });
}

function Timezone({ search = true }: { search?: boolean }) {
  return (
    <Select items={timezones}>
      <SelectLabel>Timezone</SelectLabel>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      {search ? (
        <SelectContent>
          <SelectInput aria-label="Search timezones" />
          <SelectEmpty>No timezones found.</SelectEmpty>
          <SelectList>{({ items }) => <Options entries={items} />}</SelectList>
        </SelectContent>
      ) : (
        <SelectContent>
          <Options entries={timezones} />
        </SelectContent>
      )}
    </Select>
  );
}

async function openTimezone() {
  fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
  return await screen.findByRole("combobox", { name: "Search timezones" });
}

function options() {
  return screen.queryAllByRole("option").map((option) => option.textContent);
}

test("typing in the search field keeps the matching items and marks the match", async () => {
  render(<Timezone />);
  const search = await openTimezone();
  expect(options()).toHaveLength(4);
  expect(search.closest("[data-slot='select-input-group']")).not.toBeNull();

  fireEvent.change(search, { target: { value: "japan" } });
  await waitFor(() => {
    expect(options()).toEqual(["Japan Standard Time"]);
  });
  const text = screen
    .getByRole("option", { name: "Japan Standard Time" })
    .querySelector<HTMLElement>("[data-slot='select-item-text']");
  expect(Object.hasOwn(text?.dataset ?? {}, "matched")).toBe(true);
  expect(text?.querySelector("mark")?.textContent).toBe("Japan");
  expect(screen.queryByText("North America")).toBeNull();
});

test("a search that matches nothing shows the empty state", async () => {
  render(<Timezone />);
  const search = await openTimezone();
  expect(screen.queryByText("No timezones found.")).toBeNull();

  fireEvent.change(search, { target: { value: "zzz" } });
  expect(await screen.findByText("No timezones found.")).toBeTruthy();
  expect(options()).toEqual([]);
});

function highlighted(name: string) {
  return Object.hasOwn(
    screen.getByRole("option", { name }).dataset,
    "highlighted"
  );
}

test("arrow keys and Enter pick a filtered item while focus stays in the search field", async () => {
  render(<Timezone />);
  const search = await openTimezone();
  await waitFor(() => {
    expect(document.activeElement).toBe(search);
  });

  fireEvent.change(search, { target: { value: "standard" } });
  await waitFor(() => {
    expect(options()).toHaveLength(3);
  });
  await waitFor(() => {
    expect(highlighted("Eastern Standard Time")).toBe(true);
  });
  fireEvent.keyDown(search, { key: "ArrowDown" });
  await waitFor(() => {
    expect(highlighted("Pacific Standard Time")).toBe(true);
  });
  expect(document.activeElement).toBe(search);

  fireEvent.keyDown(search, { key: "Enter" });
  await waitFor(() => {
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  expect(
    screen.getByRole("combobox", { name: "Timezone" }).textContent
  ).toContain("Pacific Standard Time");
});

function snapshotLabels() {
  return agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more")
    .map((entry) => entry.label);
}

test("search adds no names to the agent's snapshot", async () => {
  const { unmount } = render(<Timezone search={false} />);
  fireEvent.click(screen.getByRole("combobox", { name: "Timezone" }));
  await screen.findByRole("listbox");
  const plain = snapshotLabels();
  unmount();

  render(<Timezone />);
  await openTimezone();
  expect(snapshotLabels()).toEqual(plain);
});
