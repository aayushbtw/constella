import { FileViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useRouterState } from "@tanstack/react-router";

import { buttonStyles } from "@/components/primitives/button";
import { CopyButton } from "@/components/primitives/copy-button";
import { colors, sizes, space, strokes } from "@/lib/constella/tokens.stylex";
import { markdownPath } from "~/lib/markdown";

const styles = stylex.create({
  action: {
    color: colors.textSecondary,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
  },
});

function PageActions({ markdown }: { markdown: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div {...stylex.props(styles.row)}>
      <CopyButton sx={styles.action} value={markdown}>
        Copy as Markdown
      </CopyButton>
      <a
        href={markdownPath(pathname.slice(1))}
        {...stylex.props(
          buttonStyles({ size: "sm", variant: "ghost" }),
          styles.action
        )}
      >
        <HugeiconsIcon
          aria-hidden
          data-icon="inline-start"
          icon={FileViewIcon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
        View as Markdown
      </a>
    </div>
  );
}

export { PageActions };
