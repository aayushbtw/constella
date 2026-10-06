import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
} from "@/lib/tokens.stylex";

type LabelProps = Omit<ComponentProps<"label">, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  label: {
    alignItems: "center",
    // The control fades itself, so the label steps down instead of stacking a second fade.
    color: {
      default: colors.textPrimary,
      ":is([data-disabled], :has([data-disabled], :disabled))":
        colors.textMuted,
    },
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    lineHeight: lineHeights.text,
    userSelect: "none",
  },
});

/** For a field's own label part (`SliderLabel`), so every field labels alike. */
function labelStyles() {
  return styles.label;
}

function Label({ sx, ...props }: LabelProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- the caller passes `htmlFor` or wraps the control
    <label data-slot="label" {...props} {...stylex.props(styles.label, sx)} />
  );
}

export { Label, labelStyles };
export type { LabelProps };
