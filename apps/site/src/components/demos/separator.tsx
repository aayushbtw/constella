import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";
import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stack: {
    alignItems: "stretch",
    color: colors.textPrimary,
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: space.md,
    lineHeight: lineHeights.text,
    maxWidth: 384,
    width: "100%",
  },
  list: {
    gap: space.xs,
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  title: {
    fontWeight: fontWeights.medium,
  },
  muted: {
    color: colors.textSecondary,
  },
  small: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
  },
  inline: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    gap: space.md,
    height: 20,
    lineHeight: lineHeights.text,
  },
  menu: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    gap: space.md,
    lineHeight: lineHeights.text,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
  value: {
    color: colors.textSecondary,
    margin: 0,
  },
});

function SeparatorDemo() {
  return (
    <DemoRow sx={styles.stack}>
      <div {...stylex.props(styles.heading)}>
        <div {...stylex.props(styles.title)}>Constella</div>
        <div {...stylex.props(styles.muted)}>
          Components with the details done
        </div>
      </div>
      <Separator />
      <div>
        Accessible components built on Base UI and StyleX, ready to copy into
        your app.
      </div>
    </DemoRow>
  );
}

function SeparatorVerticalDemo() {
  return (
    <DemoRow sx={styles.inline}>
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </DemoRow>
  );
}

const menuItems = [
  { description: "Manage preferences", title: "Settings" },
  { description: "Profile & security", title: "Account" },
  { description: "Support & docs", title: "Help" },
];

function SeparatorMenuDemo() {
  return (
    <DemoRow sx={styles.menu}>
      {menuItems.map((item, index) => (
        <Fragment key={item.title}>
          {index > 0 && <Separator orientation="vertical" />}
          <div {...stylex.props(styles.heading)}>
            <span {...stylex.props(styles.title)}>{item.title}</span>
            <span {...stylex.props(styles.muted, styles.small)}>
              {item.description}
            </span>
          </div>
        </Fragment>
      ))}
    </DemoRow>
  );
}

const listItems = ["Item 1", "Item 2", "Item 3"];

function SeparatorListDemo() {
  return (
    <DemoRow sx={[styles.stack, styles.list]}>
      {listItems.map((item, index) => (
        <Fragment key={item}>
          {index > 0 && <Separator />}
          <dl {...stylex.props(styles.row)}>
            <dt>{item}</dt>
            <dd {...stylex.props(styles.value)}>Value {index + 1}</dd>
          </dl>
        </Fragment>
      ))}
    </DemoRow>
  );
}

export {
  SeparatorDemo,
  SeparatorListDemo,
  SeparatorMenuDemo,
  SeparatorVerticalDemo,
};
