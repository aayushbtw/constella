import * as stylex from "@stylexjs/stylex";

import { colors, fontSizes, radii, space, fonts } from "@/lib/tokens.stylex";
import { CodeTokens } from "~/components/docs/code-tokens";
import { CopyButton } from "~/components/docs/copy-button";
import { config } from "~/lib/config";
import { shellTokens } from "~/lib/highlight";
import { lineHeights, shadows } from "~/lib/tokens.stylex";

const styles = stylex.create({
  command: {
    alignItems: "center",
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.card,
    display: "flex",
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xs,
    gap: space.md,
    lineHeight: lineHeights.code,
    paddingBlock: space.sm,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.md,
  },
  code: {
    flexGrow: 1,
    minWidth: 0,
    overflowX: "auto",
    scrollbarWidth: "none",
    whiteSpace: "nowrap",
  },
  prompt: {
    color: colors.textMuted,
    userSelect: "none",
  },
});

function Install({ name }: { name?: string }) {
  const command = `npx shadcn@latest add ${config.registry}/${name}`;

  return (
    <div {...stylex.props(styles.command)}>
      <code translate="no" {...stylex.props(styles.code)}>
        <span {...stylex.props(styles.prompt)}>$ </span>
        <CodeTokens tokens={shellTokens(command)} />
      </code>
      <CopyButton label="Copy command" text={() => command} />
    </div>
  );
}

export { Install };
