import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { colors, space } from "@/lib/tokens.stylex";
import { config } from "~/lib/config";
import { entrance } from "~/lib/entrance";
import {
  fontSizes as siteFontSizes,
  layout,
  lineHeights,
  media,
} from "~/lib/tokens.stylex";
import { getComponents } from "~/server/components";

export const Route = createFileRoute("/")({
  loader: async () => await getComponents(),
  component: Home,
});

const styles = stylex.create({
  main: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    marginInline: "auto",
    maxWidth: {
      default: `calc(${layout.content} + 2 * ${layout.gutter})`,
      [media.sidebar]: layout.shell,
    },
    paddingBottom: layout.pageBottom,
    paddingInline: {
      default: layout.gutter,
      [media.sidebar]: layout.gutterWide,
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
    gap: { default: space.sm, [media.sidebar]: space.lg },
    gridTemplateColumns: {
      default: "1fr",
      [media.sidebar]: `${layout.sidebar} minmax(0, ${layout.content})`,
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
});

function Home() {
  // Drafts only exist in dev; hidden here so the page reads as it ships.
  const components = Route.useLoaderData().filter(({ draft }) => !draft);
  // The label, each component, then the links row.
  const items = components.length + 2;

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>
        {config.description.split(" ").map((word, index) => (
          <Fragment key={`${word}${index}`}>
            {index > 0 && " "}
            <span {...stylex.props(entrance.word(index))}>{word}</span>
          </Fragment>
        ))}
      </h1>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.label, entrance.item(0, items))}>
          Components
        </h2>
        <ul {...stylex.props(styles.list)}>
          {components.map(({ slug, title }, index) => (
            <li key={slug} {...stylex.props(entrance.item(index + 1, items))}>
              <Link
                params={{ slug }}
                to="/docs/components/$slug"
                {...stylex.props(styles.link)}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ul {...stylex.props(styles.inline, entrance.item(items - 1, items))}>
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
