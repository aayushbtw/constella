"use client";

import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/react/trigger-menu";
import type { TriggerMenuProps } from "@ui-sdk/react/trigger-menu";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { commandStyles } from "@/components/primitives/command";
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
import type { Sx } from "@/lib/constella/styles";
import { popupReset, typeStyles, visuallyHidden } from "@/lib/constella/styles";
import {
  colors,
  fontSizes,
  lineHeights,
  media,
  offsets,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const promptInputStates = ["ready", "submitted", "streaming"] as const;

type PromptInputState = (typeof promptInputStates)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

// Pills nest in the composer's corner at any radius (inset = outer radius − pill radius);
// `sm` attachments match them at the default radius.
const inset =
  `max(${space.xxs}, calc(${radii.xl} - ${sizes.controlSm} / 2))` as const;
// A bar button's leading icon (6px padding past a 1px border) lines up with the composer's text (10px in).
const barInset = `calc(${space.xxs} - ${strokes.border})` as const;
const invalid =
  ":has(> :is([data-slot='textarea'], [data-slot='input-group-control']):is([aria-invalid='true'], [data-invalid]))";
const wellCorner = `calc(${radii.xl} + ${space.xxs})`;
// styles.ts's `popupOpen`; keep in step.
const popupOpen =
  ":is([data-popup-open], :where([aria-haspopup], [data-slot='hover-card-trigger'], [data-slot='combobox-trigger'])[data-open])";
// The well frames the prompt, so its own ring would double the edge.
const inWell = ":is([data-slot='prompt-input-well'] *)";

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
      [inWell]: "var(--shadow-default-ring-subtle)",
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
    maxHeight: {
      default: `calc(${lineHeights.textBase} * 6 + ${space.xs} * 2)`,
      [media.coarse]: `calc(${lineHeights.touch} * 6 + ${space.xs} * 2)`,
    },
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
      [popupOpen]: colors.textPrimary,
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
  // ui-sdk's trigger menu leaves the browser's `[popover]` border.
  commandContent: {
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    boxShadow: shadows.lg,
    maxHeight: "var(--available-height)",
    paddingBlockStart: {
      default: space.xxs,
      ":has(> [data-slot='trigger-menu-list'])": 0,
    },
    width: "var(--anchor-width)",
  },
});

interface Anchor {
  anchor: HTMLDivElement | null;
  setAnchor: (element: HTMLDivElement | null) => void;
}

const AnchorContext = createContext<Anchor | null>(null);

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
      <InputGroup ref={use(AnchorContext)?.setAnchor} sx={styles.group}>
        {children}
      </InputGroup>
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
  size = "sm",
  sx,
  variant = "ghost",
  ...props
}: Omit<ButtonProps, "color">) {
  return (
    <Button
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
  onClick,
  onStop,
  state = "ready",
  ...props
}: Omit<InputGroupButtonProps, "children" | "type"> & {
  onStop?: () => void;
  state?: PromptInputState;
}) {
  const streaming = state === "streaming";
  return (
    <InputGroupButton
      aria-busy={state === "submitted" || undefined}
      aria-label={streaming ? "Stop" : "Send"}
      data-slot="prompt-input-submit"
      data-state={state}
      disabled={streaming ? false : disabled}
      size="icon-sm"
      type={streaming ? "button" : "submit"}
      variant="primary"
      {...props}
      onClick={(event, details) => {
        const result = onClick?.(event, details);
        if (streaming) {
          event.preventDefault();
          onStop?.();
        }
        return streaming ? undefined : result;
      }}
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

type PromptInputCommandProps<T = string> = TriggerMenuProps<T>;

/** A command list the prompt input opens over itself when the draft matches one of its `triggers`, like a `/` at the start. */
function PromptInputCommand<T = string>({
  children,
  ...props
}: PromptInputCommandProps<T>) {
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const anchorContext = useMemo(() => ({ anchor, setAnchor }), [anchor]);
  return (
    <AnchorContext value={anchorContext}>
      <TriggerMenu<T> {...props}>
        {children}
        <TriggerMenuStatus {...stylex.props(visuallyHidden.base)} />
      </TriggerMenu>
    </AnchorContext>
  );
}

type PromptInputCommandTextareaProps = Omit<
  TextareaProps,
  "onValueChange" | "value"
> &
  (
    | { onValueChange?: TextareaProps["onValueChange"]; value?: undefined }
    | {
        onValueChange: NonNullable<TextareaProps["onValueChange"]>;
        value: string;
      }
  );

/** The prompt input's textarea as the command's field: while the list is open, arrows move, Enter and Tab pick, Esc closes. Cmd/Ctrl+Enter still submits. Control it with `value` and `onValueChange`. */
function PromptInputCommandTextarea(props: PromptInputCommandTextareaProps) {
  return <TriggerMenuInput render={<PromptInputTextarea {...props} />} />;
}

/** The command's popup on the composer's edge, above it unless there's no room. Holds a `PromptInputCommandList`. */
function PromptInputCommandContent({
  align = "start",
  side = "top",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: Styled<ComponentProps<typeof TriggerMenuContent>>) {
  return (
    <TriggerMenuContent
      align={align}
      anchor={use(AnchorContext)?.anchor}
      side={side}
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(
        popupReset.base,
        commandStyles.surface,
        styles.commandContent,
        sx
      )}
    />
  );
}

function PromptInputCommandList({
  sx,
  ...props
}: Styled<ComponentProps<typeof TriggerMenuList>>) {
  return (
    <TriggerMenuList {...props} {...stylex.props(commandStyles.list, sx)} />
  );
}

/** A command. A pick runs its `onSelect`, then inserts what the trigger's `insert` returns. */
function PromptInputCommandItem<T = string>({
  sx,
  ...props
}: Styled<ComponentProps<typeof TriggerMenuItem<T>>>) {
  return (
    <TriggerMenuItem<T> {...props} {...stylex.props(commandStyles.item, sx)} />
  );
}

/** Shown while nothing matches. Rendered, it keeps the list open with no matches, so Enter submits only once Esc closes it. */
function PromptInputCommandEmpty({
  sx,
  ...props
}: Styled<ComponentProps<typeof TriggerMenuEmpty>>) {
  return (
    <TriggerMenuEmpty {...props} {...stylex.props(commandStyles.empty, sx)} />
  );
}

export {
  PromptInput,
  PromptInputBar,
  PromptInputBarButton,
  PromptInputCommand,
  PromptInputCommandContent,
  PromptInputCommandEmpty,
  PromptInputCommandItem,
  PromptInputCommandList,
  PromptInputCommandTextarea,
  PromptInputFooter,
  PromptInputHeader,
  promptInputStates,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputWell,
};
export type { PromptInputCommandProps, PromptInputState };
