import * as stylex from "@stylexjs/stylex";

import { Caption } from "@/components/typography/caption";
import type { CaptionSize } from "@/components/typography/caption";
import { Heading } from "@/components/typography/heading";
import type { HeadingSize } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import type { TextSize } from "@/components/typography/text";
import type { TextColor } from "@/lib/constella/styles";
import { space } from "@/lib/constella/tokens.stylex";
import { Stage } from "~/components/demos/frame";

const headingSizes: HeadingSize[] = [1, 2, 3, 4, 5, 6];
const textSizes: TextSize[] = ["lg", "base", "sm"];
const captionSizes: CaptionSize[] = ["lg", "base", "sm", "xs"];
const textColors: TextColor[] = [
  "primary",
  "secondary",
  "muted",
  "danger",
  "success",
  "warning",
  "info",
];

const styles = stylex.create({
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: 420,
    width: "100%",
  },
  tight: {
    gap: space.xxs,
  },
});

function HeadingDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack, styles.tight)}>
        <Caption>Billing</Caption>
        <Heading level={3} size={4}>
          Upgrade to Pro
        </Heading>
        <Text color="secondary">
          Unlimited projects, priority support and a 30-day history.
        </Text>
      </div>
    </Stage>
  );
}

function TextDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack, styles.tight)}>
        <Text weight="medium">Weekly digest</Text>
        <Text color="secondary">
          A summary of what changed in your projects, sent every Monday.
        </Text>
      </div>
    </Stage>
  );
}

function HeadingSizeDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        {headingSizes.map((size) => (
          <Heading key={size} level={3} size={size}>
            Heading {size}
          </Heading>
        ))}
      </div>
    </Stage>
  );
}

function TextSizeDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        {textSizes.map((size) => (
          <Text key={size} size={size}>
            The quick brown fox jumps over the lazy dog.
          </Text>
        ))}
      </div>
    </Stage>
  );
}

function TextWeightDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        <Text weight="regular">Regular</Text>
        <Text weight="semimedium">Semimedium</Text>
        <Text weight="medium">Medium</Text>
        <Text weight="semibold">Semibold</Text>
      </div>
    </Stage>
  );
}

function TextColorDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        {textColors.map((color) => (
          <Text color={color} key={color}>
            {color}
          </Text>
        ))}
      </div>
    </Stage>
  );
}

function CaptionDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack, styles.tight)}>
        <Text weight="medium">Invoice #1042</Text>
        <Caption>Paid on March 3 by Alex Smith</Caption>
      </div>
    </Stage>
  );
}

function CaptionSizeDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        {captionSizes.map((size) => (
          <Caption key={size} size={size}>
            Paid on March 3 by Alex Smith
          </Caption>
        ))}
      </div>
    </Stage>
  );
}

function CaptionCaseDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.stack)}>
        <Caption>Billing</Caption>
        <Caption uppercase>Billing</Caption>
      </div>
    </Stage>
  );
}

export {
  CaptionCaseDemo,
  CaptionDemo,
  CaptionSizeDemo,
  HeadingDemo,
  HeadingSizeDemo,
  TextColorDemo,
  TextDemo,
  TextSizeDemo,
  TextWeightDemo,
};
