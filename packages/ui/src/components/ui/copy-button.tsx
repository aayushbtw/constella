"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import { visuallyHidden } from "@/lib/constella/styles";
import { durations, sizes, strokes } from "@/lib/constella/tokens.stylex";

type CopyButtonProps = Omit<ButtonProps, "onClick" | "value"> & {
  /** The text, or a function read at the press for text only the page holds, like highlighted code. */
  value: string | (() => string);
};

// The Web clock takes bare milliseconds; the token carries `ms`.
const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

const labelledIconSizes: Partial<
  Record<NonNullable<ButtonProps["size"]>, string>
> = { sm: sizes.iconSm, xs: sizes.iconXs };

/** Copies `value`, and shows a tick for a moment after. */
function CopyButton({
  "aria-label": label,
  children,
  size,
  value,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [copies, setCopies] = useState(0);
  const copied = copies > 0;
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText(
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- `value` is a documented union of text or its getter
      typeof value === "string" ? value : value()
    );
    setCopies((count) => count + 1);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopies(0);
    }, confirmFor);
  }

  const labelled = children !== undefined;
  const buttonSize = size ?? (labelled ? "sm" : "icon-sm");
  const iconSize = labelled
    ? (labelledIconSizes[buttonSize] ?? sizes.icon)
    : sizes.icon;

  return (
    <>
      <Button
        aria-label={label ?? (labelled ? undefined : "Copy")}
        data-slot="copy-button"
        onClick={() => {
          void copy();
        }}
        size={buttonSize}
        variant={variant}
        {...props}
      >
        <SwapIcon
          aria-hidden
          data-icon={labelled ? "inline-start" : undefined}
          value={copied ? "copied" : "copy"}
        >
          <SwapIconItem value="copied">
            <HugeiconsIcon
              icon={Tick02Icon}
              size={iconSize}
              strokeWidth={Number(strokes.icon)}
            />
          </SwapIconItem>
          <SwapIconItem value="copy">
            <HugeiconsIcon
              icon={Copy01Icon}
              size={iconSize}
              strokeWidth={Number(strokes.icon)}
            />
          </SwapIconItem>
        </SwapIcon>
        {children}
      </Button>
      {/* Outside the button, or its text would join the button's name. */}
      <output aria-live="polite" {...stylex.props(visuallyHidden.base)}>
        {/* A fresh node per press, so a repeat press is announced again. */}
        {copied && <span key={copies}>Copied</span>}
      </output>
    </>
  );
}

export { CopyButton };
export type { CopyButtonProps };
