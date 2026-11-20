"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  AvatarFallback as AvatarFallbackPrimitive,
  AvatarImage as AvatarImagePrimitive,
  Avatar as AvatarPrimitive,
} from "@ui-sdk/react/avatar";
import { createContext, use, useMemo } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Badge } from "@/components/primitives/badge";
import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/hover-card";
import type { HoverCardController } from "@/components/primitives/hover-card";
import type { Sx } from "@/lib/constella/styles";
import { stateStyles, typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  fontWeights,
  radii,
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
  // A logo is a box, not a glyph with its own whitespace, so like a Button's Kbd it sits as
  // far from the side as from the top and bottom.
  pill: {
    maxWidth: sizes.citation,
    paddingInlineStart: `calc((${sizes.controlXxs} - ${sizes.iconXs}) / 2 - ${strokes.border})`,
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
  // A menu's inset, so each source's hover fill nests in the card's corner.
  card: {
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  group: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    minWidth: 0,
  },
  // One unit the row can't split, so the count never wraps onto a line alone.
  groupMore: {
    alignItems: "center",
    display: "flex",
    gap: space.xxs,
    minWidth: 0,
  },
  groupCount: {
    color: colors.textMuted,
    flexShrink: 0,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    whiteSpace: "nowrap",
  },
  source: {
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockEnd: space.row,
    paddingBlockStart: space.row,
    paddingInlineEnd: space.row,
    paddingInlineStart: space.row,
    textDecorationLine: "none",
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
  },
  current: {
    backgroundColor: colors.fillSubtle,
  },
  publication: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    // The row's padding, so the logo sits as far from its name as from the row's edge.
    gap: space.row,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  clamp: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  title: {
    fontWeight: fontWeights.medium,
  },
  description: {
    color: colors.textSecondary,
  },
  date: {
    color: colors.textMuted,
  },
  logo: {
    display: "flex",
    flexShrink: 0,
  },
  logoPill: {
    height: sizes.iconXs,
    width: sizes.iconXs,
  },
  logoCard: {
    height: sizes.iconSm,
    width: sizes.iconSm,
  },
  logoImage: {
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  logoFallback: {
    color: colors.textSecondary,
    display: "flex",
    height: "100%",
    width: "100%",
  },
});

const fallbackDelay = Number.parseFloat(durations.fallbackDelay);

// A bare favicon, not an Avatar: no tile or edge around it.
function Logo({ source, sx }: { source: Source; sx: Sx }) {
  return (
    <AvatarPrimitive
      aria-hidden
      data-icon="inline-start"
      {...stylex.props(styles.logo, sx)}
    >
      {source.icon === undefined ? null : (
        <AvatarImagePrimitive
          alt=""
          referrerPolicy="no-referrer"
          src={source.icon}
          {...stylex.props(styles.logoImage)}
        />
      )}
      {/* Held back while a logo loads, so the pill doesn't flash the globe before it. */}
      <AvatarFallbackPrimitive
        delay={source.icon === undefined ? undefined : fallbackDelay}
        {...stylex.props(styles.logoFallback)}
      >
        <HugeiconsIcon
          aria-hidden
          icon={Globe02Icon}
          size="100%"
          strokeWidth={Number(strokes.icon)}
        />
      </AvatarFallbackPrimitive>
    </AvatarPrimitive>
  );
}

type CitationSourceProps = Omit<
  ComponentProps<"a">,
  "children" | "className" | "href" | "rel" | "style" | "target"
> & { source: Source; sx?: Sx };

/** One source's row, linked to its page: the card lists them, and so can a panel. */
function CitationSource({ source, sx, ...props }: CitationSourceProps) {
  const current =
    props["aria-current"] === true || props["aria-current"] === "true";
  return (
    <a
      data-slot="citation-source"
      {...withStyles(
        props,
        stylex.props(
          styles.source,
          stateStyles.ghost,
          current && styles.current,
          sx
        )
      )}
      href={source.url}
      rel="noreferrer"
      target="_blank"
    >
      <span {...stylex.props(styles.publication)}>
        <Logo source={source} sx={styles.logoCard} />
        {source.name}
      </span>
      <span {...stylex.props(styles.body)}>
        <span
          {...stylex.props(typeStyles.textBase, styles.clamp, styles.title)}
        >
          {source.title}
        </span>
        {source.description === undefined ? null : (
          <span {...stylex.props(styles.clamp, styles.description)}>
            {source.description}
          </span>
        )}
      </span>
      {source.date === undefined ? null : (
        <span {...stylex.props(styles.date)}>{source.date}</span>
      )}
    </a>
  );
}

const CitationsContext = createContext<HoverCardController<Sources> | null>(
  null
);

/** Holds the one card every `Citation` inside opens, so it moves to each citation as you hover it. */
function Citations({
  "aria-label": label = "Sources",
  children,
  sx,
}: {
  "aria-label"?: string;
  children: ReactNode;
  sx?: Sx;
}) {
  const controller = useMemo(() => createHoverCardController<Sources>(), []);
  return (
    <CitationsContext value={controller}>
      {children}
      <HoverCard controller={controller}>
        <HoverCardContent<Sources>
          aria-label={label}
          keepMounted
          sx={[styles.card, sx]}
        >
          {({ payload }) =>
            payload === undefined ? null : (
              <div {...stylex.props(styles.list)}>
                {payload.map((source) => (
                  <CitationSource key={source.url} source={source} />
                ))}
              </div>
            )
          }
        </HoverCardContent>
      </HoverCard>
    </CitationsContext>
  );
}

type CitationProps = Omit<
  ComponentProps<typeof HoverCardTrigger<Sources>>,
  | "children"
  | "controller"
  | "href"
  | "payload"
  | "rel"
  | "render"
  | "sx"
  | "target"
> & { sources: Sources; sx?: Sx };

/** A Badge linking to the first source, counting the rest; it opens the `Citations` card. */
function Citation({ sources, sx, ...props }: CitationProps) {
  const controller = use(CitationsContext);
  if (controller === null) {
    throw new Error("Citation must be inside Citations.");
  }
  const [first] = sources;
  return (
    <Badge
      render={
        <HoverCardTrigger
          {...props}
          controller={controller}
          href={first.url}
          payload={sources}
          rel="noreferrer"
          target="_blank"
        />
      }
      sx={[styles.pill, sx]}
    >
      <Logo source={first} sx={styles.logoPill} />
      <span {...stylex.props(styles.name)}>{first.name}</span>
      {sources.length > 1 && (
        <span {...stylex.props(styles.more)}>+{sources.length - 1}</span>
      )}
    </Badge>
  );
}

/** A wrapping row of citations: the sources a search found, say. */
function CitationGroup({ children, sx }: { children: ReactNode; sx?: Sx }) {
  return (
    <div data-slot="citation-group" {...stylex.props(styles.group, sx)}>
      {children}
    </div>
  );
}

/** The group's last citation and a count of the sources not shown, kept on one line. */
function CitationGroupMore({
  children,
  count,
  sx,
}: {
  children: ReactNode;
  count: number;
  sx?: Sx;
}) {
  return (
    <span
      data-slot="citation-group-more"
      {...stylex.props(styles.groupMore, sx)}
    >
      {children}
      <span {...stylex.props(typeStyles.textSm, styles.groupCount)}>
        {count} more
      </span>
    </span>
  );
}

export {
  Citation,
  CitationGroup,
  CitationGroupMore,
  Citations,
  CitationSource,
};
export type { Source };
