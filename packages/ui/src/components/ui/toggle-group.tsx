"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useMemo } from "react";

import { toggleStyles } from "@/components/ui/toggle";
import type { ToggleSize, ToggleVariant } from "@/components/ui/toggle";
import { joins, space } from "@/lib/tokens.stylex";

const toggleGroupSpacings = [0, 1, 2] as const;

type ToggleGroupSpacing = (typeof toggleGroupSpacings)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type ToggleGroupProps = Styled<ToggleGroupPrimitive.Props> & {
  size?: ToggleSize;
  spacing?: ToggleGroupSpacing;
  variant?: ToggleVariant;
};

const vertical = ":is([data-orientation='vertical'])";

const styles = stylex.create({
  group: {
    alignItems: { default: "center", [vertical]: "stretch" },
    display: "flex",
    flexDirection: { default: "row", [vertical]: "column" },
    width: "fit-content",
  },
  // Items sit apart, whole.
  apart1: { gap: space.xxs },
  apart2: { gap: space.xs },
  // Items join into one segmented control, as in a ButtonGroup.
  joined: {
    [joins.block]: { default: "1", [vertical]: "0" },
    [joins.either]: "0",
    [joins.inline]: { default: "0", [vertical]: "1" },
    gap: 0,
  },
  item: {
    flexShrink: 0,
  },
});

const spacingStyles = {
  0: styles.joined,
  1: styles.apart1,
  2: styles.apart2,
} satisfies Record<ToggleGroupSpacing, stylex.StyleXStyles>;

const ToggleGroupContext = createContext<{
  size: ToggleSize;
  variant: ToggleVariant;
}>({ size: "default", variant: "default" });

function ToggleGroup({
  size = "default",
  spacing = 2,
  sx,
  variant = "default",
  ...props
}: ToggleGroupProps) {
  const context = useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <ToggleGroupContext value={context}>
      <ToggleGroupPrimitive
        data-size={size}
        data-slot="toggle-group"
        data-spacing={spacing}
        data-variant={variant}
        {...props}
        {...stylex.props(styles.group, spacingStyles[spacing], sx)}
      />
    </ToggleGroupContext>
  );
}

function ToggleGroupItem({ sx, ...props }: Styled<TogglePrimitive.Props>) {
  const { size, variant } = use(ToggleGroupContext);
  return (
    <TogglePrimitive
      data-size={size}
      data-slot="toggle-group-item"
      data-variant={variant}
      {...props}
      {...stylex.props(toggleStyles({ size, variant }), styles.item, sx)}
    />
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupSpacings };
export type { ToggleGroupProps, ToggleGroupSpacing };
