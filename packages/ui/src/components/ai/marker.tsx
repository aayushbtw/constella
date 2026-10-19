import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const markerVariants = ["default", "border", "separator"] as const;

type MarkerVariant = (typeof markerVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type MarkerProps = Styled<useRender.ComponentProps<"div">> & {
  variant?: MarkerVariant;
};

const inSeparator = ":is([data-slot='marker'][data-variant='separator'] > *)";

const rule = {
  backgroundColor: colors.border,
  content: "''",
  flex: 1,
  height: strokes.border,
  minWidth: 0,
};

const styles = stylex.create({
  marker: {
    alignItems: "center",
    color: {
      default: colors.textSecondary,
      [media.hover]: { default: null, ":is(a):hover": colors.textPrimary },
    },
    display: "flex",
    gap: space.xs,
    minHeight: sizes.icon,
    position: "relative",
    textAlign: "start",
    textDecorationLine: { default: "none", ":is(a)": "underline" },
    textUnderlineOffset: space.xxs,
    transitionDuration: durations.hover,
    transitionProperty: "color",
    transitionTimingFunction: "ease",
    width: "100%",
  },
  ruled: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    paddingBlockEnd: space.xs,
  },
  separator: {
    "::after": rule,
    "::before": rule,
  },
  icon: {
    display: "flex",
    flexShrink: 0,
    height: sizes.icon,
    width: sizes.icon,
  },
  content: {
    flex: { default: null, [inSeparator]: "none" },
    minWidth: 0,
    overflowWrap: "anywhere",
    textAlign: { default: null, [inSeparator]: "center" },
  },
});

/** A note in a conversation's flow: a status, a system line, or a labeled break. */
function Marker({ render, sx, variant = "default", ...props }: MarkerProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      props,
      stylex.props(
        [typeStyles.textSm, styles.marker],
        variant === "border" && styles.ruled,
        variant === "separator" && styles.separator,
        sx
      )
    ),
    render,
    // Base UI writes state as data attributes: `data-slot`, `data-variant`.
    state: { slot: "marker", variant },
  });
}

function MarkerIcon({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      data-slot="marker-icon"
      {...props}
      {...stylex.props(styles.icon, sx)}
    />
  );
}

function MarkerContent({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="marker-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

export { Marker, MarkerContent, MarkerIcon, markerVariants };
export type { MarkerProps, MarkerVariant };
