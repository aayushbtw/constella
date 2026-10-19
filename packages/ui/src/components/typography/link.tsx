import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import type { Sx } from "@/lib/constella/styles";
import { colors, durations, media, space } from "@/lib/constella/tokens.stylex";

type LinkProps = Omit<useRender.ComponentProps<"a">, "className" | "style"> & {
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
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(props, stylex.props(styles.base, sx)),
    render,
    state: { slot: "link" },
  });
}

export { Link };
export type { LinkProps };
