import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { Checkbox } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
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
