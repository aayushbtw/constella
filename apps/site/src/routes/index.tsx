import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { colors, easings, fontSizes, media, space } from "@/lib/tokens.stylex";
import { getComponents } from "~/server/components";
import { config } from "~/site/config";
import { timeline } from "~/site/entrance";
import {
  fontSizes as siteFontSizes,
  layout,
  lineHeights,
  media as siteMedia,
} from "~/site/tokens.stylex";

export const Route = createFileRoute("/")({
  loader: async () => await getComponents(),
  component: Home,
});

const focusIn = stylex.keyframes({
  from: { filter: "blur(8px)", opacity: 0, transform: "translateY(0.3em)" },
});
const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${space.xs})` },
});
const fade = stylex.keyframes({ from: { opacity: 0 } });

const styles = stylex.create({
  word: {
    display: "inline-block",
  },
  wordIn: (delay: number, duration: number) => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: "both",
    animationName: {
      default: focusIn,
      ":is([data-navigated] *)": "none",
      [media.reducedMotion]: {
        default: fade,
        ":is([data-navigated] *)": "none",
      },
    },
    animationTimingFunction: easings.out,
  }),
  item: (delay: number, duration: number) => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: "both",
    animationName: {
      default: rise,
      ":is([data-navigated] *)": "none",
      [media.reducedMotion]: {
        default: fade,
        ":is([data-navigated] *)": "none",
      },
    },
    animationTimingFunction: easings.out,
  }),
  main: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    marginInline: "auto",
    maxWidth: {
      default: `calc(${layout.content} + 2 * ${layout.gutter})`,
      [siteMedia.sidebar]: layout.shell,
    },
    paddingBottom: layout.pageBottom,
    paddingInline: {
      default: layout.gutter,
      [siteMedia.sidebar]: layout.gutterWide,
    },
    paddingTop: layout.pageTop,
  },
  title: {
    fontSize: siteFontSizes.display,
    letterSpacing: "-0.02em",
    lineHeight: lineHeights.display,
    maxWidth: "16ch",
    textWrap: "balance",
  },
  section: {
    display: "grid",
    gap: { default: space.sm, [siteMedia.sidebar]: space.lg },
    gridTemplateColumns: {
      default: "1fr",
      [siteMedia.sidebar]: `${layout.sidebar} minmax(0, ${layout.content})`,
    },
  },
  label: {
    color: colors.textMuted,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    listStyle: "none",
  },
  inline: {
    display: "flex",
    gap: space.md,
    listStyle: "none",
  },
  link: {
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  status: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
});

function Home() {
  const components = Route.useLoaderData();
  // The label, each component, then the links row, spaced so the last lands as the logo settles.
  const last = components.length + 1;
  const itemStep =
    (timeline.spinFor - timeline.items - timeline.itemFor) / last;

  function itemIn(order: number) {
    return styles.item(timeline.items + order * itemStep, timeline.itemFor);
  }

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>
        {config.description.split(" ").map((word, index) => (
          <Fragment key={`${word}${index}`}>
            {index > 0 && " "}
            <span
              {...stylex.props(
                styles.word,
                styles.wordIn(
                  timeline.words + index * timeline.wordStep,
                  timeline.wordFor
                )
              )}
            >
              {word}
            </span>
          </Fragment>
        ))}
      </h1>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.label, itemIn(0))}>Components</h2>
        <ul {...stylex.props(styles.list)}>
          {components.map(({ draft, slug, title }, index) => (
            <li key={slug} {...stylex.props(itemIn(index + 1))}>
              <Link
                params={{ slug }}
                to="/docs/components/$slug"
                {...stylex.props(styles.link)}
              >
                {title}
              </Link>{" "}
              {draft && <span {...stylex.props(styles.status)}>Draft</span>}
            </li>
          ))}
        </ul>
      </section>

      <ul {...stylex.props(styles.inline, itemIn(components.length + 1))}>
        <li>
          <Link to="/docs" {...stylex.props(styles.link)}>
            Docs
          </Link>
        </li>
        <li>
          <a
            href={`https://github.com/${config.socials.github}`}
            {...stylex.props(styles.link)}
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={`https://x.com/${config.socials.twitter}`}
            {...stylex.props(styles.link)}
          >
            X
          </a>
        </li>
      </ul>
    </main>
  );
}
