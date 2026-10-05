import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  presses,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/tokens.stylex";

// Stands in for Button in demos until the library has one.
const styles = stylex.create({
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
  trigger: {
    backgroundColor: {
      default: colors.background,
      [media.hover]: {
        default: colors.background,
        ":hover": colors.fillSubtle,
      },
    },
    borderRadius: radii.sm,
    boxShadow: shadows.ring,
    fontSize: fontSizes.sm,
    height: sizes.controlMd,
    paddingInline: space.sm,
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, background-color",
    transitionTimingFunction: `${easings.out}, ease`,
  },
});

function DemoRow(props: Omit<ComponentProps<"div">, "className" | "style">) {
  return <div {...props} {...stylex.props(styles.row)} />;
}

function DemoButton(
  props: Omit<ComponentProps<"button">, "className" | "style" | "type">
) {
  return <button type="button" {...props} {...stylex.props(styles.trigger)} />;
}

export { DemoButton, DemoRow };
