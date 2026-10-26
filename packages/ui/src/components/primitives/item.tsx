import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Separator } from "@/components/primitives/separator";
import type { SeparatorProps } from "@/components/primitives/separator";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  lineHeights,
  media,
  presses,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

const itemVariants = ["default", "outline", "secondary"] as const;
const itemSizes = ["xs", "sm", "default"] as const;
const itemMediaVariants = ["default", "icon", "image", "tile"] as const;

type ItemVariant = (typeof itemVariants)[number];
type ItemSize = (typeof itemSizes)[number];
type ItemMediaVariant = (typeof itemMediaVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type ItemProps = Styled<useRender.ComponentProps<"div">> & {
  size?: ItemSize;
  variant?: ItemVariant;
};

// An item only answers when it's rendered as a link, a button or a label for its control.
const pressable = ":is(a, button, label)";
const inSize = (size: ItemSize) =>
  `:is([data-slot='item'][data-size='${size}'] *)`;
const withDescription =
  ":is([data-slot='item']:has([data-slot='item-description']) > *)";

const styles = stylex.create({
  item: {
    alignItems: "center",
    backgroundClip: "padding-box",
    backgroundColor: {
      default: "transparent",
      [media.hover]: {
        default: "transparent",
        [`${pressable}:hover`]: colors.fillSubtle,
      },
      [`${pressable}:active`]: colors.fillSubtle,
    },
    borderBlockEndColor: "transparent",
    borderBlockStartColor: "transparent",
    borderInlineEndColor: "transparent",
    borderInlineStartColor: "transparent",
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.textPrimary,
    columnGap: space.popup,
    display: "flex",
    flexWrap: "wrap",
    paddingBlockEnd: space.popup,
    paddingBlockStart: space.popup,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.sm,
    rowGap: space.popup,
    textAlign: "start",
    textDecorationLine: "none",
    transform: {
      default: null,
      [`${pressable}:active`]: {
        default: presses.row,
        [media.reducedMotion]: null,
      },
    },
    transitionDuration: `${durations.hover}, ${durations.press}`,
    transitionProperty: "background-color, transform",
    transitionTimingFunction: `ease, ${easings.out}`,
    width: "100%",
  },
  outline: {
    borderBlockEndColor: colors.border,
    borderBlockStartColor: colors.border,
    borderInlineEndColor: colors.border,
    borderInlineStartColor: colors.border,
  },
  secondary: {
    backgroundColor: {
      default: colors.fillSubtle,
      [media.hover]: {
        default: colors.fillSubtle,
        [`${pressable}:hover`]: colors.fill,
      },
      [`${pressable}:active`]: colors.fill,
    },
  },
  xs: {
    columnGap: space.xs,
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.popup,
    paddingInlineStart: space.popup,
    rowGap: space.xs,
  },
  media: {
    alignItems: "center",
    alignSelf: { default: null, [withDescription]: "flex-start" },
    display: "flex",
    flexShrink: 0,
    gap: space.xs,
    justifyContent: "center",
    // Level with the title's first line, not the block.
    transform: {
      default: null,
      [withDescription]: `translateY(${space.xxxs})`,
    },
  },
  icon: {
    color: colors.textSecondary,
  },
  image: {
    borderStartStartRadius: radii.xs,
    borderStartEndRadius: radii.xs,
    borderEndStartRadius: radii.xs,
    borderEndEndRadius: radii.xs,
    height: {
      default: sizes.media,
      [inSize("sm")]: sizes.controlMd,
      [inSize("xs")]: sizes.controlXs,
    },
    overflow: "hidden",
    width: {
      default: sizes.media,
      [inSize("sm")]: sizes.controlMd,
      [inSize("xs")]: sizes.controlXs,
    },
  },
  // A mark that isn't a picture, like a logo, sits on a filled square in the image's box.
  tile: {
    backgroundColor: colors.fillSubtle,
  },
  // The basis wraps actions under the text once both no longer fit on one line.
  content: {
    display: "flex",
    flex: {
      default: `1 1 ${sizes.itemText}`,
      ":is([data-slot='item-content'] + *)": "none",
    },
    flexDirection: "column",
    gap: { default: space.xxxs, [inSize("xs")]: 0 },
    minWidth: 0,
  },
  title: {
    alignItems: "center",
    display: "flex",
    fontWeight: fontWeights.regular,
    gap: space.xs,
    lineHeight: "inherit",
    overflow: "hidden",
    overflowWrap: "anywhere",
    // Held to the content's width, so a nowrap title truncates rather than overflowing.
    maxWidth: "100%",
    width: "fit-content",
  },
  // A default item's rows read at its own size; smaller items keep the control size.
  description: {
    color: colors.textSecondary,
    fontSize: {
      default: fontSizes.textMd,
      [inSize("sm")]: fontSizes.textSm,
      [inSize("xs")]: fontSizes.textSm,
    },
    lineHeight: {
      default: lineHeights.textMd,
      [inSize("sm")]: lineHeights.textSm,
      [inSize("xs")]: lineHeights.textSm,
    },
    display: "-webkit-box",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    overflow: "hidden",
    overflowWrap: "anywhere",
    textWrap: "pretty",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
  },
  // Wraps, so a long title pushes its badge to the next line rather than squeezing beside it.
  edge: {
    alignItems: "center",
    display: "flex",
    flexBasis: "100%",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "space-between",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    // Separated rows space by their own padding, with the line between them.
    gap: {
      default: space.md,
      ":has([data-size='sm'])": space.popup,
      ":has([data-size='xs'])": space.xs,
      ":has(> [data-slot='item-separator'])": 0,
    },
    listStyleType: "none",
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    width: "100%",
  },
});

const variantStyles = {
  default: null,
  outline: styles.outline,
  secondary: styles.secondary,
} satisfies Record<ItemVariant, stylex.StyleXStyles | null>;

const mediaStyles = {
  default: null,
  icon: styles.icon,
  image: styles.image,
  tile: [styles.image, styles.tile],
} satisfies Record<ItemMediaVariant, stylex.StyleXStyles | null>;

/** Render it as a `ul`, with each Item as an `li`, when its items are a list. */
function ItemGroup({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.group, sx)),
    render,
    state: { slot: "item-group" },
  });
}

function ItemSeparator({ sx, ...props }: SeparatorProps) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      {...props}
      sx={sx}
    />
  );
}

function Item({
  render,
  size = "default",
  sx,
  variant = "default",
  ...props
}: ItemProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      props,
      stylex.props(
        [
          size === "default" ? typeStyles.textMd : typeStyles.textSm,
          styles.item,
        ],
        variantStyles[variant],
        size === "xs" && styles.xs,
        sx
      )
    ),
    render,
    // Base UI writes state as data attributes: `data-slot`, `data-size`, `data-variant`.
    state: { size, slot: "item", variant },
  });
}

function ItemMedia({
  sx,
  variant = "default",
  ...props
}: Styled<ComponentProps<"div">> & { variant?: ItemMediaVariant }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      {...props}
      {...stylex.props(styles.media, mediaStyles[variant], sx)}
    />
  );
}

function ItemContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="item-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

function ItemTitle({
  render,
  sx,
  ...props
}: Styled<useRender.ComponentProps<"div">>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(props, stylex.props(styles.title, sx)),
    render,
    state: { slot: "item-title" },
  });
}

function ItemDescription({ sx, ...props }: Styled<ComponentProps<"p">>) {
  return (
    <p
      data-slot="item-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function ItemActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="item-actions"
      {...props}
      {...stylex.props(styles.actions, sx)}
    />
  );
}

function ItemHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="item-header"
      {...props}
      {...stylex.props(styles.edge, sx)}
    />
  );
}

function ItemFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="item-footer"
      {...props}
      {...stylex.props(styles.edge, sx)}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  itemMediaVariants,
  ItemSeparator,
  itemSizes,
  ItemTitle,
  itemVariants,
};
export type { ItemMediaVariant, ItemProps, ItemSize, ItemVariant };
