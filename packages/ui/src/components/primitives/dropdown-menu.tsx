"use client";

import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import type {
  MenuController,
  MenuProps,
  MenuSubProps,
} from "@ui-sdk/react/menu";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";

import { useSkipMotion } from "@/lib/constella/motion";
import type { Sx } from "@/lib/constella/styles";
import { popupReset, typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
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

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type WithChildren<T> = Omit<T, "children"> & { children?: ReactNode };

interface Inset {
  inset?: boolean;
}

const dropdownMenuSizes = ["sm", "default", "lg"] as const;

type DropdownMenuSize = (typeof dropdownMenuSizes)[number];

type DropdownMenuTriggerProps<Payload> = Styled<
  Omit<ComponentProps<typeof MenuTrigger>, "controller" | "payload">
> & {
  controller?: MenuController<Payload>;
  payload?: NoInfer<Payload>;
};

type DropdownMenuContentProps<Payload = unknown> = Styled<
  ComponentProps<typeof MenuContent<Payload>>
> & { size?: DropdownMenuSize };

const dropdownMenuItemColors = ["danger"] as const;

type DropdownMenuItemColor = (typeof dropdownMenuItemColors)[number];

// `[data-skip-motion]` is never offstage, so an instant open paints no blank frame while ui-sdk holds `data-starting-style`.
const offstage =
  ":is([data-starting-style], [data-ending-style]):not([data-skip-motion])";
const closing = ":is([data-ending-style]):not([data-skip-motion])";
const instant = ":is([data-skip-motion])";
const highlighted = ":is([data-highlighted], [data-open])";
const danger = ":is([data-color='danger'])";
const off = ":is([data-disabled])";
const unchecked = ":is([data-unchecked])";
const inset = ":is([data-inset])";

// An inset row starts where the text of a row with an icon does.
const insetStart = (padding: string) =>
  `calc(${padding} + ${sizes.icon} + ${space.row})`;

const styles = stylex.create({
  // Select's surface and motion, so every popup opens the same way.
  popup: {
    backgroundColor: colors.raised,
    // ui-sdk's runtime layer resets the browser's `[popover]` box for popover and dialog content, not a menu's.
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    boxShadow: shadows.lg,
    maxHeight: "var(--available-height)",
    maxWidth: "var(--available-width)",
    // Wide enough for a label beside its value.
    minWidth: `max(var(--anchor-width), ${sizes.menuLg})`,
    opacity: { default: 1, [offstage]: 0 },
    overflowY: "auto",
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
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
  },
  popupSm: {
    minWidth: `max(var(--anchor-width), ${sizes.menu})`,
  },
  submenu: {
    transform: "none",
    transitionDuration: { default: durations.popoverExit, [instant]: "0s" },
    transitionProperty: "opacity",
  },
  // Select's item, so a menu and a select read as one family.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [highlighted]: colors.fillSubtle,
      [`${danger}${highlighted}`]: colors.dangerSubtle,
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    color: { default: colors.textPrimary, [danger]: colors.dangerText },
    cursor: { default: "pointer", [off]: "not-allowed" },
    display: "flex",
    gap: space.row,
    minHeight: sizes.controlMd,
    opacity: { default: 1, [off]: opacities.disabled },
    overflowWrap: "anywhere",
    paddingInlineEnd: space.sm,
    paddingInlineStart: { default: space.sm, [inset]: insetStart(space.sm) },
    position: "relative",
    textDecorationLine: "none",
    userSelect: "none",
  },
  itemSm: {
    minHeight: sizes.controlSm,
    paddingInlineEnd: space.row,
    paddingInlineStart: { default: space.row, [inset]: insetStart(space.row) },
  },
  itemLg: {
    minHeight: sizes.controlLg,
    paddingInlineEnd: space.md,
    paddingInlineStart: { default: space.md, [inset]: insetStart(space.md) },
  },
  // Room on the end for the tick, as in a select.
  checkable: {
    paddingInlineEnd: `calc(${sizes.icon} + ${space.sm})`,
  },
  checkableSm: {
    paddingInlineEnd: `calc(${sizes.icon} + ${space.row} * 2)`,
  },
  checkableLg: {
    paddingInlineEnd: `calc(${sizes.icon} + ${space.md})`,
  },
  indicator: {
    alignItems: "center",
    clipPath: {
      default: "inset(0)",
      [unchecked]: {
        default: "inset(0 100% 0 0)",
        [media.reducedMotion]: "inset(0)",
      },
    },
    display: "flex",
    insetInlineEnd: space.sm,
    justifyContent: "center",
    opacity: { default: 1, [unchecked]: 0 },
    pointerEvents: "none",
    position: "absolute",
    transitionDelay: { default: "0s", [unchecked]: `0s, ${durations.hover}` },
    transitionDuration: {
      default: `0s, ${durations.move}`,
      [unchecked]: `${durations.hover}, 0s`,
    },
    transitionProperty: {
      default: "opacity, clip-path",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  indicatorSm: {
    insetInlineEnd: space.row,
  },
  indicatorLg: {
    insetInlineEnd: space.md,
  },
  chevron: {
    color: colors.textMuted,
    display: "flex",
    marginInlineStart: "auto",
  },
  label: {
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: { default: space.sm, [inset]: insetStart(space.sm) },
  },
  labelSm: {
    paddingInlineEnd: space.row,
    paddingInlineStart: { default: space.row, [inset]: insetStart(space.row) },
  },
  labelLg: {
    paddingInlineEnd: space.md,
    paddingInlineStart: { default: space.md, [inset]: insetStart(space.md) },
  },
  // In line with the rows' text.
  separator: {
    backgroundColor: colors.borderSubtle,
    height: strokes.border,
    marginBlock: space.xxs,
    marginInlineEnd: space.sm,
    marginInlineStart: space.sm,
  },
  separatorSm: {
    marginInlineEnd: space.row,
    marginInlineStart: space.row,
  },
  separatorLg: {
    marginInlineEnd: space.md,
    marginInlineStart: space.md,
  },
  shortcut: {
    color: colors.textMuted,
    flexShrink: 0,
    marginInlineStart: "auto",
    whiteSpace: "nowrap",
  },
});

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

const sizeStyles = {
  default: {
    checkable: null,
    indicator: null,
    item: null,
    label: null,
    popup: null,
    separator: null,
    text: typeStyles.textMd,
  },
  lg: {
    checkable: styles.checkableLg,
    indicator: styles.indicatorLg,
    item: styles.itemLg,
    label: styles.labelLg,
    popup: null,
    separator: styles.separatorLg,
    text: typeStyles.textBase,
  },
  sm: {
    checkable: styles.checkableSm,
    indicator: styles.indicatorSm,
    item: styles.itemSm,
    label: styles.labelSm,
    popup: styles.popupSm,
    separator: styles.separatorSm,
    text: typeStyles.textSm,
  },
} satisfies Record<
  DropdownMenuSize,
  Record<
    | "checkable"
    | "indicator"
    | "item"
    | "label"
    | "popup"
    | "separator"
    | "text",
    stylex.StyleXStyles | null
  >
>;

const SkipMotion = createContext(false);
const Size = createContext<DropdownMenuSize>("default");

function useSizeStyles() {
  return sizeStyles[use(Size)];
}

function DropdownMenu({ onOpenChange, ...props }: MenuProps) {
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  return (
    <SkipMotion value={skip}>
      <Menu onOpenChange={handleOpenChange} {...props} />
    </SkipMotion>
  );
}

function DropdownMenuTrigger<Payload = unknown>({
  sx,
  ...props
}: DropdownMenuTriggerProps<Payload>) {
  return <MenuTrigger {...props} {...stylex.props(sx)} />;
}

function Popup<Payload>({
  nested = false,
  size: ownSize,
  sx,
  ...props
}: DropdownMenuContentProps<Payload> & { nested?: boolean }) {
  const skip = use(SkipMotion);
  // A submenu takes its parent's size unless it sets its own.
  const size = ownSize ?? use(Size);
  const Part = nested ? MenuSubContent : MenuContent;
  return (
    <Size value={size}>
      <Part<Payload>
        data-size={size}
        data-skip-motion={skip || undefined}
        {...props}
        {...stylex.props(
          [popupReset.base, styles.popup],
          sizeStyles[size].popup,
          nested && styles.submenu,
          sx
        )}
      />
    </Size>
  );
}

function DropdownMenuContent<Payload = unknown>({
  align = "start",
  side = "bottom",
  sideOffset = Number(offsets.popover),
  ...props
}: DropdownMenuContentProps<Payload>) {
  return (
    <Popup<Payload>
      align={align}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuGroup({
  sx,
  ...props
}: Styled<ComponentProps<typeof MenuGroup>>) {
  return <MenuGroup {...props} {...stylex.props(sx)} />;
}

function DropdownMenuLabel({
  inset: isInset,
  sx,
  ...props
}: Styled<ComponentProps<typeof MenuGroupLabel>> & Inset) {
  return (
    <MenuGroupLabel
      data-inset={isInset}
      {...props}
      {...stylex.props(
        [typeStyles.captionLg, styles.label],
        useSizeStyles().label,
        sx
      )}
    />
  );
}

function DropdownMenuItem({
  inset: isInset,
  color,
  sx,
  ...props
}: Styled<
  Omit<ComponentProps<typeof MenuItem>, "color" | "destructive" | "shortcut">
> &
  Inset & { color?: DropdownMenuItemColor }) {
  const size = useSizeStyles();
  return (
    <MenuItem
      data-color={color}
      data-inset={isInset}
      {...props}
      {...stylex.props([size.text, styles.item], size.item, sx)}
    />
  );
}

function DropdownMenuSub({ onOpenChange, ...props }: MenuSubProps) {
  const inherited = use(SkipMotion);
  const [skip, handleOpenChange] = useSkipMotion(onOpenChange);
  return (
    <SkipMotion value={inherited || skip}>
      <MenuSub onOpenChange={handleOpenChange} {...props} />
    </SkipMotion>
  );
}

function DropdownMenuSubTrigger({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<WithChildren<ComponentProps<typeof MenuSubTrigger>>> & Inset) {
  const size = useSizeStyles();
  return (
    <MenuSubTrigger
      data-inset={isInset}
      {...props}
      {...stylex.props([size.text, styles.item], size.item, sx)}
    >
      {children}
      <MenuItemIcon mirror {...stylex.props(styles.chevron)}>
        <Glyph icon={ArrowRight01Icon} />
      </MenuItemIcon>
    </MenuSubTrigger>
  );
}

function DropdownMenuSubContent({
  sideOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return <Popup nested sideOffset={sideOffset} {...props} />;
}

function Indicator() {
  const size = useSizeStyles();
  return (
    <MenuItemIndicator
      keepMounted
      {...stylex.props(styles.indicator, size.indicator)}
    >
      <Glyph icon={Tick02Icon} />
    </MenuItemIndicator>
  );
}

function DropdownMenuCheckboxItem({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<WithChildren<ComponentProps<typeof MenuCheckboxItem>>> & Inset) {
  const size = useSizeStyles();
  return (
    <MenuCheckboxItem
      data-inset={isInset}
      {...props}
      {...stylex.props(
        [size.text, styles.item],
        size.item,
        styles.checkable,
        size.checkable,
        sx
      )}
    >
      {children}
      <Indicator />
    </MenuCheckboxItem>
  );
}

function DropdownMenuRadioGroup<T extends string = string>({
  sx,
  ...props
}: Styled<ComponentProps<typeof MenuRadioGroup<T>>>) {
  return <MenuRadioGroup<T> {...props} {...stylex.props(sx)} />;
}

function DropdownMenuRadioItem({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<WithChildren<ComponentProps<typeof MenuRadioItem>>> & Inset) {
  const size = useSizeStyles();
  return (
    <MenuRadioItem
      data-inset={isInset}
      {...props}
      {...stylex.props(
        [size.text, styles.item],
        size.item,
        styles.checkable,
        size.checkable,
        sx
      )}
    >
      {children}
      <Indicator />
    </MenuRadioItem>
  );
}

function DropdownMenuSeparator({
  sx,
  ...props
}: Styled<ComponentProps<typeof MenuSeparator>>) {
  return (
    <MenuSeparator
      {...props}
      {...stylex.props(styles.separator, useSizeStyles().separator, sx)}
    />
  );
}

function DropdownMenuShortcut({
  sx,
  ...props
}: Styled<ComponentProps<typeof MenuShortcut>>) {
  return (
    <MenuShortcut
      {...props}
      {...stylex.props([typeStyles.captionLg, styles.shortcut], sx)}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  dropdownMenuItemColors,
  dropdownMenuSizes,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
export { createMenuController as createDropdownMenuController } from "@ui-sdk/react/menu";
export type { MenuController as DropdownMenuController } from "@ui-sdk/react/menu";
export type {
  DropdownMenuContentProps,
  DropdownMenuItemColor,
  DropdownMenuSize,
  DropdownMenuTriggerProps,
};
