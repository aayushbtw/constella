"use client";

import * as stylex from "@stylexjs/stylex";
import { ToggleGroup as ToggleGroupPrimitive } from "@ui-sdk/react/toggle";
import type { ComponentProps } from "react";
import { createContext, use, useMemo } from "react";

import { Toggle } from "@/components/primitives/toggle";
import type {
  ToggleProps,
  ToggleSize,
  ToggleVariant,
} from "@/components/primitives/toggle";
import type { Sx } from "@/lib/constella/styles";
import { withStyles } from "@/lib/constella/styles";
import { joins, space } from "@/lib/constella/tokens.stylex";

const toggleGroupSpacings = [0, 1, 2] as const;

type ToggleGroupSpacing = (typeof toggleGroupSpacings)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type ToggleGroupProps<Value extends string = string> = Styled<
  ComponentProps<typeof ToggleGroupPrimitive<Value>>
> & {
  size?: ToggleSize;
  spacing?: ToggleGroupSpacing;
  variant?: ToggleVariant;
};

type ToggleGroupItemProps = Omit<
  ToggleProps,
  "defaultPressed" | "pressed" | "size" | "variant"
>;

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

function ToggleGroup<Value extends string = string>({
  size = "default",
  spacing = 2,
  sx,
  variant = "default",
  ...props
}: ToggleGroupProps<Value>) {
  const context = useMemo(() => ({ size, variant }), [size, variant]);
  return (
    <ToggleGroupContext value={context}>
      <ToggleGroupPrimitive<Value>
        data-size={size}
        data-spacing={spacing}
        data-variant={variant}
        {...withStyles(
          props,
          stylex.props(styles.group, spacingStyles[spacing], sx)
        )}
      />
    </ToggleGroupContext>
  );
}

function ToggleGroupItem(props: ToggleGroupItemProps) {
  const { size, variant } = use(ToggleGroupContext);
  return <Toggle {...props} size={size} variant={variant} />;
}

export { ToggleGroup, ToggleGroupItem, toggleGroupSpacings };
export type { ToggleGroupProps, ToggleGroupSpacing };
