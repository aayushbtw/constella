import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const inTooltip = ":where([data-slot='tooltip-popup'] *)";

const styles = stylex.create({
  kbd: {
    alignItems: "center",
    backgroundColor: { default: colors.fill, [inTooltip]: colors.onAccentFill },
    borderRadius: radii.xs,
    color: { default: colors.textSecondary, [inTooltip]: colors.onAccent },
    display: "inline-flex",
    // `<kbd>` is monospace by default.
    fontFamily: "inherit",
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    gap: space.xxs,
    height: sizes.kbd,
    justifyContent: "center",
    lineHeight: 1,
    minWidth: sizes.kbd,
    paddingInline: space.xxs,
    pointerEvents: "none",
    userSelect: "none",
  },
  group: {
    alignItems: "center",
    display: "inline-flex",
    fontFamily: "inherit",
    gap: space.xxs,
  },
});

function Kbd({ sx, ...props }: Styled<ComponentProps<"kbd">>) {
  return <kbd data-slot="kbd" {...props} {...stylex.props(styles.kbd, sx)} />;
}

function KbdGroup({ sx, ...props }: Styled<ComponentProps<"kbd">>) {
  return (
    <kbd data-slot="kbd-group" {...props} {...stylex.props(styles.group, sx)} />
  );
}

export { Kbd, KbdGroup };
