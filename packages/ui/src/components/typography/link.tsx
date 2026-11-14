import * as stylex from "@stylexjs/stylex";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";

import type { Sx } from "@/lib/constella/styles";
import { colors, durations, media, space } from "@/lib/constella/tokens.stylex";

type LinkProps = Omit<PartProps<"a">, "className" | "style"> & {
  sx?: Sx;
};

const styles = stylex.create({
  base: {
    color: colors.textPrimary,
    textDecorationColor: {
      default: colors.border,
      [media.hover]: {
        default: colors.border,
        ":hover": colors.textPrimary,
      },
      ":active": colors.textPrimary,
    },
    textDecorationLine: "underline",
    textUnderlineOffset: space.xxs,
    transitionDuration: durations.hover,
    transitionProperty: "text-decoration-color",
    transitionTimingFunction: "ease",
  },
});

/** A link inside running text. Pass a router's link as `render`. */
function Link({ render, sx, ...props }: LinkProps) {
  return renderElement(
    "a",
    mergeProps({ "data-slot": "link" }, props, stylex.props(styles.base, sx)),
    render
  );
}

export { Link };
export type { LinkProps };
