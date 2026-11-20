import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { Checkbox, CheckboxGroup } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./field";
import { Label } from "./label";

const agent = createAgent();

function Settings() {
  return (
    <>
      <Label>
        <Checkbox defaultChecked />
        Accept terms
      </Label>
      <Field orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Marketing emails</FieldLabel>
          <FieldDescription>Once a month.</FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>
          <Checkbox />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
          </FieldContent>
        </FieldLabel>
      </Field>
      <Field disabled orientation="horizontal">
        <Checkbox />
        <FieldLabel>Push notifications</FieldLabel>
      </Field>
      <Field invalid orientation="horizontal">
        <Checkbox />
        <FieldLabel>Share usage data</FieldLabel>
      </Field>
      <Checkbox aria-label="Select row" />
    </>
  );
}

test("a Field's label and description reach the checkbox, and so do its disabled and invalid state", () => {
  render(<Settings />);

  const marketing = screen.getByRole("checkbox", { name: "Marketing emails" });
  expect(marketing.getAttribute("aria-describedby")).toBe(
    screen.getByText("Once a month.").id
  );
  fireEvent.click(screen.getByText("Marketing emails"));
  expect(marketing.getAttribute("aria-checked")).toBe("true");

  const card = screen.getByRole("checkbox", { name: "Enable notifications" });
  fireEvent.click(screen.getByText("Enable notifications"));
  expect(card.getAttribute("aria-checked")).toBe("true");

  const push = screen.getByRole("checkbox", { name: "Push notifications" });
  expect(push.matches("[data-disabled]")).toBe(true);
  fireEvent.click(push);
  expect(push.getAttribute("aria-checked")).toBe("false");

  const usage = screen.getByRole("checkbox", { name: "Share usage data" });
  expect(usage.getAttribute("aria-invalid")).toBe("true");
  expect(usage.matches("[data-invalid]")).toBe(true);

  const terms = screen.getByRole("checkbox", { name: "Accept terms" });
  for (const attribute of [
    "aria-invalid",
    "data-invalid",
    "data-disabled",
    "aria-describedby",
  ]) {
    expect(terms.hasAttribute(attribute), attribute).toBe(false);
  }
});

function SelectAll() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(
    "indeterminate"
  );
  return (
    <Label>
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      {`Select all: ${String(checked)}`}
    </Label>
  );
}

test("an indeterminate checkbox carries what the dash keys on, and a click checks it", () => {
  render(<SelectAll />);
  const checkbox = screen.getByRole("checkbox");
  expect(checkbox.getAttribute("aria-checked")).toBe("mixed");
  expect(checkbox.matches("[data-indeterminate]")).toBe(true);

  fireEvent.click(checkbox);

  expect(screen.getByText("Select all: true")).toBeTruthy();
  expect(checkbox.matches("[data-checked]:not([data-indeterminate])")).toBe(
    true
  );
});

test("an agent finds every checkbox by its label and changes it", async () => {
  render(<Settings />);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toEqual([
    "Accept terms",
    "Marketing emails",
    "Enable notifications",
    "Push notifications",
    "Share usage data",
    "Select row",
  ]);

  const result = await agent.act({
    steps: [
      { action: "setChecked", args: [false], ref: "Accept terms" },
      { action: "setChecked", args: [true], ref: "Marketing emails" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen
      .getByRole("checkbox", { name: "Accept terms" })
      .getAttribute("aria-checked")
  ).toBe("false");
  expect(
    screen
      .getByRole("checkbox", { name: "Marketing emails" })
      .getAttribute("aria-checked")
  ).toBe("true");
});

const fruits = ["apples", "oranges", "pears"];

function Fruits() {
  const [value, setValue] = useState(["apples"]);
  return (
    <FieldSet>
      <FieldLegend id="fruits-legend">Fruits</FieldLegend>
      <FieldDescription id="fruits-description">Pick any.</FieldDescription>
      <CheckboxGroup
        allValues={fruits}
        aria-describedby="fruits-description"
        aria-labelledby="fruits-legend"
        onValueChange={setValue}
        value={value}
      >
        <Label>
          <Checkbox parent />
          All fruits
        </Label>
        {fruits.map((fruit) => (
          <Label key={fruit}>
            <Checkbox value={fruit} />
            {`Pick ${fruit}`}
          </Label>
        ))}
      </CheckboxGroup>
      <output>{value.join(",")}</output>
    </FieldSet>
  );
}

test("a parent checkbox is mixed from its group on the first render, and checks or clears every child", async () => {
  render(<Fruits />);
  const [set, group] = screen.getAllByRole("group", { name: "Fruits" });
  expect(set?.dataset.slot).toBe("field-set");
  expect(group?.dataset.slot).toBe("checkbox-group");
  expect(group?.getAttribute("aria-describedby")).toBe("fruits-description");

  const parent = screen.getByRole("checkbox", { name: "All fruits" });
  expect(parent.getAttribute("aria-checked")).toBe("mixed");
  expect(parent.matches("[data-indeterminate]")).toBe(true);
  await waitFor(() => {
    expect(parent.getAttribute("aria-controls")?.split(" ")).toEqual(
      fruits.map(
        (fruit) => screen.getByRole("checkbox", { name: `Pick ${fruit}` }).id
      )
    );
  });

  fireEvent.click(parent);
  expect(screen.getByRole("status").textContent).toBe(fruits.join(","));
  expect(parent.getAttribute("aria-checked")).toBe("true");

  fireEvent.click(screen.getByText("Pick oranges"));
  expect(screen.getByRole("status").textContent).toBe("apples,pears");
  expect(parent.getAttribute("aria-checked")).toBe("mixed");

  fireEvent.click(parent);
  fireEvent.click(parent);
  expect(screen.getByRole("status").textContent).toBe("");
  expect(parent.getAttribute("aria-checked")).toBe("false");
});

test("an agent finds the parent and each child by its label and checks them", async () => {
  render(<Fruits />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(
    entries.map((entry) => [entry.component, entry.label, entry.actions])
  ).toEqual([
    ["checkbox", "All fruits", ["setChecked"]],
    ["checkbox", "Pick apples", ["setChecked"]],
    ["checkbox", "Pick oranges", ["setChecked"]],
    ["checkbox", "Pick pears", ["setChecked"]],
    ["checkbox", "Fruits", ["setValue", "setAll"]],
  ]);

  const group = await agent.act({
    steps: [{ action: "setValue", args: [["pears"]], ref: "Fruits" }],
  });
  expect(group.ok, group.error?.message).toBe(true);
  expect(screen.getByRole("status").textContent).toBe("pears");

  const result = await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "All fruits" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(screen.getByRole("status").textContent).toBe(fruits.join(","));
});
