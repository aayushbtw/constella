import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";

import { Field, FieldDescription, FieldLabel } from "./field";
import { InputGroup, InputGroupInput } from "./input-group";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "./slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const agent = createAgent();

function Volume() {
  return (
    <Field>
      <Slider defaultValue={40}>
        <FieldLabel>Volume</FieldLabel>
        <SliderValue />
        <SliderControl />
      </Slider>
      <FieldDescription>How loud it plays.</FieldDescription>
    </Field>
  );
}

function Price({ disabled = false, invalid = false } = {}) {
  return (
    <Field disabled={disabled} invalid={invalid} name="price">
      <FieldLabel>Price</FieldLabel>
      <FieldDescription>Set your budget.</FieldDescription>
      <Slider defaultValue={[20, 80]}>
        <SliderValue />
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb aria-label="Minimum price" index={0} />
            <SliderThumb aria-label="Maximum price" index={1} />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>
  );
}

function Stops() {
  return (
    <Slider aria-label="Stops" defaultValue={[10, 40, 70]} step={10}>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="First stop" index={0} />
          <SliderThumb aria-label="Second stop" index={1} />
          <SliderThumb aria-label="Third stop" index={2} />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}

function Bass() {
  return (
    <Slider defaultValue={60} orientation="vertical">
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Bass" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}

function Opacity() {
  return (
    <Slider defaultValue={100}>
      <Field>
        <FieldLabel>Opacity</FieldLabel>
        <InputGroup size="sm">
          <InputGroupInput defaultValue="100" type="number" />
        </InputGroup>
      </Field>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb aria-label="Opacity" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}

function TooltipVolume() {
  return (
    <Field>
      <Slider defaultValue={40} format={{ style: "unit", unit: "percent" }}>
        <FieldLabel>Volume</FieldLabel>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <Tooltip closeOnPress={false} delay={0} type="description">
              <TooltipTrigger render={<SliderThumb />} />
              <TooltipContent>
                <SliderValue />
              </TooltipContent>
            </Tooltip>
          </SliderTrack>
        </SliderControl>
      </Slider>
    </Field>
  );
}

function wiring(root: ParentNode) {
  const label = root.querySelector("label");
  const thumb = root.querySelector("input[type='range']");
  return {
    describedBy: thumb?.getAttribute("aria-describedby"),
    description: root.querySelector("[data-slot='field-description']")?.id,
    for: label?.htmlFor,
    labelId: label?.id,
    labelledBy: thumb?.getAttribute("aria-labelledby"),
    thumbId: thumb?.id,
  };
}

test("a single slider in a Field is named by the label and described by the description, from the server's HTML on", () => {
  const html = renderToString(<Volume />);
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = html;
  const server = wiring(container);
  expect(server.thumbId).toBeTruthy();
  expect(server.for).toBe(server.thumbId);
  expect(server.labelledBy).toBe(server.labelId);
  expect(server.describedBy).toBe(server.description);

  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  render(<Volume />, { container, hydrate: true });
  expect(error).not.toHaveBeenCalled();
  error.mockRestore();
  expect(wiring(container)).toEqual(server);

  const thumb = screen.getByRole("slider", { name: "Volume" });
  expect(thumb.getAttribute("aria-describedby")).toBe(
    screen.getByText("How loud it plays.").id
  );
});

test("a range in a Field names and describes the group, and each thumb by its own aria-label", () => {
  render(<Price />);
  const group = screen.getByRole("group", { name: "Price" });
  expect(group.getAttribute("aria-describedby")).toBe(
    screen.getByText("Set your budget.").id
  );
  for (const name of ["Minimum price", "Maximum price"]) {
    const thumb = screen.getByRole("slider", { name });
    expect(thumb.hasAttribute("aria-describedby"), name).toBe(false);
  }
});

test("a Field's disabled, invalid and name reach the slider", () => {
  const { rerender } = render(<Price />);
  const group = screen.getByRole("group", { name: "Price" });
  const hidden = document.querySelector("input[type='hidden'][name='price']");
  expect(hidden?.getAttribute("value")).toBe("20/80");
  expect(Object.hasOwn(group.dataset, "disabled")).toBe(false);
  expect(group.hasAttribute("aria-invalid")).toBe(false);
  for (const thumb of screen.getAllByRole("slider")) {
    expect(thumb.matches(":disabled")).toBe(false);
  }

  rerender(<Price disabled invalid />);
  expect(group.matches("[data-disabled]")).toBe(true);
  expect(group.matches("[aria-invalid='true'][data-invalid]")).toBe(true);
  for (const thumb of screen.getAllByRole("slider")) {
    expect(thumb.matches(":disabled")).toBe(true);
  }
});

test.each<[string, () => ReactNode, string[]]>([
  ["a Field's label", Volume, ["Volume"]],
  ["a range's thumb labels", Price, ["Minimum price", "Maximum price"]],
  [
    "thumb labels without a Field",
    Stops,
    ["First stop", "Second stop", "Third stop"],
  ],
  ["a vertical thumb's label", Bass, ["Bass"]],
  ["its own label beside an input's Field", Opacity, ["Opacity"]],
  ["the Field's label under a description tooltip", TooltipVolume, ["Volume"]],
])("every thumb is named by %s", (_, Demo, names) => {
  render(<Demo />);
  const thumbs = screen.getAllByRole("slider");
  expect(thumbs).toHaveLength(names.length);
  for (const [index, name] of names.entries()) {
    expect(thumbs[index]).toBe(screen.getByRole("slider", { name }));
  }
});

test("the input demo's Field names the input, and no id repeats", () => {
  render(<Opacity />);
  expect(screen.getByRole("spinbutton", { name: "Opacity" })).toBeTruthy();
  const ids = [...document.querySelectorAll("[id]")].map(
    (element) => element.id
  );
  expect(new Set(ids).size).toBe(ids.length);
});

test("format drives both the shown value and what the thumb announces", () => {
  render(
    <Field>
      <Slider defaultValue={20} format={{ style: "unit", unit: "gigabyte" }}>
        <FieldLabel>Storage</FieldLabel>
        <SliderValue />
        <SliderControl />
      </Slider>
    </Field>
  );
  const thumb = screen.getByRole("slider", { name: "Storage" });
  expect(thumb.getAttribute("aria-valuetext")).toBe("20 GB");
  expect(
    document.querySelector("[data-slot='slider-value']")?.textContent
  ).toBe("20 GB");
});

test("an agent names every slider and sets a value", async () => {
  render(
    <>
      <Volume />
      <Price />
      <Stops />
      <Bass />
    </>
  );
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries.map((entry) => entry.label);
  for (const label of ["Volume", "Price", "Stops", "Bass"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [{ action: "setValue", args: [65], ref: "Volume" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(screen.getByRole("slider", { name: "Volume" })).toHaveProperty(
    "value",
    "65"
  );
});

// ui-sdk 0.1.0-beta.13 names a tooltip from its trigger, and this trigger is the thumb, whose name sits on its inner input.
test("the Tooltip demo's open tooltip is unnamed in the snapshot", () => {
  render(<TooltipVolume />);
  const thumb = screen.getByRole("slider", { name: "Volume" }).parentElement;
  if (thumb === null) {
    throw new Error("the thumb renders");
  }
  act(() => {
    fireEvent.pointerEnter(thumb, { pointerType: "mouse" });
  });

  expect(screen.getByRole("tooltip").textContent).toBe("40%");
  expect(
    agent
      .snapshot()
      .filter((entry) => entry.component === "tooltip")
      .map(({ component, label, open }) => ({ component, label, open }))
  ).toEqual([{ component: "tooltip", label: undefined, open: true }]);
});

test("the thumb and slider carry their slots, and data-dragging while pressed", () => {
  render(<Bass />);
  const group = screen.getByRole("group");
  const control = document.querySelector("[data-slot='slider-control']");
  const thumb = screen.getByRole("slider", { name: "Bass" }).parentElement;
  expect(group.dataset.slot).toBe("slider");
  expect(thumb?.dataset.slot).toBe("slider-thumb");
  for (const slot of ["slider-track", "slider-indicator"]) {
    expect(document.querySelector(`[data-slot='${slot}']`), slot).toBeTruthy();
  }
  if (control === null || thumb === null) {
    throw new Error("the control and thumb render");
  }

  const pointer = { button: 0, clientX: 5, clientY: 50, pointerId: 1 };
  act(() => {
    fireEvent.pointerDown(control, pointer);
  });
  expect(Object.hasOwn(thumb.dataset, "dragging")).toBe(true);
  expect(Object.hasOwn(group.dataset, "dragging")).toBe(true);
  act(() => {
    fireEvent.pointerUp(control, pointer);
  });
  expect(Object.hasOwn(thumb.dataset, "dragging")).toBe(false);
});
