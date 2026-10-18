"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRender } from "@base-ui/react/use-render";
import { Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps, RefObject } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { Command, CommandItem } from "@/components/primitives/command";
import type { CommandProps } from "@/components/primitives/command";
import {
  Popover,
  popoverStyles,
  PopoverTrigger,
} from "@/components/primitives/popover";
import type { PopoverContentProps } from "@/components/primitives/popover";
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
  sx?: stylex.StyleXStyles;
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
  instant: {
    transitionDuration: "0s",
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
  actions: RefObject<PopoverPrimitive.Root.Actions | null>;
  cancelShow: () => void;
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
  actionsRef,
  onOpenChangeComplete,
  ...props
}: PopoverPrimitive.Root.Props) {
  const ownActions = useRef<PopoverPrimitive.Root.Actions | null>(null);
  const actions = actionsRef ?? ownActions;
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
      actions,
      cancelShow: () => {
        clearTimeout(timer.current);
      },
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
    [actions, detailsId, picked, shown]
  );
  return (
    <PickerContext value={picker}>
      <Popover
        actionsRef={actions}
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
      data-slot="model-picker-trigger"
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

/** Renders the portal, the positioner and a popup that is no surface, so the command and details card beside it are. */
function ModelPickerContent({
  align = "start",
  alignOffset = 0,
  detailsSide = "inline-end",
  side = "bottom",
  sideOffset = Number(offsets.popover),
  sx,
  ...props
}: PopoverContentProps & {
  /** Which side of the list the details card opens on; `inline-start` for a picker at the end of a row. */
  detailsSide?: (typeof modelPickerDetailsSides)[number];
}) {
  const { picked } = usePicker();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(popoverStyles.positioner)}
      >
        <PopoverPrimitive.Popup
          data-details-side={detailsSide}
          data-slot="model-picker-content"
          {...props}
          {...stylex.props(
            popoverStyles.motion,
            styles.content,
            detailsSide === "inline-start" && styles.detailsStart,
            picked && styles.instant,
            sx
          )}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
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
  const { actions, cancelShow, detailsId, setPicked, showAfterRest, shown } =
    usePicker();
  return (
    <CommandItem
      aria-checked={selected}
      aria-describedby={shown ? detailsId : undefined}
      onClick={(event) => {
        onClick?.(event);
        setPicked(true);
        actions.current?.close();
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

function ModelPickerTitle({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.title, sx)),
    render,
    state: { slot: "model-picker-title" },
  });
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
