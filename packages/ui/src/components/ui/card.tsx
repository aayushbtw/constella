import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  cardVars,
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  space,
  strokes,
} from "@/lib/tokens.stylex";

const cardSizes = ["sm", "default", "flush"] as const;
const cardVariants = ["default", "well"] as const;

type CardSize = (typeof cardSizes)[number];
type CardVariant = (typeof cardVariants)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type CardProps = Styled<ComponentProps<"div">> & {
  size?: CardSize;
  variant?: CardVariant;
};

const inWell = ":is([data-slot='card'][data-variant='well'] > *)";
const hasFooter = ":has(> [data-slot='card-footer'])";
// In a well, a header's text lines up with the text of the card under it.
const wellInset = `calc(${space.md} + ${strokes.border})`;
const corner = { default: radii.lg, [inWell]: radii.md };

const styles = stylex.create({
  card: {
    backgroundColor: colors.raised,
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderStartStartRadius: corner,
    borderStartEndRadius: corner,
    borderEndStartRadius: corner,
    borderEndEndRadius: corner,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    gap: cardVars.spacing,
    lineHeight: lineHeights.text,
    overflow: "hidden",
    paddingBlockEnd: { default: cardVars.spacing, [hasFooter]: 0 },
    paddingBlockStart: cardVars.spacing,
  },
  default: { [cardVars.spacing]: space.md },
  sm: { [cardVars.spacing]: space.sm },
  flush: { [cardVars.spacing]: "0px" },
  // A tinted tray around a card and the rows that label it, a ladder step out from the card.
  well: {
    [cardVars.spacing]: space.xxs,
    backgroundColor: colors.fillSubtle,
    paddingBlockEnd: cardVars.spacing,
    paddingInlineEnd: cardVars.spacing,
    paddingInlineStart: cardVars.spacing,
  },
  header: {
    alignItems: "start",
    display: "grid",
    gap: space.xxs,
    gridAutoRows: "min-content",
    gridTemplateColumns: {
      default: null,
      ":has(> [data-slot='card-action'])": "minmax(0, 1fr) auto",
    },
    paddingBlockEnd: { default: 0, [inWell]: space.xs },
    paddingBlockStart: { default: 0, [inWell]: space.xs },
    paddingInlineEnd: { default: cardVars.spacing, [inWell]: wellInset },
    paddingInlineStart: { default: cardVars.spacing, [inWell]: wellInset },
  },
  title: {
    fontSize: {
      default: fontSizes.md,
      ":is([data-slot='card'][data-size='sm'] *)": fontSizes.sm,
    },
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.text,
    overflowWrap: "anywhere",
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    overflowWrap: "anywhere",
    textWrap: "pretty",
  },
  action: {
    alignSelf: "start",
    gridColumnStart: 2,
    gridRowEnd: "span 2",
    gridRowStart: 1,
    justifySelf: "end",
  },
  content: {
    paddingInlineEnd: cardVars.spacing,
    paddingInlineStart: cardVars.spacing,
  },
  // The dialog's footer: a tinted bar set into the card's bottom edge.
  footer: {
    alignItems: "center",
    backgroundColor: colors.fillSubtle,
    borderBlockStartColor: colors.edgeSubtle,
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    display: "flex",
    gap: space.xs,
    paddingBlockEnd: cardVars.spacing,
    paddingBlockStart: cardVars.spacing,
    paddingInlineEnd: cardVars.spacing,
    paddingInlineStart: cardVars.spacing,
  },
});

const sizeStyles = {
  default: styles.default,
  flush: styles.flush,
  sm: styles.sm,
} satisfies Record<CardSize, stylex.StyleXStyles>;

function Card({
  size = "default",
  sx,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      data-size={size}
      data-slot="card"
      data-variant={variant}
      {...props}
      {...stylex.props(
        styles.card,
        sizeStyles[size],
        variant === "well" && styles.well,
        sx
      )}
    />
  );
}

function CardHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-header"
      {...props}
      {...stylex.props(styles.header, sx)}
    />
  );
}

function CardTitle({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function CardDescription({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function CardAction({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-action"
      {...props}
      {...stylex.props(styles.action, sx)}
    />
  );
}

function CardContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

function CardFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="card-footer"
      {...props}
      {...stylex.props(styles.footer, sx)}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  cardSizes,
  CardTitle,
  cardVariants,
};
export type { CardProps, CardSize, CardVariant };
