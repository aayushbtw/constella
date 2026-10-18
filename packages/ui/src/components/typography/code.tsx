import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";

import { colors, fonts, radii, space } from "@/lib/constella/tokens.stylex";

type CodeProps = Omit<
  useRender.ComponentProps<"code">,
  "className" | "style"
> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  base: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    fontFamily: fonts.mono,
    fontSize: "0.875em",
    fontVariantLigatures: "none",
    paddingBlockStart: space.xxxs,
    paddingBlockEnd: space.xxxs,
    paddingInlineStart: space.xxs,
    paddingInlineEnd: space.xxs,
  },
});

/** Code inside running text: a name, a value, a short command. */
function Code({ render, sx, ...props }: CodeProps) {
  return useRender({
    defaultTagName: "code",
    props: mergeProps<"code">(props, stylex.props(styles.base, sx)),
    render,
    state: { slot: "code" },
  });
}

export { Code };
export type { CodeProps };
