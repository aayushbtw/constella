import {
  GridViewIcon,
  LeftToRightListBulletIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Toggle } from "@/components/ui/toggle";
import type { ToggleSize } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

const textSizes = ["sm", "default", "lg"] satisfies ToggleSize[];
const iconSizes = ["icon-sm", "icon", "icon-lg"] satisfies ToggleSize[];

const styles = stylex.create({
  stack: { flexDirection: "column", gap: space.md },
});

function ToggleDemo() {
  return (
    <DemoRow>
      <Toggle aria-label="Toggle bold" size="icon">
        <Glyph icon={TextBoldIcon} />
      </Toggle>
    </DemoRow>
  );
}

function ToggleOutlineDemo() {
  return (
    <DemoRow>
      <Toggle aria-label="Toggle italic" size="icon" variant="outline">
        <Glyph icon={TextItalicIcon} />
      </Toggle>
      <Toggle defaultPressed variant="outline">
        <Glyph icon={TextUnderlineIcon} />
        Underline
      </Toggle>
    </DemoRow>
  );
}

function ToggleSizeDemo() {
  return (
    <DemoRow>
      {textSizes.map((size) => (
        <Toggle key={size} size={size} variant="outline">
          <Glyph icon={TextItalicIcon} />
          Italic
        </Toggle>
      ))}
    </DemoRow>
  );
}

function ToggleDisabledDemo() {
  return (
    <DemoRow>
      <Toggle aria-label="Toggle bold" disabled size="icon">
        <Glyph icon={TextBoldIcon} />
      </Toggle>
    </DemoRow>
  );
}

function Formatting() {
  return (
    <>
      <ToggleGroupItem aria-label="Toggle bold" value="bold">
        <Glyph icon={TextBoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle italic" value="italic">
        <Glyph icon={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Toggle underline" value="underline">
        <Glyph icon={TextUnderlineIcon} />
      </ToggleGroupItem>
    </>
  );
}

function ToggleGroupDemo() {
  return (
    <DemoRow>
      <ToggleGroup
        defaultValue={["bold"]}
        multiple
        size="icon"
        variant="outline"
      >
        <Formatting />
      </ToggleGroup>
    </DemoRow>
  );
}

function ToggleGroupSpacingDemo() {
  return (
    <DemoRow>
      <ToggleGroup defaultValue={["all"]} spacing={0} variant="outline">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
        <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
      </ToggleGroup>
    </DemoRow>
  );
}

function ToggleGroupSizeDemo() {
  return (
    <DemoRow sx={styles.stack}>
      {iconSizes.map((size) => (
        <ToggleGroup defaultValue={["bold"]} key={size} multiple size={size}>
          <Formatting />
        </ToggleGroup>
      ))}
    </DemoRow>
  );
}

function ToggleGroupMultipleDemo() {
  return (
    <DemoRow sx={styles.stack}>
      <ToggleGroup defaultValue={["left"]} variant="outline">
        <ToggleGroupItem aria-label="Align left" value="left">
          <Glyph icon={TextAlignLeftIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align center" value="center">
          <Glyph icon={TextAlignCenterIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Align right" value="right">
          <Glyph icon={TextAlignRightIcon} />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup defaultValue={["bold", "italic"]} multiple variant="outline">
        <Formatting />
      </ToggleGroup>
    </DemoRow>
  );
}

function ToggleGroupWithIconDemo() {
  return (
    <DemoRow>
      <ToggleGroup defaultValue={["list"]} spacing={0} variant="outline">
        <ToggleGroupItem value="list">
          <Glyph data-icon="inline-start" icon={LeftToRightListBulletIcon} />
          List
        </ToggleGroupItem>
        <ToggleGroupItem value="grid">
          <Glyph data-icon="inline-start" icon={GridViewIcon} />
          Grid
        </ToggleGroupItem>
      </ToggleGroup>
    </DemoRow>
  );
}

function ToggleGroupVerticalDemo() {
  return (
    <DemoRow>
      <ToggleGroup
        defaultValue={["all"]}
        orientation="vertical"
        spacing={0}
        variant="outline"
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
        <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
      </ToggleGroup>
    </DemoRow>
  );
}

function ToggleGroupDisabledDemo() {
  return (
    <DemoRow>
      <ToggleGroup defaultValue={["all"]} spacing={0} variant="outline">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
        <ToggleGroupItem disabled value="archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </DemoRow>
  );
}

export {
  ToggleGroupDisabledDemo,
  ToggleGroupMultipleDemo,
  ToggleGroupVerticalDemo,
  ToggleGroupWithIconDemo,
  ToggleDemo,
  ToggleDisabledDemo,
  ToggleGroupDemo,
  ToggleGroupSizeDemo,
  ToggleGroupSpacingDemo,
  ToggleOutlineDemo,
  ToggleSizeDemo,
};
