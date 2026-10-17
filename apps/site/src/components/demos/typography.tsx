import * as stylex from "@stylexjs/stylex";

import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  space,
  strokes,
  fonts,
} from "@/lib/constella/tokens.stylex";
import { shadows } from "~/lib/tokens.stylex";

const sample = "The quick brown fox jumps over the lazy dog";

const weights = [
  { name: "regular", value: fontWeights.regular },
  { name: "medium", value: fontWeights.medium },
  { name: "semibold", value: fontWeights.semibold },
] as const;

const sizes = [
  { name: "xl", value: fontSizes.xl },
  { name: "lg", value: fontSizes.lg },
  { name: "md", value: fontSizes.md },
  { name: "sm", value: fontSizes.sm },
  { name: "xs", value: fontSizes.xs },
  { name: "xxs", value: fontSizes.xxs },
] as const;

interface Row {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  token: string;
}

const families: Row[] = [
  { fontFamily: fonts.sans, token: "fonts.sans" },
  { fontFamily: fonts.mono, token: "fonts.mono" },
].map((row) => ({
  ...row,
  fontSize: fontSizes.md,
  fontWeight: fontWeights.regular,
}));

const sizeRows: Row[] = sizes.map(({ name, value }) => ({
  fontFamily: fonts.sans,
  fontSize: value,
  fontWeight: fontWeights.regular,
  token: `fontSizes.${name}`,
}));

const weightRows: Row[] = weights.map(({ name, value }) => ({
  fontFamily: fonts.sans,
  fontSize: fontSizes.md,
  fontWeight: value,
  token: `fontWeights.${name}`,
}));

const styles = stylex.create({
  card: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.inset,
  },
  row: {
    alignItems: "center",
    borderBlockStartColor: {
      default: colors.borderSubtle,
      ":first-child": "transparent",
    },
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    display: "flex",
    gap: space.md,
    justifyContent: "space-between",
    paddingBlock: space.sm,
    paddingInline: space.md,
  },
  text: {
    color: colors.textPrimary,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  token: {
    color: colors.textMuted,
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xxs,
    fontVariantLigatures: "none",
  },
  font: (fontFamily: string, fontSize: string, fontWeight: string) => ({
    fontFamily,
    fontSize,
    fontWeight,
  }),
});

function Specimen({ rows }: { rows: Row[] }) {
  return (
    <div {...stylex.props(styles.card)}>
      {rows.map(({ fontFamily, fontSize, fontWeight, token }) => (
        <div key={token} {...stylex.props(styles.row)}>
          <span
            {...stylex.props(
              styles.text,
              styles.font(fontFamily, fontSize, fontWeight)
            )}
          >
            {sample}
          </span>
          <span {...stylex.props(styles.token)}>{token}</span>
        </div>
      ))}
    </div>
  );
}

function FontFamiliesDemo() {
  return <Specimen rows={families} />;
}

function FontSizesDemo() {
  return <Specimen rows={sizeRows} />;
}

function FontWeightsDemo() {
  return <Specimen rows={weightRows} />;
}

export { FontFamiliesDemo, FontSizesDemo, FontWeightsDemo };
