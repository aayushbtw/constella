import * as stylex from "@stylexjs/stylex";
import { render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vite-plus/test";

import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  HoverCard,
  HoverCardTrigger,
} from "@/components/primitives/hover-card";
import { Item } from "@/components/primitives/item";
import { Popover, PopoverTrigger } from "@/components/primitives/popover";
import {
  createSidePanelController,
  SidePanel,
  SidePanelTrigger,
} from "@/components/primitives/side-panel";

const s = stylex.create({
  grid: { display: "grid" },
});

const panel = createSidePanelController<string>();

function display(element: HTMLElement) {
  return getComputedStyle(element).display;
}

test("an Item rendered through a trigger keeps the Item's look on the button", () => {
  render(
    <SidePanel controller={panel}>
      <Item render={<SidePanelTrigger controller={panel} payload="x" />}>
        Row
      </Item>
    </SidePanel>
  );

  expect(display(screen.getByRole("button", { name: "Row" }))).toBe("flex");
});

test("sx on the part that draws wins over that part's own styles", () => {
  render(
    <SidePanel controller={panel}>
      <Item
        render={<SidePanelTrigger controller={panel} payload="x" />}
        sx={s.grid}
      >
        Row
      </Item>
    </SidePanel>
  );

  expect(display(screen.getByRole("button", { name: "Row" }))).toBe("grid");
});

test("a Badge rendered as a DOM link keeps the Badge's look", () => {
  render(
    <Badge
      // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the badge renders its children into the link
      render={<a href="#top" />}
    >
      New
    </Badge>
  );

  expect(display(screen.getByRole("link", { name: "New" }))).toBe(
    "inline-flex"
  );
});

describe("two parts styling one element throw", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("an Item over a trigger with its own sx", () => {
    expect(() =>
      render(
        <SidePanel controller={panel}>
          <Item
            render={
              <SidePanelTrigger controller={panel} payload="x" sx={s.grid} />
            }
          >
            Row
          </Item>
        </SidePanel>
      )
    ).toThrow();
  });

  test("a trigger with sx over a Button", () => {
    expect(() =>
      render(
        <Popover>
          <PopoverTrigger render={<Button />} sx={s.grid}>
            Open
          </PopoverTrigger>
        </Popover>
      )
    ).toThrow();
  });

  test("a Badge over a Hover Card trigger with its own sx", () => {
    expect(() =>
      render(
        <HoverCard>
          <Badge render={<HoverCardTrigger href="#top" sx={s.grid} />}>
            @acme
          </Badge>
        </HoverCard>
      )
    ).toThrow();
  });
});
