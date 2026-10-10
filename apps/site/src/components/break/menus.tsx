import {
  CreditCardIcon,
  SmileIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Fragment, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { peopleFor, text } from "~/components/break/fixtures";
import type { Dataset } from "~/components/break/fixtures";

const styles = stylex.create({
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: space.md,
    justifyContent: "center",
    width: "100%",
  },
  trigger: { maxWidth: "100%", width: 192 },
  command: { maxWidth: "100%", width: 384 },
});

interface Option {
  label: string;
  value: string | null;
}

const options = {
  demo: ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"],
  worst: [
    "Indonesia Central Standard Time (Western Indonesian Time Zone, UTC+07:00)",
    text.german,
    text.uuid,
    "Jo",
    text.french,
  ],
};

function optionsFor(data: Dataset): Option[] {
  const labels = {
    demo: options.demo,
    empty: [],
    huge: peopleFor("huge").map((person) => person.email),
    one: options.demo.slice(0, 1),
    worst: options.worst,
  }[data];
  return labels.map((label) => ({ label, value: label }));
}

function SelectBreak({ data, open }: { data: Dataset; open: boolean }) {
  const items = optionsFor(data);
  const all = [{ label: "Select an option", value: null }, ...items];
  return (
    <div {...stylex.props(styles.row)}>
      <Select
        defaultOpen={open}
        defaultValue={items[0]?.value ?? null}
        items={all}
      >
        <SelectTrigger aria-label="Option" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              {data === "worst" ? text.jobTitle : "Fruits"}
            </SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select defaultValue={items[0]?.value ?? null} items={all}>
        <SelectTrigger aria-label="Option" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.label} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface Entry {
  icon: HugeiconsIconProps["icon"];
  label: string;
  shortcut?: string;
  value: string;
}

interface Group {
  items: Entry[];
  value: string;
}

function groupsFor(data: Dataset): Group[] {
  const entries = {
    demo: [
      { icon: UserIcon, label: "Profile", shortcut: "⌘P", value: "profile" },
      {
        icon: CreditCardIcon,
        label: "Billing",
        shortcut: "⌘B",
        value: "billing",
      },
      { icon: SmileIcon, label: "Search Emoji", value: "emoji" },
    ],
    empty: [],
    huge: peopleFor("huge").map((person) => ({
      icon: UserIcon,
      label: person.name,
      value: person.email,
    })),
    one: [
      { icon: UserIcon, label: "Profile", shortcut: "⌘P", value: "profile" },
    ],
    worst: [
      { icon: UserIcon, label: text.file, shortcut: "⌃⌥⇧⌘P", value: "file" },
      { icon: CreditCardIcon, label: text.url, shortcut: "⌘B", value: "url" },
      { icon: SmileIcon, label: text.german, value: "german" },
      {
        icon: UserIcon,
        label: "Jo",
        shortcut: "Ctrl+Alt+Shift+Delete",
        value: "jo",
      },
    ],
  }[data];
  return entries.length === 0
    ? []
    : [
        {
          items: entries,
          value: data === "worst" ? text.jobTitle : "Suggestions",
        },
      ];
}

function CommandBreak({ data }: { data: Dataset }) {
  return (
    <Command items={groupsFor(data)} sx={styles.command}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(group: Group, index: number) => (
          <Fragment key={group.value}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup items={group.items}>
              <CommandGroupLabel>{group.value}</CommandGroupLabel>
              <CommandCollection>
                {(entry: Entry) => (
                  <CommandItem key={entry.value} value={entry}>
                    <HugeiconsIcon
                      aria-hidden
                      icon={entry.icon}
                      size={sizes.icon}
                      strokeWidth={Number(strokes.icon)}
                    />
                    {entry.label}
                    {entry.shortcut !== undefined && (
                      <CommandShortcut>{entry.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                )}
              </CommandCollection>
            </CommandGroup>
          </Fragment>
        )}
      </CommandList>
    </Command>
  );
}

function DropdownMenuBreak({ data, open }: { data: Dataset; open: boolean }) {
  const groups = groupsFor(data);
  return (
    <DropdownMenu defaultOpen={open}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {groups.map((group) => (
          <DropdownMenuGroup key={group.value}>
            <DropdownMenuLabel>{group.value}</DropdownMenuLabel>
            {group.items.map((entry) => (
              <DropdownMenuItem key={entry.value}>
                <HugeiconsIcon
                  aria-hidden
                  icon={entry.icon}
                  size={sizes.icon}
                  strokeWidth={Number(strokes.icon)}
                />
                {entry.label}
                {entry.shortcut !== undefined && (
                  <DropdownMenuShortcut>{entry.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
        {groups.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem variant="danger">
          {data === "worst" ? `Remove ${text.file}` : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const toasts = {
  demo: [{ description: "Your changes are live.", title: "Saved" }],
  worst: [
    { description: text.url, title: text.file },
    { description: text.description2000, title: text.german },
    { description: undefined, title: text.markup },
  ],
};

function showToasts(data: Dataset) {
  toast.close();
  if (data === "empty") {
    return;
  }
  const rows = data === "worst" ? toasts.worst : toasts.demo;
  for (const row of rows) {
    toast.add({
      actionProps: { children: data === "worst" ? text.french : "Undo" },
      description: row.description,
      timeout: 0,
      title: row.title,
      type: "warning",
    });
  }
}

function ToastBreak({ data }: { data: Dataset }) {
  useEffect(() => {
    showToasts(data);
  }, [data]);
  return (
    <Button
      onClick={() => {
        showToasts(data);
      }}
      variant="outline"
    >
      Show toasts
    </Button>
  );
}

export { CommandBreak, DropdownMenuBreak, SelectBreak, ToastBreak };
