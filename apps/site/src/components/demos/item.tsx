import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  Notification01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemSizes,
  itemVariants,
} from "@/components/ui/item";
import type { ItemSize, ItemVariant } from "@/components/ui/item";
import { colors, fontSizes, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  meta: { color: colors.textMuted, fontSize: fontSizes.xs },
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 448,
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

function ItemDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Basic Item</ItemTitle>
            <ItemDescription>
              A simple item with title and description.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item
          // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the item renders its children into the link
          render={<a href="#item" />}
          size="sm"
          variant="outline"
        >
          <ItemMedia variant="icon">
            <Glyph icon={CheckmarkBadge01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Glyph icon={ArrowRight01Icon} />
          </ItemActions>
        </Item>
      </div>
    </DemoRow>
  );
}

const variantLabels = {
  default: "Default Variant",
  muted: "Muted Variant",
  outline: "Outline Variant",
} satisfies Record<ItemVariant, string>;

function ItemVariantDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        {itemVariants.map((variant) => (
          <Item key={variant} variant={variant}>
            <ItemContent>
              <ItemTitle>{variantLabels[variant]}</ItemTitle>
              <ItemDescription>
                Standard styling with subtle background and borders.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </DemoRow>
  );
}

const sizeLabels = {
  default: "Default Size",
  sm: "Small Size",
  xs: "Extra Small Size",
} satisfies Record<ItemSize, string>;

function ItemSizeDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        {itemSizes.toReversed().map((size) => (
          <Item key={size} size={size} variant="outline">
            <ItemMedia variant="icon">
              <Glyph icon={Notification01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{sizeLabels[size]}</ItemTitle>
              <ItemDescription>New messages land here.</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </DemoRow>
  );
}

function ItemIconDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Glyph icon={Shield01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Security Alert</ItemTitle>
            <ItemDescription>
              New login detected from unknown device.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Review
            </Button>
          </ItemActions>
        </Item>
      </div>
    </DemoRow>
  );
}

const people = [
  {
    email: "shadcn@vercel.com",
    initials: "SC",
    name: "shadcn",
    src: "https://github.com/shadcn.png",
  },
  {
    email: "maxleiter@vercel.com",
    initials: "ML",
    name: "maxleiter",
    src: "https://github.com/maxleiter.png",
  },
  {
    email: "evilrabbit@vercel.com",
    initials: "ER",
    name: "evilrabbit",
    src: "https://github.com/evilrabbit.png",
  },
];

function ItemAvatarDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Item variant="outline">
          <ItemMedia>
            <Avatar size="lg">
              <AvatarImage alt="" src={people[0]?.src} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>shadcn</ItemTitle>
            <ItemDescription>Last seen 5 months ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Invite
            </Button>
          </ItemActions>
        </Item>
      </div>
    </DemoRow>
  );
}

function ItemGroupDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <ItemGroup>
          {people.map((person, index) => (
            <Fragment key={person.name}>
              {index > 0 && <ItemSeparator />}
              <Item>
                <ItemMedia>
                  <Avatar>
                    <AvatarImage alt="" src={person.src} />
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{person.name}</ItemTitle>
                  <ItemDescription>{person.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="ghost">
                    Message
                  </Button>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </div>
    </DemoRow>
  );
}

function ItemLinkDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Item
          // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the item renders its children into the link
          render={<a href="#item" />}
        >
          <ItemContent>
            <ItemTitle>Visit our documentation</ItemTitle>
            <ItemDescription>
              Learn how to get started with our components.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Glyph icon={ArrowRight01Icon} />
          </ItemActions>
        </Item>
      </div>
    </DemoRow>
  );
}

const releases = [
  {
    notes: "Hover cards glide between triggers.",
    tag: "Latest",
    version: "v0.9.0",
    when: "Today",
  },
  {
    notes: "Data tables, sidebars and the chat parts.",
    tag: null,
    version: "v0.8.0",
    when: "Last week",
  },
];

function ItemHeaderDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        {releases.map((release) => (
          <Item key={release.version} variant="outline">
            <ItemHeader>
              <ItemTitle>{release.version}</ItemTitle>
              {release.tag !== null && (
                <Badge variant="secondary">{release.tag}</Badge>
              )}
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{release.notes}</ItemDescription>
            </ItemContent>
            <ItemFooter>
              <span {...stylex.props(styles.meta)}>{release.when}</span>
              <Button size="sm" variant="ghost">
                Read notes
              </Button>
            </ItemFooter>
          </Item>
        ))}
      </div>
    </DemoRow>
  );
}

export {
  ItemAvatarDemo,
  ItemHeaderDemo,
  ItemDemo,
  ItemGroupDemo,
  ItemIconDemo,
  ItemLinkDemo,
  ItemSizeDemo,
  ItemVariantDemo,
};
