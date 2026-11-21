"use client";

import { Tick02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  SelectContent as SelectContentPrimitive,
  SelectGroupLabel as SelectGroupLabelPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectItemIndicator as SelectItemIndicatorPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectLabel as SelectLabelPrimitive,
  Select as SelectPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
} from "@ui-sdk/react/select";
import type { SelectProps } from "@ui-sdk/react/select";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";

import { popupMotion, useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  joinStyles,
  popupReset,
  stateStyles,
  typeStyles,
  withStyles,
} from "@/lib/constella/styles";
import {
  colors,
  durations,
  fontWeights,
  media,
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

type SelectTriggerProps = Omit<
  Styled<ComponentProps<typeof SelectTriggerPrimitive>>,
  "children"
> & {
  children?: ReactNode;
  size?: SelectSize;
};

type SelectContentProps = Styled<
  ComponentProps<typeof SelectContentPrimitive>
> & { size?: SelectSize };

const invalid = ":is([aria-invalid='true'], [data-invalid])";
const disabled = ":is(:disabled, [data-disabled])";

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
      [`:is([data-open]):not(${invalid})`]: shadows.defaultHover,
      // Repeated inside the media block, which StyleX ranks above the bare conditions.
      [media.hover]: {
        default: shadows.default,
        [`:is([data-open]):not(${invalid})`]: shadows.defaultHover,
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
  // ui-sdk's select leaves the browser's `[popover]` border and margin.
  content: {
    backgroundColor: colors.raised,
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    marginBlock: 0,
    marginInline: 0,
    maxHeight: `min(var(--available-height), ${sizes.menuHeight})`,
    maxWidth: "var(--available-width)",
    minWidth: sizes.menu,
    overflowX: "hidden",
    overflowY: "auto",
    paddingBlock: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    scrollPaddingBlock: sizes.controlXs,
    width: "var(--anchor-width)",
  },
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":is([data-highlighted])": colors.fillSubtle,
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
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
  groupLabel: {
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
    paddingBlock: space.xxs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
  groupLabelSm: { paddingInlineEnd: space.row, paddingInlineStart: space.row },
  groupLabelLg: { paddingInlineEnd: space.md, paddingInlineStart: space.md },
  // In line with the rows' text.
  separator: {
    backgroundColor: colors.borderSubtle,
    height: strokes.border,
    marginBlock: space.xxs,
    marginInline: space.sm,
  },
  separatorSm: { marginInline: space.row },
  separatorLg: { marginInline: space.md },
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
    groupLabel: null,
    indicator: null,
    item: null,
    separator: null,
    text: typeStyles.textMd,
  },
  lg: {
    groupLabel: styles.groupLabelLg,
    indicator: styles.indicatorLg,
    item: styles.itemLg,
    separator: styles.separatorLg,
    text: typeStyles.textBase,
  },
  sm: {
    groupLabel: styles.groupLabelSm,
    indicator: styles.indicatorSm,
    item: styles.itemSm,
    separator: styles.separatorSm,
    text: typeStyles.textSm,
  },
} satisfies Record<
  SelectSize,
  Record<
    "groupLabel" | "indicator" | "item" | "separator" | "text",
    stylex.StyleXStyles | null
  >
>;

const SkipMotion = createContext(false);
const Size = createContext<SelectSize>("default");

function Select<T = string, Multiple extends boolean | undefined = false>(
  props: SelectProps<T, Multiple>
) {
  const [skip, handleOpenChange] = useSkipMotion(props.onOpenChange);
  return (
    <SkipMotion value={skip}>
      <SelectPrimitive<T, Multiple>
        {...props}
        loop={props.loop ?? false}
        onOpenChange={handleOpenChange}
      />
    </SkipMotion>
  );
}

function SelectLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof SelectLabelPrimitive>>) {
  return <SelectLabelPrimitive {...withStyles(props, stylex.props(sx))} />;
}

function SelectGroup({
  sx,
  ...props
}: Styled<ComponentProps<typeof SelectGroupPrimitive>>) {
  return <SelectGroupPrimitive {...withStyles(props, stylex.props(sx))} />;
}

function SelectValue({
  sx,
  ...props
}: Styled<ComponentProps<typeof SelectValuePrimitive>>) {
  return (
    <SelectValuePrimitive
      {...withStyles(props, stylex.props(styles.value, sx))}
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
    <SelectTriggerPrimitive
      data-size={size}
      {...withStyles(
        props,
        stylex.props(
          [typeStyles.textSm, styles.trigger],
          stateStyles.outline,
          joinStyles.md,
          joinStyles.edges,
          sizeStyles[size],
          sx
        )
      )}
    >
      {children}
      <span aria-hidden {...stylex.props(styles.icon)}>
        <Glyph icon={UnfoldMoreIcon} size={size} />
      </span>
    </SelectTriggerPrimitive>
  );
}

function SelectContent({
  align = "start",
  alignItemWithTrigger = false,
  alignOffset = 0,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  size = "default",
  sx,
  ...props
}: SelectContentProps) {
  const skip = use(SkipMotion);
  const opensInPlace = alignItemWithTrigger;
  return (
    <Size value={size}>
      <SelectContentPrimitive
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        data-size={size}
        data-skip-motion={skip || opensInPlace || undefined}
        side={side}
        sideOffset={sideOffset}
        {...withStyles(
          props,
          stylex.props(popupReset.base, styles.content, popupMotion.popover, sx)
        )}
      />
    </Size>
  );
}

function SelectGroupLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof SelectGroupLabelPrimitive>>) {
  return (
    <SelectGroupLabelPrimitive
      {...withStyles(
        props,
        stylex.props(
          [typeStyles.captionLg, styles.groupLabel],
          contentSizeStyles[use(Size)].groupLabel,
          sx
        )
      )}
    />
  );
}

function SelectItem<T = string>({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof SelectItemPrimitive<T>>>, "children"> & {
  children?: ReactNode;
}) {
  const size = use(Size);
  const sized = contentSizeStyles[size];
  return (
    <SelectItemPrimitive<T>
      {...withStyles(
        props,
        stylex.props([sized.text, styles.item], sized.item, sx)
      )}
    >
      <span {...stylex.props(styles.itemText)}>{children}</span>
      <SelectItemIndicatorPrimitive
        {...stylex.props(styles.indicator, sized.indicator)}
      >
        <Glyph icon={Tick02Icon} size={size} />
      </SelectItemIndicatorPrimitive>
    </SelectItemPrimitive>
  );
}

function SelectSeparator({
  sx,
  ...props
}: Styled<ComponentProps<typeof SelectSeparatorPrimitive>>) {
  return (
    <SelectSeparatorPrimitive
      {...withStyles(
        props,
        stylex.props(
          styles.separator,
          contentSizeStyles[use(Size)].separator,
          sx
        )
      )}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  selectSizes,
  SelectTrigger,
  SelectValue,
};
export type { SelectContentProps, SelectSize, SelectTriggerProps };
