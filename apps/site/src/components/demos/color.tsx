import * as stylex from "@stylexjs/stylex";

import { typeStyles } from "@/lib/constella/styles";
import { colors, radii, sizes } from "@/lib/constella/tokens.stylex";
import { Tile, Tiles } from "~/components/demos/frame";

type Kind = "border" | "fill" | "text";

interface Swatch {
  color: string;
  kind: Kind;
  // The surface the token is drawn on, for tokens that only sit on one.
  on?: string;
  token: string;
}

const surfaces: Swatch[] = [
  { color: colors.background, kind: "fill", token: "background" },
  { color: colors.sidebar, kind: "fill", token: "sidebar" },
  { color: colors.raised, kind: "fill", token: "raised" },
  { color: colors.well, kind: "fill", token: "well" },
];

const text: Swatch[] = [
  { color: colors.textPrimary, kind: "text", token: "textPrimary" },
  { color: colors.textSecondary, kind: "text", token: "textSecondary" },
  { color: colors.textMuted, kind: "text", token: "textMuted" },
];

const border: Swatch[] = [
  { color: colors.border, kind: "border", token: "border" },
  { color: colors.borderSubtle, kind: "border", token: "borderSubtle" },
  { color: colors.dangerBorder, kind: "border", token: "dangerBorder" },
];

const fill: Swatch[] = [
  { color: colors.fillSubtle, kind: "fill", token: "fillSubtle" },
  { color: colors.fill, kind: "fill", token: "fill" },
  { color: colors.fillStrong, kind: "fill", token: "fillStrong" },
  { color: colors.fillOpaque, kind: "fill", token: "fillOpaque" },
  {
    color: colors.fillOnStrong,
    kind: "fill",
    on: colors.fillStrong,
    token: "fillOnStrong",
  },
];

const accent: Swatch[] = [
  { color: colors.accentSolid, kind: "fill", token: "accentSolid" },
  {
    color: colors.accentOnSolid,
    kind: "text",
    on: colors.accentSolid,
    token: "accentOnSolid",
  },
];

const inverted: Swatch[] = [
  { color: colors.invertedSolid, kind: "fill", token: "invertedSolid" },
  {
    color: colors.invertedOnSolid,
    kind: "text",
    on: colors.invertedSolid,
    token: "invertedOnSolid",
  },
  {
    color: colors.invertedFill,
    kind: "fill",
    on: colors.invertedSolid,
    token: "invertedFill",
  },
];

// A row per status: its text, its tint and the tint's hover, then its solid.
const status: Swatch[] = [
  { color: colors.dangerText, kind: "text", token: "dangerText" },
  { color: colors.dangerSubtle, kind: "fill", token: "dangerSubtle" },
  { color: colors.dangerSubtleHover, kind: "fill", token: "dangerSubtleHover" },
  { color: colors.dangerSolid, kind: "fill", token: "dangerSolid" },
  { color: colors.successText, kind: "text", token: "successText" },
  { color: colors.successSubtle, kind: "fill", token: "successSubtle" },
  {
    color: colors.successSubtleHover,
    kind: "fill",
    token: "successSubtleHover",
  },
  { color: colors.successSolid, kind: "fill", token: "successSolid" },
  { color: colors.warningText, kind: "text", token: "warningText" },
  { color: colors.warningSubtle, kind: "fill", token: "warningSubtle" },
  {
    color: colors.warningSubtleHover,
    kind: "fill",
    token: "warningSubtleHover",
  },
  { color: colors.warningSolid, kind: "fill", token: "warningSolid" },
  { color: colors.infoText, kind: "text", token: "infoText" },
  { color: colors.infoSubtle, kind: "fill", token: "infoSubtle" },
  { color: colors.infoSubtleHover, kind: "fill", token: "infoSubtleHover" },
  { color: colors.infoSolid, kind: "fill", token: "infoSolid" },
  {
    color: colors.infoOnSolid,
    kind: "text",
    on: colors.infoSolid,
    token: "infoOnSolid",
  },
];

const styles = stylex.create({
  paint: (color: string) => ({
    backgroundColor: color,
  }),
  // In place of the tile's own ring, so the edge shown is the token's.
  border: (color: string) => ({
    boxShadow: `inset 0 0 0 1px ${color}`,
  }),
  text: (color: string) => ({
    color,
  }),
  chip: {
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    height: sizes.controlMd,
    width: sizes.controlMd,
  },
});

function Swatches({ swatches }: { swatches: Swatch[] }) {
  return (
    <Tiles>
      {swatches.map(({ color, kind, on, token }) => {
        // On its surface, a fill is a chip so the surface shows around it.
        const chip = kind === "fill" && on !== undefined;

        return (
          <Tile
            key={token}
            sx={[
              on !== undefined && styles.paint(on),
              kind === "border" && styles.border(color),
              kind === "text" && [typeStyles.heading5, styles.text(color)],
              kind === "fill" && !chip && styles.paint(color),
            ]}
            token={token}
          >
            {kind === "text" ? "Aa" : null}
            {chip ? (
              <span {...stylex.props(styles.chip, styles.paint(color))} />
            ) : null}
          </Tile>
        );
      })}
    </Tiles>
  );
}

function ColorSurfacesDemo() {
  return <Swatches swatches={surfaces} />;
}

function ColorTextDemo() {
  return <Swatches swatches={text} />;
}

function ColorBorderDemo() {
  return <Swatches swatches={border} />;
}

function ColorFillDemo() {
  return <Swatches swatches={fill} />;
}

function ColorAccentDemo() {
  return <Swatches swatches={accent} />;
}

function ColorInvertedDemo() {
  return <Swatches swatches={inverted} />;
}

function ColorStatusDemo() {
  return <Swatches swatches={status} />;
}

export {
  ColorAccentDemo,
  ColorBorderDemo,
  ColorFillDemo,
  ColorInvertedDemo,
  ColorStatusDemo,
  ColorSurfacesDemo,
  ColorTextDemo,
};
