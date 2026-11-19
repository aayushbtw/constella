import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vite-plus/test";

import { Field, FieldDescription, FieldLabel } from "./field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

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

test("a Select in a ui-sdk Field takes its label, description, name and state, from the server's HTML on", () => {
  const html = renderToString(<Department />);
  const server = document.createElement("div");
  server.innerHTML = html;
  const label = server.querySelector("label");
  expect(
    server
      .querySelector(`#${CSS.escape(label?.htmlFor ?? "")}`)
      ?.getAttribute("role")
  ).toBe("combobox");

  const { rerender } = render(<Department />);
  const trigger = screen.getByRole("combobox", { name: "Department" });
  expect(trigger.getAttribute("aria-describedby")).toBe(
    screen.getByText("Where you work.").id
  );
  expect(document.querySelector("input[name='department']")).not.toBeNull();
  for (const attribute of ["aria-invalid", "data-invalid", "disabled"]) {
    expect(trigger.hasAttribute(attribute), attribute).toBe(false);
  }

  rerender(<Department disabled invalid />);
  expect(trigger.matches(":disabled[data-disabled]")).toBe(true);
  expect(trigger.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
});
