"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useFieldControl } from "@ui-sdk/react/field";
import { createContext, use, useRef } from "react";
import type { Ref } from "react";

import { Button } from "@/components/primitives/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/primitives/input-group";
import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { controlIconSize, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  inputVars,
  layers,
  lineHeights,
  media,
  motion,
  offsets,
  opacities,
  popupVars,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const comboboxSizes = ["sm", "default", "lg"] as const;

type ComboboxSize = (typeof comboboxSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

// Native `size` counts characters; `size` here is the control scale.
type ComboboxInputProps = Omit<
  Styled<ComboboxPrimitive.Input.Props>,
  "render" | "size"
> & {
  showClear?: boolean;
  showTrigger?: boolean;
  size?: ComboboxSize;
};

type ComboboxContentProps = Styled<ComboboxPrimitive.Popup.Props> &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  > & { size?: ComboboxSize };

type ComboboxChipsProps = Styled<ComboboxPrimitive.Chips.Props> & {
  ref?: Ref<HTMLDivElement>;
  size?: ComboboxSize;
};

type ComboboxChipProps = Styled<ComboboxPrimitive.Chip.Props> & {
  showRemove?: boolean;
};

const offstage = ":is([data-starting-style], [data-ending-style])";
const closing = ":is([data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const maxHeight = `min(${popupVars.availableHeight}, ${sizes.menuHeight})`;

// Read from the chips box, which carries the size as `data-size`.
const inBox = (size: ComboboxSize) =>
  `:where([data-slot='input-group'][data-size='${size}'] *)`;
const bySize = (values: Record<ComboboxSize, string>) => ({
  default: values.default,
  [inBox("sm")]: values.sm,
  [inBox("lg")]: values.lg,
});

// A chip is a step under the box, centered in it with the same inset at every size.
const chipHeight = {
  default: sizes.controlXs,
  lg: sizes.controlSm,
  sm: sizes.controlXxs,
};
const chipInset = (box: string, chip: string) =>
  `calc((${box} - ${chip}) / 2 - ${strokes.border})`;
const inset = {
  default: chipInset(sizes.controlMd, chipHeight.default),
  lg: chipInset(sizes.controlLg, chipHeight.lg),
  sm: chipInset(sizes.controlSm, chipHeight.sm),
};
// Concentric with the box's corner at that inset.
const chipCorner = (gap: string) =>
  `calc(${radii.md} - ${strokes.border} - ${gap})`;
const chipRadius = bySize({
  default: chipCorner(inset.default),
  lg: chipCorner(inset.lg),
  sm: chipCorner(inset.sm),
});
const chipSide = { default: space.xs, lg: space.popup, sm: space.row };
// Empty, the box pads no side, so its text sits where a plain input's does. `:is`, not
// `:where`, so a size outranks the default.
const hasChip = ":has(> [data-slot='combobox-chip'])";
const sideInset = {
  default: 0,
  [hasChip]: inset.default,
  [`:is([data-slot='input-group'][data-size='sm'] *)${hasChip}`]: inset.sm,
  [`:is([data-slot='input-group'][data-size='lg'] *)${hasChip}`]: inset.lg,
};
const unscaled = (length: string) => `calc(${length} / ${inputVars.scale})`;

const styles = stylex.create({
  positioner: {
    [popupVars.availableHeight]: "var(--available-height)",
    [popupVars.availableWidth]: "var(--available-width)",
    zIndex: layers.popover,
  },
  popup: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    maxHeight,
    maxWidth: popupVars.availableWidth,
    minWidth: sizes.menu,
    opacity: { default: 1, [offstage]: 0 },
    transform: { default: "none", [offstage]: `scale(${motion.popoverScale})` },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: {
      default: durations.popover,
      [closing]: durations.popoverExit,
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
    minHeight: 0,
    overflowX: "hidden",
    overflowY: "auto",
    overscrollBehavior: "contain",
    paddingBlockEnd: { default: space.xxs, ":empty": 0 },
    paddingBlockStart: { default: space.xxs, ":empty": 0 },
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    scrollPaddingBlock: space.xxs,
  },
  empty: {
    color: colors.textSecondary,
    paddingBlockEnd: { default: space.lg, ":empty": 0 },
    paddingBlockStart: { default: space.lg, ":empty": 0 },
    textAlign: "center",
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
    overflowWrap: "anywhere",
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
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
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
  // Hidden while the clear button stands in its place.
  trigger: {
    display: {
      default: null,
      ":is([data-slot='input-group']:has([data-slot='combobox-clear']) *)":
        "none",
    },
  },
  // The input group's box, grown to hold rows of chips.
  chipsBox: {
    alignItems: "stretch",
    height: "auto",
    minHeight: {
      default: sizes.controlMd,
      ":is([data-size='sm'])": sizes.controlSm,
      ":is([data-size='lg'])": sizes.controlLg,
    },
  },
  chips: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    flexWrap: "wrap",
    gap: space.xxs,
    minWidth: 0,
    paddingBlockEnd: bySize(inset),
    paddingBlockStart: bySize(inset),
    paddingInlineEnd: sideInset,
    paddingInlineStart: sideInset,
  },
  chip: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderStartStartRadius: chipRadius,
    borderStartEndRadius: chipRadius,
    borderEndStartRadius: chipRadius,
    borderEndEndRadius: chipRadius,
    color: colors.textPrimary,
    display: "inline-flex",
    flexShrink: 0,
    fontSize: bySize({
      default: fontSizes.captionLg,
      lg: fontSizes.textSm,
      sm: fontSizes.captionLg,
    }),
    fontWeight: fontWeights.medium,
    height: bySize(chipHeight),
    lineHeight: bySize({
      default: lineHeights.captionLg,
      lg: lineHeights.textSm,
      sm: lineHeights.captionLg,
    }),
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "clip",
    paddingInlineEnd: {
      ...bySize(chipSide),
      ":has(> [data-slot='combobox-chip-remove'])": 0,
    },
    paddingInlineStart: bySize(chipSide),
    whiteSpace: "nowrap",
  },
  // A square the chip's height, flush with its end, so its corners are the chip's.
  chipRemove: {
    aspectRatio: "1",
    borderEndEndRadius: "inherit",
    borderEndStartRadius: "inherit",
    borderStartEndRadius: "inherit",
    borderStartStartRadius: "inherit",
    color: colors.textMuted,
    height: "100%",
    width: "auto",
  },
  // A small basis, so the input shares a line with the chips and grows into what's left.
  chipsInput: {
    flexGrow: 1,
    width: unscaled(sizes.chipsInput),
  },
});

// The popup's rows by `ComboboxContent`'s size; the base styles are `default`'s.
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
  ComboboxSize,
  Record<
    "indicator" | "item" | "label" | "separator" | "text",
    stylex.StyleXStyles | null
  >
>;

function Glyph({
  icon,
  size = "default",
}: {
  icon: typeof Tick02Icon;
  size?: ComboboxSize;
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

const SkipMotion = createContext(false);
const Size = createContext<ComboboxSize>("default");

function Combobox<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>({
  onOpenChange,
  ...props
}: ComboboxPrimitive.Root.Props<Value, Multiple, Item>) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  // Joins a ui-sdk Field until Combobox ports.
  const field = useFieldControl();
  return (
    <SkipMotion value={skip}>
      <ComboboxPrimitive.Root
        disabled={field?.disabled}
        name={field?.name}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SkipMotion>
  );
}

// Only the field's id, over Base UI's: the rendered ui-sdk Input joins the field itself.
function FieldInput(props: ComboboxPrimitive.Input.Props) {
  const field = useFieldControl(props);
  const { id } = { id: props.id, ...field?.props(props) };
  return <ComboboxPrimitive.Input {...props} id={id} />;
}

function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value {...props} />;
}

function ComboboxTrigger({
  children,
  sx,
  ...props
}: Styled<ComboboxPrimitive.Trigger.Props>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      {...props}
      {...stylex.props(sx)}
    >
      {children}
      <Glyph icon={ArrowDown01Icon} />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({
  sx,
  ...props
}: Omit<Styled<ComboboxPrimitive.Clear.Props>, "render">) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton size="icon-xs" sx={sx} variant="ghost" />}
      {...props}
    >
      <Glyph icon={Cancel01Icon} />
    </ComboboxPrimitive.Clear>
  );
}

/** An input group around the input, with a trigger and a clear button at its end. `sx` goes to the group. */
function ComboboxInput({
  children,
  disabled = false,
  showClear = false,
  showTrigger = true,
  size = "default",
  sx,
  ...props
}: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.InputGroup render={<InputGroup size={size} sx={sx} />}>
      <FieldInput disabled={disabled} render={<InputGroupInput />} {...props} />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <ComboboxPrimitive.Trigger
            disabled={disabled}
            render={
              <InputGroupButton
                size="icon-xs"
                sx={styles.trigger}
                variant="ghost"
              />
            }
          >
            <Glyph icon={ArrowDown01Icon} size={size} />
          </ComboboxPrimitive.Trigger>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </ComboboxPrimitive.InputGroup>
  );
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function ComboboxContent({
  align = "start",
  alignOffset = 0,
  anchor,
  side = "bottom",
  sideOffset = Number(offsets.popover),
  size = "default",
  sx,
  ...props
}: ComboboxContentProps) {
  const skip = use(SkipMotion);
  return (
    <Size value={size}>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(styles.positioner)}
        >
          <ComboboxPrimitive.Popup
            data-size={size}
            data-skip-motion={skip || undefined}
            data-slot="combobox-content"
            {...props}
            {...stylex.props(styles.popup, sx)}
          />
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </Size>
  );
}

function ComboboxList({ sx, ...props }: Styled<ComboboxPrimitive.List.Props>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      {...props}
      {...stylex.props(styles.list, sx)}
    />
  );
}

function ComboboxItem({
  children,
  sx,
  ...props
}: Styled<ComboboxPrimitive.Item.Props>) {
  const size = use(Size);
  const sized = contentSizeStyles[size];
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      {...props}
      {...stylex.props([sized.text, styles.item], sized.item, sx)}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        {...stylex.props(styles.indicator, sized.indicator)}
      >
        <Glyph icon={Tick02Icon} size={size} />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({
  sx,
  ...props
}: Styled<ComboboxPrimitive.Group.Props>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      {...props}
      {...stylex.props(sx)}
    />
  );
}

function ComboboxLabel({
  sx,
  ...props
}: Styled<ComboboxPrimitive.GroupLabel.Props>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      {...props}
      {...stylex.props(
        [typeStyles.captionLg, styles.label],
        contentSizeStyles[use(Size)].label,
        sx
      )}
    />
  );
}

function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />;
}

function ComboboxEmpty({
  sx,
  ...props
}: Styled<ComboboxPrimitive.Empty.Props>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      {...props}
      {...stylex.props([typeStyles.textMd, styles.empty], sx)}
    />
  );
}

function ComboboxSeparator({
  sx,
  ...props
}: Styled<ComboboxPrimitive.Separator.Props>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      {...props}
      {...stylex.props(
        styles.separator,
        contentSizeStyles[use(Size)].separator,
        sx
      )}
    />
  );
}

/** An input group's box that wraps its chips and input onto new lines. `ref` and `sx` go to the box. */
function ComboboxChips({
  ref,
  size = "default",
  sx,
  ...props
}: ComboboxChipsProps) {
  return (
    <ComboboxPrimitive.InputGroup
      ref={ref}
      render={<InputGroup size={size} sx={[styles.chipsBox, sx]} />}
    >
      <ComboboxPrimitive.Chips
        data-slot="combobox-chips"
        {...props}
        {...stylex.props(styles.chips)}
      />
    </ComboboxPrimitive.InputGroup>
  );
}

function ComboboxChip({
  children,
  showRemove = true,
  sx,
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      {...props}
      {...stylex.props(styles.chip, sx)}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          aria-label="Remove"
          data-slot="combobox-chip-remove"
          render={
            <Button size="icon-xs" sx={styles.chipRemove} variant="ghost" />
          }
        >
          <HugeiconsIcon
            aria-hidden
            icon={Cancel01Icon}
            size={sizes.iconXs}
            strokeWidth={Number(strokes.icon)}
          />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  sx,
  ...props
}: Omit<Styled<ComboboxPrimitive.Input.Props>, "render">) {
  return (
    // Keeps the group's `input-group-control` slot, so the box draws the focus ring.
    <FieldInput
      render={<InputGroupInput sx={[styles.chipsInput, sx]} />}
      {...props}
    />
  );
}

/** A ref for the chips box, to anchor `ComboboxContent` to it. */
function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  comboboxSizes,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
export type {
  ComboboxChipProps,
  ComboboxChipsProps,
  ComboboxContentProps,
  ComboboxInputProps,
  ComboboxSize,
};
