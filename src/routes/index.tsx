import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

import { config } from "@/lib/config";
import { colors, layout, space } from "@/lib/tokens.stylex";
import { getComponents } from "@/server/components";

export const Route = createFileRoute("/")({
  loader: async () => await getComponents(),
  component: Home,
});

const styles = stylex.create({
  main: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    marginInline: "auto",
    maxWidth: layout.content,
    paddingBottom: layout.pageBottom,
    paddingInline: layout.gutter,
    paddingTop: layout.pageTop,
  },
  description: {
    color: colors.textSecondary,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    listStyle: "none",
    paddingTop: space.lg,
  },
  link: {
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
});

function Home() {
  return (
    <main {...stylex.props(styles.main)}>
      <h1>{config.name}</h1>
      <p {...stylex.props(styles.description)}>{config.description}</p>
      <ul {...stylex.props(styles.list)}>
        {Route.useLoaderData().map(({ slug, title }) => (
          <li key={slug}>
            <Link
              params={{ slug }}
              to="/components/$slug"
              {...stylex.props(styles.link)}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
