import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Slider, SliderControl } from "./slider";
import { Switch } from "./switch";

const agent = createAgent();

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Cherry", value: "cherry" },
];

function Settings() {
  return (
    <>
      <Label htmlFor="speed">Shipping speed</Label>
      <RadioGroup defaultValue="standard" id="speed">
        <Label>
          <RadioGroupItem value="standard" />
          Standard
        </Label>
        <Label>
          <RadioGroupItem value="express" />
          Express
        </Label>
      </RadioGroup>
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
      <Label htmlFor="volume">Volume</Label>
      <Slider defaultValue={40} id="volume">
        <SliderControl />
      </Slider>
      <Label htmlFor="fruit">Fruit</Label>
      <Select items={fruits} placeholder="Pick one">
        <SelectTrigger id="fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms</Label>
    </>
  );
}

test("a press on the label reaches the control it names", () => {
  render(<Settings />);
  const label = screen.getByText("Shipping speed");
  expect(label.dataset.slot).toBe("label");

  fireEvent.click(label);
  expect(document.activeElement).toBe(
    screen.getByRole("radio", { name: "Standard" })
  );

  fireEvent.click(screen.getByText("Airplane mode"));
  expect(
    screen
      .getByRole("switch", { name: "Airplane mode" })
      .getAttribute("aria-checked")
  ).toBe("true");
});

test("an agent finds every control a Label names and changes it", async () => {
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
  for (const label of [
    "Shipping speed",
    "Airplane mode",
    "Volume",
    "Fruit",
    "Accept terms",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [
      { action: "setValue", args: ["express"], ref: "Shipping speed" },
      { action: "setChecked", args: [true], ref: "Airplane mode" },
      { action: "setValue", args: [65], ref: "Volume" },
      { action: "setValue", args: ["Cherry"], ref: "Fruit" },
      { action: "setChecked", args: [true], ref: "Accept terms" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole("radio", { name: "Express" }).getAttribute("aria-checked")
  ).toBe("true");
  expect(
    screen
      .getByRole("switch", { name: "Airplane mode" })
      .getAttribute("aria-checked")
  ).toBe("true");
  expect(screen.getByRole("slider", { name: "Volume" })).toHaveProperty(
    "value",
    "65"
  );
  expect(screen.getByRole("combobox", { name: "Fruit" }).textContent).toContain(
    "Cherry"
  );
  expect(
    screen
      .getByRole("checkbox", { name: "Accept terms" })
      .getAttribute("aria-checked")
  ).toBe("true");
});
