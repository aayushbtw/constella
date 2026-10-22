"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import * as stylex from "@stylexjs/stylex";

import { buttonStyles } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import { stateStyles } from "@/lib/constella/styles";

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
  sx?: Sx;
  variant?: ToggleVariant;
};

const variantStyles = {
  default: stateStyles.selectedFill,
  outline: stateStyles.selectedFillLifted,
} satisfies Record<ToggleVariant, stylex.StyleXStyles>;

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
    variantStyles[variant],
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
