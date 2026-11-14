import * as stylex from "@stylexjs/stylex";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";

import type { Sx } from "@/lib/constella/styles";
import { colors, fonts, radii, space } from "@/lib/constella/tokens.stylex";

type CodeProps = Omit<PartProps<"code">, "className" | "style"> & {
  sx?: Sx;
};

const styles = stylex.create({
  base: {
    backgroundColor: colors.fill,
    boxDecorationBreak: "clone",
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    fontFamily: fonts.mono,
    fontSize: "0.875em",
    fontVariantLigatures: "none",
    paddingInlineStart: space.xxs,
    paddingInlineEnd: space.xxs,
  },
});

/** Code inside running text: a name, a value, a short command. */
function Code({ render, sx, ...props }: CodeProps) {
  return renderElement(
    "code",
    mergeProps({ "data-slot": "code" }, props, stylex.props(styles.base, sx)),
    render
  );
}

export { Code };
export type { CodeProps };
