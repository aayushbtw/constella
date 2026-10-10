import {
  ArrowDown01Icon,
  ArrowTurnBackwardIcon,
  Copy01Icon,
  CreditCardIcon,
  FileScriptIcon,
  InformationCircleIcon,
  JavaScriptIcon,
  Mail01Icon,
  MoreHorizontalIcon,
  Refresh01Icon,
  Search01Icon,
  StarIcon,
  Tick02Icon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  inputGroupTextareaStyles,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
  durations,
  easings,
  fontSizes,
  media,
  motion,
  sizes,
  space,
  strokes,
  fonts,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  narrow: { maxWidth: 320, width: "100%" },
  stack: { display: "grid", gap: space.lg, width: "100%" },
  code: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    fontVariantLigatures: "none",
  },
  hint: { fontSize: fontSizes.xs },
  editor: { minHeight: 200 },
  // Both icons share one cell, so the swap is a crossfade in place.
  swap: { display: "grid" },
  swapIcon: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: durations.crossfade,
    transitionProperty: {
      default: "opacity, filter, transform",
      [media.reducedMotion]: "opacity, filter",
    },
    transitionTimingFunction: easings.crossfade,
  },
  hidden: {
    filter: `blur(${motion.crossfadeBlur})`,
    opacity: 0,
    transform: `scale(${motion.crossfadeScale})`,
  },
});

const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

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

function InputGroupDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search..." />
        <InputGroupAddon>
          <Glyph icon={Search01Icon} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
    </DemoRow>
  );
}

const sizeRows = [
  { icon: sizes.iconSm, label: "Small", size: "sm" },
  { icon: sizes.icon, label: "Default", size: "default" },
  { icon: sizes.icon, label: "Large", size: "lg" },
] as const;

function InputGroupSizeDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        {sizeRows.map((row) => (
          <InputGroup key={row.size} size={row.size}>
            <InputGroupInput aria-label={row.label} placeholder={row.label} />
            <InputGroupAddon>
              <Glyph icon={Search01Icon} size={row.icon} />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
          </InputGroup>
        ))}
      </div>
    </DemoRow>
  );
}

function InputGroupInlineStartDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Input</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <Glyph icon={Search01Icon} />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Icon positioned at the start.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputGroupInlineEndDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Input</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="Enter password" type="password" />
          <InputGroupAddon align="inline-end">
            <Glyph icon={ViewOffSlashIcon} />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Icon positioned at the end.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputGroupBlockStartDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field>
          <FieldLabel>Input</FieldLabel>
          <InputGroup>
            <InputGroupInput placeholder="Enter your name" />
            <InputGroupAddon align="block-start">
              <InputGroupText>Full Name</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Header positioned above the input.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Textarea</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              placeholder="console.log('Hello, world!');"
              sx={styles.code}
            />
            <InputGroupAddon align="block-start">
              <Glyph icon={FileScriptIcon} />
              <InputGroupText sx={styles.code}>script.js</InputGroupText>
              <InputGroupButton aria-label="Copy" size="icon-xs">
                <Glyph icon={Copy01Icon} />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Header positioned above the textarea.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function InputGroupBlockEndDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field>
          <FieldLabel>Input</FieldLabel>
          <InputGroup>
            <InputGroupInput placeholder="Enter amount" />
            <InputGroupAddon align="block-end">
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Footer positioned below the input.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Textarea</FieldLabel>
          <InputGroup>
            <InputGroupTextarea placeholder="Write a comment..." />
            <InputGroupAddon align="block-end">
              <InputGroupText>0/280</InputGroupText>
              <InputGroupButton size="sm" variant="primary">
                Post
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Footer positioned below the textarea.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function InputGroupIconDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <InputGroup>
          <InputGroupInput aria-label="Search" placeholder="Search..." />
          <InputGroupAddon>
            <Glyph icon={Search01Icon} />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Email"
            placeholder="Enter your email"
            type="email"
          />
          <InputGroupAddon>
            <Glyph icon={Mail01Icon} />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Card number" placeholder="Card number" />
          <InputGroupAddon>
            <Glyph icon={CreditCardIcon} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Glyph icon={Tick02Icon} />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Card number" placeholder="Card number" />
          <InputGroupAddon align="inline-end">
            <Glyph icon={StarIcon} />
            <Glyph icon={InformationCircleIcon} />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DemoRow>
  );
}

function InputGroupTextDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Amount" placeholder="0.00" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Website" placeholder="example.com" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Username"
            placeholder="Enter your username"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>@company.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea
            aria-label="Message"
            placeholder="Enter your message"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText sx={styles.hint}>
              120 characters left
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DemoRow>
  );
}

function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <span aria-hidden {...stylex.props(styles.swap)}>
      <span {...stylex.props(styles.swapIcon, !copied && styles.hidden)}>
        <Glyph icon={Tick02Icon} />
      </span>
      <span {...stylex.props(styles.swapIcon, copied && styles.hidden)}>
        <Glyph icon={Copy01Icon} />
      </span>
    </span>
  );
}

function InputGroupButtonDemo() {
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText("https://x.com/shadcn");
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, confirmFor);
  }

  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <InputGroup>
          <InputGroupInput
            aria-label="Profile link"
            placeholder="https://x.com/shadcn"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={copied ? "Copied" : "Copy"}
              onClick={() => {
                void copy();
              }}
              size="icon-xs"
            >
              <CopyGlyph copied={copied} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <Popover>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    aria-label="Connection info"
                    size="icon-xs"
                    variant="secondary"
                  />
                }
              >
                <Glyph icon={InformationCircleIcon} />
              </PopoverTrigger>
              <PopoverContent align="start">
                <PopoverHeader>
                  <PopoverTitle>Your connection is not secure.</PopoverTitle>
                  <PopoverDescription>
                    You should not enter any sensitive information on this site.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Website" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Favorite"
              aria-pressed={favorite}
              onClick={() => {
                setFavorite(!favorite);
              }}
              size="icon-xs"
            >
              <Glyph
                fill={favorite ? "currentColor" : "none"}
                icon={StarIcon}
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Search"
            placeholder="Type to search..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DemoRow>
  );
}

const fileActions = ["Settings", "Copy path", "Open location"];
const searchScopes = ["Documentation", "Blog Posts", "Changelog"];

function InputGroupDropdownDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <InputGroup>
          <InputGroupInput
            aria-label="File name"
            placeholder="Enter file name"
          />
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<InputGroupButton aria-label="More" size="icon-xs" />}
              >
                <Glyph icon={MoreHorizontalIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {fileActions.map((action) => (
                    <DropdownMenuItem key={action}>{action}</DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            aria-label="Search query"
            placeholder="Enter search query"
          />
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<InputGroupButton />}>
                Search In...
                <Glyph
                  data-icon="inline-end"
                  icon={ArrowDown01Icon}
                  size={sizes.iconXs}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  {searchScopes.map((scope) => (
                    <DropdownMenuItem key={scope}>{scope}</DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DemoRow>
  );
}

function InputGroupKbdDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search..." />
        <InputGroupAddon>
          <Glyph icon={Search01Icon} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </DemoRow>
  );
}

function InputGroupSpinnerDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <InputGroup>
          <InputGroupInput aria-label="Search" placeholder="Searching..." />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Task" placeholder="Processing..." />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Notes" placeholder="Saving changes..." />
          <InputGroupAddon align="inline-end">
            <InputGroupText>Saving...</InputGroupText>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Data" placeholder="Refreshing data..." />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>Please wait...</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DemoRow>
  );
}

function InputGroupTextareaDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <InputGroup>
        <InputGroupTextarea
          aria-label="Code"
          placeholder="console.log('Hello, world!');"
          sx={[styles.code, styles.editor]}
        />
        <InputGroupAddon align="block-end" separated>
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" variant="primary">
            Run <Glyph data-icon="inline-end" icon={ArrowTurnBackwardIcon} />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" separated>
          <InputGroupText sx={styles.code}>
            <Glyph icon={JavaScriptIcon} />
            script.js
          </InputGroupText>
          <InputGroupButton aria-label="Refresh" size="icon-xs">
            <Glyph icon={Refresh01Icon} />
          </InputGroupButton>
          <InputGroupButton aria-label="Copy" size="icon-xs">
            <Glyph icon={Copy01Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </DemoRow>
  );
}

function InputGroupCustomDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <InputGroup>
        <TextareaAutosize
          aria-label="Message"
          data-slot="input-group-control"
          placeholder="Autoresize textarea..."
          {...stylex.props(inputGroupTextareaStyles())}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="sm" variant="primary">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </DemoRow>
  );
}

export {
  InputGroupDropdownDemo,
  InputGroupBlockEndDemo,
  InputGroupBlockStartDemo,
  InputGroupButtonDemo,
  InputGroupCustomDemo,
  InputGroupDemo,
  InputGroupIconDemo,
  InputGroupInlineEndDemo,
  InputGroupInlineStartDemo,
  InputGroupKbdDemo,
  InputGroupSizeDemo,
  InputGroupSpinnerDemo,
  InputGroupTextareaDemo,
  InputGroupTextDemo,
};
