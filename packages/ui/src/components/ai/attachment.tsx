"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Shimmer } from "@/components/ai/shimmer";
import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { scrollFade } from "@/lib/constella/scroll-fade";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  fontWeights,
  lineHeights,
  media,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const attachmentStates = [
  "idle",
  "uploading",
  "processing",
  "error",
  "done",
] as const;
const attachmentSizes = ["xs", "sm", "default"] as const;
const attachmentOrientations = ["horizontal", "vertical"] as const;
const attachmentMediaVariants = ["default", "image"] as const;

type AttachmentState = (typeof attachmentStates)[number];
type AttachmentSize = (typeof attachmentSizes)[number];
type AttachmentOrientation = (typeof attachmentOrientations)[number];
type AttachmentMediaVariant = (typeof attachmentMediaVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const State = createContext<AttachmentState>("done");

const root = "[data-slot='attachment']";
const inSize = (size: AttachmentSize) => `:is(${root}[data-size='${size}'] *)`;
const inState = (state: AttachmentState) =>
  `:is(${root}[data-state='${state}'] *)`;
const vertical = `:is(${root}[data-orientation='vertical'] *)`;
const withMedia = ":has(> [data-slot='attachment-media'])";
const withContent = ":has(> [data-slot='attachment-content'])";
const pressable = ":has(> [data-slot='attachment-trigger'])";

// shadcn's insets, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

// The media's corner plus the inset around it, so the two stay concentric.
const corner = {
  default: `calc(${radii.sm} + ${space.xs})`,
  ":is([data-size='sm'])": `calc(${radii.sm} + ${px6})`,
  ":is([data-size='xs'])": `calc(${radii.xs} + ${space.xxs})`,
};

// A card with media is inset evenly around it; one with only text, wider at the sides.
const textOnly = `:not(${withMedia})${withContent}`;
const padBlock = {
  default: 0,
  [textOnly]: space.xs,
  [`:is([data-size='sm'])${textOnly}`]: px6,
  [`:is([data-size='xs'])${textOnly}`]: space.xxs,
  [withMedia]: space.xs,
  [`:is([data-size='sm'])${withMedia}`]: px6,
  [`:is([data-size='xs'])${withMedia}`]: space.xxs,
};
const padInline = {
  default: 0,
  [textOnly]: px10,
  [`:is([data-size='sm'])${textOnly}`]: space.xs,
  [`:is([data-size='xs'])${textOnly}`]: px6,
  [withMedia]: space.xs,
  [`:is([data-size='sm'])${withMedia}`]: px6,
  [`:is([data-size='xs'])${withMedia}`]: space.xxs,
};

const styles = stylex.create({
  attachment: {
    alignItems: {
      default: "center",
      ":is([data-orientation='vertical'])": null,
    },
    backgroundColor: {
      default: colors.raised,
      [media.hover]: {
        default: colors.raised,
        [`${pressable}:hover`]: colors.fillSubtle,
      },
    },
    borderBlockEndColor: {
      default: colors.border,
      ":is([data-state='error'])": colors.dangerText,
    },
    borderBlockStartColor: {
      default: colors.border,
      ":is([data-state='error'])": colors.dangerText,
    },
    borderInlineEndColor: {
      default: colors.border,
      ":is([data-state='error'])": colors.dangerText,
    },
    borderInlineStartColor: {
      default: colors.border,
      ":is([data-state='error'])": colors.dangerText,
    },
    borderBlockEndStyle: {
      default: "solid",
      ":is([data-state='idle'])": "dashed",
    },
    borderBlockStartStyle: {
      default: "solid",
      ":is([data-state='idle'])": "dashed",
    },
    borderInlineEndStyle: {
      default: "solid",
      ":is([data-state='idle'])": "dashed",
    },
    borderInlineStartStyle: {
      default: "solid",
      ":is([data-state='idle'])": "dashed",
    },
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: corner,
    borderStartEndRadius: corner,
    borderEndStartRadius: corner,
    borderEndEndRadius: corner,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: {
      default: "row",
      ":is([data-orientation='vertical'])": "column",
    },
    flexShrink: 0,
    flexWrap: "wrap",
    gap: {
      default: space.xs,
      ":is([data-size='sm'])": px10,
      ":is([data-size='xs'])": px6,
    },
    maxWidth: "100%",
    minWidth: {
      default: 0,
      ":is([data-orientation='horizontal'])": sizes.itemText,
    },
    paddingBlockEnd: padBlock,
    paddingBlockStart: padBlock,
    paddingInlineEnd: padInline,
    paddingInlineStart: padInline,
    position: "relative",
    scrollSnapAlign: "start",
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: "ease",
    width: {
      default: "fit-content",
      ":is([data-orientation='vertical'])": 96,
      [`:is([data-orientation='vertical'])${withContent}`]: 120,
    },
  },
  media: {
    alignItems: "center",
    aspectRatio: "1",
    backgroundColor: {
      default: colors.fill,
      [inState("error")]: colors.dangerSubtle,
    },
    borderStartStartRadius: { default: radii.sm, [inSize("xs")]: radii.xs },
    borderStartEndRadius: { default: radii.sm, [inSize("xs")]: radii.xs },
    borderEndStartRadius: { default: radii.sm, [inSize("xs")]: radii.xs },
    borderEndEndRadius: { default: radii.sm, [inSize("xs")]: radii.xs },
    color: {
      default: colors.textPrimary,
      [inState("error")]: colors.dangerText,
    },
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: {
      default: sizes.media,
      [inSize("sm")]: sizes.controlMd,
      [inSize("xs")]: sizes.controlSm,
      [vertical]: "100%",
    },
  },
  // An image waits dimmed until its file is in.
  image: {
    opacity: {
      default: opacities.busy,
      [inState("done")]: 1,
      [inState("idle")]: 1,
    },
  },
  content: {
    flex: "1",
    lineHeight: lineHeights.textSm,
    maxWidth: "100%",
    minWidth: 0,
    paddingInlineEnd: { default: null, [vertical]: space.xxs },
    paddingInlineStart: { default: null, [vertical]: space.xxs },
  },
  title: {
    color: {
      default: null,
      [inState("uploading")]: colors.textSecondary,
      [inState("processing")]: colors.textSecondary,
    },
    display: "block",
    fontWeight: fontWeights.medium,
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    color: {
      default: colors.textSecondary,
      [inState("error")]: colors.dangerText,
    },
    display: "block",
    marginBlockStart: space.xxxs,
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // Over the trigger, so each action stays its own target. Over a picture it sits on its own
  // `raised` chip, so a ghost action's hover fill never shows the image through.
  actions: {
    alignItems: "center",
    backgroundColor: { default: null, [vertical]: colors.raised },
    borderStartStartRadius: { default: null, [vertical]: radii.sm },
    borderStartEndRadius: { default: null, [vertical]: radii.sm },
    borderEndStartRadius: { default: null, [vertical]: radii.sm },
    borderEndEndRadius: { default: null, [vertical]: radii.sm },
    display: "flex",
    flexShrink: 0,
    gap: { default: null, [vertical]: space.xxs },
    insetBlockStart: { default: null, [vertical]: space.sm },
    insetInlineEnd: { default: null, [vertical]: space.sm },
    position: { default: "relative", [vertical]: "absolute" },
    zIndex: 2,
  },
  // Covers the whole card, so the card opens from anywhere on it; its ring follows the corner.
  trigger: {
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartStartRadius: "inherit",
    borderStartEndRadius: "inherit",
    borderEndStartRadius: "inherit",
    borderEndEndRadius: "inherit",
    cursor: "pointer",
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "absolute",
    zIndex: 1,
  },
  group: {
    display: "flex",
    gap: space.sm,
    minWidth: 0,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    scrollPaddingInline: space.xxs,
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
  },
});

const mediaStyles = {
  default: null,
  image: styles.image,
} satisfies Record<AttachmentMediaVariant, stylex.StyleXStyles | null>;

type AttachmentProps = Styled<ComponentProps<"div">> & {
  orientation?: AttachmentOrientation;
  size?: AttachmentSize;
  state?: AttachmentState;
};

/** A file or image: its media, name and details, upload state and actions. */
function Attachment({
  orientation = "horizontal",
  size = "default",
  state = "done",
  sx,
  ...props
}: AttachmentProps) {
  return (
    <State value={state}>
      <div
        data-orientation={orientation}
        data-size={size}
        data-slot="attachment"
        data-state={state}
        {...props}
        {...stylex.props([typeStyles.textSm, styles.attachment], sx)}
      />
    </State>
  );
}

function AttachmentMedia({
  sx,
  variant = "default",
  ...props
}: Styled<ComponentProps<"div">> & { variant?: AttachmentMediaVariant }) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.media, mediaStyles[variant], sx)}
    />
  );
}

function AttachmentContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="attachment-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

/** The file's name; it shimmers while the file uploads or processes. */
function AttachmentTitle({
  children,
  sx,
  ...props
}: Styled<ComponentProps<"span">> & { children?: ReactNode }) {
  const state = use(State);
  const working = state === "uploading" || state === "processing";
  return (
    <span
      data-slot="attachment-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    >
      {working ? <Shimmer>{children}</Shimmer> : children}
    </span>
  );
}

function AttachmentDescription({
  sx,
  ...props
}: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="attachment-description"
      {...props}
      {...stylex.props([typeStyles.textSm, styles.description], sx)}
    />
  );
}

function AttachmentActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="attachment-actions"
      {...props}
      {...stylex.props(styles.actions, sx)}
    />
  );
}

function AttachmentAction({
  size = "icon-xs",
  variant = "ghost",
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="attachment-action"
      size={size}
      variant={variant}
      {...props}
    />
  );
}

/** Covers the card to open the file; `render` an `a` for a link. */
function AttachmentTrigger({
  render,
  sx,
  type,
  ...props
}: Styled<useRender.ComponentProps<"button">>) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { type: render ? type : (type ?? "button") },
      props,
      stylex.props(styles.trigger, sx)
    ),
    render,
    state: { slot: "attachment-trigger" },
  });
}

/** A row of attachments that scrolls and snaps, its edges fading while there's more. */
function AttachmentGroup({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="attachment-group"
      {...props}
      {...stylex.props(styles.group, scrollFade.x, sx)}
    />
  );
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentMediaVariants,
  attachmentOrientations,
  attachmentSizes,
  attachmentStates,
};
export type {
  AttachmentMediaVariant,
  AttachmentOrientation,
  AttachmentProps,
  AttachmentSize,
  AttachmentState,
};
