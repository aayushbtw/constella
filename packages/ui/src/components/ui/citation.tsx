"use client";

import * as stylex from "@stylexjs/stylex";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

interface Source {
  /** When it was published, as it should read: "August 3, 2026". */
  date?: string;
  /** The publication's logo; its first letter shows without one. */
  icon?: string;
  /** The publication: "Acme Journal". */
  name: string;
  /** The page's headline. */
  title: string;
  url: string;
}

const styles = stylex.create({
  pill: {
    maxWidth: sizes.citation,
  },
  name: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  publication: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    gap: space.xs,
  },
  title: {
    display: "-webkit-box",
    fontWeight: fontWeights.medium,
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  date: {
    color: colors.textMuted,
  },
});

function Logo({ source, size }: { size?: "sm"; source: Source }) {
  return (
    <Avatar aria-hidden corners="rounded" size={size}>
      {source.icon === undefined ? null : (
        <AvatarImage alt="" src={source.icon} />
      )}
      <AvatarFallback>{source.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

const handle = createHoverCardHandle<Source>();

/** The one card every citation opens, so it moves to each citation as you hover it. Render it once. */
function CitationCard({ sx }: { sx?: stylex.StyleXStyles }) {
  return (
    <HoverCard handle={handle}>
      {({ payload }) => (
        <HoverCardContent sx={sx}>
          {payload === undefined ? null : (
            <div {...stylex.props(styles.card)}>
              <div {...stylex.props(styles.publication)}>
                <Logo size="sm" source={payload} />
                {payload.name}
              </div>
              <div {...stylex.props([typeStyles.textLg, styles.title])}>
                {payload.title}
              </div>
              {payload.date === undefined ? null : (
                <div {...stylex.props(styles.date)}>{payload.date}</div>
              )}
            </div>
          )}
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

/** A Badge that opens the `CitationCard`, so it keeps the badge's slot. */
function Citation({
  source,
  sx,
}: {
  source: Source;
  sx?: stylex.StyleXStyles;
}) {
  return (
    <Badge
      render={
        <HoverCardTrigger
          handle={handle}
          href={source.url}
          payload={source}
          rel="noreferrer"
          target="_blank"
        />
      }
      sx={[styles.pill, sx]}
    >
      <Logo source={source} />
      <span {...stylex.props(styles.name)}>{source.name}</span>
    </Badge>
  );
}

export { Citation, CitationCard };
export type { Source };
