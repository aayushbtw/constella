import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoControls, Stage, Well } from "~/components/demos/frame";
import {
  fontSizes as siteFontSizes,
  fonts,
  lineHeights as siteLineHeights,
} from "~/site/tokens.stylex";

const sample = "Quiet, crisp, and finished.";

const sizes = [
  { name: "sm", value: fontSizes.sm },
  { name: "xs", value: fontSizes.xs },
  { name: "xxs", value: fontSizes.xxs },
] as const;

const weights = [
  { label: "Regular", name: "regular", value: fontWeights.regular },
  { label: "Medium", name: "medium", value: fontWeights.medium },
  { label: "Semibold", name: "semibold", value: fontWeights.semibold },
] as const;

type Weight = (typeof weights)[number]["name"];

const glyphs = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789 !?&@#%",
];

const styles = stylex.create({
  well: {
    borderRadius: radii.md,
    maxWidth: 520,
    width: "100%",
  },
  panel: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  specimen: {
    alignItems: "center",
    display: "grid",
    gap: space.lg,
    gridTemplateColumns: "auto minmax(0, 1fr)",
    padding: space.lg,
  },
  glyph: {
    color: colors.textPrimary,
    fontSize: siteFontSizes.specimen,
    letterSpacing: "-0.04em",
    lineHeight: siteLineHeights.specimen,
  },
  about: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    minWidth: 0,
  },
  family: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  set: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    letterSpacing: "0.04em",
    overflowWrap: "anywhere",
  },
  row: {
    alignItems: "baseline",
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "40px minmax(0, 1fr) auto",
    paddingBlock: space.md,
    paddingInline: space.lg,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    // The tabs set the sample's weight, not the labels'.
    fontWeight: fontWeights.regular,
  },
  text: {
    color: colors.textPrimary,
    lineHeight: lineHeights.row,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  size: (fontSize: string) => ({
    fontSize,
  }),
  weight: (fontWeight: string) => ({
    fontWeight,
  }),
  fullWidth: {
    width: "100%",
  },
});

function TypographyDemo() {
  const [weight, setWeight] = useState<Weight>("regular");
  const fontWeight =
    weights.find(({ name }) => name === weight)?.value ?? fontWeights.regular;

  return (
    <>
      <Stage>
        <Well sx={styles.well}>
          <div {...stylex.props(styles.panel, styles.weight(fontWeight))}>
            <div {...stylex.props(styles.specimen)}>
              <span aria-hidden {...stylex.props(styles.glyph)}>
                Aa
              </span>
              <div {...stylex.props(styles.about)}>
                <p {...stylex.props(styles.family)}>Inter</p>
                <div>
                  {glyphs.map((line) => (
                    <p key={line} {...stylex.props(styles.set)}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {sizes.map(({ name, value }) => (
              <div key={name} {...stylex.props(styles.row)}>
                <span {...stylex.props(styles.label)}>{name}</span>
                <span {...stylex.props(styles.text, styles.size(value))}>
                  {sample}
                </span>
                <span {...stylex.props(styles.label)}>
                  {value} / {lineHeights.row}
                </span>
              </div>
            ))}
          </div>
        </Well>
      </Stage>
      <DemoControls>
        <Tabs
          onValueChange={(value: Weight) => {
            setWeight(value);
          }}
          value={weight}
        >
          <TabsList sx={styles.fullWidth}>
            {weights.map(({ label, name, value }) => (
              <TabsTrigger key={name} value={name}>
                {label} {value}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </DemoControls>
    </>
  );
}

export { TypographyDemo };
