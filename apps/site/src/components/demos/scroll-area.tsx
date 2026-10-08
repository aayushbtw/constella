import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const box = {
  borderBlockEndColor: colors.edge,
  borderBlockStartColor: colors.edge,
  borderInlineEndColor: colors.edge,
  borderInlineStartColor: colors.edge,
  borderBlockEndStyle: "solid",
  borderBlockStartStyle: "solid",
  borderInlineEndStyle: "solid",
  borderInlineStartStyle: "solid",
  borderBlockEndWidth: strokes.border,
  borderBlockStartWidth: strokes.border,
  borderInlineEndWidth: strokes.border,
  borderInlineStartWidth: strokes.border,
  borderStartStartRadius: radii.sm,
  borderStartEndRadius: radii.sm,
  borderEndStartRadius: radii.sm,
  borderEndEndRadius: radii.sm,
} as const;

const styles = stylex.create({
  tags: { ...box, height: 288, width: 192 },
  list: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  heading: {
    fontWeight: fontWeights.medium,
    marginBlockEnd: space.md,
  },
  separator: { marginBlockEnd: space.xs, marginBlockStart: space.xs },
  gallery: { ...box, maxWidth: "100%", width: 384 },
  row: {
    display: "flex",
    gap: space.md,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
    width: "max-content",
  },
  sheet: { ...box, height: 240, maxWidth: "100%", width: 384 },
  grid: {
    borderCollapse: "collapse",
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
  },
  cell: {
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    textAlign: "end",
    whiteSpace: "nowrap",
  },
  head: {
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
    textAlign: "start",
  },
  tile: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    height: 160,
    width: 128,
  },
});

const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);

function ScrollAreaDemo() {
  return (
    <DemoRow>
      <ScrollArea sx={styles.tags}>
        <div {...stylex.props(styles.list)}>
          <div {...stylex.props(styles.heading)}>Tags</div>
          {tags.map((tag, index) => (
            <Fragment key={tag}>
              {index > 0 && <Separator sx={styles.separator} />}
              <div>{tag}</div>
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </DemoRow>
  );
}

function ScrollAreaHorizontalDemo() {
  return (
    <DemoRow>
      <ScrollArea sx={styles.gallery}>
        <div {...stylex.props(styles.row)}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} {...stylex.props(styles.tile)} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DemoRow>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const regions = [
  "North America",
  "South America",
  "Europe",
  "Africa",
  "Middle East",
  "South Asia",
  "East Asia",
  "Oceania",
  "Caribbean",
  "Central Asia",
];

function ScrollAreaBothDemo() {
  return (
    <DemoRow>
      <ScrollArea sx={styles.sheet}>
        <table {...stylex.props(styles.grid)}>
          <thead>
            <tr>
              <th {...stylex.props(styles.cell, styles.head)}>Region</th>
              {months.map((month) => (
                <th key={month} {...stylex.props(styles.cell, styles.head)}>
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((region, row) => (
              <tr key={region}>
                <td {...stylex.props(styles.cell, styles.head)}>{region}</td>
                {months.map((month, column) => (
                  <td key={month} {...stylex.props(styles.cell)}>
                    {((row + 3) * (column + 7) * 37) % 900}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DemoRow>
  );
}

export { ScrollAreaBothDemo, ScrollAreaDemo, ScrollAreaHorizontalDemo };
