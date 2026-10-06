import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { colors, fontSizes, lineHeights, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  column: {
    flexDirection: "column",
    gap: space.md,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    margin: 0,
  },
});

function KbdDemo() {
  return (
    <DemoRow sx={styles.column}>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </DemoRow>
  );
}

function KbdGroupDemo() {
  return (
    <DemoRow>
      <p {...stylex.props(styles.text)}>
        Use{" "}
        <KbdGroup>
          <Kbd>Ctrl + B</Kbd>
          <Kbd>Ctrl + K</Kbd>
        </KbdGroup>{" "}
        to open the command palette
      </p>
    </DemoRow>
  );
}

function KbdButtonDemo() {
  return (
    <DemoRow>
      <Button size="sm" variant="outline">
        Accept <Kbd data-icon="inline-end">⏎</Kbd>
      </Button>
      <Button size="sm" variant="outline">
        Cancel <Kbd data-icon="inline-end">Esc</Kbd>
      </Button>
    </DemoRow>
  );
}

export { KbdButtonDemo, KbdDemo, KbdGroupDemo };
