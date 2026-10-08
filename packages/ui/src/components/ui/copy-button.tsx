"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import { durations, sizes, strokes } from "@/lib/tokens.stylex";

type CopyButtonProps = Omit<ButtonProps, "children" | "onClick" | "value"> & {
  value: string;
};

// The Web clock takes bare milliseconds; the token carries `ms`.
const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

/** Copies `value`, and shows a tick for a moment after. */
function CopyButton({
  "aria-label": label = "Copy",
  size = "icon-sm",
  value,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(
    () => () => {
      clearTimeout(timeout.current ?? undefined);
    },
    []
  );

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, confirmFor);
  }

  return (
    <Button
      aria-label={copied ? "Copied" : label}
      data-slot="copy-button"
      onClick={() => {
        void copy();
      }}
      size={size}
      variant={variant}
      {...props}
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
    </Button>
  );
}

export { CopyButton };
export type { CopyButtonProps };
