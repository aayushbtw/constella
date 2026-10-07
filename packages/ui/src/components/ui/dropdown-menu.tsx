"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  layers,
  media,
  opacities,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

interface Inset {
  inset?: boolean;
}

type DropdownMenuContentProps = Styled<MenuPrimitive.Popup.Props> &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >;

const dropdownMenuItemVariants = ["default", "danger"] as const;

type DropdownMenuItemVariant = (typeof dropdownMenuItemVariants)[number];

const offstage = ":is([data-starting-style], [data-ending-style])";
const highlighted = ":is([data-highlighted], [data-popup-open])";
const danger = ":is([data-variant='danger'])";
const off = ":is([data-disabled])";
const inset = ":is([data-inset])";

// shadcn's padding, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;
// An inset row starts where the text of a row with an icon does.
const insetStart = `calc(${px6} * 2 + ${sizes.icon})`;

const styles = stylex.create({
  positioner: {
    zIndex: layers.popover,
  },
  // Select's surface and motion, so every popup opens the same way.
  popup: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    boxShadow: shadows.popover,
    boxSizing: "border-box",
    color: colors.textPrimary,
    maxHeight: "var(--available-height)",
    minWidth: `max(var(--anchor-width), ${sizes.menu})`,
    opacity: { default: 1, [offstage]: 0 },
    overflowY: "auto",
    padding: space.xxs,
    transform: { default: "none", [offstage]: "scale(0.96)" },
    transformOrigin: "var(--transform-origin)",
    transitionDuration: durations.popover,
    transitionProperty: {
      default: "opacity, transform",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
  },
  // Select's item, so a menu and a select read as one family.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [highlighted]: colors.fillSubtle,
      [`${danger}${highlighted}`]: colors.dangerFillSubtle,
    },
    borderRadius: radii.xs,
    color: { default: colors.textPrimary, [danger]: colors.danger },
    cursor: { default: "pointer", [off]: "not-allowed" },
    display: "flex",
    fontSize: fontSizes.sm,
    gap: px6,
    minHeight: sizes.controlSm,
    opacity: { default: 1, [off]: opacities.disabled },
    paddingInlineEnd: px6,
    paddingInlineStart: { default: px6, [inset]: insetStart },
    position: "relative",
    userSelect: "none",
  },
  // Room on the end for the tick, as in a select.
  checkable: {
    paddingInlineEnd: `calc(${sizes.icon} + ${space.xs} * 2)`,
  },
  indicator: {
    alignItems: "center",
    display: "flex",
    insetInlineEnd: space.xs,
    justifyContent: "center",
    pointerEvents: "none",
    position: "absolute",
  },
  chevron: {
    color: colors.textMuted,
    display: "flex",
    marginInlineStart: "auto",
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    paddingBlock: space.xxs,
    paddingInlineEnd: px6,
    paddingInlineStart: { default: px6, [inset]: insetStart },
  },
  separator: {
    backgroundColor: colors.edgeSubtle,
    height: strokes.border,
    marginBlock: space.xxs,
    marginInline: `calc(-1 * ${space.xxs})`,
  },
  shortcut: {
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    marginInlineStart: "auto",
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

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/** Renders the portal, the positioner and the popup. Placement props go to the positioner. */
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("4px")` is NaN
  sideOffset = Number.parseFloat(space.xxs),
  sx,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          {...props}
          {...stylex.props(styles.popup, sx)}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  inset: isInset,
  sx,
  ...props
}: Styled<MenuPrimitive.GroupLabel.Props> & Inset) {
  return (
    <MenuPrimitive.GroupLabel
      data-inset={isInset}
      data-slot="dropdown-menu-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function DropdownMenuItem({
  inset: isInset,
  sx,
  variant = "default",
  ...props
}: Styled<MenuPrimitive.Item.Props> &
  Inset & { variant?: DropdownMenuItemVariant }) {
  return (
    <MenuPrimitive.Item
      data-inset={isInset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.item, sx)}
    />
  );
}

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<MenuPrimitive.SubmenuTrigger.Props> & Inset) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-inset={isInset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
      {...stylex.props(styles.item, sx)}
    >
      {children}
      <span {...stylex.props(styles.chevron)}>
        <Glyph icon={ArrowRight01Icon} />
      </span>
    </MenuPrimitive.SubmenuTrigger>
  );
}

/** A submenu's popup: opens beside its trigger, with its first item level with it. */
function DropdownMenuSubContent({
  align = "start",
  // oxlint-disable-next-line unicorn/prefer-number-coercion -- `Number("4px")` is NaN
  alignOffset = -Number.parseFloat(space.xxs),
  side = "inline-end",
  sideOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      align={align}
      alignOffset={alignOffset}
      data-slot="dropdown-menu-sub-content"
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<MenuPrimitive.CheckboxItem.Props> & Inset) {
  return (
    <MenuPrimitive.CheckboxItem
      data-inset={isInset}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
      {...stylex.props(styles.item, styles.checkable, sx)}
    >
      {children}
      <MenuPrimitive.CheckboxItemIndicator {...stylex.props(styles.indicator)}>
        <Glyph icon={Tick02Icon} />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  children,
  inset: isInset,
  sx,
  ...props
}: Styled<MenuPrimitive.RadioItem.Props> & Inset) {
  return (
    <MenuPrimitive.RadioItem
      data-inset={isInset}
      data-slot="dropdown-menu-radio-item"
      {...props}
      {...stylex.props(styles.item, styles.checkable, sx)}
    >
      {children}
      <MenuPrimitive.RadioItemIndicator {...stylex.props(styles.indicator)}>
        <Glyph icon={Tick02Icon} />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  sx,
  ...props
}: Styled<MenuPrimitive.Separator.Props>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      {...props}
      {...stylex.props(styles.separator, sx)}
    />
  );
}

function DropdownMenuShortcut({
  sx,
  ...props
}: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...props}
      {...stylex.props(styles.shortcut, sx)}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  dropdownMenuItemVariants,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
export type { DropdownMenuContentProps, DropdownMenuItemVariant };
