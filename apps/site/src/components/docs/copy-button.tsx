import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import {
  colors,
  durations,
  easings,
  media,
  motion,
  presses,
  radii,
  sizes,
  strokes,
} from "@/lib/tokens.stylex";
import { durations as siteDurations } from "~/site/tokens.stylex";

const styles = stylex.create({
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
    flexShrink: 0,
    height: sizes.controlXs,
    justifyContent: "center",
    position: "relative",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
    width: sizes.controlXs,
    "::before": {
      content: "''",
      inset: `calc((${sizes.controlXs} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
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

function CopyButton({
  label = "Copy",
  sx,
  text,
}: {
  label?: string;
  sx?: stylex.StyleXStyles;
  text: () => string;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText(text());
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, confirmFor);
  }

  return (
    <button
      aria-label={copied ? "Copied" : label}
      onClick={() => {
        void copy();
      }}
      type="button"
      {...stylex.props(styles.copy, sx)}
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
  );
}

export { CopyButton };
