import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { radii, sizes, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 384,
  },
  avatarSm: {
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: sizes.controlMd,
    width: sizes.controlMd,
  },
  // A bar inside a text line's height, so the row doesn't move when the text arrives.
  title: {
    height: space.sm,
    marginBlockEnd: space.xxs,
    marginBlockStart: space.xxs,
    width: 96,
  },
  detail: {
    height: space.sm,
    marginBlockEnd: space.xxs,
    marginBlockStart: space.xxs,
    width: 192,
  },
  row: { alignItems: "center", display: "flex", gap: space.md },
  lines: { display: "flex", flexDirection: "column", gap: space.xs },
  avatar: {
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: sizes.media,
    width: sizes.media,
  },
  line: { height: space.md, width: 240 },
  short: { height: space.md, width: 192 },
  card: { maxWidth: "100%", width: 320 },
  image: { aspectRatio: "16 / 9", width: "100%" },
});

function SkeletonDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.row)}>
        <Skeleton sx={styles.avatar} />
        <div {...stylex.props(styles.lines)}>
          <Skeleton sx={styles.line} />
          <Skeleton sx={styles.short} />
        </div>
      </div>
    </DemoRow>
  );
}

function SkeletonCardDemo() {
  return (
    <DemoRow>
      <Card sx={styles.card}>
        <CardHeader>
          <Skeleton sx={styles.short} />
        </CardHeader>
        <CardContent>
          <Skeleton sx={styles.image} />
        </CardContent>
      </Card>
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

function Members() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <ItemGroup>
      {people.map((person) => (
        <Item key={person.name} variant="outline">
          <ItemMedia>
            {loading ? (
              <Skeleton sx={styles.avatarSm} />
            ) : (
              <Avatar>
                <AvatarImage alt="" src={person.src} />
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            )}
          </ItemMedia>
          <ItemContent>
            {loading ? (
              <>
                <Skeleton sx={styles.title} />
                <Skeleton sx={styles.detail} />
              </>
            ) : (
              <>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </>
            )}
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

function SkeletonItemDemo() {
  const [run, setRun] = useState(0);
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Members key={run} />
        <Button
          onClick={() => {
            setRun(run + 1);
          }}
          size="sm"
          variant="outline"
        >
          Load again
        </Button>
      </div>
    </DemoRow>
  );
}

export { SkeletonCardDemo, SkeletonDemo, SkeletonItemDemo };
