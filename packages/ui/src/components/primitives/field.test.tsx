import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Checkbox } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./field";
import { Input } from "./input";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const agent = createAgent();

function Payment() {
  return (
    <form>
      <FieldSet>
        <FieldLegend variant="label">Payment Method</FieldLegend>
        <FieldDescription>All transactions are secure</FieldDescription>
        <FieldGroup>
          <Field name="card">
            <FieldLabel>Card Number</FieldLabel>
            <Input required />
            <FieldDescription>Enter your 16-digit card number</FieldDescription>
          </Field>
          <Field disabled>
            <FieldLabel>Email</FieldLabel>
            <Input />
          </Field>
          <Field invalid>
            <FieldLabel>Comments</FieldLabel>
            <Textarea />
            <FieldError>Too short.</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldContent>
              <FieldLabel>Accept terms</FieldLabel>
              <FieldDescription>You agree to the terms.</FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>Mentions</FieldTitle>
                <FieldDescription>When someone mentions you.</FieldDescription>
              </FieldContent>
              <Switch />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

test("the legend names the set and its description describes it", async () => {
  render(<Payment />);
  const set = screen.getByRole("group", { name: "Payment Method" });
  expect(set.dataset).toMatchObject({ slot: "field-set" });
  await waitFor(() => {
    expect(set.getAttribute("aria-describedby")).toBe(
      screen.getByText("All transactions are secure").id
    );
  });
  expect(screen.getByText("Payment Method").dataset).toMatchObject({
    slot: "field-legend",
    variant: "label",
  });
});

test("a field names, describes, disables and invalidates its control, and lays out by orientation", () => {
  render(<Payment />);
  const card = screen.getByRole("textbox", { name: "Card Number" });
  expect(card.getAttribute("aria-describedby")).toBe(
    screen.getByText("Enter your 16-digit card number").id
  );
  expect(card.getAttribute("name")).toBe("card");
  expect(
    card.closest<HTMLElement>("[data-slot='field']")?.dataset.orientation
  ).toBe("vertical");

  const email = screen.getByRole("textbox", { name: "Email" });
  expect(email.matches(":disabled[data-disabled]")).toBe(true);
  expect(screen.getByText("Email").matches("[data-disabled]")).toBe(true);

  const comments = screen.getByRole("textbox", { name: "Comments" });
  expect(comments.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
  expect(screen.getByText("Too short.").dataset).toMatchObject({
    slot: "field-error",
  });
  expect(comments.getAttribute("aria-describedby")).toContain(
    screen.getByText("Too short.").id
  );

  for (const control of [card, email]) {
    expect(control.hasAttribute("aria-invalid"), control.id).toBe(false);
  }
});

test("pressing a label, or the description in a card label, toggles its control", () => {
  render(<Payment />);
  const terms = screen.getByRole("checkbox", { name: "Accept terms" });
  expect(terms.getAttribute("aria-describedby")).toBe(
    screen.getByText("You agree to the terms.").id
  );
  fireEvent.click(screen.getByText("Accept terms"));
  expect(terms.getAttribute("aria-checked")).toBe("true");

  const mentions = screen.getByRole("switch", { name: /Mentions/u });
  fireEvent.click(screen.getByText("When someone mentions you."));
  expect(mentions.getAttribute("aria-checked")).toBe("true");
});

function Errors({ errors }: { errors: { message?: string }[] }) {
  return (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <Input />
      <FieldError errors={errors} />
    </Field>
  );
}

test("errors from a form library show once each, several as a list, none as nothing", () => {
  const { rerender } = render(
    <Errors errors={[{ message: "Taken." }, { message: "Taken." }]} />
  );
  expect(screen.getAllByText("Taken.")).toHaveLength(1);

  rerender(
    <Errors errors={[{ message: "Taken." }, { message: "Too long." }]} />
  );
  expect(
    screen.getAllByRole("listitem").map((item) => item.textContent)
  ).toEqual(["Taken.", "Too long."]);

  rerender(<Errors errors={[]} />);
  expect(document.querySelector("[data-slot='field-error']")).toBeNull();
});

test("an agent finds every control in the set by its label", () => {
  render(<Payment />);
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
    "Card Number",
    "Email",
    "Comments",
    "Accept terms",
    expect.stringContaining("Mentions"),
  ]);
});
