import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  colors,
  durations,
  easings,
  media,
  presses,
  radii,
  sizes,
  strokes,
} from "@/lib/tokens.stylex";

const styles = stylex.create({
  copy: {
    alignItems: "center",
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
      ":active": colors.textPrimary,
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
      insetBlock: `calc((${sizes.controlXs} - ${sizes.hitArea}) / 2)`,
      insetInline: `calc((${sizes.controlXs} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
  },
});

const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

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
      <SwapIcon aria-hidden value={copied ? "copied" : "copy"}>
        <SwapIconItem value="copied">
          <HugeiconsIcon
            icon={Tick02Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
        <SwapIconItem value="copy">
          <HugeiconsIcon
            icon={Copy01Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
      </SwapIcon>
    </button>
  );
}

export { CopyButton };
