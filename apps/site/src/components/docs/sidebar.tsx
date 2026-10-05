import * as stylex from "@stylexjs/stylex";
import { Link, useParams } from "@tanstack/react-router";

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
    color: {
      default: colors.textSecondary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover": colors.textPrimary,
      },
    },
    display: "flex",
    fontSize: fontSizes.sm,
    height: sizes.controlMd,
    // The label's text lines up with the heading above, not the row's fill.
    marginInlineStart: `calc(-1 * ${space.xs})`,
    paddingInline: space.xs,
    transform: { default: null, ":active": presses.row },
    transitionDuration: `${durations.hover}, ${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, color, transform",
    transitionTimingFunction: `ease, ease, ${easings.out}`,
  },
  active: {
    backgroundColor: colors.fill,
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
});

interface SidebarItem {
  slug: string;
  title: string;
}

function Sidebar({ items }: { items: SidebarItem[] }) {
  const { slug: current } = useParams({ strict: false });

  return (
    <nav aria-label="Components" {...stylex.props(styles.sidebar)}>
      <p {...stylex.props(styles.label)}>Components</p>
      <ul {...stylex.props(styles.list)}>
        {items.map(({ slug, title }) => (
          <li key={slug}>
            <Link
              params={{ slug }}
              to="/components/$slug"
              {...stylex.props(styles.link, slug === current && styles.active)}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { Sidebar };
