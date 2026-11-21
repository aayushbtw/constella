import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { buttonStyles } from "@/components/primitives/button";
import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/hover-card";
import type { HoverCardController } from "@/components/primitives/hover-card";
import { Text } from "@/components/typography/text";
import {
  colors,
  fontWeights,
  lineHeights,
  space,
} from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { display: "flex", gap: space.md },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    lineHeight: lineHeights.textSm,
  },
  name: { fontWeight: fontWeights.medium },
  sentence: {
    maxWidth: 448,
    textAlign: "center",
  },
  // An inline link, so mentions sit in the sentence like words.
  mention: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
    textDecorationLine: "underline",
    textDecorationColor: colors.border,
    textUnderlineOffset: space.xxs,
  },
});

interface Profile {
  avatar?: string;
  bio: string;
  handle: string;
  href: string;
  initials: string;
  joined: string;
}

const profiles = {
  acme: {
    bio: "Tools for teams that ship. Built and run by Acme.",
    handle: "@acme",
    href: "https://acme.com",
    initials: "AC",
    joined: "Joined December 2021",
  },
  shadcn: {
    avatar: "/avatars/shadcn.png",
    bio: "Building shadcn/ui, beautifully designed components you copy and paste.",
    handle: "@shadcn",
    href: "https://github.com/shadcn",
    initials: "CN",
    joined: "Joined September 2009",
  },
  emilkowalski: {
    avatar: "/avatars/emilkowalski.png",
    bio: "Design engineer.",
    handle: "@emilkowalski",
    href: "https://github.com/emilkowalski",
    initials: "EK",
    joined: "Joined February 2018",
  },
} satisfies Record<string, Profile>;

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div {...stylex.props(styles.row)}>
      <Avatar>
        {profile.avatar === undefined ? null : (
          <AvatarImage alt="" src={profile.avatar} />
        )}
        <AvatarFallback>{profile.initials}</AvatarFallback>
      </Avatar>
      <div {...stylex.props(styles.text)}>
        <div {...stylex.props(styles.name)}>{profile.handle}</div>
        <div>{profile.bio}</div>
        <Text color="muted" size="sm">
          {profile.joined}
        </Text>
      </div>
    </div>
  );
}

const link = stylex.props(buttonStyles({ variant: "link" }));

function HoverCardDemo() {
  return (
    <DemoRow>
      <HoverCard>
        <HoverCardTrigger href="https://acme.com" {...link}>
          @acme
        </HoverCardTrigger>
        <HoverCardContent>
          <ProfileCard profile={profiles.acme} />
        </HoverCardContent>
      </HoverCard>
    </DemoRow>
  );
}

function Mention({
  controller,
  id,
}: {
  controller: HoverCardController<Profile>;
  id: keyof typeof profiles;
}) {
  const profile = profiles[id];
  return (
    <HoverCardTrigger
      controller={controller}
      href={profile.href}
      payload={profile}
      sx={styles.mention}
    >
      {profile.handle}
    </HoverCardTrigger>
  );
}

function HoverCardTriggersDemo() {
  // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
  const [mentions] = useState(() => createHoverCardController<Profile>());
  return (
    <DemoRow>
      <Text color="primary" size="lg" sx={styles.sentence}>
        Follow <Mention controller={mentions} id="shadcn" />,{" "}
        <Mention controller={mentions} id="emilkowalski" /> and{" "}
        <Mention controller={mentions} id="acme" /> for updates.
      </Text>
      <HoverCard controller={mentions}>
        <HoverCardContent<Profile>>
          {({ payload }) =>
            payload === undefined ? null : <ProfileCard profile={payload} />
          }
        </HoverCardContent>
      </HoverCard>
    </DemoRow>
  );
}

const sides = ["left", "top", "bottom", "right"] as const;

const outline = stylex.props(buttonStyles({ variant: "outline" }));

function HoverCardSideDemo() {
  return (
    <DemoRow>
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger href={profiles.shadcn.href} {...outline}>
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            <ProfileCard profile={profiles.shadcn} />
          </HoverCardContent>
        </HoverCard>
      ))}
    </DemoRow>
  );
}

export { HoverCardDemo, HoverCardSideDemo, HoverCardTriggersDemo };
