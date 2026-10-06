"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";

import { colors, strokes } from "@/lib/tokens.stylex";

type SeparatorProps = Omit<SeparatorPrimitive.Props, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  separator: {
    backgroundColor: colors.edge,
    flexShrink: 0,
  },
  horizontal: {
    height: strokes.border,
    width: "100%",
  },
  vertical: {
    alignSelf: "stretch",
    width: strokes.border,
  },
});

function Separator({
  orientation = "horizontal",
  sx,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...props}
      {...stylex.props(styles.separator, styles[orientation], sx)}
    />
  );
}

export { Separator };
export type { SeparatorProps };
