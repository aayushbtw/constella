"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import * as stylex from "@stylexjs/stylex";

import { buttonStyles } from "@/components/ui/button";
import { colors, media } from "@/lib/tokens.stylex";

const toggleVariants = ["default", "outline"] as const;
const toggleSizes = [
  "sm",
  "default",
  "lg",
  "icon-sm",
  "icon",
  "icon-lg",
] as const;

type ToggleVariant = (typeof toggleVariants)[number];
type ToggleSize = (typeof toggleSizes)[number];

type ToggleProps = Omit<TogglePrimitive.Props, "className" | "style"> & {
  size?: ToggleSize;
  sx?: stylex.StyleXStyles;
  variant?: ToggleVariant;
};

const pressed = ":is([data-pressed])";
const hover = ":hover:not(:disabled, [data-pressed])";
const active = ":active:not(:disabled, [data-pressed])";

// A pressed toggle is selected, so it takes `fill`; hover and press stay a step under it.
const fills = (rest: string) => ({
  default: rest,
  [media.hover]: {
    default: rest,
    [hover]: colors.fillSubtle,
    [pressed]: colors.fill,
  },
  [active]: colors.fillSubtle,
  [pressed]: colors.fill,
});

const styles = stylex.create({
  default: { backgroundColor: fills("transparent") },
  outline: { backgroundColor: fills(colors.background) },
});

/** A toggle's styles: a ghost or outline button that fills while pressed. */
function toggleStyles({
  size = "default",
  variant = "default",
}: { size?: ToggleSize; variant?: ToggleVariant } = {}) {
  return [
    buttonStyles({
      size,
      variant: variant === "outline" ? "outline" : "ghost",
    }),
    styles[variant],
  ];
}

function Toggle({
  size = "default",
  sx,
  variant = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-size={size}
      data-slot="toggle"
      data-variant={variant}
      {...props}
      {...stylex.props(toggleStyles({ size, variant }), sx)}
    />
  );
}

export { Toggle, toggleSizes, toggleStyles, toggleVariants };
export type { ToggleProps, ToggleSize, ToggleVariant };
