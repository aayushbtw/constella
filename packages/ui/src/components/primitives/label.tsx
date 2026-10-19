import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import { colors, fontWeights, space } from "@/lib/constella/tokens.stylex";

type LabelProps = Omit<ComponentProps<"label">, "className" | "style"> & {
  sx?: Sx;
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
    fontWeight: fontWeights.medium,
    gap: space.xs,
    overflowWrap: "anywhere",
    userSelect: "none",
  },
});

/** For a field's own label part (`SliderLabel`), so every field labels alike. */
function labelStyles() {
  return [typeStyles.textSm, styles.label];
}

function Label({ sx, ...props }: LabelProps) {
  return (
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- the caller passes `htmlFor` or wraps the control
    <label
      data-slot="label"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.label], sx)}
    />
  );
}

export { Label, labelStyles };
export type { LabelProps };
