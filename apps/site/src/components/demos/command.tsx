import {
  Calculator01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Settings01Icon,
  SmileIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  command: { maxWidth: "100%", width: 384 },
});

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

const groups: Group[] = [
  {
    items: [
      { icon: Calendar03Icon, label: "Calendar", value: "calendar" },
      { icon: SmileIcon, label: "Search Emoji", value: "emoji" },
      { icon: Calculator01Icon, label: "Calculator", value: "calculator" },
    ],
    value: "Suggestions",
  },
  {
    items: [
      { icon: UserIcon, label: "Profile", shortcut: "⌘P", value: "profile" },
      {
        icon: CreditCardIcon,
        label: "Billing",
        shortcut: "⌘B",
        value: "billing",
      },
      {
        icon: Settings01Icon,
        label: "Settings",
        shortcut: "⌘S",
        value: "settings",
      },
    ],
    value: "Settings",
  },
];

function Palette() {
  return (
    <>
      <CommandInput placeholder="Type a command or search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(group: Group) => (
          <CommandGroup items={group.items} key={group.value}>
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
        )}
      </CommandList>
    </>
  );
}

function CommandDemo() {
  return (
    <DemoRow>
      <Command items={groups} sx={styles.command}>
        <Palette />
      </Command>
    </DemoRow>
  );
}

function CommandDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoRow>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
      >
        Open Menu
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <Command items={groups}>
          <Palette />
        </Command>
      </CommandDialog>
    </DemoRow>
  );
}

export { CommandDemo, CommandDialogDemo };
