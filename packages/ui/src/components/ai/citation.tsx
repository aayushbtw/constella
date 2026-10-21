"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useMemo } from "react";
import type { ReactNode } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import {
  createHoverCardHandle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/hover-card";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

interface Source {
  /** When it was published, as it should read: "August 3, 2026". */
  date?: string;
  /** A line or two from the page: what it says about the claim. */
  description?: string;
  /** The publication's logo; a globe shows without one. */
  icon?: string;
  /** The publication: "Acme Journal". */
  name: string;
  /** The page's headline. */
  title: string;
  url: string;
}

type Sources = readonly [Source, ...Source[]];

const styles = stylex.create({
  pill: {
    maxWidth: sizes.citation,
  },
  name: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  more: {
    color: colors.textMuted,
    flexShrink: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  source: {
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    textDecorationLine: "none",
  },
  publication: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    gap: space.xs,
  },
  clamp: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  title: {
    fontWeight: fontWeights.medium,
    textDecorationLine: {
      default: "none",
      [media.hover]: { default: null, ":is(a:hover > *)": "underline" },
    },
  },
  description: {
    color: colors.textSecondary,
  },
  date: {
    color: colors.textMuted,
  },
});

function Logo({ source, size }: { size?: "sm"; source: Source }) {
  return (
    <Avatar aria-hidden corners="rounded" size={size}>
      {source.icon === undefined ? null : (
        <AvatarImage alt="" referrerPolicy="no-referrer" src={source.icon} />
      )}
      {/* Held back while a logo loads, so the pill doesn't flash the globe before it. */}
      <AvatarFallback delay={source.icon === undefined ? undefined : 600}>
        <HugeiconsIcon
          aria-hidden
          icon={Globe02Icon}
          size="1em"
          strokeWidth={Number(strokes.icon)}
        />
      </AvatarFallback>
    </Avatar>
  );
}

const CitationsContext = createContext<ReturnType<
  typeof createHoverCardHandle<Sources>
> | null>(null);

/** Holds the one card every `Citation` inside opens, so it moves to each citation as you hover it. */
function Citations({ children, sx }: { children: ReactNode; sx?: Sx }) {
  const handle = useMemo(() => createHoverCardHandle<Sources>(), []);
  return (
    <CitationsContext value={handle}>
      {children}
      <HoverCard handle={handle}>
        {({ payload }) => (
          <HoverCardContent sx={sx}>
            {payload === undefined ? null : (
              <div {...stylex.props(styles.list)}>
                {payload.map((source) => (
                  <a
                    href={source.url}
                    key={source.url}
                    rel="noreferrer"
                    target="_blank"
                    {...stylex.props(styles.source)}
                  >
                    <span {...stylex.props(styles.publication)}>
                      <Logo size="sm" source={source} />
                      {source.name}
                    </span>
                    <span
                      {...stylex.props(
                        typeStyles.textBase,
                        styles.clamp,
                        styles.title
                      )}
                    >
                      {source.title}
                    </span>
                    {source.description === undefined ? null : (
                      <span {...stylex.props(styles.clamp, styles.description)}>
                        {source.description}
                      </span>
                    )}
                    {source.date === undefined ? null : (
                      <span {...stylex.props(styles.date)}>{source.date}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </HoverCardContent>
        )}
      </HoverCard>
    </CitationsContext>
  );
}

/** A Badge linking to the first source, counting the rest; it opens the `Citations` card. */
function Citation({ sources, sx }: { sources: Sources; sx?: Sx }) {
  const handle = use(CitationsContext);
  if (handle === null) {
    throw new Error("Citation must be inside Citations.");
  }
  const [first] = sources;
  return (
    <Badge
      render={
        <HoverCardTrigger
          handle={handle}
          href={first.url}
          payload={sources}
          rel="noreferrer"
          target="_blank"
        />
      }
      sx={[styles.pill, sx]}
    >
      <Logo source={first} />
      <span {...stylex.props(styles.name)}>{first.name}</span>
      {sources.length > 1 && (
        <span {...stylex.props(styles.more)}>+{sources.length - 1}</span>
      )}
    </Badge>
  );
}

export { Citation, Citations };
export type { Source };
