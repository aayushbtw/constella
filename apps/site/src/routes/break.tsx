import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";

import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  space,
} from "@/lib/tokens.stylex";
import { ChartBreak, MessageBreak, SidebarBreak } from "~/components/break/app";
import { datasetLabels, datasets } from "~/components/break/fixtures";
import {
  CommandBreak,
  DropdownMenuBreak,
  SelectBreak,
  ToastBreak,
} from "~/components/break/menus";
import { AvatarBreak, ItemBreak } from "~/components/break/people";
import {
  AlertBreak,
  BadgeBreak,
  CardBreak,
  FieldBreak,
  TabsBreak,
} from "~/components/break/surfaces";
import { DataTableBreak, TableBreak } from "~/components/break/tables";
import { Stage } from "~/components/demos/frame";

// Each component fed worst-case data through its demo's props, per the break-ui skill.
const sections = {
  alert: { Break: AlertBreak, title: "Alert" },
  avatar: { Break: AvatarBreak, title: "Avatar" },
  badge: { Break: BadgeBreak, title: "Badge" },
  card: { Break: CardBreak, title: "Card" },
  chart: { Break: ChartBreak, title: "Chart" },
  command: { Break: CommandBreak, title: "Command" },
  "data-table": { Break: DataTableBreak, title: "Data Table" },
  "dropdown-menu": { Break: DropdownMenuBreak, title: "Dropdown Menu" },
  field: { Break: FieldBreak, title: "Field" },
  item: { Break: ItemBreak, title: "Item" },
  message: { Break: MessageBreak, title: "Message" },
  select: { Break: SelectBreak, title: "Select" },
  sidebar: { Break: SidebarBreak, title: "Sidebar" },
  table: { Break: TableBreak, title: "Table" },
  tabs: { Break: TabsBreak, title: "Tabs" },
  toast: { Break: ToastBreak, title: "Toast" },
};

const search = z.object({
  c: z.string().optional(),
  data: z.enum(datasets).optional(),
  dir: z.enum(["ltr", "rtl"]).optional(),
});

export const Route = createFileRoute("/break")({
  // Dev only: never linked, so never prerendered, and a 404 if reached in a build.
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
  component: BreakPage,
  // A hand-edited URL falls back to every default rather than an error page.
  validateSearch: (raw) => search.safeParse(raw).data ?? {},
});

const pill = {
  borderStartStartRadius: radii.full,
  borderStartEndRadius: radii.full,
  borderEndStartRadius: radii.full,
  borderEndEndRadius: radii.full,
};

// Plain chrome, not part of the design under test.
const styles = stylex.create({
  main: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    marginInline: "auto",
    maxWidth: 960,
    paddingBlockEnd: 120,
    paddingBlockStart: space.lg,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: fontSizes.xs,
    gap: space.xs,
  },
  navLink: { color: colors.textMuted },
  current: { color: colors.textPrimary, textDecorationLine: "underline" },
  section: { display: "flex", flexDirection: "column", gap: space.xs },
  heading: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold },
  toggle: {
    ...pill,
    // Opaque: it floats over whatever the component renders.
    backgroundColor: colors.fillOpaque,
    bottom: space.md,
    display: "flex",
    fontFamily: "system-ui, sans-serif",
    fontSize: fontSizes.xs,
    gap: space.xxxs,
    insetInlineStart: "50%",
    maxWidth: `calc(100vw - 2 * ${space.md})`,
    overflowX: "auto",
    paddingBlockEnd: space.xxxs,
    paddingBlockStart: space.xxxs,
    paddingInlineEnd: space.xxxs,
    paddingInlineStart: space.xxxs,
    position: "fixed",
    transform: "translateX(-50%)",
    zIndex: 100,
  },
  segment: {
    ...pill,
    color: colors.textSecondary,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    textDecorationLine: "none",
    whiteSpace: "nowrap",
  },
  active: { backgroundColor: colors.raised, color: colors.textPrimary },
});

const nav = [
  ["", "All"],
  ...Object.entries(sections).map(([slug, { title }]) => [slug, title]),
] as const;

function BreakPage() {
  const { c, data = "demo", dir = "ltr" } = Route.useSearch();
  const shown = Object.entries(sections).filter(
    ([slug]) => c === undefined || c === slug
  );
  return (
    <main {...stylex.props(styles.main)}>
      <nav {...stylex.props(styles.nav)}>
        {nav.map(([slug, title]) => (
          <Link
            key={slug}
            search={(prev) => ({ ...prev, c: slug === "" ? undefined : slug })}
            to="/break"
            {...stylex.props(
              styles.navLink,
              (c ?? "") === slug && styles.current
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
      {shown.map(([slug, { Break, title }]) => (
        <section
          data-break={slug}
          dir={dir}
          key={slug}
          {...stylex.props(styles.section)}
        >
          <h2 {...stylex.props(styles.heading)}>{title}</h2>
          <Stage>
            <Break data={data} open={c === slug} />
          </Stage>
        </section>
      ))}
      <nav aria-label="Dataset" {...stylex.props(styles.toggle)}>
        {datasets.map((option) => (
          <Link
            key={option}
            search={(prev) => ({ ...prev, data: option })}
            to="/break"
            {...stylex.props(styles.segment, data === option && styles.active)}
          >
            {datasetLabels[option]}
          </Link>
        ))}
        <Link
          search={(prev) => ({ ...prev, dir: dir === "rtl" ? "ltr" : "rtl" })}
          to="/break"
          {...stylex.props(styles.segment, dir === "rtl" && styles.active)}
        >
          RTL
        </Link>
      </nav>
    </main>
  );
}
