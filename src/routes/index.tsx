import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";

import { config } from "@/lib/config";
import { colors, layout, space } from "@/lib/tokens.stylex";

export const Route = createFileRoute("/")({
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
});

function Home() {
  return (
    <main {...stylex.props(styles.main)}>
      <h1>{config.name}</h1>
      <p {...stylex.props(styles.description)}>{config.description}</p>
    </main>
  );
}
