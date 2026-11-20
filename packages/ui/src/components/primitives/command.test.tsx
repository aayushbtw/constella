import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setPlatform } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { Fragment, useState } from "react";
import { renderToString } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const agent = createAgent();

const groups = [
  {
    items: [
      { label: "Calendar", value: "calendar" },
      { label: "Data Table", value: "data-table" },
      { label: "Breadcrumb", value: "breadcrumb" },
    ],
    label: "Suggestions",
  },
  {
    items: [
      { label: "Button", value: "button" },
      { label: "Button Group", value: "button-group" },
      { disabled: true, label: "Calculator", value: "calculator" },
    ],
    label: "Components",
  },
];

function Palette({ onRun }: { onRun?: (value: string) => void }) {
  return (
    <Command>
      <CommandInput aria-label="Search commands" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {groups.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup>
              <CommandGroupLabel>{group.label}</CommandGroupLabel>
              {group.items.map((item) => (
                <CommandItem
                  disabled={item.disabled}
                  key={item.value}
                  onSelect={() => {
                    onRun?.(item.value);
                  }}
                  value={item.value}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </Command>
  );
}

const input = () => screen.getByRole("combobox", { name: "Search commands" });
const options = () =>
  screen.queryAllByRole("option").map((option) => option.textContent);
const highlighted = () =>
  screen
    .queryAllByRole("option")
    .find((option) => Object.hasOwn(option.dataset, "highlighted"))
    ?.textContent;
const type = (text: string) => {
  fireEvent.change(input(), { target: { value: text } });
};

test("the first command is highlighted from the start", async () => {
  render(<Palette />);

  await waitFor(() => {
    expect(highlighted()).toBe("Calendar");
  });
});

test("typing keeps the commands that contain it and hides groups left empty", async () => {
  render(<Palette />);
  type("bu");

  expect(options()).toEqual(["Button", "Button Group"]);
  expect(screen.queryByRole("group", { name: "Suggestions" })).toBeNull();
  expect(screen.getByRole("group", { name: "Components" })).toBeTruthy();
  await waitFor(() => {
    expect(highlighted()).toBe("Button");
  });
});

test("server HTML shows a group that holds items", () => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Palette />);

  const group = container.querySelector("[data-slot='command-group']");
  expect(group).not.toBeNull();
  expect(group?.hasAttribute("hidden")).toBe(false);
});

test("the empty message shows only while nothing matches", async () => {
  render(<Palette />);
  expect(screen.queryByText("No results found.")).toBeNull();

  type("zzz");

  expect(options()).toEqual([]);
  expect(await screen.findByText("No results found.")).toBeTruthy();
});

test("Enter and a click both run the command's onSelect", async () => {
  const onRun = vi.fn<(value: string) => void>();
  render(<Palette onRun={onRun} />);
  type("bu");
  await waitFor(() => {
    expect(highlighted()).toBe("Button");
  });

  fireEvent.keyDown(input(), { key: "Enter" });
  fireEvent.click(screen.getByRole("option", { name: "Button Group" }));

  expect(onRun.mock.calls).toEqual([["button"], ["button-group"]]);
});

test("a disabled command doesn't run", () => {
  const onRun = vi.fn<(value: string) => void>();
  render(<Palette onRun={onRun} />);

  fireEvent.click(screen.getByRole("option", { name: "Calculator" }));

  expect(onRun).not.toHaveBeenCalled();
});

test("the input sits in an input group's slot, in a group without the input group's ring", () => {
  render(<Palette />);

  const slot = input().parentElement;
  expect(slot?.dataset.slot).toBe("input-group-input");
  expect(slot?.parentElement?.dataset.slot).toBe("command-input-group");
  expect(input().matches("[data-slot='input-group-input'] > input")).toBe(true);
});

test("an agent names the command by its input and runs a command by name", async () => {
  const onRun = vi.fn<(value: string) => void>();
  render(<Palette onRun={onRun} />);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toContain("Search commands");

  const ran = await agent.act({
    steps: [{ action: "run", args: ["button-group"], ref: "Search commands" }],
  });
  expect(ran.ok, ran.error?.message).toBe(true);
  expect(onRun.mock.calls).toEqual([["button-group"]]);
});

const isolates = /[⁦-⁩]/gu;

test.each([
  { keys: { ctrlKey: true }, platform: "other", text: "Ctrl+P" },
  { keys: { metaKey: true }, platform: "apple", text: "⌘P" },
] as const)(
  "Command Shortcut shows $text on $platform and runs nothing when pressed",
  async ({ keys, platform, text }) => {
    setPlatform(platform);
    try {
      const onSelect = vi.fn<() => void>();
      render(
        <Command>
          <CommandInput aria-label="Search commands" />
          <CommandList>
            <CommandItem onSelect={onSelect} value="profile">
              Profile
              <CommandShortcut data-testid="shortcut" shortcut="mod+p" />
            </CommandItem>
          </CommandList>
        </Command>
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("shortcut").textContent?.replaceAll(isolates, "")
        ).toContain(text);
      });
      expect(screen.getByRole("option").hasAttribute("aria-keyshortcuts")).toBe(
        false
      );

      fireEvent.keyDown(input(), { key: "p", ...keys });
      fireEvent.keyDown(document, { key: "p", ...keys });
      expect(onSelect).not.toHaveBeenCalled();
    } finally {
      setPlatform("other");
    }
  }
);

function PaletteDialog() {
  const [open, setOpen] = useState(true);
  return (
    <CommandDialog onOpenChange={setOpen} open={open} title="Command Palette">
      <Palette />
    </CommandDialog>
  );
}

test("Command Dialog is named by its title, and Escape clears the search before it closes", async () => {
  render(<PaletteDialog />);
  const dialog = await screen.findByRole("dialog", { name: "Command Palette" });
  type("bu");

  fireEvent.keyDown(input(), { key: "Escape" });
  expect(input()).toHaveProperty("value", "");
  expect(dialog.isConnected).toBe(true);

  fireEvent.keyDown(input(), { key: "Escape" });
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
