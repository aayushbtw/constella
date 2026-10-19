"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";

import type { Sx } from "@/lib/constella/styles";
import { colors, strokes } from "@/lib/constella/tokens.stylex";

type SeparatorProps = Omit<SeparatorPrimitive.Props, "className" | "style"> & {
  sx?: Sx;
};

const styles = stylex.create({
  separator: {
    backgroundColor: colors.borderSubtle,
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
