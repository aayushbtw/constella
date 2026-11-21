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
import { createDialogController } from "@ui-sdk/react/dialog";
import { useShortcutHint } from "@ui-sdk/react/shortcuts";
import { Fragment, useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/primitives/command";
import { DialogTrigger } from "@/components/primitives/dialog";
import { Kbd } from "@/components/primitives/kbd";
import { SwapText } from "@/components/primitives/swap-text";
import { Text } from "@/components/typography/text";
import { sizes, space, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  command: { maxWidth: "100%", width: sizes.dialog },
  stack: { flexDirection: "column", gap: space.md },
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
      { icon: UserIcon, label: "Profile", shortcut: "mod+p", value: "profile" },
      {
        icon: CreditCardIcon,
        label: "Billing",
        shortcut: "mod+b",
        value: "billing",
      },
      {
        icon: Settings01Icon,
        label: "Settings",
        shortcut: "mod+s",
        value: "settings",
      },
    ],
    value: "Settings",
  },
];

function Palette({ onRun }: { onRun?: (entry: Entry) => void }) {
  return (
    <>
      <CommandInput
        aria-label="Search commands"
        placeholder="Type a command or search..."
      />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {groups.map((group, index) => (
          <Fragment key={group.value}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup>
              <CommandGroupLabel>{group.value}</CommandGroupLabel>
              {group.items.map((entry) => (
                <CommandItem
                  disabled={entry.disabled}
                  key={entry.value}
                  label={entry.label}
                  onSelect={() => onRun?.(entry)}
                  value={entry.value}
                >
                  <HugeiconsIcon
                    aria-hidden
                    icon={entry.icon}
                    size={sizes.icon}
                    strokeWidth={Number(strokes.icon)}
                  />
                  <CommandItemText />
                  {entry.shortcut !== undefined && (
                    <CommandShortcut shortcut={entry.shortcut} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </>
  );
}

function CommandDemo() {
  const [ran, setRan] = useState("Nothing yet");
  return (
    <DemoRow sx={styles.stack}>
      <Command sx={styles.command}>
        <Palette
          onRun={(entry) => {
            setRan(entry.label);
          }}
        />
      </Command>
      <Text color="secondary" size="sm">
        Ran: <SwapText>{ran}</SwapText>
      </Text>
    </DemoRow>
  );
}

function CommandDialogDemo() {
  // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
  const [palette] = useState(() => createDialogController());
  const hint = useShortcutHint("mod+j");
  return (
    <DemoRow>
      <DialogTrigger
        controller={palette}
        render={<Button variant="outline" />}
        shortcut="mod+j"
      >
        Open Menu
        <Kbd aria-hidden>{hint.text}</Kbd>
      </DialogTrigger>
      <CommandDialog controller={palette}>
        <Command>
          <Palette
            onRun={() => {
              palette.close();
            }}
          />
        </Command>
      </CommandDialog>
    </DemoRow>
  );
}

export { CommandDemo, CommandDialogDemo, Palette };
