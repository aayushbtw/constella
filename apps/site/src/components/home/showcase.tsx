import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { Chat } from "~/components/demos/chat";
import { groups, Palette } from "~/components/demos/command";
import { Formatting } from "~/components/demos/toggle";
import { entrance } from "~/lib/entrance";
import { media as siteMedia, shadows, surfaces } from "~/lib/tokens.stylex";

// Concentric with the chat's composer, which sits its `xs` inset from the tile's edge.
const corner = `calc(${radii.xl} + ${space.xs})`;

const styles = stylex.create({
  bento: {
    display: "grid",
    gap: space.md,
    gridAutoRows: { default: "auto", [media.md]: "232px" },
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [media.md]: "repeat(2, minmax(0, 1fr))",
      [siteMedia.sidebar]: "repeat(3, minmax(0, 1fr))",
    },
  },
  tile: {
    backgroundColor: surfaces.stage,
    borderStartStartRadius: corner,
    borderStartEndRadius: corner,
    borderEndStartRadius: corner,
    borderEndEndRadius: corner,
    boxShadow: shadows.inset,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    minHeight: { default: 216, [media.md]: 0 },
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInline: space.md,
  },
  large: {
    gridColumn: { default: null, [media.md]: "span 2" },
    gridRow: { default: null, [media.md]: "span 2" },
  },
  // The chat is the tile: its composer sits the chat's own inset from the tile's corner.
  bleed: {
    paddingBlockEnd: 0,
    paddingInline: 0,
  },
  bleedName: {
    paddingInline: space.md,
  },
  tall: {
    gridRow: { default: null, [media.md]: "span 2" },
  },
  name: {
    color: {
      default: colors.textMuted,
      [media.hover]: { default: null, ":hover": colors.textPrimary },
    },
    fontSize: fontSizes.sm,
    textDecoration: "none",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: easings.out,
  },
  body: {
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    minHeight: 0,
  },
  fill: {
    maxWidth: 320,
    width: "100%",
  },
  chat: {
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    height: { default: 440, [media.md]: "100%" },
    width: "100%",
  },
  command: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
  sliders: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
  },
});

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

const plans = [
  { description: "For individuals and small teams.", label: "Plus" },
  { description: "For growing businesses.", label: "Pro" },
  { description: "For large teams and enterprises.", label: "Enterprise" },
];

function SaveButtons() {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const done = saving
      ? setTimeout(() => {
          setSaving(false);
          toast.add({
            description: "Your changes are live.",
            title: "Saved",
            type: "success",
          });
        }, 1200)
      : undefined;
    return () => {
      clearTimeout(done);
    };
  }, [saving]);

  return (
    <div {...stylex.props(styles.row)}>
      <Button disabled={saving} variant="outline">
        Discard
      </Button>
      <Button
        aria-busy={saving}
        disabled={saving}
        onClick={() => {
          setSaving(true);
        }}
        variant="primary"
      >
        {saving && <Spinner data-icon="inline-start" />}
        Save changes
      </Button>
    </div>
  );
}

interface Tile {
  bleed?: boolean;
  content: ReactNode;
  size?: "large" | "tall";
  slug: string;
  title: string;
}

// Every row is full in both the 2- and 3-column bento: 12 cells, large 4, tall 2.
const tiles: Tile[] = [
  {
    bleed: true,
    content: <Chat sx={styles.chat} />,
    size: "large",
    slug: "prompt-input",
    title: "Prompt Input",
  },
  {
    content: (
      <FieldGroup sx={styles.fill}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Push notifications</FieldLabel>
            <FieldDescription>On this device.</FieldDescription>
          </FieldContent>
          <Switch defaultChecked />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Weekly digest</FieldLabel>
            <FieldDescription>Every Monday.</FieldDescription>
          </FieldContent>
          <Switch />
        </Field>
      </FieldGroup>
    ),
    slug: "switch",
    title: "Switch",
  },
  {
    content: (
      <div {...stylex.props(styles.fill, styles.sliders)}>
        <Slider defaultValue={64}>
          <SliderLabel>Volume</SliderLabel>
          <SliderValue />
          <SliderControl />
        </Slider>
        <Slider defaultValue={[20, 80]}>
          <SliderLabel>Price</SliderLabel>
          <SliderValue />
          <SliderControl />
        </Slider>
      </div>
    ),
    slug: "slider",
    title: "Slider",
  },
  {
    content: (
      <Command items={groups} sx={styles.command}>
        <Palette />
      </Command>
    ),
    size: "tall",
    slug: "command",
    title: "Command",
  },
  {
    content: (
      <RadioGroup defaultValue="Pro" sx={styles.fill}>
        {plans.map((plan) => (
          <Field key={plan.label}>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>{plan.label}</FieldTitle>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={plan.label} />
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    ),
    size: "tall",
    slug: "radio-group",
    title: "Radio Group",
  },
  {
    content: <SaveButtons />,
    slug: "button",
    title: "Button",
  },
  {
    content: (
      <div {...stylex.props(styles.row)}>
        <ToggleGroup
          defaultValue={["bold"]}
          multiple
          size="icon"
          variant="outline"
        >
          <Formatting />
        </ToggleGroup>
        <ToggleGroup defaultValue={["left"]} size="icon" variant="outline">
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
      </div>
    ),
    slug: "toggle-group",
    title: "Toggle Group",
  },
];

/** The home page's bento of live components; `order` and `count` place it in the entrance. */
function Showcase({ count, order }: { count: number; order: number }) {
  return (
    <div {...stylex.props(styles.bento)}>
      {tiles.map(({ bleed, content, size, slug, title }, index) => (
        <figure
          key={slug}
          {...stylex.props(
            styles.tile,
            size !== undefined && styles[size],
            bleed === true && styles.bleed,
            entrance.item(order + index, count)
          )}
        >
          <figcaption {...stylex.props(bleed === true && styles.bleedName)}>
            <Link
              params={{ slug }}
              to="/docs/components/$slug"
              {...stylex.props(styles.name)}
            >
              {title}
            </Link>
          </figcaption>
          <div
            {...stylex.props(
              styles.body,
              entrance.content(order + index, count)
            )}
          >
            {content}
          </div>
        </figure>
      ))}
    </div>
  );
}

const showcaseSize = tiles.length;

export { Showcase, showcaseSize };
