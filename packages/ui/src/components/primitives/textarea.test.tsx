import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Textarea } from "./textarea";

const agent = createAgent();

function Feedback() {
  return (
    <>
      <Field name="feedback">
        <FieldLabel>Feedback</FieldLabel>
        <Textarea size="sm" />
        <FieldDescription>Only the team sees this.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel>Reply</FieldLabel>
        <Textarea defaultValue="Replies are closed." />
      </Field>
      <Field invalid>
        <FieldLabel>Review</FieldLabel>
        <Textarea />
        <FieldError>Write at least 20 characters.</FieldError>
      </Field>
      <Textarea aria-label="Message" />
    </>
  );
}

test("a field names, describes, disables and invalidates its textarea", () => {
  render(<Feedback />);
  const feedback = screen.getByRole("textbox", { name: "Feedback" });
  expect(feedback.dataset).toMatchObject({ size: "sm", slot: "textarea" });
  expect(feedback.getAttribute("name")).toBe("feedback");
  expect(feedback.getAttribute("aria-describedby")).toBe(
    screen.getByText("Only the team sees this.").id
  );

  const reply = screen.getByRole("textbox", { name: "Reply" });
  expect(reply.matches(":disabled[data-disabled]")).toBe(true);

  const review = screen.getByRole("textbox", { name: "Review" });
  expect(review.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
  expect(review.getAttribute("aria-describedby")).toContain(
    screen.getByText("Write at least 20 characters.").id
  );

  const message = screen.getByRole("textbox", { name: "Message" });
  expect(message.dataset).toMatchObject({ size: "default" });
  for (const attribute of ["aria-invalid", "data-invalid", "data-disabled"]) {
    expect(message.hasAttribute(attribute), attribute).toBe(false);
  }
});

test("an agent finds every textarea by its label and fills it", async () => {
  render(<Feedback />);
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
    "Feedback",
    "Reply",
    "Review",
    "Message",
  ]);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["Great docs."], ref: "Feedback" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Feedback" }).value
  ).toBe("Great docs.");
});
