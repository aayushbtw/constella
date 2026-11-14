import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "./field";
import { Label } from "./label";
import { Switch } from "./switch";

const agent = createAgent();

function Settings() {
  return (
    <>
      <Label>
        <Switch size="sm" />
        Airplane mode
      </Label>
      <Label>
        <Switch defaultChecked name="digest" />
        Weekly digest
      </Label>
      <Label>
        <Switch disabled />
        Security alerts
      </Label>
    </>
  );
}

test("the size reaches the track, and the thumb carries the state its styles key on", () => {
  render(<Settings />);
  const airplane = screen.getByRole("switch", { name: "Airplane mode" });
  const thumb = airplane.querySelector("[data-slot='switch-thumb']");
  expect(airplane.dataset).toMatchObject({ size: "sm", slot: "switch" });
  expect(thumb?.matches("[data-unchecked]")).toBe(true);

  fireEvent.click(airplane);

  expect(airplane.getAttribute("aria-checked")).toBe("true");
  expect(thumb?.matches("[data-checked]")).toBe(true);
});

test("clicking the label toggles it, and a disabled one stays put", () => {
  render(<Settings />);
  fireEvent.click(screen.getByText("Weekly digest"));
  expect(
    screen
      .getByRole("switch", { name: "Weekly digest" })
      .getAttribute("aria-checked")
  ).toBe("false");

  const alerts = screen.getByRole("switch", { name: "Security alerts" });
  fireEvent.click(alerts);
  expect(alerts.getAttribute("aria-checked")).toBe("false");
  expect(alerts.matches("[data-disabled]")).toBe(true);
});

test("a Field names, describes, disables and invalidates its switch, and its card label toggles it", () => {
  render(
    <>
      <Field>
        <FieldLabel>
          <FieldContent>
            <FieldTitle>Mentions</FieldTitle>
            <FieldDescription>When someone mentions you.</FieldDescription>
          </FieldContent>
          <Switch />
        </FieldLabel>
      </Field>
      <Field disabled orientation="horizontal">
        <Switch />
        <FieldLabel>Push</FieldLabel>
      </Field>
      <Field invalid orientation="horizontal">
        <Switch />
        <FieldLabel>Accept terms</FieldLabel>
      </Field>
    </>
  );
  const mentions = screen.getByRole("switch", { name: /Mentions/u });
  expect(mentions.getAttribute("aria-describedby")).toBe(
    screen.getByText("When someone mentions you.").id
  );
  fireEvent.click(screen.getByText("When someone mentions you."));
  expect(mentions.getAttribute("aria-checked")).toBe("true");

  const push = screen.getByRole("switch", { name: "Push" });
  expect(push.matches(":disabled[data-disabled]")).toBe(true);
  fireEvent.click(screen.getByText("Push"));
  expect(push.getAttribute("aria-checked")).toBe("false");

  const terms = screen.getByRole("switch", { name: "Accept terms" });
  expect(terms.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
});

test("an agent finds every switch by its label and sets it", async () => {
  render(<Settings />);

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = components.map((entry) => entry.label);
  for (const label of ["Airplane mode", "Weekly digest", "Security alerts"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [
      { action: "setChecked", args: [true], ref: "Airplane mode" },
      { action: "setChecked", args: [false], ref: "Weekly digest" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen
      .getByRole("switch", { name: "Airplane mode" })
      .getAttribute("aria-checked")
  ).toBe("true");
  expect(
    screen
      .getByRole("switch", { name: "Weekly digest" })
      .getAttribute("aria-checked")
  ).toBe("false");
});
