import * as stylex from "@stylexjs/stylex";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { display: "flex", gap: space.md },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    lineHeight: lineHeights.text,
  },
  name: { fontWeight: fontWeights.medium },
  muted: { color: colors.textMuted, fontSize: fontSizes.xs },
  sentence: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.prose,
    maxWidth: 448,
    textAlign: "center",
  },
  // An inline link, so mentions sit in the sentence like words.
  mention: {
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
    textDecorationLine: "underline",
    textDecorationColor: colors.edge,
    textUnderlineOffset: space.xxs,
  },
  grid: {
    display: "grid",
    gap: space.xs,
    gridTemplateColumns: "repeat(2, auto)",
  },
});

interface Profile {
  avatar: string;
  bio: string;
  handle: string;
  initials: string;
  joined: string;
}

const profiles = {
  nextjs: {
    avatar: "https://github.com/vercel.png",
    bio: "The React Framework – created and maintained by @vercel.",
    handle: "@nextjs",
    initials: "VC",
    joined: "Joined December 2021",
  },
  shadcn: {
    avatar: "https://github.com/shadcn.png",
    bio: "Building shadcn/ui, beautifully designed components you copy and paste.",
    handle: "@shadcn",
    initials: "SC",
    joined: "Joined March 2018",
  },
  base: {
    avatar: "https://github.com/mui.png",
    bio: "Unstyled UI components for building accessible web apps and design systems. From the creators of Radix, Floating UI and Material UI.",
    handle: "@base-ui",
    initials: "BU",
    joined: "Joined June 2024",
  },
} satisfies Record<string, Profile>;

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div {...stylex.props(styles.row)}>
      <Avatar>
        <AvatarImage alt="" src={profile.avatar} />
        <AvatarFallback>{profile.initials}</AvatarFallback>
      </Avatar>
      <div {...stylex.props(styles.text)}>
        <div {...stylex.props(styles.name)}>{profile.handle}</div>
        <div>{profile.bio}</div>
        <div {...stylex.props(styles.muted)}>{profile.joined}</div>
      </div>
    </div>
  );
}

const link = stylex.props(buttonStyles({ variant: "link" }));

function HoverCardDemo() {
  return (
    <DemoRow>
      <HoverCard>
        <HoverCardTrigger href="https://nextjs.org" {...link}>
          @nextjs
        </HoverCardTrigger>
        <HoverCardContent>
          <ProfileCard profile={profiles.nextjs} />
        </HoverCardContent>
      </HoverCard>
    </DemoRow>
  );
}

const mentions = createHoverCardHandle<Profile>();

function Mention({ id }: { id: keyof typeof profiles }) {
  const profile = profiles[id];
  return (
    <HoverCardTrigger
      handle={mentions}
      href={`https://github.com/${id}`}
      payload={profile}
      {...stylex.props(styles.mention)}
    >
      {profile.handle}
    </HoverCardTrigger>
  );
}

function HoverCardTriggersDemo() {
  return (
    <DemoRow>
      <p {...stylex.props(styles.sentence)}>
        Built by <Mention id="shadcn" /> on <Mention id="base" />, and
        documented with <Mention id="nextjs" />.
      </p>
      <HoverCard handle={mentions}>
        {({ payload }) => (
          <HoverCardContent>
            {payload === undefined ? null : <ProfileCard profile={payload} />}
          </HoverCardContent>
        )}
      </HoverCard>
    </DemoRow>
  );
}

const sides = ["top", "right", "bottom", "left"] as const;

function HoverCardSideDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.grid)}>
        {sides.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger href="#hover-card" {...link}>
              {side}
            </HoverCardTrigger>
            <HoverCardContent side={side}>
              Opens on the {side}, and flips when there&apos;s no room.
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </DemoRow>
  );
}

function HoverCardDelayDemo() {
  return (
    <DemoRow>
      <HoverCard>
        <HoverCardTrigger closeDelay={0} delay={0} href="#hover-card" {...link}>
          Instant
        </HoverCardTrigger>
        <HoverCardContent>
          Opens as soon as the pointer arrives.
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger delay={1000} href="#hover-card" {...link}>
          After a second
        </HoverCardTrigger>
        <HoverCardContent>Waits until the pointer settles.</HoverCardContent>
      </HoverCard>
    </DemoRow>
  );
}

export {
  HoverCardDelayDemo,
  HoverCardDemo,
  HoverCardSideDemo,
  HoverCardTriggersDemo,
};
