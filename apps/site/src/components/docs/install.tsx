import * as stylex from "@stylexjs/stylex";

import { colors, fontSizes, radii, space } from "@/lib/tokens.stylex";
import { CopyButton } from "~/components/docs/copy-button";
import { config } from "~/lib/config";
import { shellTokens } from "~/lib/highlight";
import { fonts, lineHeights, shadows } from "~/lib/tokens.stylex";

const styles = stylex.create({
  command: {
    alignItems: "center",
    backgroundColor: colors.fillSubtle,
    borderRadius: radii.md,
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

// Keyed by offset, not index: two identical words would collide.
function keyedTokens(command: string) {
  let offset = 0;

  return shellTokens(command).map((token) => {
    const key = offset;
    offset += token.value.length;

    return { className: token.className, key, value: token.value };
  });
}

function Install({ name }: { name?: string }) {
  const command = `npx shadcn@latest add ${config.registry}/${name}`;

  return (
    <div {...stylex.props(styles.command)}>
      <code translate="no" {...stylex.props(styles.code)}>
        <span {...stylex.props(styles.prompt)}>$ </span>
        {keyedTokens(command).map((token) => (
          <span
            className={token.className && `th-token th-${token.className}`}
            key={token.key}
          >
            {token.value}
          </span>
        ))}
      </code>
      <CopyButton label="Copy command" text={() => command} />
    </div>
  );
}

export { Install };
