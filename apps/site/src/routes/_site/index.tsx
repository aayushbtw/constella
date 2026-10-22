import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { Link as TextLink } from "@/components/typography/link";
import { Text } from "@/components/typography/text";
import {
  fontSizes,
  letterSpacings,
  lineHeights,
  media as uiMedia,
  space,
} from "@/lib/constella/tokens.stylex";
import { Showcase, showcaseSize } from "~/components/home/showcase";
import { config } from "~/lib/config";
import { entrance } from "~/lib/entrance";
import { layout, media } from "~/lib/tokens.stylex";
import { getComponents } from "~/server/components";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  codeRepository: config.repo,
  description: config.description,
  name: config.name,
  programmingLanguage: "TypeScript",
  runtimePlatform: "React",
  url: config.url,
};

export const Route = createFileRoute("/_site/")({
  loader: async () => await getComponents(),
  head: () => ({
    scripts: [
      {
        children: JSON.stringify(structuredData),
        type: "application/ld+json",
      },
    ],
  }),
  component: Home,
});

const styles = stylex.create({
  main: {
    display: "flex",
    flexDirection: "column",
    gap: layout.sectionGap,
    marginInline: "auto",
    maxWidth: layout.shell,
    paddingBottom: layout.pageBottom,
    paddingInline: {
      default: layout.gutter,
      [media.sidebar]: layout.gutterWide,
    },
    paddingTop: layout.pageTop,
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
  },
  title: {
    fontSize: {
      default: fontSizes.heading4,
      [media.sidebar]: fontSizes.heading3,
    },
    letterSpacing: letterSpacings.heading,
    lineHeight: {
      default: lineHeights.heading4,
      [media.sidebar]: lineHeights.heading3,
    },
    maxWidth: "16ch",
    textWrap: "balance",
  },
  lead: {
    maxWidth: "48ch",
    textWrap: "pretty",
  },
  section: {
    display: "grid",
    gap: { default: space.sm, [media.sidebar]: space.lg },
    gridTemplateColumns: {
      default: "1fr",
      [media.sidebar]: `${layout.sidebar} minmax(0, 1fr)`,
    },
  },
  list: {
    columnCount: { default: 2, [uiMedia.md]: 3, [media.sidebar]: 4 },
    columnGap: space.lg,
    listStyle: "none",
  },
  item: {
    breakInside: "avoid",
    paddingBottom: space.sm,
  },
  inline: {
    display: "flex",
    gap: space.md,
    listStyle: "none",
  },
});

function Home() {
  // Drafts only exist in dev; hidden here so the page reads as it ships.
  const components = Route.useLoaderData().filter(({ draft }) => !draft);
  // The lead, the links row, each tile, then the index.
  const items = showcaseSize + 3;

  return (
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.hero)}>
        <h1 {...stylex.props(styles.title)}>
          {config.description.split(" ").map((word, index) => (
            <Fragment key={`${word}${index}`}>
              {index > 0 && " "}
              <span {...stylex.props(entrance.word(index))}>{word}</span>
            </Fragment>
          ))}
        </h1>

        <Text
          color="secondary"
          render={
            <p {...stylex.props(styles.lead, entrance.item(0, items))}>
              React components styled with StyleX.
            </p>
          }
        />

        <ul {...stylex.props(styles.inline, entrance.item(1, items))}>
          <li>
            <TextLink
              render={
                <Link params={{ slug: "installation" }} to="/docs/$slug" />
              }
            >
              Get started
            </TextLink>
          </li>
          <li>
            <TextLink href={config.repo}>GitHub</TextLink>
          </li>
          <li>
            <TextLink href={`https://x.com/${config.socials.twitter}`}>
              X
            </TextLink>
          </li>
        </ul>
      </div>

      <Showcase count={items} order={2} />

      <section
        {...stylex.props(styles.section, entrance.item(items - 1, items))}
      >
        <Text color="muted" render={<h2>Components</h2>} />
        <ul {...stylex.props(styles.list)}>
          {components.map(({ slug, title }) => (
            <li key={slug} {...stylex.props(styles.item)}>
              <TextLink
                render={<Link params={{ slug }} to="/docs/components/$slug" />}
              >
                {title}
              </TextLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
