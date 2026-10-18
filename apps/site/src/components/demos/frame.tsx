import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Caption } from "@/components/typography/caption";
import {
  colors,
  fonts,
  media,
  radii,
  space,
} from "@/lib/constella/tokens.stylex";
import { shadows, surfaces } from "~/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  stage: {
    backgroundColor: surfaces.stage,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    boxShadow: shadows.inset,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  // With controls, the demo's frame is the one edge; the controls panel carries its own.
  bare: {
    boxShadow: "none",
  },
  view: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    minHeight: 280,
    paddingBlock: space.xl,
    paddingInline: space.md,
  },
  compact: {
    minHeight: 0,
    paddingBlock: space.md,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
  // Set into the stage's foot, concentric with it, so it reads as part of the demo but not the component.
  controls: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    boxShadow: shadows.inset,
    display: "grid",
    gap: { default: space.md, [media.sm]: space.lg },
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    paddingBlock: space.md,
    paddingInline: space.md,
  },
  // A tinted frame around a subject; the edge is drawn inside so it never stacks.
  well: {
    backgroundColor: colors.fillSubtle,
    boxShadow: shadows.inset,
    display: "flex",
    paddingBlock: space.xxs,
    paddingInline: space.xxs,
  },
  tiles: {
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  },
  tile: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    minWidth: 0,
  },
  sample: {
    alignItems: "center",
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.inset,
    display: "flex",
    height: 72,
    justifyContent: "center",
  },
  token: {
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

/** Set by /poster: demos hug their content and drop their controls. */
const CompactStage = createContext(false);

/** The demo's surface; `controls` are the demo's own knobs and actions, kept apart from the component. */
function Stage({
  children,
  controls,
}: {
  children: ReactNode;
  controls?: ReactNode;
}) {
  const compact = use(CompactStage);
  const shown = compact ? undefined : controls;
  return (
    <div {...stylex.props(styles.stage, shown !== undefined && styles.bare)}>
      <div {...stylex.props(styles.view, compact && styles.compact)}>
        {children}
      </div>
      {shown === undefined ? null : (
        <div {...stylex.props(styles.controls)}>{shown}</div>
      )}
    </div>
  );
}

function DemoRow({
  controls,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & { controls?: ReactNode }) {
  return (
    <Stage controls={controls}>
      <div {...props} {...stylex.props(styles.row, sx)} />
    </Stage>
  );
}

function Well({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  return <div {...stylex.props(styles.well, sx)}>{children}</div>;
}

function Tiles({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  return <div {...stylex.props(styles.tiles, sx)}>{children}</div>;
}

/** A token shown on its own sample, named under it. */
function Tile({
  children,
  sx,
  token,
}: {
  children?: ReactNode;
  sx?: stylex.StyleXStyles;
  token: string;
}) {
  return (
    <div {...stylex.props(styles.tile)}>
      <div {...stylex.props(styles.sample, sx)}>{children}</div>
      <Caption color="secondary" size="lg" sx={styles.token}>
        {token}
      </Caption>
    </div>
  );
}

export { CompactStage, DemoRow, Stage, Tile, Tiles, Well };
