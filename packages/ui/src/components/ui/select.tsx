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

import { joinStyles } from "@/lib/join";
import { useSkipMotion } from "@/lib/motion";
import {
  colors,
  durations,
  easings,
  fontSizes,
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
} from "@/lib/tokens.stylex";

const selectSizes = ["sm", "default", "lg"] as const;

type SelectSize = (typeof selectSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
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

// shadcn's padding, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  // An input's surface, so a select and an input in one form read as one family.
  trigger: {
    alignItems: "center",
    backgroundClip: "padding-box",
    backgroundColor: {
      default: colors.background,
      [media.hover]: {
        default: colors.background,
        ":hover:not(:disabled)": colors.fillSubtle,
      },
      ":active:not(:disabled)": colors.fillSubtle,
    },
    borderBlockColor: { default: colors.edge, [invalid]: colors.danger },
    borderInlineColor: { default: colors.edge, [invalid]: colors.danger },
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    boxShadow: {
      default: shadows.control,
      // Repeated inside the media block, which StyleX ranks above the bare conditions.
      [media.hover]: {
        default: shadows.control,
        [`:hover:not(:disabled, :active):not(${invalid})`]:
          shadows.controlHover,
        [`:active:not(:disabled):not(${invalid})`]: shadows.controlPressed,
        [invalid]: shadows.invalid,
      },
      [`:active:not(:disabled):not(${invalid})`]: shadows.controlPressed,
      [invalid]: shadows.invalid,
    },
    boxSizing: "border-box",
    color: colors.textPrimary,
    cursor: { default: "pointer", [disabled]: "not-allowed" },
    display: "flex",
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    gap: px6,
    height: sizes.controlMd,
    justifyContent: "space-between",
    marginBlock: 0,
    marginInline: 0,
    minWidth: 0,
    opacity: { default: 1, [disabled]: opacities.disabled },
    paddingInlineEnd: space.xs,
    paddingInlineStart: px10,
    transitionDuration: durations.hover,
    transitionProperty: "background-color, border-color, box-shadow",
    transitionTimingFunction: "ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    width: "fit-content",
    // In a ButtonGroup, the focused item's ring stays above its neighbors.
    zIndex: { default: null, ":focus-visible": 1 },
  },
  sm: { fontSize: fontSizes.xs, height: sizes.controlSm },
  lg: { height: sizes.controlLg },
  value: {
    alignItems: "center",
    color: { default: null, ":is([data-placeholder] *)": colors.textMuted },
    display: "flex",
    flex: 1,
    gap: px6,
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
    boxShadow: shadows.popover,
    boxSizing: "border-box",
    color: colors.textPrimary,
    maxHeight,
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
    boxSizing: "border-box",
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
    fontSize: fontSizes.sm,
    gap: px6,
    minHeight: sizes.controlSm,
    opacity: { default: 1, ":is([data-disabled])": opacities.disabled },
    paddingInlineEnd: `calc(${sizes.icon} + ${space.xs} * 2)`,
    paddingInlineStart: px6,
    position: "relative",
    userSelect: "none",
  },
  itemSm: { fontSize: fontSizes.xs, minHeight: sizes.controlXs },
  itemLg: { minHeight: sizes.controlMd },
  itemText: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    gap: space.xs,
    whiteSpace: "nowrap",
  },
  indicator: {
    alignItems: "center",
    display: "flex",
    insetInlineEnd: space.xs,
    justifyContent: "center",
    position: "absolute",
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    paddingBlock: space.xxs,
    paddingInlineEnd: px6,
    paddingInlineStart: px6,
  },
  separator: {
    backgroundColor: colors.edgeSubtle,
    height: strokes.border,
    marginBlock: space.xxs,
    marginInline: `calc(-1 * ${space.xxs})`,
  },
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
  sm: styles.sm,
} satisfies Record<SelectSize, stylex.StyleXStyles | null>;

function Glyph({ icon }: { icon: typeof Tick02Icon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

const itemSizeStyles = {
  default: null,
  lg: styles.itemLg,
  sm: styles.itemSm,
} satisfies Record<SelectSize, stylex.StyleXStyles | null>;

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

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
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
        styles.trigger,
        joinStyles.sm,
        joinStyles.edges,
        sizeStyles[size],
        sx
      )}
    >
      {children}
      <SelectPrimitive.Icon {...stylex.props(styles.icon)}>
        <Glyph icon={UnfoldMoreIcon} />
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
      {...stylex.props(styles.label, sx)}
    />
  );
}

function SelectItem({
  children,
  sx,
  ...props
}: Styled<SelectPrimitive.Item.Props>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...props}
      {...stylex.props(styles.item, itemSizeStyles[use(Size)], sx)}
    >
      <SelectPrimitive.ItemText {...stylex.props(styles.itemText)}>
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator {...stylex.props(styles.indicator)}>
        <Glyph icon={Tick02Icon} />
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
      {...stylex.props(styles.separator, sx)}
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
