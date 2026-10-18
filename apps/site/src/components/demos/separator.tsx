import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { Separator } from "@/components/primitives/separator";
import { Text } from "@/components/typography/text";
import { typeStyles } from "@/lib/constella/styles";
import { colors, space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stack: {
    alignItems: "stretch",
    color: colors.textPrimary,
    flexDirection: "column",
    gap: space.md,
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
  inline: {
    color: colors.textPrimary,
    gap: space.md,
    height: 20,
  },
  menu: {
    color: colors.textPrimary,
    gap: space.md,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBlock: 0,
    marginInline: 0,
  },
  value: {
    color: colors.textSecondary,
    marginBlock: 0,
    marginInline: 0,
  },
});

function SeparatorDemo() {
  return (
    <DemoRow sx={[typeStyles.textSm, styles.stack]}>
      <div {...stylex.props(styles.heading)}>
        <Text render={<div />} size="sm" weight="medium">
          Constella
        </Text>
        <Text color="secondary" size="sm">
          Components with the details done
        </Text>
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
    <DemoRow sx={[typeStyles.textSm, styles.inline]}>
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
    <DemoRow sx={[typeStyles.textSm, styles.menu]}>
      {menuItems.map((item, index) => (
        <Fragment key={item.title}>
          {index > 0 && <Separator orientation="vertical" />}
          <div {...stylex.props(styles.heading)}>
            <Text render={<span />} size="sm" weight="medium">
              {item.title}
            </Text>
            <Text color="secondary" render={<span />} size="sm">
              {item.description}
            </Text>
          </div>
        </Fragment>
      ))}
    </DemoRow>
  );
}

const listItems = ["Item 1", "Item 2", "Item 3"];

function SeparatorListDemo() {
  return (
    <DemoRow sx={[[typeStyles.textSm, styles.stack], styles.list]}>
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
