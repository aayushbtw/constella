import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import { colors, media, radii, space } from "@/lib/tokens.stylex";
import { shadows, surfaces } from "~/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  stage: {
    alignItems: "center",
    backgroundColor: surfaces.stage,
    borderRadius: radii.sm,
    boxShadow: shadows.inset,
    display: "flex",
    justifyContent: "center",
    minHeight: 280,
    overflow: "hidden",
    paddingBlock: space.xl,
    paddingInline: space.md,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
  // Sits on the frame under the stage, so the controls read as part of the demo.
  controls: {
    display: "grid",
    gap: { default: space.md, [media.sm]: space.lg },
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    paddingBlock: space.sm,
    paddingInline: space.sm,
  },
  // A tinted frame around a subject; the edge is drawn inside so it never stacks.
  well: {
    backgroundColor: colors.fillSubtle,
    boxShadow: shadows.inset,
    display: "flex",
    paddingBlock: space.xxs,
    paddingInline: space.xxs,
  },
});

function Stage({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: stylex.StyleXStyles;
}) {
  return <div {...stylex.props(styles.stage, sx)}>{children}</div>;
}

function DemoRow({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <Stage>
      <div {...props} {...stylex.props(styles.row, sx)} />
    </Stage>
  );
}

function DemoControls({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.controls)}>{children}</div>;
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

export { DemoControls, DemoRow, Stage, Well };
