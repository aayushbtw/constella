import * as stylex from "@stylexjs/stylex";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { radii, sizes, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { alignItems: "center", display: "flex", gap: space.md },
  lines: { display: "flex", flexDirection: "column", gap: space.xs },
  avatar: {
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    height: sizes.media,
    width: sizes.media,
  },
  line: { height: space.md, width: 240 },
  short: { height: space.md, width: 192 },
  card: { maxWidth: "100%", width: 320 },
  image: { aspectRatio: "16 / 9", width: "100%" },
});

function SkeletonDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.row)}>
        <Skeleton sx={styles.avatar} />
        <div {...stylex.props(styles.lines)}>
          <Skeleton sx={styles.line} />
          <Skeleton sx={styles.short} />
        </div>
      </div>
    </DemoRow>
  );
}

function SkeletonCardDemo() {
  return (
    <DemoRow>
      <Card sx={styles.card}>
        <CardHeader>
          <Skeleton sx={styles.short} />
        </CardHeader>
        <CardContent>
          <Skeleton sx={styles.image} />
        </CardContent>
      </Card>
    </DemoRow>
  );
}

export { SkeletonCardDemo, SkeletonDemo };
