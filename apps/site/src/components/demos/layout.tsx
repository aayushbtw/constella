import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import type { ButtonSize } from "@/components/ui/button";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { Stage, Well } from "~/components/demos/frame";
import { fonts } from "~/lib/tokens.stylex";

const radiusScale = [
  { name: "xs", value: radii.xs },
  { name: "sm", value: radii.sm },
  { name: "md", value: radii.md },
  { name: "full", value: radii.full },
] as const;

const controls = [
  { name: "controlXs", size: "xs", value: sizes.controlXs },
  { name: "controlSm", size: "sm", value: sizes.controlSm },
  { name: "controlMd", size: "default", value: sizes.controlMd },
  { name: "controlLg", size: "lg", value: sizes.controlLg },
] as const satisfies readonly {
  name: string;
  size: ButtonSize;
  value: string;
}[];

const styles = stylex.create({
  value: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    textAlign: "end",
  },
  items: {
    alignItems: "flex-end",
    display: "flex",
    flexWrap: "wrap",
    gap: space.lg,
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  label: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xxs,
  },
  labelName: {
    color: colors.textPrimary,
  },
  // A quarter of a large square, so the curve of each radius reads at its true size.
  corner: (borderRadius: string) => ({
    borderColor: colors.edge,
    borderStartStartRadius: borderRadius,
    borderStyle: "solid",
    borderWidth: `${strokes.border} 0 0 ${strokes.border}`,
    height: 64,
    width: 64,
  }),
  cornerWell: {
    borderEndEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderStartStartRadius: radii.md,
    paddingBlockStart: space.md,
    paddingInlineStart: space.md,
  },
});

function Label({ name, value }: { name: string; value: string }) {
  return (
    <span {...stylex.props(styles.label)}>
      <span {...stylex.props(styles.labelName)}>{name}</span>
      <span {...stylex.props(styles.value)}>{value}</span>
    </span>
  );
}

function LayoutRadiiDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.items)}>
        {radiusScale.map(({ name, value }) => (
          <div key={name} {...stylex.props(styles.item)}>
            <Well sx={styles.cornerWell}>
              <span {...stylex.props(styles.corner(value))} />
            </Well>
            <Label name={name} value={value} />
          </div>
        ))}
      </div>
    </Stage>
  );
}

function LayoutSizesDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.items)}>
        {controls.map(({ name, size, value }) => (
          <div key={name} {...stylex.props(styles.item)}>
            <Button size={size} variant="outline">
              Button
            </Button>
            <Label name={name} value={value} />
          </div>
        ))}
      </div>
    </Stage>
  );
}

export { LayoutRadiiDemo, LayoutSizesDemo };
