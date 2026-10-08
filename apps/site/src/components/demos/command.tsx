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
import { Fragment, useEffect, useState } from "react";

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
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SwapText } from "@/components/ui/swap-text";
import { colors, fontSizes, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  command: { maxWidth: "100%", width: 384 },
  stack: { flexDirection: "column", gap: space.md },
  ran: { color: colors.textSecondary, fontSize: fontSizes.sm },
});

interface Entry {
  disabled?: boolean;
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
      {
        disabled: true,
        icon: Calculator01Icon,
        label: "Calculator",
        value: "calculator",
      },
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

function Palette({ onRun }: { onRun?: (entry: Entry) => void }) {
  return (
    <>
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
                  <CommandItem
                    disabled={entry.disabled}
                    key={entry.value}
                    onClick={() => onRun?.(entry)}
                    value={entry}
                  >
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
    </>
  );
}

function CommandDemo() {
  const [ran, setRan] = useState("Nothing yet");
  return (
    <DemoRow sx={styles.stack}>
      <Command items={groups} sx={styles.command}>
        <Palette
          onRun={(entry) => {
            setRan(entry.label);
          }}
        />
      </Command>
      <div {...stylex.props(styles.ran)}>
        Ran: <SwapText>{ran}</SwapText>
      </div>
    </DemoRow>
  );
}

function CommandDialogDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((was) => !was);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  return (
    <DemoRow>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
      >
        Open Menu
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>J</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <Command items={groups}>
          <Palette
            onRun={() => {
              setOpen(false);
            }}
          />
        </Command>
      </CommandDialog>
    </DemoRow>
  );
}

export { CommandDemo, CommandDialogDemo };
