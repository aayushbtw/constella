"use client";

import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type {
  InputGroupAddonProps,
  InputGroupButtonProps,
} from "@/components/ui/input-group";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import type { TextareaProps } from "@/components/ui/textarea";
import {
  fontSizes,
  lineHeights,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const promptInputStatuses = ["ready", "submitted", "streaming"] as const;

type PromptInputStatus = (typeof promptInputStatuses)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  form: {
    width: "100%",
  },
  // The composer is the roomiest surface, so it takes the top of the corner ladder.
  group: {
    borderStartStartRadius: radii.xl,
    borderStartEndRadius: radii.xl,
    borderEndStartRadius: radii.xl,
    borderEndEndRadius: radii.xl,
    height: "auto",
  },
  textarea: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.prose,
    // Grows with its text up to six control heights, then scrolls.
    maxHeight: `calc(${sizes.controlMd} * 6)`,
    minHeight: sizes.controlLg,
    overflowY: "auto",
  },
  footer: {
    justifyContent: "space-between",
  },
  tools: {
    alignItems: "center",
    display: "flex",
    gap: space.xxs,
  },
});

/** A form around an input group: submit it with Enter or the submit button. */
function PromptInput({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"form">>) {
  return (
    <form
      data-slot="prompt-input"
      {...props}
      {...stylex.props(styles.form, sx)}
    >
      <InputGroup sx={styles.group}>{children}</InputGroup>
    </form>
  );
}

/** Submits its form on Enter; Shift+Enter, and Enter while an IME is composing, add a line. */
function PromptInputTextarea({
  onKeyDown,
  placeholder = "Ask anything…",
  sx,
  ...props
}: TextareaProps) {
  return (
    <InputGroupTextarea
      data-prompt-input-textarea=""
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          event.key !== "Enter" ||
          event.shiftKey ||
          event.nativeEvent.isComposing
        ) {
          return;
        }
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
      }}
      placeholder={placeholder}
      rows={1}
      {...props}
      sx={[styles.textarea, sx]}
    />
  );
}

/** Above the text, for attachments. */
function PromptInputHeader(props: Omit<InputGroupAddonProps, "align">) {
  return (
    <InputGroupAddon
      align="block-start"
      data-prompt-input-header=""
      {...props}
    />
  );
}

/** Below the text: tools at the start, submit at the end. */
function PromptInputFooter({
  sx,
  ...props
}: Omit<InputGroupAddonProps, "align">) {
  return (
    <InputGroupAddon
      align="block-end"
      data-prompt-input-footer=""
      {...props}
      sx={[styles.footer, sx]}
    />
  );
}

function PromptInputTools({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="prompt-input-tools"
      {...props}
      {...stylex.props(styles.tools, sx)}
    />
  );
}

/** Sends the prompt; while an answer streams it turns into Stop, which calls `onStop`. */
function PromptInputSubmit({
  disabled,
  onStop,
  status = "ready",
  ...props
}: Omit<InputGroupButtonProps, "children" | "onClick" | "type"> & {
  onStop?: () => void;
  status?: PromptInputStatus;
}) {
  const streaming = status === "streaming";
  return (
    <InputGroupButton
      aria-busy={status === "submitted" || undefined}
      aria-label={streaming ? "Stop" : "Send"}
      corners="pill"
      data-slot="prompt-input-submit"
      disabled={streaming ? false : disabled}
      onClick={streaming ? onStop : undefined}
      size="icon-sm"
      type={streaming ? "button" : "submit"}
      variant="primary"
      {...props}
    >
      <SwapIcon aria-hidden value={streaming ? "stop" : "send"}>
        <SwapIconItem value="send">
          <HugeiconsIcon
            icon={ArrowUp02Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
        <SwapIconItem value="stop">
          <HugeiconsIcon
            icon={StopIcon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </SwapIconItem>
      </SwapIcon>
    </InputGroupButton>
  );
}

export {
  PromptInput,
  PromptInputFooter,
  PromptInputHeader,
  promptInputStatuses,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
};
export type { PromptInputStatus };
