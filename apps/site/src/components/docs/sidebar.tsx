import * as stylex from "@stylexjs/stylex";
import { Link, useMatchRoute } from "@tanstack/react-router";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  media,
  presses,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";
import { layout, media as siteMedia } from "~/site/tokens.stylex";

const styles = stylex.create({
  sidebar: {
    alignSelf: "start",
    display: { default: "none", [siteMedia.sidebar]: "block" },
    insetBlockStart: 0,
    // Room for the rows' fill, which reaches past the text; the scroll box clips it.
    marginInline: `calc(-1 * ${space.xs})`,
    height: "100dvh",
    overflowY: "auto",
    paddingBlock: layout.pageTop,
    paddingInline: space.xs,
    position: "sticky",
  },
  group: {
    marginBlockEnd: { default: space.lg, ":last-child": 0 },
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    paddingBlockEnd: space.xs,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
    listStyle: "none",
  },
  link: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fillSubtle },
    },
    borderRadius: radii.sm,
    // Every row reads at full strength; the fill alone marks hover and the current page.
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    height: sizes.controlMd,
    // The label's text lines up with the heading above, not the row's fill.
    marginInlineStart: `calc(-1 * ${space.xs})`,
    paddingInline: space.xs,
    transform: { default: null, ":active": presses.row },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
  },
  active: {
    backgroundColor: colors.fill,
    fontWeight: fontWeights.medium,
  },
});

interface SidebarGroup {
  items: { slug: string; title: string }[];
  label: string;
  to: "/docs/$slug" | "/docs/components/$slug";
}

function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const matchRoute = useMatchRoute();

  return (
    <nav aria-label="Docs" {...stylex.props(styles.sidebar)}>
      {groups
        .filter(({ items }) => items.length > 0)
        .map(({ items, label, to }) => (
          <section key={label} {...stylex.props(styles.group)}>
            <h2 {...stylex.props(styles.label)}>{label}</h2>
            <ul {...stylex.props(styles.list)}>
              {items.map(({ slug, title }) => (
                <li key={slug}>
                  <Link
                    params={{ slug }}
                    to={to}
                    {...stylex.props(
                      styles.link,
                      Boolean(matchRoute({ params: { slug }, to })) &&
                        styles.active
                    )}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </nav>
  );
}

export { Sidebar };
