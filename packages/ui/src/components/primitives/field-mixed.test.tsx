import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vite-plus/test";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox";
import { Field, FieldDescription, FieldLabel } from "./field";

function Fruit({ disabled = false, invalid = false }) {
  return (
    <Field disabled={disabled} invalid={invalid} name="fruit">
      <FieldLabel>Fruit</FieldLabel>
      <Combobox items={["Apple"]}>
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Pick one.</FieldDescription>
    </Field>
  );
}

test("a Combobox in a ui-sdk Field takes its label, description and state, from the server's HTML on", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(<Fruit />);
  const label = server.querySelector("label");
  expect(
    server
      .querySelector(`#${CSS.escape(label?.htmlFor ?? "")}`)
      ?.getAttribute("role")
  ).toBe("combobox");

  const { rerender } = render(<Fruit />);
  const input = screen.getByRole("combobox", { name: "Fruit" });
  expect(input.getAttribute("aria-describedby")).toBe(
    screen.getByText("Pick one.").id
  );
  expect(document.querySelector("input[name='fruit']")).not.toBeNull();
  expect(input.hasAttribute("aria-invalid")).toBe(false);

  rerender(<Fruit disabled invalid />);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.matches(":disabled")).toBe(true);
  expect(
    screen.getByRole("button", { hidden: true }).matches(":disabled")
  ).toBe(true);
});
