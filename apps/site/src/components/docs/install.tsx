import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  motion,
  presses,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { shellTokens } from "~/site/highlight";
import {
  durations as siteDurations,
  fonts,
  lineHeights,
  shadows,
} from "~/site/tokens.stylex";

const styles = stylex.create({
  frame: {
    backgroundColor: colors.fill,
    borderRadius: radii.md,
    boxShadow: shadows.card,
    padding: space.xxs,
  },
  command: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.card,
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    gap: space.md,
    lineHeight: lineHeights.code,
    paddingBlock: space.xs,
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
  copy: {
    alignItems: "center",
    borderRadius: radii.xs,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
    },
    display: "flex",
    height: sizes.controlSm,
    justifyContent: "center",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
    width: sizes.controlSm,
  },
  // Both icons share one cell, so the swap is a crossfade in place.
  icons: {
    display: "grid",
  },
  icon: {
    display: "flex",
    gridArea: "1 / 1",
    transitionDuration: durations.crossfade,
    transitionProperty: {
      default: "opacity, filter, transform",
      [media.reducedMotion]: "opacity, filter",
    },
    transitionTimingFunction: easings.crossfade,
  },
  hidden: {
    filter: `blur(${motion.crossfadeBlur})`,
    opacity: 0,
    transform: `scale(${motion.crossfadeScale})`,
  },
});

const confirmFor = Number(siteDurations.confirm.slice(0, -"ms".length));

// Keyed by offset, not index: two identical words would collide.
function keyedTokens(command: string) {
  let offset = 0;

  return shellTokens(command).map((token) => {
    const key = offset;
    offset += token.value.length;

    return { className: token.className, key, value: token.value };
  });
}

function Install({ name, url }: { name?: string; url: string }) {
  const command = `npx shadcn@latest add ${url}/r/${name}.json`;
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, confirmFor);
  }

  return (
    <div {...stylex.props(styles.frame)}>
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

        <button
          aria-label={copied ? "Copied" : "Copy command"}
          onClick={() => {
            void copy();
          }}
          type="button"
          {...stylex.props(styles.copy)}
        >
          <span aria-hidden {...stylex.props(styles.icons)}>
            <span {...stylex.props(styles.icon, !copied && styles.hidden)}>
              <HugeiconsIcon
                icon={Tick02Icon}
                size={sizes.icon}
                strokeWidth={Number(strokes.icon)}
              />
            </span>
            <span {...stylex.props(styles.icon, copied && styles.hidden)}>
              <HugeiconsIcon
                icon={Copy01Icon}
                size={sizes.icon}
                strokeWidth={Number(strokes.icon)}
              />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export { Install };
