import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { ButtonGroup, ButtonGroupSeparator } from "./button-group";
import { ItemGroup, ItemSeparator } from "./item";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";
import { Separator } from "./separator";

const agent = createAgent();

test("a separator is announced with its orientation and carries it for styling", () => {
  render(
    <>
      <Separator />
      <Separator orientation="vertical" />
    </>
  );
  const [horizontal, vertical] = screen.getAllByRole("separator");

  expect(horizontal?.getAttribute("aria-orientation")).toBe("horizontal");
  expect(horizontal?.dataset).toMatchObject({
    orientation: "horizontal",
    slot: "separator",
  });
  expect(vertical?.getAttribute("aria-orientation")).toBe("vertical");
  expect(vertical?.dataset.orientation).toBe("vertical");
});

test("a decorative separator is hidden from screen readers", () => {
  const { container } = render(<Separator decorative />);

  expect(screen.queryByRole("separator")).toBeNull();
  expect(container.firstElementChild?.getAttribute("role")).toBe("none");
});

test("parts built on it keep the slot their groups read", () => {
  render(
    <>
      <ButtonGroup>
        <button type="button">Archive</button>
        <ButtonGroupSeparator />
        <button type="button">Snooze</button>
      </ButtonGroup>
      <ItemGroup>
        <div data-slot="item">Ada</div>
        <ItemSeparator />
        <div data-slot="item">Grace</div>
      </ItemGroup>
    </>
  );
  const [groupSeparator, itemSeparator] = screen.getAllByRole("separator");

  expect(groupSeparator?.getAttribute("aria-orientation")).toBe("vertical");
  expect(
    screen
      .getByRole("button", { name: "Snooze" })
      .matches("[data-slot='separator'] + *")
  ).toBe(true);
  expect(itemSeparator?.getAttribute("aria-orientation")).toBe("horizontal");
  expect(
    itemSeparator?.parentElement?.matches(":has(> [data-slot='separator'])")
  ).toBe(true);
});

test("an agent sees the controls around a separator by name, and not the separator", () => {
  render(
    <>
      <Popover>
        <PopoverTrigger>Filters</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Filters</PopoverTitle>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" />
      <Popover>
        <PopoverTrigger>Sort</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Sort</PopoverTitle>
        </PopoverContent>
      </Popover>
    </>
  );

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(components.map((entry) => entry.label)).toEqual(["Filters", "Sort"]);
});
