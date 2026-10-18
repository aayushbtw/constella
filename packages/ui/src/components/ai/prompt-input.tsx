"use client";

import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/primitives/input-group";
import type {
  InputGroupAddonProps,
  InputGroupButtonProps,
} from "@/components/primitives/input-group";
import { SwapIcon, SwapIconItem } from "@/components/primitives/swap-icon";
import type { TextareaProps } from "@/components/primitives/textarea";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  fontSizes,
  lineHeights,
  media,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const promptInputStates = ["ready", "submitted", "streaming"] as const;

type PromptInputState = (typeof promptInputStates)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

// Pills nest in the composer's corner at any radius (inset = outer radius − pill radius);
// `sm` attachments match them at the default radius.
const inset = `max(${space.xxs}, calc(${radii.xl} - ${sizes.controlSm} / 2))`;
// A bar button's leading icon (6px padding past a 1px border) lines up with the composer's text (10px in).
const barInset = `calc(${space.xxs} - ${strokes.border})`;
const invalid =
  ":has(> [data-slot='input-group-control']:is([aria-invalid='true'], [data-invalid]))";
const wellCorner = `calc(${radii.xl} + ${space.xxs})`;

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
    // A surface, not a control: the `raised` fill, and its edge a ring in its shadow, so no border.
    backgroundColor: colors.raised,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    boxShadow: {
      default: shadows.defaultRingSubtle,
      [invalid]: shadows.defaultRingInvalid,
    },
    height: "auto",
  },
  // Sets the type itself: typeStyles would override Textarea's touch size, and iOS would zoom.
  textarea: {
    fontSize: { default: fontSizes.textBase, [media.coarse]: fontSizes.touch },
    lineHeight: {
      default: lineHeights.textBase,
      [media.coarse]: lineHeights.touch,
    },
    // Grows with its text up to six control heights, then scrolls.
    maxHeight: `calc(${sizes.controlMd} * 6)`,
    minHeight: sizes.controlLg,
    overflowY: "auto",
  },
  header: {
    paddingBlockStart: {
      default: inset,
      // The group already pads `space.xxs` so focus rings aren't clipped.
      ":has(> [data-slot='attachment-group'])": `calc(${inset} - ${space.xxs})`,
    },
    paddingInlineEnd: inset,
    paddingInlineStart: inset,
  },
  footer: {
    justifyContent: "space-between",
    paddingBlockEnd: inset,
    paddingInlineEnd: inset,
    paddingInlineStart: inset,
  },
  tools: {
    alignItems: "center",
    display: "flex",
    gap: space.xxs,
  },
  // The one corner past the top of the ladder: the composer keeps `xl` inside it.
  well: {
    backgroundColor: colors.well,
    borderStartStartRadius: wellCorner,
    borderStartEndRadius: wellCorner,
    borderEndStartRadius: wellCorner,
    borderEndEndRadius: wellCorner,
    display: "flex",
    flexDirection: "column",
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    width: "100%",
  },
  barButton: {
    color: {
      default: colors.textSecondary,
      ":is([data-popup-open])": colors.textPrimary,
      [media.hover]: {
        default: colors.textSecondary,
        ":hover:not(:disabled)": colors.textPrimary,
      },
      ":active:not(:disabled)": colors.textPrimary,
    },
  },
  bar: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    gap: space.xs,
    minHeight: sizes.controlSm,
    // The well's own padding is the gap on its outer side, so each side reads `space.xxs`.
    paddingBlockEnd: { default: space.xxs, ":last-child": 0 },
    paddingBlockStart: { default: space.xxs, ":first-child": 0 },
    paddingInlineEnd: barInset,
    paddingInlineStart: barInset,
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
function PromptInputHeader({
  sx,
  ...props
}: Omit<InputGroupAddonProps, "align">) {
  return (
    <InputGroupAddon
      align="block-start"
      data-prompt-input-header=""
      {...props}
      sx={[styles.header, sx]}
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

/** A tinted tray around a prompt input and the bars that set its context, like a project or apps. */
function PromptInputWell({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="prompt-input-well"
      {...props}
      {...stylex.props(styles.well, sx)}
    />
  );
}

/** A quiet pill for a bar: secondary text, so the context reads behind the prompt. */
function PromptInputBarButton({
  corners = "pill",
  size = "sm",
  sx,
  variant = "ghost",
  ...props
}: Omit<ButtonProps, "color">) {
  return (
    <Button
      corners={corners}
      data-slot="prompt-input-bar-button"
      size={size}
      variant={variant}
      {...props}
      sx={[styles.barButton, sx]}
    />
  );
}

/** A row in the well, above or below the prompt input. */
function PromptInputBar({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="prompt-input-bar"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.bar], sx)}
    />
  );
}

/** Sends the prompt; while an answer streams it turns into Stop, which calls `onStop`. */
function PromptInputSubmit({
  disabled,
  onStop,
  state = "ready",
  ...props
}: Omit<InputGroupButtonProps, "children" | "onClick" | "type"> & {
  onStop?: () => void;
  state?: PromptInputState;
}) {
  const streaming = state === "streaming";
  return (
    <InputGroupButton
      aria-busy={state === "submitted" || undefined}
      aria-label={streaming ? "Stop" : "Send"}
      corners="pill"
      data-slot="prompt-input-submit"
      data-state={state}
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
  PromptInputBar,
  PromptInputBarButton,
  PromptInputFooter,
  PromptInputHeader,
  promptInputStates,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputWell,
};
export type { PromptInputState };
