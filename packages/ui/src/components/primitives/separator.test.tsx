import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { ButtonGroup, ButtonGroupSeparator } from "./button-group";
import { Item, ItemGroup, ItemSeparator } from "./item";
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

test("a button group divides vertically and an item group horizontally", () => {
  render(
    <>
      <ButtonGroup>
        <button type="button">Archive</button>
        <ButtonGroupSeparator />
        <button type="button">Snooze</button>
      </ButtonGroup>
      <ItemGroup>
        <Item>Ada</Item>
        <ItemSeparator />
        <Item>Grace</Item>
      </ItemGroup>
    </>
  );
  const [groupSeparator, itemSeparator] = screen.getAllByRole("separator");

  expect(groupSeparator?.getAttribute("aria-orientation")).toBe("vertical");
  expect(itemSeparator?.getAttribute("aria-orientation")).toBe("horizontal");
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
  expect(components.map((entry) => entry.label)).toEqual(["Filters", "Sort"]);
});
