import * as stylex from "@stylexjs/stylex";

import { Caption, Heading, Text } from "@/components/ui/typography";
import type {
  HeadingSize,
  TextSize,
  TypeColor,
} from "@/components/ui/typography";
import { space } from "@/lib/constella/tokens.stylex";
import { Stage } from "~/components/demos/frame";

const headingSizes: HeadingSize[] = [1, 2, 3, 4, 5, 6];
const textSizes: TextSize[] = ["lg", "base", "sm"];
const textColors: TypeColor[] = [
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

function TypographyDemo() {
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

export {
  CaptionDemo,
  HeadingSizeDemo,
  TextColorDemo,
  TextSizeDemo,
  TextWeightDemo,
  TypographyDemo,
};
