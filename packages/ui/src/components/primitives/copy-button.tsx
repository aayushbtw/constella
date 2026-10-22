"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
import { controlIconSize, visuallyHidden } from "@/lib/constella/styles";
import { durations, strokes } from "@/lib/constella/tokens.stylex";

type CopyButtonProps = Omit<ButtonProps, "onClick" | "value"> & {
  /** The text, or a function read at the press for text only the page holds, like highlighted code. */
  value: string | (() => string);
  /** The same content as HTML, for a target that takes it: a spreadsheet pastes a table as cells. */
  html?: string | (() => string);
};

function read(content: string | (() => string)) {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- content is a documented union of text or its getter
  return typeof content === "string" ? content : content();
}

// The Web clock takes bare milliseconds; the token carries `ms`.
const confirmFor = Number(durations.confirm.slice(0, -"ms".length));

/** Copies `value`, and shows a tick for a moment after. */
function CopyButton({
  "aria-label": label,
  children,
  html,
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
    const text = read(value);
    await (html === undefined
      ? navigator.clipboard.writeText(text)
      : navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([read(html)], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]));
    setCopies((count) => count + 1);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => {
      setCopies(0);
    }, confirmFor);
  }

  const labelled = children !== undefined;
  const buttonSize = size ?? (labelled ? "sm" : "icon-sm");
  const iconSize = controlIconSize[buttonSize];

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
