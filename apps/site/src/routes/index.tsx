import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

import { colors, fontSizes, space } from "@/lib/tokens.stylex";
import { getComponents } from "~/server/components";
import { config } from "~/site/config";
import {
  fontSizes as siteFontSizes,
  layout,
  lineHeights,
  media,
} from "~/site/tokens.stylex";

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
  status: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
});

function Home() {
  const components = Route.useLoaderData();

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>{config.description}</h1>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.label)}>Components</h2>
        <ul {...stylex.props(styles.list)}>
          {components.map(({ draft, slug, title }) => (
            <li key={slug}>
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

      <ul {...stylex.props(styles.inline)}>
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
