import * as stylex from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import {
  colors,
  durations,
  fontSizes,
  lineHeights,
  media,
  space,
} from "@/lib/tokens.stylex";
import { layout, media as siteMedia } from "~/lib/tokens.stylex";

const reducedMotion = media.reducedMotion.slice("@media ".length);

const styles = stylex.create({
  outline: {
    alignSelf: "start",
    display: { default: "none", [siteMedia.outline]: "block" },
    insetBlockStart: 0,
    height: "100dvh",
    overflowY: "auto",
    paddingBlock: layout.pageTop,
    position: "sticky",
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    paddingBlockEnd: space.xs,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    listStyle: "none",
  },
  link: {
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
    },
    display: "block",
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
  },
  nested: {
    paddingInlineStart: space.sm,
  },
  active: {
    color: colors.textPrimary,
  },
});

interface Heading {
  id: string;
  level: number;
  text: string;
}

// A section is current once its heading has passed the top third of the viewport.
function useCurrentHeading(headings: Heading[]) {
  const [current, setCurrent] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    const targets = headings
      .map(({ id }) => document.querySelector(`#${id}`))
      .filter((target) => target !== null);

    function update() {
      const root = document.documentElement;
      const atBottom = scrollY + innerHeight >= root.scrollHeight - 1;
      const passed = targets.filter(
        (target) => target.getBoundingClientRect().top <= innerHeight / 3
      );
      // The last sections can be too short to ever reach the line.
      const target = atBottom ? targets.at(-1) : (passed.at(-1) ?? targets[0]);

      setCurrent(target?.id);
    }

    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);

    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [headings]);

  return current;
}

function Outline({ headings }: { headings: Heading[] }) {
  const current = useCurrentHeading(headings);
  const navigate = useNavigate();

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    // Modified clicks open a tab or window, as on any link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    // A keyboard press has no click count; keyboard actions never animate.
    const instant = event.detail === 0 || matchMedia(reducedMotion).matches;

    void navigate({
      hash: id,
      hashScrollIntoView: { behavior: instant ? "instant" : "smooth" },
    });
  }

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" {...stylex.props(styles.outline)}>
      <p {...stylex.props(styles.label)}>On this page</p>
      <ul {...stylex.props(styles.list)}>
        {headings.map(({ id, level, text }) => (
          <li key={id}>
            <a
              aria-current={id === current ? "location" : undefined}
              href={`#${id}`}
              onClick={(event) => {
                jump(event, id);
              }}
              {...stylex.props(
                styles.link,
                level === 3 && styles.nested,
                id === current && styles.active
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { Outline };
export type { Heading };
