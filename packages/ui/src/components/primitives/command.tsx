"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from "@/components/primitives/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/primitives/input-group";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, visuallyHidden } from "@/lib/constella/styles";
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

type CommandProps = Omit<
  AutocompletePrimitive.Root.Props<unknown>,
  "inline"
> & { "data-slot"?: string; sx?: Sx };

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
  viewport: {
    alignItems: "flex-start",
    paddingBlockStart: `max(${space.md}, 15vh)`,
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
  dialog: {
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    gap: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
});

/** A searchable list, always open, built on Base UI's inline Autocomplete. Pass `items`. */
function Command({
  "data-slot": slot = "command",
  sx,
  ...props
}: CommandProps) {
  return (
    <div data-slot={slot} {...stylex.props(styles.command, sx)}>
      <AutocompletePrimitive.Root
        autoHighlight="always"
        inline
        open
        {...props}
      />
    </div>
  );
}

/** Renders a dialog with a command inside, named for screen readers by `title` and `description`. */
function CommandDialog({
  children,
  description = "Search for a command to run...",
  instant = false,
  sx,
  title = "Command Palette",
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children: ReactNode;
  description?: string;
  /** Opens and closes with no motion, for a change the keyboard made. */
  instant?: boolean;
  sx?: Sx;
  title?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogBackdrop data-skip-motion={instant || undefined} />
        <DialogViewport sx={styles.viewport}>
          <DialogPopup
            data-skip-motion={instant || undefined}
            size="lg"
            sx={[styles.dialog, sx]}
          >
            <DialogTitle sx={visuallyHidden.base}>{title}</DialogTitle>
            <DialogDescription sx={visuallyHidden.base}>
              {description}
            </DialogDescription>
            {children}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

function CommandInput({
  sx,
  ...props
}: Omit<Styled<AutocompletePrimitive.Input.Props>, "render">) {
  return (
    <InputGroup data-slot="command-input" size="lg" sx={[styles.input, sx]}>
      {/* Keeps the group's `input-group-control` slot, so the group draws the focus ring. */}
      <AutocompletePrimitive.Input render={<InputGroupInput />} {...props} />
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
}: Styled<AutocompletePrimitive.List.Props>) {
  return (
    <AutocompletePrimitive.List
      data-slot="command-list"
      {...props}
      {...stylex.props(styles.list, sx)}
    />
  );
}

function CommandEmpty({
  sx,
  ...props
}: Styled<AutocompletePrimitive.Empty.Props>) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="command-empty"
      {...props}
      {...stylex.props([typeStyles.textMd, styles.empty], sx)}
    />
  );
}

function CommandGroup({
  sx,
  ...props
}: Styled<AutocompletePrimitive.Group.Props>) {
  return (
    <AutocompletePrimitive.Group
      data-slot="command-group"
      {...props}
      {...stylex.props(styles.group, sx)}
    />
  );
}

function CommandGroupLabel({
  sx,
  ...props
}: Styled<AutocompletePrimitive.GroupLabel.Props>) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="command-group-label"
      {...props}
      {...stylex.props([typeStyles.captionLg, styles.groupLabel], sx)}
    />
  );
}

function CommandCollection(props: AutocompletePrimitive.Collection.Props) {
  return <AutocompletePrimitive.Collection {...props} />;
}

function CommandItem({
  sx,
  ...props
}: Styled<AutocompletePrimitive.Item.Props>) {
  return (
    <AutocompletePrimitive.Item
      data-slot="command-item"
      {...props}
      {...stylex.props([typeStyles.textMd, styles.item], sx)}
    />
  );
}

function CommandSeparator({
  sx,
  ...props
}: Styled<AutocompletePrimitive.Separator.Props>) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="command-separator"
      {...props}
      {...stylex.props(styles.separator, sx)}
    />
  );
}

function CommandShortcut({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      data-slot="command-shortcut"
      {...props}
      {...stylex.props([typeStyles.captionLg, styles.shortcut], sx)}
    />
  );
}

function CommandFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="command-footer"
      {...props}
      {...stylex.props([typeStyles.captionLg, styles.footer], sx)}
    />
  );
}

/** The command's surface, for a part that draws its own popup around a command list. */
const commandStyles = {
  surface: styles.command,
};

export {
  Command,
  CommandCollection,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  commandStyles,
};
export type { CommandProps };
