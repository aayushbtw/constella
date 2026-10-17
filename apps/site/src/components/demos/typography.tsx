import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { Caption, Heading, Text } from "@/components/ui/typography";
import type {
  HeadingSize,
  TextSize,
  TypeWeight,
} from "@/components/ui/typography";
import {
  colors,
  fontWeights,
  fonts,
  radii,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";
import { shadows } from "~/lib/tokens.stylex";

const sample = "The quick brown fox jumps over the lazy dog";

const headingSizes: HeadingSize[] = [1, 2, 3, 4, 5, 6];
const textSizes: TextSize[] = ["lg", "base", "sm"];
const weights: TypeWeight[] = ["regular", "semimedium", "medium", "semibold"];

interface Row {
  label: string;
  sample: ReactNode;
}

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
  sample: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
  },
  mono: {
    fontFamily: fonts.mono,
  },
});

const families: Row[] = [
  {
    label: "fonts.sans",
    sample: (
      <Text color="primary" sx={styles.sample}>
        {sample}
      </Text>
    ),
  },
  {
    label: "fonts.mono",
    sample: (
      <Text color="primary" sx={[styles.sample, styles.mono]}>
        {sample}
      </Text>
    ),
  },
];

const sizes: Row[] = [
  ...headingSizes.map((size) => ({
    label: `<Heading size={${size}}>`,
    sample: (
      <Heading level={3} size={size} sx={styles.sample}>
        Heading {size}
      </Heading>
    ),
  })),
  ...textSizes.map((size) => ({
    label: `<Text color="primary" size="${size}">`,
    sample: (
      <Text color="primary" size={size} sx={styles.sample}>
        {sample}
      </Text>
    ),
  })),
  {
    label: "<Caption>",
    sample: (
      <Caption color="primary" sx={styles.sample}>
        {sample}
      </Caption>
    ),
  },
];

const weightRows: Row[] = weights.map((weight) => ({
  label: `weight="${weight}"`,
  sample: (
    <Text color="primary" size="lg" sx={styles.sample} weight={weight}>
      {weight.charAt(0).toUpperCase() + weight.slice(1)} {fontWeights[weight]}
    </Text>
  ),
}));

function Specimen({ rows }: { rows: Row[] }) {
  return (
    <div {...stylex.props(styles.card)}>
      {rows.map(({ label, sample: content }) => (
        <div key={label} {...stylex.props(styles.row)}>
          {content}
          <Caption render={<span />} sx={styles.label}>
            {label}
          </Caption>
        </div>
      ))}
    </div>
  );
}

function FontFamiliesDemo() {
  return <Specimen rows={families} />;
}

function FontSizesDemo() {
  return <Specimen rows={sizes} />;
}

function FontWeightsDemo() {
  return <Specimen rows={weightRows} />;
}

export { FontFamiliesDemo, FontSizesDemo, FontWeightsDemo };
