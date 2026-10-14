import {
  Copy01Icon,
  FileViewIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  presses,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { markdownPath } from "~/lib/markdown";

const styles = stylex.create({
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.md,
  },
  // Text actions, not buttons: they sit under the page's title, quieter than it.
  action: {
    alignItems: "center",
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
      ":active": colors.textPrimary,
    },
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    position: "relative",
    textDecorationLine: "none",
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
    "::before": {
      content: "''",
      insetBlock: `calc((100% - ${sizes.hitArea}) / 2)`,
      insetInline: 0,
      position: "absolute",
    },
  },
});

const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

function Glyph({ icon }: { icon: IconSvgElement }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function PageActions({ markdown }: { markdown: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, confirmFor);
  }

  return (
    <div {...stylex.props(styles.row)}>
      <button
        aria-label={copied ? "Copied" : undefined}
        onClick={() => {
          void copy();
        }}
        type="button"
        {...stylex.props(styles.action)}
      >
        <SwapIcon aria-hidden value={copied ? "copied" : "copy"}>
          <SwapIconItem value="copied">
            <Glyph icon={Tick02Icon} />
          </SwapIconItem>
          <SwapIconItem value="copy">
            <Glyph icon={Copy01Icon} />
          </SwapIconItem>
        </SwapIcon>
        Copy as Markdown
      </button>
      <Separator orientation="vertical" />
      <a
        href={markdownPath(pathname.slice(1))}
        {...stylex.props(styles.action)}
      >
        <Glyph icon={FileViewIcon} />
        View as Markdown
      </a>
    </div>
  );
}

export { PageActions };
