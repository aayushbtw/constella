import * as stylex from "@stylexjs/stylex";

import { colors, shadows } from "@/lib/constella/tokens.stylex";
import { Tile, Tiles } from "~/components/demos/frame";

const styles = stylex.create({
  tiles: {
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  },
  surface: {
    backgroundColor: colors.raised,
    height: 120,
  },
  default: {
    boxShadow: shadows.default,
  },
  lg: {
    boxShadow: shadows.lg,
  },
  xl: {
    boxShadow: shadows.xl,
  },
});

const tiles = ["default", "lg", "xl"] as const;

function ShadowsDemo() {
  return (
    <Tiles sx={styles.tiles}>
      {tiles.map((token) => (
        <Tile key={token} sx={[styles.surface, styles[token]]} token={token} />
      ))}
    </Tiles>
  );
}

export { ShadowsDemo };
