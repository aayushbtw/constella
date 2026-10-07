import {
  Add01Icon,
  Alert02Icon,
  Archive02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  AudioWave01Icon,
  CalendarAdd01Icon,
  Clock01Icon,
  Copy01Icon,
  Delete02Icon,
  FilterHorizontalIcon,
  Link01Icon,
  Mail01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  Robot01Icon,
  Search01Icon,
  Share08Icon,
  Tag01Icon,
  Tick02Icon,
  UserRemove01Icon,
  VolumeOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonSize } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colors, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";
import { fonts } from "~/lib/tokens.stylex";

const styles = stylex.create({
  stack: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: space.lg,
  },
  narrow: { maxWidth: 384, width: "100%" },
  fill: { flexGrow: 1 },
  noResize: { resize: "none" },
  srOnly: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
  mono: { fontFamily: fonts.mono },
  muted: { color: colors.textMuted },
});

function Glyph({
  size = sizes.icon,
  ...props
}: Omit<HugeiconsIconProps, "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={size}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

function ButtonGroupDemo() {
  return (
    <DemoRow>
      <ButtonGroup aria-label="Message actions">
        <ButtonGroup>
          <Button aria-label="Go back" size="icon" variant="outline">
            <Glyph icon={ArrowLeft01Icon} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Snooze</Button>
          <MoreMenu />
        </ButtonGroup>
      </ButtonGroup>
    </DemoRow>
  );
}

function MoreMenu() {
  const [label, setLabel] = useState("personal");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="More options" size="icon" variant="outline" />
        }
      >
        <Glyph icon={MoreHorizontalIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Glyph icon={Mail01Icon} />
            Mark as Read
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={Archive02Icon} />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Glyph icon={Clock01Icon} />
            Snooze
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={CalendarAdd01Icon} />
            Add to Calendar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={FilterHorizontalIcon} />
            Add to List
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Glyph icon={Tag01Icon} />
              Label As...
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup onValueChange={setLabel} value={label}>
                <DropdownMenuRadioItem value="personal">
                  Personal
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">
                  Other
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <Glyph icon={Delete02Icon} />
          Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const conversationActions = [
  { icon: VolumeOffIcon, label: "Mute Conversation" },
  { icon: Tick02Icon, label: "Mark as Read" },
  { icon: Alert02Icon, label: "Report Conversation" },
  { icon: UserRemove01Icon, label: "Block User" },
  { icon: Share08Icon, label: "Share Conversation" },
  { icon: Copy01Icon, label: "Copy Conversation" },
];

function ButtonGroupDropdownDemo() {
  return (
    <DemoRow>
      <ButtonGroup>
        <Button variant="outline">Follow</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button aria-label="More actions" size="icon" variant="outline" />
            }
          >
            <Glyph icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {conversationActions.map((action) => (
                <DropdownMenuItem key={action.label}>
                  <Glyph icon={action.icon} />
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">
              <Glyph icon={Delete02Icon} />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupPopoverDemo() {
  return (
    <DemoRow>
      <ButtonGroup>
        <Button variant="outline">
          <Glyph data-icon="inline-start" icon={Robot01Icon} />
          Copilot
        </Button>
        <Popover>
          <PopoverTrigger
            render={
              <Button aria-label="Open Popover" size="icon" variant="outline" />
            }
          >
            <Glyph icon={ArrowDown01Icon} />
          </PopoverTrigger>
          <PopoverContent align="end">
            <PopoverHeader>
              <PopoverTitle>Start a new task with Copilot</PopoverTitle>
              <PopoverDescription>
                Describe your task in natural language.
              </PopoverDescription>
            </PopoverHeader>
            <Field>
              <FieldLabel sx={styles.srOnly}>Task Description</FieldLabel>
              <Textarea placeholder="I need to..." sx={styles.noResize} />
              <FieldDescription>
                Copilot will open a pull request for review.
              </FieldDescription>
            </Field>
          </PopoverContent>
        </Popover>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupOrientationDemo() {
  return (
    <DemoRow>
      <ButtonGroup aria-label="Media controls" orientation="vertical">
        <Button aria-label="Volume up" size="icon" variant="outline">
          <Glyph icon={Add01Icon} />
        </Button>
        <Button aria-label="Volume down" size="icon" variant="outline">
          <Glyph icon={MinusSignIcon} />
        </Button>
      </ButtonGroup>
    </DemoRow>
  );
}

const sizeRows = [
  { icon: "icon-sm", label: "Small", size: "sm", glyph: sizes.iconSm },
  { icon: "icon", label: "Default", size: "default", glyph: sizes.icon },
  { icon: "icon-lg", label: "Large", size: "lg", glyph: sizes.icon },
] satisfies {
  glyph: string;
  icon: ButtonSize;
  label: string;
  size: ButtonSize;
}[];

function ButtonGroupSizeDemo() {
  return (
    <DemoRow sx={styles.stack}>
      {sizeRows.map((row) => (
        <ButtonGroup key={row.size}>
          <Button size={row.size} variant="outline">
            {row.label}
          </Button>
          <Button size={row.size} variant="outline">
            Button
          </Button>
          <Button size={row.size} variant="outline">
            Group
          </Button>
          <Button aria-label="Add" size={row.icon} variant="outline">
            <Glyph icon={Add01Icon} size={row.glyph} />
          </Button>
        </ButtonGroup>
      ))}
    </DemoRow>
  );
}

const pages = ["1", "2", "3", "4", "5"];

function ButtonGroupNestedDemo() {
  return (
    <DemoRow>
      <ButtonGroup aria-label="Pagination">
        <ButtonGroup>
          {pages.map((page) => (
            <Button key={page} size="sm" variant="outline">
              {page}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup>
          <Button aria-label="Previous" size="icon-sm" variant="outline">
            <Glyph icon={ArrowLeft01Icon} size={sizes.iconSm} />
          </Button>
          <Button aria-label="Next" size="icon-sm" variant="outline">
            <Glyph icon={ArrowRight01Icon} size={sizes.iconSm} />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupSeparatorDemo() {
  return (
    <DemoRow>
      <ButtonGroup>
        <Button size="sm">Copy</Button>
        <ButtonGroupSeparator />
        <Button size="sm">Paste</Button>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupSplitDemo() {
  return (
    <DemoRow>
      <ButtonGroup>
        <Button>Button</Button>
        <ButtonGroupSeparator />
        <Button aria-label="Add" size="icon">
          <Glyph icon={Add01Icon} />
        </Button>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupInputDemo() {
  return (
    <DemoRow>
      <ButtonGroup>
        <Input aria-label="Search" placeholder="Search..." />
        <Button aria-label="Search" size="icon" variant="outline">
          <Glyph icon={Search01Icon} />
        </Button>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupInputGroupDemo() {
  const [voice, setVoice] = useState(false);
  return (
    <DemoRow sx={styles.narrow}>
      <ButtonGroup sx={[styles.narrow, styles.fill]}>
        <ButtonGroup>
          <Button aria-label="Add" size="icon" variant="outline">
            <Glyph icon={Add01Icon} />
          </Button>
        </ButtonGroup>
        <ButtonGroup sx={styles.fill}>
          <InputGroup>
            <InputGroupInput
              aria-label="Message"
              disabled={voice}
              placeholder={
                voice ? "Record and send audio..." : "Send a message..."
              }
            />
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      aria-label="Voice mode"
                      aria-pressed={voice}
                      onClick={() => {
                        setVoice(!voice);
                      }}
                      size="icon-xs"
                      variant={voice ? "secondary" : "ghost"}
                    />
                  }
                >
                  <Glyph icon={AudioWave01Icon} />
                </TooltipTrigger>
                <TooltipContent>Voice mode</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </DemoRow>
  );
}

const currencies = [
  { label: "US Dollar", value: "$" },
  { label: "Euro", value: "€" },
  { label: "British Pound", value: "£" },
];

function ButtonGroupSelectDemo() {
  const [currency, setCurrency] = useState("$");
  return (
    <DemoRow>
      <ButtonGroup>
        <ButtonGroup>
          <Select
            items={currencies}
            onValueChange={(value) => {
              if (value !== null) {
                setCurrency(value);
              }
            }}
            value={currency}
          >
            <SelectTrigger aria-label="Currency" sx={styles.mono}>
              {currency}
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {currencies.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value}
                    <span {...stylex.props(styles.muted)}>{item.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input aria-label="Amount" pattern="[0-9]*" placeholder="10.00" />
        </ButtonGroup>
        <ButtonGroup>
          <Button aria-label="Send" size="icon" variant="outline">
            <Glyph icon={ArrowRight01Icon} />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </DemoRow>
  );
}

function ButtonGroupTextDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <ButtonGroup sx={styles.narrow}>
        {/* oxlint-disable-next-line jsx-a11y/label-has-associated-control -- the children render inside the label */}
        <ButtonGroupText render={<label htmlFor="button-group-url" />}>
          https://
        </ButtonGroupText>
        <InputGroup>
          <InputGroupInput id="button-group-url" />
          <InputGroupAddon align="inline-end">
            <Glyph icon={Link01Icon} />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </DemoRow>
  );
}

export {
  ButtonGroupDropdownDemo,
  ButtonGroupPopoverDemo,
  ButtonGroupDemo,
  ButtonGroupInputDemo,
  ButtonGroupInputGroupDemo,
  ButtonGroupNestedDemo,
  ButtonGroupOrientationDemo,
  ButtonGroupSelectDemo,
  ButtonGroupSeparatorDemo,
  ButtonGroupSizeDemo,
  ButtonGroupSplitDemo,
  ButtonGroupTextDemo,
};
