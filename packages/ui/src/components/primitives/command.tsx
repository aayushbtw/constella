"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import {
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroupLabel as CommandGroupLabelPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandItemText as CommandItemTextPrimitive,
  CommandList as CommandListPrimitive,
  Command as CommandPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
  CommandShortcut as CommandShortcutPrimitive,
} from "@ui-sdk/react/command";
import type { CommandProps as CommandPrimitiveProps } from "@ui-sdk/react/command";
import { renderElement } from "@ui-sdk/react/primitive";
import { useSyncExternalStore } from "react";
import type { ComponentProps } from "react";

import {
  InputGroup,
  InputGroupAddon,
  inputGroupInputStyles,
} from "@/components/primitives/input-group";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  fontWeights,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type CommandProps = Styled<CommandPrimitiveProps>;

const highlighted = ":is([data-highlighted])";
const off = ":is([data-disabled])";

const styles = stylex.create({
  command: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    width: "100%",
  },
  // Inside the command's padding, so its corner nests in the command's.
  input: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: "none",
  },
  icon: {
    color: colors.textMuted,
    display: "flex",
  },
  list: {
    maxHeight: sizes.menuHeight,
    overflowX: "hidden",
    overflowY: "auto",
    paddingBlockStart: space.xxs,
    scrollPaddingBlock: space.xxs,
  },
  empty: {
    color: colors.textSecondary,
    paddingBlockEnd: { default: space.lg, ":empty": 0 },
    paddingBlockStart: { default: space.lg, ":empty": 0 },
    textAlign: "center",
  },
  group: {
    paddingBlockEnd: space.xxs,
  },
  groupLabel: {
    color: colors.textMuted,
    fontWeight: fontWeights.medium,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
  // A default menu's row, so a command list and a menu read as one family.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [highlighted]: colors.fillSubtle,
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    cursor: { default: "pointer", [off]: "not-allowed" },
    display: "flex",
    gap: space.row,
    minHeight: sizes.controlMd,
    opacity: { default: 1, [off]: opacities.disabled },
    overflowWrap: "anywhere",
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    userSelect: "none",
  },
  itemText: {
    color: { default: null, ":is([data-matched])": colors.textSecondary },
  },
  match: {
    backgroundColor: "transparent",
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  // In line with the rows' text.
  separator: {
    backgroundColor: colors.borderSubtle,
    height: strokes.border,
    marginBlockEnd: space.xxs,
    marginInlineEnd: space.sm,
    marginInlineStart: space.sm,
  },
  shortcut: {
    color: colors.textMuted,
    flexShrink: 0,
    marginInlineStart: "auto",
    whiteSpace: "nowrap",
  },
  footer: {
    alignItems: "center",
    backgroundColor: colors.fillSubtle,
    borderTopColor: colors.borderSubtle,
    borderTopStyle: "solid",
    borderTopWidth: strokes.border,
    color: colors.textMuted,
    display: "flex",
    gap: space.md,
    marginBlockEnd: `calc(-1 * ${space.xxs})`,
    marginBlockStart: space.xxs,
    marginInlineEnd: `calc(-1 * ${space.xxs})`,
    marginInlineStart: `calc(-1 * ${space.xxs})`,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
  },
});

const commandStyles = {
  empty: [typeStyles.textMd, styles.empty],
  item: [typeStyles.textMd, styles.item],
  list: styles.list,
  surface: styles.command,
};

/** A searchable list, always open, on ui-sdk's Command. Typing keeps the items whose text contains it. */
function Command({ filter = "contains", sx, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      filter={filter}
      {...withStyles(props, stylex.props(commandStyles.surface, sx))}
    />
  );
}

function CommandInput({
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof CommandInputPrimitive>>, "render">) {
  const input = inputGroupInputStyles();
  return (
    <InputGroup size="lg" sx={[styles.input, sx]}>
      <span data-slot="input-group-input" {...stylex.props(input.slot)}>
        <CommandInputPrimitive
          {...withStyles(props, stylex.props(input.input))}
        />
      </span>
      <InputGroupAddon>
        <span {...stylex.props(styles.icon)}>
          <HugeiconsIcon
            aria-hidden
            icon={Search01Icon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </span>
      </InputGroupAddon>
    </InputGroup>
  );
}

function CommandList({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandListPrimitive>>) {
  return (
    <CommandListPrimitive
      {...withStyles(props, stylex.props(commandStyles.list, sx))}
    />
  );
}

function CommandEmpty({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandEmptyPrimitive>>) {
  return (
    <CommandEmptyPrimitive
      {...withStyles(props, stylex.props(commandStyles.empty, sx))}
    />
  );
}

function unsubscribeNothing() {
  return null;
}

function subscribeNever() {
  return unsubscribeNothing;
}

function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
}

function CommandGroup({
  render,
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandGroupPrimitive>>) {
  const hydrated = useHydrated();
  return (
    <CommandGroupPrimitive
      {...withStyles(props, stylex.props(styles.group, sx))}
      // ui-sdk's server HTML hides every composed group; remove when it stops.
      render={
        hydrated
          ? render
          : ({ hidden: _hidden, ...rendered }, state) =>
              renderElement("div", rendered, render, state)
      }
    />
  );
}

function CommandGroupLabel({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandGroupLabelPrimitive>>) {
  return (
    <CommandGroupLabelPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.captionLg, styles.groupLabel], sx)
      )}
    />
  );
}

function CommandItem({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandItemPrimitive>>) {
  return (
    <CommandItemPrimitive
      {...withStyles(props, stylex.props(commandStyles.item, sx))}
    />
  );
}

/** Its item's label, with the search marked in it. The label is the item's `label`, or its `value`. */
function CommandItemText({
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof CommandItemTextPrimitive>>, "children">) {
  return (
    <CommandItemTextPrimitive
      {...withStyles(props, stylex.props(styles.itemText, sx))}
    >
      {({ segments }) => {
        let start = 0;
        return segments.map((segment) => {
          const key = start;
          start += segment.text.length;
          return segment.match ? (
            <mark key={key} {...stylex.props(styles.match)}>
              {segment.text}
            </mark>
          ) : (
            segment.text
          );
        });
      }}
    </CommandItemTextPrimitive>
  );
}

function CommandSeparator({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandSeparatorPrimitive>>) {
  return (
    <CommandSeparatorPrimitive
      {...withStyles(props, stylex.props(styles.separator, sx))}
    />
  );
}

function CommandShortcut({
  sx,
  ...props
}: Styled<ComponentProps<typeof CommandShortcutPrimitive>>) {
  return (
    <CommandShortcutPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.captionLg, styles.shortcut], sx)
      )}
    />
  );
}

function CommandFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="command-footer"
      {...withStyles(
        props,
        stylex.props([typeStyles.captionLg, styles.footer], sx)
      )}
    />
  );
}

export { CommandDialog } from "@/components/primitives/command-dialog";

export {
  Command,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  commandStyles,
};
export type { CommandProps };
