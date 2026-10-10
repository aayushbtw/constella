"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  colors,
  fontSizes,
  fontWeights,
  opacities,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type CommandProps = Omit<
  AutocompletePrimitive.Root.Props<unknown>,
  "inline"
> & { sx?: stylex.StyleXStyles };

const highlighted = ":is([data-highlighted])";
const off = ":is([data-disabled])";

// shadcn's padding, off our 4px grid.
const px6 = `calc(${space.xs} - ${space.xxxs})`;

const styles = stylex.create({
  command: {
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
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
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
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
    fontSize: fontSizes.sm,
    paddingBlockEnd: { default: space.lg, ":empty": 0 },
    paddingBlockStart: { default: space.lg, ":empty": 0 },
    textAlign: "center",
  },
  group: {
    paddingBlockEnd: space.xxs,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    fontWeight: fontWeights.medium,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: px6,
    paddingInlineStart: px6,
  },
  // A menu's row, so a command list and a menu read as one family.
  item: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [highlighted]: colors.fillSubtle,
    },
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    cursor: { default: "pointer", [off]: "not-allowed" },
    display: "flex",
    fontSize: fontSizes.sm,
    gap: px6,
    minHeight: sizes.controlSm,
    opacity: { default: 1, [off]: opacities.disabled },
    paddingInlineEnd: px6,
    paddingInlineStart: px6,
    userSelect: "none",
  },
  separator: {
    backgroundColor: colors.edgeSubtle,
    height: strokes.border,
    marginBlockEnd: space.xxs,
    marginInlineEnd: `calc(-1 * ${space.xxs})`,
    marginInlineStart: `calc(-1 * ${space.xxs})`,
  },
  shortcut: {
    color: colors.textMuted,
    fontSize: fontSizes.xxs,
    marginInlineStart: "auto",
  },
  dialog: {
    gap: 0,
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
  // Named for screen readers, hidden from sight.
  hidden: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

/** A searchable list, always open, built on Base UI's inline Autocomplete. Pass `items`. */
function Command({ sx, ...props }: CommandProps) {
  return (
    <div data-slot="command" {...stylex.props(styles.command, sx)}>
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
  title = "Command Palette",
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children: ReactNode;
  description?: string;
  title?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogContent sx={styles.dialog}>
        <DialogTitle sx={styles.hidden}>{title}</DialogTitle>
        <DialogDescription sx={styles.hidden}>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  sx,
  ...props
}: Styled<AutocompletePrimitive.Input.Props>) {
  return (
    <InputGroup data-slot="command-input" sx={styles.input}>
      {/* Keeps the group's `input-group-control` slot, so the group draws the focus ring. */}
      <AutocompletePrimitive.Input
        render={<InputGroupInput sx={sx} />}
        {...props}
      />
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
      {...stylex.props(styles.empty, sx)}
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
      {...stylex.props(styles.groupLabel, sx)}
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
      {...stylex.props(styles.item, sx)}
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
      {...stylex.props(styles.shortcut, sx)}
    />
  );
}

export {
  Command,
  CommandCollection,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
export type { CommandProps };
