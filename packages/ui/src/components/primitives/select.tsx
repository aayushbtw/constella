"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useContext } from "react";

import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  joinStyles,
  stateStyles,
  typeStyles,
} from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  layers,
  media,
  motion,
  offsets,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const selectSizes = ["sm", "default", "lg"] as const;

type SelectSize = (typeof selectSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type SelectTriggerProps = Styled<SelectPrimitive.Trigger.Props> & {
  size?: SelectSize;
};

type SelectContentProps = Styled<SelectPrimitive.Popup.Props> &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
  > & { size?: SelectSize };

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";
const offstage = ":is([data-starting-style], [data-ending-style])";
// Over the trigger, the popup opens in place, so it doesn't travel.
const aligned = ":is([data-side='none'])";
const closing =
  ":is([data-ending-style]):not([data-side='none'], [data-skip-motion])";
const instant = ":is([data-skip-motion])";

// Base UI grows an aligned popup as it scrolls, up to the popup's `max-height`.
const maxHeight = `min(var(--available-height), ${sizes.menuHeight})`;

const styles = stylex.create({
  // An input's surface, so a select and an input in one form read as one family.
  trigger: {
    alignItems: "center",
    backgroundClip: "padding-box",
    borderBlockColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderInlineColor: {
      default: colors.border,
      [invalid]: colors.dangerBorder,
    },
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    boxShadow: {
      default: shadows.default,
      [`:is([data-popup-open]):not(${invalid})`]: shadows.defaultHover,
      // Repeated inside the media block, which StyleX ranks above the bare conditions.
      [media.hover]: {
        default: shadows.default,
        [`:is([data-popup-open]):not(${invalid})`]: shadows.defaultHover,
        [`:hover:not(:disabled, :active):not(${invalid})`]:
          shadows.defaultHover,
        [`:active:not(:disabled):not(${invalid})`]: shadows.defaultPressed,
        [invalid]: shadows.defaultInvalid,
      },
      [`:active:not(:disabled):not(${invalid})`]: shadows.defaultPressed,
      [invalid]: shadows.defaultInvalid,
    },
    color: colors.textPrimary,
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    display: "flex",
    gap: space.row,
    height: sizes.controlMd,
    justifyContent: "space-between",
    marginBlock: 0,
    marginInline: 0,
    maxWidth: "100%",
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.popup,
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color, box-shadow",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    width: "fit-content",
    // In a ButtonGroup, the focused item's ring stays above its neighbors.
    zIndex: { default: null, ":focus-visible": 1 },
  },
  sm: {
    height: sizes.controlSm,
  },
  lg: { height: sizes.controlLg },
  // A block, not a flex box: an ellipsis only ends text in a block.
  value: {
    color: { default: null, ":is([data-placeholder] *)": colors.textMuted },
    display: "block",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textAlign: "start",
    textOverflow: "ellipsis",
  },
  icon: {
    color: colors.textMuted,
    display: "flex",
    flexShrink: 0,
  },
  positioner: {
    zIndex: layers.popover,
  },
  popup: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    maxHeight,
    maxWidth: "var(--available-width)",
    minWidth: sizes.menu,
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    // Holds the scroll arrows, which Base UI positions absolutely.
    position: "relative",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
      [aligned]: "0s",
      [instant]: "0s",
    },
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    width: "var(--anchor-width)",
  },
  list: {
    maxHeight,
    overflowX: "hidden",
    overflowY: "auto",
    paddingBlock: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    position: "relative",
    scrollPaddingBlock: sizes.controlXs,
  },
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":is([data-highlighted])": colors.fillSubtle,
    },
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "flex",
    gap: space.row,
    minHeight: sizes.controlMd,
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    paddingInlineEnd: `calc(${sizes.icon} + ${space.sm})`,
    paddingInlineStart: space.sm,
    position: "relative",
    userSelect: "none",
  },
  itemSm: {
    minHeight: sizes.controlSm,
    paddingInlineEnd: `calc(${sizes.icon} + ${space.row} * 2)`,
    paddingInlineStart: space.row,
  },
  itemLg: {
    minHeight: sizes.controlLg,
    paddingInlineEnd: `calc(${sizes.icon} + ${space.md})`,
    paddingInlineStart: space.md,
  },
  // Wraps rather than truncating, so options that differ only at the end stay apart.
  itemText: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    gap: space.xs,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  indicator: {
    alignItems: "center",
    display: "flex",
    insetInlineEnd: space.sm,
    justifyContent: "center",
    position: "absolute",
  },
  indicatorSm: { insetInlineEnd: space.row },
  indicatorLg: { insetInlineEnd: space.md },
  label: {
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
    paddingBlock: space.xxs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
  labelSm: { paddingInlineEnd: space.row, paddingInlineStart: space.row },
  labelLg: { paddingInlineEnd: space.md, paddingInlineStart: space.md },
  // In line with the rows' text.
  separator: {
    backgroundColor: colors.borderSubtle,
    height: strokes.border,
    marginBlock: space.xxs,
    marginInline: space.sm,
  },
  separatorSm: { marginInline: space.row },
  separatorLg: { marginInline: space.md },
  scrollArrow: {
    alignItems: "center",
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    insetBlockEnd: { default: null, ":is([data-direction='down'])": 0 },
    insetBlockStart: { default: null, ":is([data-direction='up'])": 0 },
    color: colors.textMuted,
    cursor: "default",
    display: "flex",
    height: sizes.controlXs,
    justifyContent: "center",
    width: "100%",
    zIndex: 1,
  },
});

const sizeStyles = {
  default: null,
  lg: styles.lg,
  sm: [typeStyles.captionLg, styles.sm],
} satisfies Record<SelectSize, stylex.StyleXStyles | null>;

function Glyph({
  icon,
  size = "default",
}: {
  icon: typeof Tick02Icon;
  size?: SelectSize;
}) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={controlIconSize[size]}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

// The popup's rows by `SelectContent`'s size; the base styles are `default`'s.
const contentSizeStyles = {
  default: {
    indicator: null,
    item: null,
    label: null,
    separator: null,
    text: typeStyles.textMd,
  },
  lg: {
    indicator: styles.indicatorLg,
    item: styles.itemLg,
    label: styles.labelLg,
    separator: styles.separatorLg,
    text: typeStyles.textBase,
  },
  sm: {
    indicator: styles.indicatorSm,
    item: styles.itemSm,
    label: styles.labelSm,
    separator: styles.separatorSm,
    text: typeStyles.textSm,
  },
} satisfies Record<
  SelectSize,
  Record<
    "indicator" | "item" | "label" | "separator" | "text",
    stylex.StyleXStyles | null
  >
>;

const SkipMotion = createContext(false);
const Size = createContext<SelectSize>("default");

function Select<Value, Multiple extends boolean | undefined = false>({
  onOpenChange,
  ...props
}: SelectPrimitive.Root.Props<Value, Multiple>) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  return (
    <SkipMotion value={skip}>
      <SelectPrimitive.Root onOpenChange={handleOpenChange} {...props} />
    </SkipMotion>
  );
}

function SelectGroup({ sx, ...props }: Styled<SelectPrimitive.Group.Props>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      {...props}
      {...stylex.props(sx)}
    />
  );
}

function SelectValue({ sx, ...props }: Styled<SelectPrimitive.Value.Props>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

function SelectTrigger({
  children,
  size = "default",
  sx,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-size={size}
      data-slot="select-trigger"
      {...props}
      {...stylex.props(
        [typeStyles.textSm, styles.trigger],
        stateStyles.outline,
        joinStyles.sm,
        joinStyles.edges,
        sizeStyles[size],
        sx
      )}
    >
      {children}
      <SelectPrimitive.Icon {...stylex.props(styles.icon)}>
        <Glyph icon={UnfoldMoreIcon} size={size} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  sx,
  ...props
}: Styled<SelectPrimitive.ScrollUpArrow.Props>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      {...props}
      {...stylex.props(styles.scrollArrow, sx)}
    >
      <Glyph icon={ArrowUp01Icon} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  sx,
  ...props
}: Styled<SelectPrimitive.ScrollDownArrow.Props>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      {...props}
      {...stylex.props(styles.scrollArrow, sx)}
    >
      <Glyph icon={ArrowDown01Icon} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function SelectContent({
  align = "start",
  alignItemWithTrigger = false,
  alignOffset = 0,
  children,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  size = "default",
  sx,
  ...props
}: SelectContentProps) {
  const skip = useContext(SkipMotion);
  return (
    <Size value={size}>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          align={align}
          alignItemWithTrigger={alignItemWithTrigger}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(styles.positioner)}
        >
          <SelectPrimitive.Popup
            data-size={size}
            data-skip-motion={skip || undefined}
            data-slot="select-content"
            {...props}
            {...stylex.props(styles.popup, sx)}
          >
            <SelectScrollUpButton />
            <SelectPrimitive.List {...stylex.props(styles.list)}>
              {children}
            </SelectPrimitive.List>
            <SelectScrollDownButton />
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </Size>
  );
}

function SelectLabel({
  sx,
  ...props
}: Styled<SelectPrimitive.GroupLabel.Props>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      {...props}
      {...stylex.props(
        [typeStyles.captionLg, styles.label],
        contentSizeStyles[use(Size)].label,
        sx
      )}
    />
  );
}

function SelectItem({
  children,
  sx,
  ...props
}: Styled<SelectPrimitive.Item.Props>) {
  const size = use(Size);
  const sized = contentSizeStyles[size];
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...props}
      {...stylex.props([sized.text, styles.item], sized.item, sx)}
    >
      <SelectPrimitive.ItemText {...stylex.props(styles.itemText)}>
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        {...stylex.props(styles.indicator, sized.indicator)}
      >
        <Glyph icon={Tick02Icon} size={size} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  sx,
  ...props
}: Styled<SelectPrimitive.Separator.Props>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      {...props}
      {...stylex.props(
        styles.separator,
        contentSizeStyles[use(Size)].separator,
        sx
      )}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  selectSizes,
  SelectTrigger,
  SelectValue,
};
export type { SelectContentProps, SelectSize, SelectTriggerProps };
