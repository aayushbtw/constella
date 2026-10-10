import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
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
} from "@/components/ui/item";
import { colors, fontSizes, space } from "@/lib/tokens.stylex";
import { peopleFor, text } from "~/components/break/fixtures";
import type { Dataset, Person } from "~/components/break/fixtures";

const styles = stylex.create({
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 448,
  },
  meta: { color: colors.textMuted, fontSize: fontSizes.xs },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.md,
  },
});

function PersonAvatar({
  person,
  size,
}: {
  person: Person;
  size?: "lg" | "sm";
}) {
  return (
    <Avatar size={size}>
      {person.src !== undefined && <AvatarImage alt="" src={person.src} />}
      <AvatarFallback>{person.initials}</AvatarFallback>
    </Avatar>
  );
}

const releases = {
  demo: [
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
  ],
  worst: [
    {
      notes: text.description2000,
      tag: text.status,
      version: text.file,
      when: "3 years ago",
    },
    { notes: text.url, tag: text.german, version: "v1", when: "Now" },
  ],
};

function ItemBreak({ data }: { data: Dataset }) {
  const people = peopleFor(data).slice(0, data === "huge" ? undefined : 8);
  const notes = data === "worst" ? releases.worst : releases.demo;
  return (
    <div {...stylex.props(styles.column)}>
      <ItemGroup>
        {people.map((person, index) => (
          <Fragment key={person.email}>
            {index > 0 && <ItemSeparator />}
            <Item>
              <ItemMedia>
                <PersonAvatar person={person} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="ghost">
                  {data === "worst" ? "Resend invitation" : "Message"}
                </Button>
              </ItemActions>
            </Item>
          </Fragment>
        ))}
      </ItemGroup>
      {data !== "empty" &&
        notes.slice(0, data === "one" ? 1 : undefined).map((release) => (
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
  );
}

function AvatarBreak({ data }: { data: Dataset }) {
  const people = peopleFor(data);
  const shown = people.slice(0, 3);
  const rest = people.length - shown.length;
  return (
    <div {...stylex.props(styles.row)}>
      {people.slice(0, 8).map((person) => (
        <PersonAvatar key={person.email} person={person} />
      ))}
      {people.slice(0, 8).map((person) => (
        <PersonAvatar key={person.email} person={person} size="sm" />
      ))}
      {people[0] !== undefined && (
        <Avatar size="lg">
          {people[0].src !== undefined && (
            <AvatarImage alt="" src={people[0].src} />
          )}
          <AvatarFallback>{people[0].initials}</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
      )}
      <AvatarGroup>
        {shown.map((person) => (
          <PersonAvatar key={person.email} person={person} />
        ))}
        {rest > 0 && (
          <AvatarGroupCount>+{rest.toLocaleString("en-US")}</AvatarGroupCount>
        )}
      </AvatarGroup>
      <AvatarGroup>
        {shown.map((person) => (
          <PersonAvatar key={person.email} person={person} size="sm" />
        ))}
        {rest > 0 && (
          <AvatarGroupCount>+{rest.toLocaleString("en-US")}</AvatarGroupCount>
        )}
      </AvatarGroup>
    </div>
  );
}

export { AvatarBreak, ItemBreak, PersonAvatar };
