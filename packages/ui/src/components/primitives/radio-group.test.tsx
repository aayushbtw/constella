import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

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
import { RadioGroup, RadioGroupItem } from "./radio-group";

const agent = createAgent();

function Settings() {
  return (
    <>
      <RadioGroup aria-label="Density" defaultValue="comfortable">
        <Label>
          <RadioGroupItem size="sm" value="default" />
          Default
        </Label>
        <Label>
          <RadioGroupItem value="comfortable" />
          Comfortable
        </Label>
        <Label>
          <RadioGroupItem value="compact" />
          Compact
        </Label>
      </RadioGroup>
      <FieldSet>
        <FieldLegend id="plan-legend" variant="label">
          Plan
        </FieldLegend>
        <RadioGroup aria-labelledby="plan-legend" defaultValue="plus">
          <Field>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>Plus</FieldTitle>
                <FieldDescription>For small teams.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="plus" />
            </FieldLabel>
          </Field>
          <Field>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>Pro</FieldTitle>
                <FieldDescription>For growing businesses.</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="pro" />
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <RadioGroup aria-label="Backups" defaultValue="daily">
        <Field disabled orientation="horizontal">
          <RadioGroupItem value="hourly" />
          <FieldLabel>Hourly</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="daily" />
          <FieldLabel>Daily</FieldLabel>
        </Field>
        <Field invalid orientation="horizontal">
          <RadioGroupItem value="weekly" />
          <FieldLabel>Weekly</FieldLabel>
        </Field>
      </RadioGroup>
    </>
  );
}

test("the group and items carry their slots and size, and the dot shows on the checked one", () => {
  render(<Settings />);
  expect(
    screen.getByRole("radiogroup", { name: "Plan" }).dataset
  ).toMatchObject({ slot: "radio-group" });
  const small = screen.getByRole("radio", { name: "Default" });
  expect(small.dataset).toMatchObject({ size: "sm", slot: "radio" });
  const comfortable = screen.getByRole("radio", { name: "Comfortable" });
  expect(
    comfortable.querySelector("[data-slot='radio-indicator'][data-checked]")
  ).not.toBeNull();
  expect(small.querySelector("[data-slot='radio-indicator']")).toBeNull();
});

test("arrow keys move the choice, and a label or a card's description picks one", () => {
  render(<Settings />);
  const comfortable = screen.getByRole("radio", { name: "Comfortable" });
  fireEvent.keyDown(comfortable, { key: "ArrowDown" });
  expect(
    screen.getByRole("radio", { name: "Compact" }).getAttribute("aria-checked")
  ).toBe("true");

  fireEvent.click(screen.getByText("Default"));
  expect(
    screen.getByRole("radio", { name: "Default" }).getAttribute("aria-checked")
  ).toBe("true");

  fireEvent.click(screen.getByText("For growing businesses."));
  const pro = screen.getByRole("radio", { name: /Pro/u });
  expect(pro.getAttribute("aria-checked")).toBe("true");
  expect(pro.getAttribute("aria-describedby")).toBe(
    screen.getByText("For growing businesses.").id
  );
});

test("a disabled field skips its item, and an invalid one marks it", () => {
  render(<Settings />);
  const hourly = screen.getByRole("radio", { name: "Hourly" });
  expect(hourly.matches(":disabled[data-disabled]")).toBe(true);
  fireEvent.keyDown(screen.getByRole("radio", { name: "Daily" }), {
    key: "ArrowUp",
  });
  expect(hourly.getAttribute("aria-checked")).toBe("false");

  const weekly = screen.getByRole("radio", { name: "Weekly" });
  expect(weekly.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
  expect(
    screen.getByRole("radio", { name: "Daily" }).hasAttribute("aria-invalid")
  ).toBe(false);
});

test("an agent finds every group by its name and picks a choice", async () => {
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
    "Density",
    "Plan",
    "Backups",
  ]);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["pro"], ref: "Plan" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole("radio", { name: /Pro/u }).getAttribute("aria-checked")
  ).toBe("true");
});
