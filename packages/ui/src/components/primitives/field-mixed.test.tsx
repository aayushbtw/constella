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
import { Slider, SliderControl, SliderThumb, SliderTrack } from "./slider";

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

function Price({ disabled = false, invalid = false }) {
  return (
    <Field disabled={disabled} invalid={invalid} name="price">
      <FieldDescription>Set your budget.</FieldDescription>
      <Slider aria-label="Price" defaultValue={[2, 8]} max={10}>
        <SliderControl>
          <SliderTrack>
            <SliderThumb index={0} />
            <SliderThumb index={1} />
          </SliderTrack>
        </SliderControl>
      </Slider>
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

test("a Slider in a ui-sdk Field takes its description, name and state on its group", () => {
  const { rerender } = render(<Price />);
  const slider = screen.getByRole("group", { name: "Price" });
  expect(slider.getAttribute("aria-describedby")).toBe(
    screen.getByText("Set your budget.").id
  );
  expect(document.querySelectorAll("input[name='price']")).not.toHaveLength(0);
  expect(slider.dataset.disabled).toBeUndefined();

  rerender(<Price disabled invalid />);
  expect(slider.matches("[data-disabled]")).toBe(true);
  expect(slider.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
  for (const thumb of screen.getAllByRole("slider")) {
    expect(thumb.matches(":disabled")).toBe(true);
  }
});
