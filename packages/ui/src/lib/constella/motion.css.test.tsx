import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { settle } from "@ui-sdk/core/testing";
import type { ReactElement } from "react";
import { expect, test } from "vite-plus/test";

import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerItem,
  ModelPickerTrigger,
} from "@/components/ai/model-picker";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/primitives/alert-dialog";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/primitives/combobox";
import { CommandInput, CommandList } from "@/components/primitives/command";
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from "@/components/primitives/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/primitives/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  SidePanel,
  SidePanelContent,
  SidePanelTitle,
} from "@/components/primitives/side-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";

interface PopupRow {
  content: () => HTMLElement | Promise<HTMLElement>;
  name: string;
  render: () => ReactElement;
}

function slot(name: string) {
  const element = document.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (element === null) {
    throw new Error(`No [data-slot='${name}'] is rendered`);
  }
  return element;
}

const fruits = ["Apple", "Banana"];

function Account() {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Share() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>Share</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

function Delete() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogTitle>Delete</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const rows: PopupRow[] = [
  {
    content: async () => await screen.findByRole("dialog"),
    name: "Popover content",
    render: () => (
      <Popover defaultOpen>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Dimensions</PopoverTitle>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    content: async () =>
      await waitFor(() => slot("hover-card-content"), { timeout: 2000 }),
    name: "Hover Card content",
    render: () => (
      <HoverCard defaultOpen>
        <HoverCardTrigger href="https://acme.com">@acme</HoverCardTrigger>
        <HoverCardContent>Tools for teams that ship.</HoverCardContent>
      </HoverCard>
    ),
  },
  {
    content: async () => {
      fireEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
      await screen.findByRole("listbox");
      return slot("select-content");
    },
    name: "Select content",
    render: () => (
      <Select items={fruits.map((fruit) => ({ label: fruit, value: fruit }))}>
        <SelectLabel>Fruit</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((fruit) => (
            <SelectItem key={fruit} value={fruit}>
              {fruit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    content: async () => {
      fireEvent.click(
        screen.getByRole("button", { hidden: true, name: "Show fruits" })
      );
      await act(async () => {
        await settle();
      });
      return slot("combobox-content");
    },
    name: "Combobox content",
    render: () => (
      <Combobox>
        <ComboboxLabel>Fruit</ComboboxLabel>
        <ComboboxInput triggerLabel="Show fruits" />
        <ComboboxContent>
          <ComboboxList>
            {fruits.map((fruit) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    ),
  },
  {
    content: async () => await screen.findByRole("menu"),
    name: "Dropdown Menu content",
    render: () => <Account />,
  },
  {
    content: async () => {
      const subTrigger = await screen.findByRole("menuitem", {
        name: "Invite users",
      });
      subTrigger.focus();
      fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
      return await screen.findByRole("menu", { name: "Invite users" });
    },
    name: "Dropdown Menu submenu content",
    render: () => <Account />,
  },
  {
    content: async () => await screen.findByRole("dialog", { name: "Share" }),
    name: "Dialog popup",
    render: () => <Share />,
  },
  {
    content: async () => {
      await screen.findByRole("dialog", { name: "Share" });
      return slot("dialog-backdrop");
    },
    name: "Dialog backdrop",
    render: () => <Share />,
  },
  {
    content: async () =>
      await screen.findByRole("alertdialog", { name: "Delete" }),
    name: "Alert Dialog popup",
    render: () => <Delete />,
  },
  {
    content: async () => {
      await screen.findByRole("alertdialog", { name: "Delete" });
      return slot("alert-dialog-backdrop");
    },
    name: "Alert Dialog backdrop",
    render: () => <Delete />,
  },
  {
    content: async () => await screen.findByRole("dialog", { name: "Event" }),
    name: "Side Panel popup",
    render: () => (
      <SidePanel defaultOpen>
        <SidePanelContent>
          <SidePanelTitle>Event</SidePanelTitle>
        </SidePanelContent>
      </SidePanel>
    ),
  },
  {
    content: async () => await screen.findByRole("tooltip"),
    name: "Tooltip content",
    render: () => (
      <Tooltip defaultOpen>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipContent>Save changes</TooltipContent>
      </Tooltip>
    ),
  },
  {
    content: async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Model: Pick a model" })
      );
      return await screen.findByRole("dialog");
    },
    name: "Model Picker popup",
    render: () => (
      <ModelPicker>
        <ModelPickerTrigger>Pick a model</ModelPickerTrigger>
        <ModelPickerContent>
          <ModelPickerCommand>
            <CommandInput aria-label="Search models" />
            <CommandList>
              <ModelPickerItem value="gpt-5">GPT-5</ModelPickerItem>
            </CommandList>
          </ModelPickerCommand>
        </ModelPickerContent>
      </ModelPicker>
    ),
  },
  {
    content: async () => {
      fireEvent.click(screen.getByRole("button", { name: /^Report period/u }));
      return await screen.findByRole("dialog");
    },
    name: "Date Range Picker popup",
    render: () => (
      <DateRangePicker
        defaultValue={["2026-06-12", "2026-06-18"]}
        today="2026-06-18"
      >
        <DateRangePickerTrigger aria-label="Report period" />
        <DateRangePickerContent>
          <DateRangePickerCalendar />
        </DateRangePickerContent>
      </DateRangePicker>
    ),
  },
];

function* cssRules(list: CSSRuleList): Generator<CSSRule> {
  for (const rule of list) {
    yield rule;
    if (rule instanceof CSSGroupingRule) {
      yield* cssRules(rule.cssRules);
    }
  }
}

function hiddenRules(element: HTMLElement) {
  return [...document.styleSheets]
    .flatMap((sheet) => [...cssRules(sheet.cssRules)])
    .filter(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        rule.style.opacity === "0" &&
        element.matches(rule.selectorText)
    )
    .map((rule) => rule.cssText);
}

test.each(rows)(
  "$name: an instant open's first frame is not offstage",
  async (row) => {
    render(row.render());
    const element = await row.content();
    element.dataset.skipMotion = "";
    element.dataset.startingStyle = "";

    const matched = hiddenRules(element);
    expect(matched, `opacity: 0 still matches: ${matched.join(" | ")}`).toEqual(
      []
    );
  }
);

test.each(rows)(
  "$name: an animated open's first frame is offstage",
  async (row) => {
    render(row.render());
    const element = await row.content();
    delete element.dataset.skipMotion;
    element.dataset.startingStyle = "";

    expect(hiddenRules(element).length).toBeGreaterThan(0);
  }
);
