import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { ScrollArea, ScrollBar } from "@/components/primitives/scroll-area";
import { Separator } from "@/components/primitives/separator";
import { Text } from "@/components/typography/text";
import { scrollFade } from "@/lib/constella/scroll-fade";
import { typeStyles } from "@/lib/constella/styles";
import { colors, radii, space, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const box = {
  borderBlockEndColor: colors.border,
  borderBlockStartColor: colors.border,
  borderInlineEndColor: colors.border,
  borderInlineStartColor: colors.border,
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
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  heading: {
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
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "repeat(6, max-content)",
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
    width: "max-content",
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
        <div {...stylex.props([typeStyles.textSm, styles.list])}>
          <Text render={<div />} size="sm" sx={styles.heading} weight="medium">
            Tags
          </Text>
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
      <ScrollArea scrollbar="horizontal" sx={styles.gallery}>
        <div {...stylex.props(styles.row)}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} {...stylex.props(styles.tile)} />
          ))}
        </div>
      </ScrollArea>
    </DemoRow>
  );
}

function ScrollAreaBothDemo() {
  return (
    <DemoRow>
      <ScrollArea sx={styles.sheet}>
        <div {...stylex.props(styles.grid)}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} {...stylex.props(styles.tile)} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DemoRow>
  );
}

function ScrollFadeDemo() {
  return (
    <DemoRow>
      <ScrollArea sx={styles.tags} viewportSx={scrollFade.y}>
        <div {...stylex.props([typeStyles.textSm, styles.list])}>
          <Text render={<div />} size="sm" sx={styles.heading} weight="medium">
            Tags
          </Text>
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

function ScrollFadeHorizontalDemo() {
  return (
    <DemoRow>
      <ScrollArea
        scrollbar="horizontal"
        sx={styles.gallery}
        viewportSx={scrollFade.x}
      >
        <div {...stylex.props(styles.row)}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} {...stylex.props(styles.tile)} />
          ))}
        </div>
      </ScrollArea>
    </DemoRow>
  );
}

export {
  ScrollAreaBothDemo,
  ScrollAreaDemo,
  ScrollAreaHorizontalDemo,
  ScrollFadeDemo,
  ScrollFadeHorizontalDemo,
};
