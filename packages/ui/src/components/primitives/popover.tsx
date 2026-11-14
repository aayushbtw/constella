"use client";

import * as stylex from "@stylexjs/stylex";
import {
  PopoverClose as PopoverClosePrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverDescription as PopoverDescriptionPrimitive,
  Popover as PopoverPrimitive,
  PopoverTitle as PopoverTitlePrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@ui-sdk/react/popover";
import type { PopoverProps } from "@ui-sdk/react/popover";
import { createContext, use, useState } from "react";
import type { ComponentProps } from "react";
import { flushSync } from "react-dom";

import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  joins,
  media,
  motion,
  offsets,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type PopoverContentProps = Styled<
  ComponentProps<typeof PopoverContentPrimitive>
>;

const offstage = ":is([data-starting-style], [data-ending-style])";
const closing = ":is([data-ending-style])";

const styles = stylex.create({
  // The content renders in place, so it drops what it would inherit from there: a group's joins,
  // an addon's text, a table cell's wrapping. ui-sdk's own layer resets the browser's `[popover]` box.
  popup: {
    [joins.block]: "1",
    [joins.either]: "1",
    [joins.inline]: "1",
    color: colors.textPrimary,
    cursor: "auto",
    fontWeight: fontWeights.regular,
    textAlign: "start",
    userSelect: "auto",
    whiteSpace: "normal",
  },
  // Select's surface and motion (below), so every popup opens the same way.
  surface: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    gap: space.popup,
    maxWidth: "var(--available-width)",
    paddingBlock: space.popup,
    paddingInline: space.popup,
    width: sizes.popover,
  },
  motion: {
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  instant: {
    transitionDuration: "0s",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxxs,
  },
  title: {
    fontWeight: fontWeights.medium,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    marginBlock: 0,
    marginInline: 0,
    textWrap: "pretty",
  },
});

// Whether the last open or close came from the keyboard or focus leaving, which skip the motion,
// as Base UI's `data-instant` did. ui-sdk marks the content as it closes, after this callback,
// so the flag commits first: a frame later, the exit would already be running.
const InstantContext = createContext(false);

function Popover({ onOpenChange, ...props }: PopoverProps) {
  const [instant, setInstant] = useState(false);
  return (
    <InstantContext value={instant}>
      <PopoverPrimitive
        onOpenChange={(open, details) => {
          flushSync(() => {
            setInstant(
              details.source === "keyboard" || details.reason === "focus-out"
            );
          });
          onOpenChange?.(open, details);
        }}
        {...props}
      />
    </InstantContext>
  );
}

/** Whether the popover's last open or close skips its motion; apply `popoverStyles.instant` while it does. */
function usePopoverInstant() {
  return use(InstantContext);
}

function PopoverTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverTriggerPrimitive>>) {
  return <PopoverTriggerPrimitive {...props} {...stylex.props(sx)} />;
}

function PopoverContent({
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PopoverContentProps) {
  const instant = usePopoverInstant();
  return (
    <PopoverContentPrimitive
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(
        [typeStyles.textSm, styles.popup, styles.surface],
        styles.motion,
        instant && styles.instant,
        sx
      )}
    />
  );
}

function PopoverHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="popover-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function PopoverTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverTitlePrimitive>>) {
  return (
    <PopoverTitlePrimitive
      {...props}
      {...stylex.props([typeStyles.textSm, styles.title], sx)}
    />
  );
}

function PopoverDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverDescriptionPrimitive>>) {
  return (
    <PopoverDescriptionPrimitive
      {...props}
      {...stylex.props([typeStyles.textSm, styles.description], sx)}
    />
  );
}

function PopoverClose({
  sx,
  ...props
}: Styled<ComponentProps<typeof PopoverClosePrimitive>>) {
  return <PopoverClosePrimitive {...props} {...stylex.props(sx)} />;
}

/** The popup's reset, surface and motion, for a part that draws its own popup. */
const popoverStyles = {
  instant: styles.instant,
  motion: styles.motion,
  popup: styles.popup,
  surface: [typeStyles.textSm, styles.surface],
};

export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  popoverStyles,
  PopoverTitle,
  PopoverTrigger,
  usePopoverInstant,
};
export type { PopoverContentProps };
