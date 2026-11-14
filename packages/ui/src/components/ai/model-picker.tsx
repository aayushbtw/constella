"use client";

import { Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  createPopoverController,
  PopoverContent as PopoverContentPrimitive,
} from "@ui-sdk/react/popover";
import type { PopoverProps } from "@ui-sdk/react/popover";
import { mergeProps, renderElement } from "@ui-sdk/react/primitive";
import type { PartProps } from "@ui-sdk/react/primitive";
import {
  createContext,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { Command, CommandItem } from "@/components/primitives/command";
import type { CommandProps } from "@/components/primitives/command";
import {
  Popover,
  popoverStyles,
  PopoverTrigger,
  usePopoverInstant,
} from "@/components/primitives/popover";
import type { PopoverContentProps } from "@/components/primitives/popover";
import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  fontWeights,
  lineHeights,
  offsets,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const modelPickerDetailsSides = ["inline-start", "inline-end"] as const;

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const hoverDelay = Number(durations.hoverCardDelay.slice(0, -"ms".length));

const rowGap = `calc(${space.xs} - ${space.xxxs})`;

const styles = stylex.create({
  content: {
    alignItems: { default: "flex-start", ":is([data-side='top'])": "flex-end" },
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    maxWidth: "var(--available-width)",
  },
  detailsStart: {
    flexDirection: "row-reverse",
  },
  command: {
    boxShadow: shadows.lg,
    maxWidth: "100%",
    width: sizes.modelPicker,
  },
  check: {
    color: colors.textPrimary,
    display: "flex",
    marginInlineStart: "auto",
  },
  logo: {
    backgroundColor: "currentColor",
    flexShrink: 0,
    height: sizes.icon,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    width: sizes.icon,
  },
  mask: (image: string) => ({ maskImage: image }),
  details: {
    maxWidth: "100%",
  },
  title: {
    alignItems: "center",
    display: "flex",
    fontWeight: fontWeights.medium,
    gap: rowGap,
    lineHeight: lineHeights.textSm,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: lineHeights.textSm,
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
});

interface Picker {
  cancelShow: () => void;
  controller: NonNullable<PopoverProps["controller"]>;
  detailsId: string;
  picked: boolean;
  setPicked: (picked: boolean) => void;
  setShown: (shown: boolean) => void;
  showAfterRest: () => void;
  shown: boolean;
}

const PickerContext = createContext<Picker | null>(null);

function usePicker() {
  const picker = use(PickerContext);
  if (picker === null) {
    throw new Error("Model picker parts must be inside a ModelPicker.");
  }
  return picker;
}

function ModelPicker({
  controller: givenController,
  onOpenChangeComplete,
  ...props
}: PopoverProps) {
  const ownController = useMemo(() => createPopoverController(), []);
  const controller = givenController ?? ownController;
  const [picked, setPicked] = useState(false);
  const [shown, setShown] = useState(false);
  const timer = useRef(0);
  const detailsId = useId();
  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    []
  );
  const picker = useMemo(
    () => ({
      cancelShow: () => {
        clearTimeout(timer.current);
      },
      controller,
      detailsId,
      picked,
      setPicked,
      setShown: (next: boolean) => {
        clearTimeout(timer.current);
        setShown(next);
      },
      showAfterRest: () => {
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          setShown(true);
        }, hoverDelay);
      },
      shown,
    }),
    [controller, detailsId, picked, shown]
  );
  return (
    <PickerContext value={picker}>
      <Popover
        controller={controller}
        // Reset once closed, since a controlled `open` never calls `onOpenChange`.
        onOpenChangeComplete={(open) => {
          if (!open) {
            setPicked(false);
            setShown(false);
          }
          onOpenChangeComplete?.(open);
        }}
        {...props}
      />
    </PickerContext>
  );
}

/** A ghost button by default, ending in the picker's chevron. */
function ModelPickerTrigger({
  children,
  size = "sm",
  variant = "ghost",
  ...props
}: ButtonProps) {
  return (
    <PopoverTrigger
      render={<Button size={size} variant={variant} {...props} />}
    >
      {children}
      <HugeiconsIcon
        aria-hidden
        icon={UnfoldMoreIcon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </PopoverTrigger>
  );
}

/** A popover content that is no surface, so the command and details card beside it are. */
function ModelPickerContent({
  align = "start",
  detailsSide = "inline-end",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PopoverContentProps & {
  /** Which side of the list the details card opens on; `inline-start` for a picker at the end of a row. */
  detailsSide?: (typeof modelPickerDetailsSides)[number];
}) {
  const { picked } = usePicker();
  const instant = usePopoverInstant();
  return (
    <PopoverContentPrimitive
      align={align}
      data-details-side={detailsSide}
      sideOffset={sideOffset}
      {...props}
      {...stylex.props(
        popoverStyles.popup,
        popoverStyles.motion,
        styles.content,
        detailsSide === "inline-start" && styles.detailsStart,
        (picked || instant) && popoverStyles.instant,
        sx
      )}
    />
  );
}

/**
 * A `Command` at `sizes.modelPicker` that keeps its highlight when the pointer leaves for the details card.
 * The card shows once a row is reached by arrow key, or rested on with the pointer.
 */
function ModelPickerCommand({
  keepHighlight = true,
  onItemHighlighted,
  sx,
  ...props
}: CommandProps) {
  const { setShown } = usePicker();
  return (
    <Command
      data-slot="model-picker-command"
      keepHighlight={keepHighlight}
      onItemHighlighted={(value, details) => {
        if (value === undefined) {
          setShown(false);
        } else if (details.reason === "keyboard") {
          setShown(true);
        }
        onItemHighlighted?.(value, details);
      }}
      {...props}
      sx={[styles.command, sx]}
    />
  );
}

/**
 * A `CommandItem` that closes the picker once picked, with a tick when `selected`.
 * Every row is described by the details card, which always shows the highlighted row's model.
 */
function ModelPickerItem({
  children,
  onClick,
  onPointerEnter,
  onPointerLeave,
  selected = false,
  ...props
}: ComponentProps<typeof CommandItem> & { selected?: boolean }) {
  const { cancelShow, controller, detailsId, setPicked, showAfterRest, shown } =
    usePicker();
  return (
    <CommandItem
      aria-checked={selected}
      aria-describedby={shown ? detailsId : undefined}
      onClick={(event) => {
        onClick?.(event);
        setPicked(true);
        controller.close();
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        showAfterRest();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        cancelShow();
      }}
      {...props}
    >
      {children}
      {selected && (
        <span {...stylex.props(styles.check)}>
          <HugeiconsIcon
            aria-hidden
            icon={Tick02Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </span>
      )}
    </CommandItem>
  );
}

/** A provider's one-color logo, painted in the text's color so it follows the theme. */
function ModelPickerLogo({
  src,
  sx,
  ...props
}: Styled<ComponentProps<"span">> & { src: string }) {
  return (
    <span
      aria-hidden
      data-slot="model-picker-logo"
      {...props}
      {...stylex.props(styles.logo, styles.mask(`url("${src}")`), sx)}
    />
  );
}

/** The highlighted model's card, beside the command. Hidden until a row is reached by key or rested on. */
function ModelPickerDetails({ sx, ...props }: Styled<ComponentProps<"div">>) {
  const { detailsId, shown } = usePicker();
  if (!shown) {
    return null;
  }
  return (
    <div
      data-slot="model-picker-details"
      {...props}
      id={detailsId}
      {...stylex.props(popoverStyles.surface, styles.details, sx)}
    />
  );
}

function ModelPickerTitle({ render, sx, ...props }: Styled<PartProps<"div">>) {
  return renderElement(
    "div",
    mergeProps(
      { "data-slot": "model-picker-title" },
      props,
      stylex.props(styles.title, sx)
    ),
    render
  );
}

function ModelPickerDescription({ sx, ...props }: Styled<ComponentProps<"p">>) {
  return (
    <p
      data-slot="model-picker-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

export {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerDescription,
  ModelPickerDetails,
  modelPickerDetailsSides,
  ModelPickerItem,
  ModelPickerLogo,
  ModelPickerTitle,
  ModelPickerTrigger,
};
