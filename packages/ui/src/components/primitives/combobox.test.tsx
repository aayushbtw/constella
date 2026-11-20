import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ChangeDetails } from "@ui-sdk/core";
import { settle } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import type {
  ComboboxProps,
  ComboboxValueChangeReason,
} from "@ui-sdk/react/combobox";
import { Fragment, useState } from "react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vite-plus/test";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "./combobox";
import { Field, FieldDescription, FieldLabel } from "./field";

const agent = createAgent();

const fruits = ["Apple", "Banana", "Cherry"];

const produce = [
  { items: ["Apple", "Banana"], label: "Fruits" },
  { items: ["Broccoli", "Carrot"], label: "Vegetables" },
];

function FruitItems() {
  return (
    <ComboboxList>
      {fruits.map((fruit) => (
        <ComboboxItem key={fruit} value={fruit}>
          {fruit}
        </ComboboxItem>
      ))}
    </ComboboxList>
  );
}

function Fruit({
  defaultValue = null,
  loop,
  onOpenChange,
  onValueChange,
}: {
  defaultValue?: string | null;
  loop?: boolean;
  onOpenChange?: ComboboxProps["onOpenChange"];
  onValueChange?: (
    value: string | null,
    details: ChangeDetails<ComboboxValueChangeReason>
  ) => void;
}) {
  return (
    <Combobox
      defaultValue={defaultValue}
      loop={loop}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
    >
      <ComboboxLabel>Fruit</ComboboxLabel>
      <ComboboxInput
        clearLabel="Clear fruit"
        showClear
        triggerLabel="Show fruits"
      />
      <ComboboxContent>
        <FruitItems />
      </ComboboxContent>
    </Combobox>
  );
}

function Produce() {
  return (
    <Combobox>
      <ComboboxInput aria-label="Produce" triggerLabel="Show produce" />
      <ComboboxContent>
        <ComboboxEmpty>No produce found.</ComboboxEmpty>
        <ComboboxList>
          {produce.map((group, index) => (
            <Fragment key={group.label}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxGroup>
                <ComboboxGroupLabel>{group.label}</ComboboxGroupLabel>
                {group.items.map((item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </Fragment>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function Fruits() {
  const [value, setValue] = useState(["Apple", "Banana"]);
  return (
    <Combobox multiple onValueChange={setValue} value={value}>
      <ComboboxChips aria-label="Fruits">
        {value.map((fruit) => (
          <ComboboxChip key={fruit} value={fruit} />
        ))}
        <ComboboxChipsInput aria-label="Fruits" />
      </ComboboxChips>
      <ComboboxContent>
        <FruitItems />
      </ComboboxContent>
    </Combobox>
  );
}

const tags = ["design", "engineering", "marketing"];

function Tags({ onSubmit }: { onSubmit?: () => void }) {
  const [known, setKnown] = useState(tags);
  const [value, setValue] = useState(["design"]);
  const [query, setQuery] = useState("");

  function add(text: string) {
    const typed = text.trim();
    if (typed === "") {
      return;
    }
    const tag =
      known.find((name) => name.toLowerCase() === typed.toLowerCase()) ?? typed;
    setKnown((current) =>
      current.includes(tag) ? current : [...current, tag]
    );
    setValue((current) =>
      current.includes(tag) ? current : [...current, tag]
    );
    setQuery("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <Combobox
        autoHighlight
        multiple
        onQueryChange={setQuery}
        onValueChange={setValue}
        query={query}
        value={value}
      >
        <ComboboxChips aria-label="Tags">
          {value.map((tag) => (
            <ComboboxChip key={tag} value={tag} />
          ))}
          <ComboboxChipsInput
            aria-label="Tags"
            onKeyDown={(event) => {
              if (event.key !== "," || event.nativeEvent.isComposing) {
                return;
              }
              event.preventDefault();
              add(query);
            }}
          />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {known.map((tag) => (
              <ComboboxItem key={tag} value={tag}>
                {tag}
              </ComboboxItem>
            ))}
            <ComboboxCreate onCreate={add}>
              {(state) => `Create “${state.query}”`}
            </ComboboxCreate>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </form>
  );
}

async function flush() {
  await act(async () => {
    await settle();
  });
}
const input = (name: string) => screen.getByRole("combobox", { name });
const options = () =>
  screen.queryAllByRole("option").map((option) => option.textContent);
const chips = () =>
  [...document.querySelectorAll("[data-slot='combobox-chip']")].map(
    (chip) => chip.textContent
  );
const highlighted = () =>
  screen
    .queryAllByRole("option")
    .find((option) => Object.hasOwn(option.dataset, "highlighted"))
    ?.textContent;
const content = () =>
  document.querySelector<HTMLElement>("[data-slot='combobox-content']");

async function type(name: string, text: string) {
  input(name).focus();
  fireEvent.change(input(name), { target: { value: text } });
  await flush();
}

test("ComboboxLabel names the input, and the bundled trigger and clear take the names they're given", () => {
  render(<Fruit defaultValue="Banana" />);
  expect(input("Fruit")).toHaveProperty("value", "Banana");
  expect(screen.getByText("Fruit").dataset.slot).toBe("combobox-label");
  expect(
    screen.getByRole("button", { hidden: true, name: "Show fruits" }).dataset
      .slot
  ).toBe("combobox-trigger");
  expect(screen.getByRole("button", { name: "Clear fruit" }).dataset.slot).toBe(
    "combobox-clear"
  );
});

test("the input sits in an input group's slot, with the addon after it", () => {
  render(<Fruit />);
  const slot = input("Fruit").parentElement;
  expect(slot?.dataset.slot).toBe("input-group-input");
  expect(slot?.parentElement?.dataset.slot).toBe("input-group");
  expect(
    slot?.parentElement?.querySelector(
      ":scope > [data-slot='input-group-input'] + [data-slot='input-group-addon']"
    )
  ).not.toBeNull();
});

test("the clear button empties the input and the value, and hides once there's nothing to clear", async () => {
  render(<Fruit defaultValue="Banana" />);
  fireEvent.click(screen.getByRole("button", { name: "Clear fruit" }));
  await flush();
  expect(input("Fruit")).toHaveProperty("value", "");
  expect(screen.queryByRole("button", { name: "Clear fruit" })).toBeNull();
});

test("the content anchors to the input group's box, so it's as wide as the box", async () => {
  render(<Fruit />);
  const box = input("Fruit").closest<HTMLElement>("[data-slot='input-group']");
  if (box === null) {
    throw new Error("The input isn't inside an input group");
  }
  box.getBoundingClientRect = () =>
    DOMRect.fromRect({ height: 36, width: 311 });
  input("Fruit").getBoundingClientRect = () =>
    DOMRect.fromRect({ height: 34, width: 200 });

  await type("Fruit", "a");
  expect(content()?.style.getPropertyValue("--anchor-width")).toBe("311px");
});

test("typing keeps the items that contain it, and hides a group left empty with its separator", async () => {
  render(<Produce />);
  await type("Produce", "car");

  expect(options()).toEqual(["Carrot"]);
  expect(screen.queryByRole("group", { name: "Fruits" })).toBeNull();
  expect(screen.getByRole("group", { name: "Vegetables" })).toBeTruthy();
  expect(
    content()?.querySelector("[data-slot='combobox-separator']:not([hidden])")
  ).toBeNull();

  await type("Produce", "zzz");
  expect(options()).toEqual([]);
  expect(screen.getByText("No produce found.")).toBeTruthy();
});

test("a pointer open animates, and a pointer pick closes at once", async () => {
  render(<Fruit />);
  fireEvent.click(
    screen.getByRole("button", { hidden: true, name: "Show fruits" })
  );
  await flush();
  const popup = content();
  expect(popup?.dataset.size).toBe("default");
  expect(Object.hasOwn(popup?.dataset ?? {}, "skipMotion")).toBe(false);

  fireEvent.click(screen.getByRole("option", { name: "Cherry" }));
  expect(Object.hasOwn(popup?.dataset ?? {}, "skipMotion")).toBe(true);
  await flush();
  expect(input("Fruit")).toHaveProperty("value", "Cherry");
});

async function arrowDown() {
  fireEvent.keyDown(input("Fruit"), { key: "ArrowDown" });
  await flush();
}

async function arrowDownFromLast() {
  input("Fruit").focus();
  await arrowDown();
  await arrowDown();
  await arrowDown();
  expect(highlighted()).toBe("Cherry");
  await arrowDown();
}

test("ArrowDown on the last item wraps to the first, unless loop is off", async () => {
  const { unmount } = render(<Fruit />);
  await arrowDownFromLast();
  expect(highlighted()).toBe("Apple");
  unmount();

  render(<Fruit loop={false} />);
  await arrowDownFromLast();
  expect(highlighted()).toBe("Cherry");
});

test("each chip shows its label and a remove button named after it, which removes it", async () => {
  render(<Fruits />);
  expect(chips()).toEqual(["Apple", "Banana"]);
  expect(screen.getByRole("toolbar", { name: "Fruits" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Remove Apple" }));
  await flush();
  expect(chips()).toEqual(["Banana"]);
});

test("Backspace in the empty input removes the last chip, and Escape with the list closed keeps them", async () => {
  render(<Fruits />);
  input("Fruits").focus();

  fireEvent.keyDown(input("Fruits"), { key: "Backspace" });
  await flush();
  expect(chips()).toEqual(["Apple"]);

  fireEvent.keyDown(input("Fruits"), { key: "Escape" });
  await flush();
  expect(chips()).toEqual(["Apple"]);
});

test("with chips, the content anchors to the box around them", async () => {
  render(<Fruits />);
  const toolbar = screen.getByRole("toolbar", { name: "Fruits" });
  toolbar.getBoundingClientRect = () =>
    DOMRect.fromRect({ height: 26, width: 280 });
  if (toolbar.parentElement === null) {
    throw new Error("The chips have no box");
  }
  toolbar.parentElement.getBoundingClientRect = () =>
    DOMRect.fromRect({ height: 36, width: 311 });

  await type("Fruits", "c");
  expect(content()?.style.getPropertyValue("--anchor-width")).toBe("311px");
});

test("chips sit straight in the chips box, so its insets can read them", () => {
  render(<Fruits />);
  const toolbar = screen.getByRole("toolbar", { name: "Fruits" });
  expect(toolbar.parentElement?.dataset.slot).toBe("input-group");
  expect(
    toolbar.querySelectorAll(":scope > [data-slot='combobox-chip']")
  ).toHaveLength(2);
});

test("in the creatable demo, Enter picks the first match or creates the text, and a comma adds it", async () => {
  render(<Tags />);

  await type("Tags", "eng");
  fireEvent.keyDown(input("Tags"), { key: "Enter" });
  await flush();
  expect(chips()).toEqual(["design", "engineering"]);

  await type("Tags", "foo");
  expect(screen.getByRole("option", { name: "Create “foo”" })).toBeTruthy();
  fireEvent.keyDown(input("Tags"), { key: "Enter" });
  await flush();
  expect(chips()).toEqual(["design", "engineering", "foo"]);

  await type("Tags", "bar");
  fireEvent.keyDown(input("Tags"), { key: "," });
  await flush();
  expect(chips()).toEqual(["design", "engineering", "foo", "bar"]);
  expect(input("Tags")).toHaveProperty("value", "");
});

test("Enter with the list open and nothing highlighted removes no chip and keeps the form from submitting", async () => {
  render(<Tags />);
  input("Tags").focus();
  fireEvent.click(input("Tags"));
  await flush();
  expect(content()).not.toBeNull();
  expect(document.querySelector("[data-highlighted]")).toBeNull();

  expect(fireEvent.keyDown(input("Tags"), { key: "Enter" })).toBe(false);
  await flush();
  expect(chips()).toEqual(["design"]);

  fireEvent.keyDown(input("Tags"), { key: "Escape" });
  await flush();
  expect(content()).toBeNull();
  expect(fireEvent.keyDown(input("Tags"), { key: "Enter" })).toBe(true);
});

function Department({ disabled = false, invalid = false }) {
  return (
    <Field disabled={disabled} invalid={invalid} name="fruit">
      <FieldLabel>Fruit</FieldLabel>
      <Combobox>
        <ComboboxInput triggerLabel="Show fruits" />
        <ComboboxContent>
          <FruitItems />
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Pick one.</FieldDescription>
    </Field>
  );
}

test("in a Field, the combobox takes its label, description, name and state, from the server's HTML on", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(<Department />);
  const label = server.querySelector("label");
  expect(
    server
      .querySelector(`#${CSS.escape(label?.htmlFor ?? "")}`)
      ?.getAttribute("role")
  ).toBe("combobox");

  const { rerender } = render(<Department />);
  const combobox = input("Fruit");
  expect(combobox.getAttribute("aria-describedby")).toBe(
    screen.getByText("Pick one.").id
  );
  expect(
    document.querySelector<HTMLElement>("[name='fruit']")?.dataset.slot
  ).toBe("combobox-form-input");
  expect(combobox.hasAttribute("aria-invalid")).toBe(false);

  rerender(<Department disabled invalid />);
  expect(combobox.getAttribute("aria-invalid")).toBe("true");
  expect(combobox.matches(":disabled")).toBe(true);
  expect(
    screen
      .getByRole("button", { hidden: true, name: "Show fruits" })
      .matches(":disabled")
  ).toBe(true);
});

test("an agent finds every control by name, and picks a value by label", async () => {
  render(
    <>
      <Fruit defaultValue="Banana" />
      <Produce />
      <Fruits />
    </>
  );

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries.map((entry) => entry.label);
  expect(new Set(labels).size, labels.join(", ")).toBe(labels.length);
  for (const label of [
    "Fruit",
    "Show fruits",
    "Clear fruit",
    "Show produce",
    "Fruits",
    "Remove Apple",
    "Remove Banana",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const picked = await agent.act({
    steps: [
      { action: "setValue", args: ["Cherry"], ref: "Fruit" },
      { action: "press", ref: "Remove Apple" },
    ],
  });
  expect(picked.ok, picked.error?.message).toBe(true);
  expect(input("Fruit")).toHaveProperty("value", "Cherry");
  expect(chips()).toEqual(["Banana"]);
});

test("an agent's pick reaches onValueChange as the agent's, and a cancel keeps the value", async () => {
  const seen: [string | null, string][] = [];
  render(
    <Fruit
      defaultValue="Banana"
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
  expect(seen).toEqual([["Cherry", "agent"]]);
  expect(input("Fruit")).toHaveProperty("value", "Banana");
});

test("an agent's open reaches onOpenChange as the agent's, and a cancel keeps the list closed", async () => {
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
  expect(input("Fruit").getAttribute("aria-expanded")).toBe("false");
  expect(content()).toBeNull();
});
