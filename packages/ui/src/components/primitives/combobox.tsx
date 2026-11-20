"use client";

import {
  ArrowDown01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  ComboboxChipRemove as ComboboxChipRemovePrimitive,
  ComboboxChip as ComboboxChipPrimitive,
  ComboboxChips as ComboboxChipsPrimitive,
  ComboboxClear as ComboboxClearPrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxCreate as ComboboxCreatePrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxGroupLabel as ComboboxGroupLabelPrimitive,
  ComboboxGroup as ComboboxGroupPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItemIndicator as ComboboxItemIndicatorPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxList as ComboboxListPrimitive,
  Combobox as ComboboxPrimitive,
  ComboboxSeparator as ComboboxSeparatorPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
} from "@ui-sdk/react/combobox";
import type { ComboboxProps } from "@ui-sdk/react/combobox";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  inputGroupInputStyles,
} from "@/components/primitives/input-group";
import { popupMotion, useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import {
  controlIconSize,
  popupReset,
  typeStyles,
} from "@/lib/constella/styles";
import {
  colors,
  fontSizes,
  fontWeights,
  inputVars,
  lineHeights,
  offsets,
  opacities,
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

type InputPrimitiveProps = Omit<
  Styled<ComponentProps<typeof ComboboxInputPrimitive>>,
  "disabled" | "render" | "size"
>;

type TriggerLabel =
  | { showTrigger?: true; triggerLabel: string }
  | { showTrigger: false; triggerLabel?: never };

type ClearLabel =
  | { clearLabel: string; showClear: true }
  | { clearLabel?: never; showClear?: false };

// Native `size` counts characters; `size` here is the control scale.
type ComboboxInputProps = InputPrimitiveProps & {
  size?: ComboboxSize;
} & TriggerLabel &
  ClearLabel;

type ComboboxContentProps = Styled<
  ComponentProps<typeof ComboboxContentPrimitive>
> & { size?: ComboboxSize };

type ComboboxChipsProps = Styled<
  ComponentProps<typeof ComboboxChipsPrimitive>
> & { size?: ComboboxSize };

type ComboboxChipProps<T = string> = Omit<
  Styled<ComponentProps<typeof ComboboxChipPrimitive<T>>>,
  "children"
> & {
  children?: ReactNode;
  showRemove?: boolean;
};

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
  // ui-sdk's combobox leaves the browser's `[popover]` border, padding and margin.
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
    display: "flex",
    flexDirection: "column",
    marginBlock: 0,
    marginInline: 0,
    maxHeight: `min(var(--available-height), ${sizes.menuHeight})`,
    maxWidth: "var(--available-width)",
    minWidth: sizes.menu,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
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
  groupLabel: {
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
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
  ComboboxSize,
  Record<
    "groupLabel" | "indicator" | "item" | "separator" | "text",
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

interface Anchor {
  anchor: HTMLDivElement | null;
  setAnchor: (element: HTMLDivElement | null) => void;
}

const SkipMotion = createContext(false);
const Size = createContext<ComboboxSize>("default");
const AnchorContext = createContext<Anchor | null>(null);

function Combobox<T = string, Multiple extends boolean | undefined = false>(
  props: ComboboxProps<T, Multiple>
) {
  const [skip, handleOpenChange] = useSkipMotion(props.onOpenChange);
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const anchorContext = useMemo(() => ({ anchor, setAnchor }), [anchor]);
  return (
    <SkipMotion value={skip}>
      <AnchorContext value={anchorContext}>
        <ComboboxPrimitive<T, Multiple>
          {...props}
          onOpenChange={handleOpenChange}
        />
      </AnchorContext>
    </SkipMotion>
  );
}

function ComboboxLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxLabelPrimitive>>) {
  return <ComboboxLabelPrimitive {...props} {...stylex.props(sx)} />;
}

function ComboboxTrigger({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof ComboboxTriggerPrimitive>>, "children"> & {
  "aria-label": string;
  children?: ReactNode;
}) {
  return (
    <ComboboxTriggerPrimitive {...props} {...stylex.props(sx)}>
      {children}
      <Glyph icon={ArrowDown01Icon} />
    </ComboboxTriggerPrimitive>
  );
}

function ComboboxClear({
  sx,
  ...props
}: Omit<
  Styled<ComponentProps<typeof ComboboxClearPrimitive>>,
  "children" | "render"
> & { "aria-label": string }) {
  return (
    <ComboboxClearPrimitive
      {...props}
      render={<InputGroupButton size="icon-xs" sx={sx} variant="ghost" />}
    >
      <Glyph icon={Cancel01Icon} />
    </ComboboxClearPrimitive>
  );
}

/** An input group around the input, with a trigger and a clear button at its end, named by `triggerLabel` and `clearLabel`. `sx` goes to the group. */
function ComboboxInput({
  clearLabel,
  showClear,
  showTrigger,
  size = "default",
  sx,
  triggerLabel,
  ...props
}: ComboboxInputProps) {
  const input = inputGroupInputStyles();
  return (
    <InputGroup ref={use(AnchorContext)?.setAnchor} size={size} sx={sx}>
      <span data-slot="input-group-input" {...stylex.props(input.slot)}>
        <ComboboxInputPrimitive {...props} {...stylex.props(input.input)} />
      </span>
      <InputGroupAddon align="inline-end">
        {showTrigger !== false && (
          <ComboboxTriggerPrimitive
            aria-label={triggerLabel}
            render={
              <InputGroupButton
                size="icon-xs"
                sx={styles.trigger}
                variant="ghost"
              />
            }
          >
            <Glyph icon={ArrowDown01Icon} size={size} />
          </ComboboxTriggerPrimitive>
        )}
        {showClear === true && <ComboboxClear aria-label={clearLabel} />}
      </InputGroupAddon>
    </InputGroup>
  );
}

/** The popup, anchored to the input group's box unless `anchor` is set. */
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
  const groupBox = use(AnchorContext)?.anchor;
  return (
    <Size value={size}>
      <ComboboxContentPrimitive
        align={align}
        alignOffset={alignOffset}
        anchor={anchor ?? groupBox}
        data-size={size}
        data-skip-motion={skip || undefined}
        side={side}
        sideOffset={sideOffset}
        {...props}
        {...stylex.props(
          popupReset.base,
          styles.content,
          popupMotion.popover,
          sx
        )}
      />
    </Size>
  );
}

function ComboboxList({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxListPrimitive>>) {
  return (
    <ComboboxListPrimitive {...props} {...stylex.props(styles.list, sx)} />
  );
}

function ComboboxItem<T = string>({
  children,
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof ComboboxItemPrimitive<T>>>, "children"> & {
  children?: ReactNode;
}) {
  const size = use(Size);
  const sized = contentSizeStyles[size];
  return (
    <ComboboxItemPrimitive<T>
      {...props}
      {...stylex.props([sized.text, styles.item], sized.item, sx)}
    >
      {children}
      <ComboboxItemIndicatorPrimitive
        {...stylex.props(styles.indicator, sized.indicator)}
      >
        <Glyph icon={Tick02Icon} size={size} />
      </ComboboxItemIndicatorPrimitive>
    </ComboboxItemPrimitive>
  );
}

/** A row that offers the typed text as a new item. Shown while no item's label matches it exactly. */
function ComboboxCreate({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxCreatePrimitive>>) {
  const sized = contentSizeStyles[use(Size)];
  return (
    <ComboboxCreatePrimitive
      {...props}
      {...stylex.props([sized.text, styles.item], sized.item, sx)}
    />
  );
}

function ComboboxGroup({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxGroupPrimitive>>) {
  return <ComboboxGroupPrimitive {...props} {...stylex.props(sx)} />;
}

function ComboboxGroupLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxGroupLabelPrimitive>>) {
  return (
    <ComboboxGroupLabelPrimitive
      {...props}
      {...stylex.props(
        [typeStyles.captionLg, styles.groupLabel],
        contentSizeStyles[use(Size)].groupLabel,
        sx
      )}
    />
  );
}

function ComboboxEmpty({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxEmptyPrimitive>>) {
  return (
    <ComboboxEmptyPrimitive
      {...props}
      {...stylex.props([typeStyles.textMd, styles.empty], sx)}
    />
  );
}

function ComboboxSeparator({
  sx,
  ...props
}: Styled<ComponentProps<typeof ComboboxSeparatorPrimitive>>) {
  return (
    <ComboboxSeparatorPrimitive
      {...props}
      {...stylex.props(
        styles.separator,
        contentSizeStyles[use(Size)].separator,
        sx
      )}
    />
  );
}

/** An input group's box that wraps its chips and input onto new lines. `size` and `sx` go to the box. */
function ComboboxChips({ size = "default", sx, ...props }: ComboboxChipsProps) {
  return (
    <InputGroup
      ref={use(AnchorContext)?.setAnchor}
      size={size}
      sx={[styles.chipsBox, sx]}
    >
      <ComboboxChipsPrimitive {...props} {...stylex.props(styles.chips)} />
    </InputGroup>
  );
}

/** One selected value. Without children it shows the value's label; its remove button is named after it. */
function ComboboxChip<T = string>({
  children,
  showRemove = true,
  sx,
  ...props
}: ComboboxChipProps<T>) {
  return (
    <ComboboxChipPrimitive<T> {...props} {...stylex.props(styles.chip, sx)}>
      {({ label }) => (
        <>
          {children ?? label}
          {showRemove && (
            <ComboboxChipRemovePrimitive
              aria-label={`Remove ${label}`}
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
            </ComboboxChipRemovePrimitive>
          )}
        </>
      )}
    </ComboboxChipPrimitive>
  );
}

function ComboboxChipsInput({ sx, ...props }: InputPrimitiveProps) {
  const input = inputGroupInputStyles();
  return (
    <span data-slot="input-group-input" {...stylex.props(input.slot)}>
      <ComboboxInputPrimitive
        {...props}
        {...stylex.props(input.input, styles.chipsInput, sx)}
      />
    </span>
  );
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  comboboxSizes,
  ComboboxTrigger,
};
export { ComboboxValue } from "@ui-sdk/react/combobox";
export type {
  ComboboxChipProps,
  ComboboxChipsProps,
  ComboboxContentProps,
  ComboboxInputProps,
  ComboboxSize,
};
