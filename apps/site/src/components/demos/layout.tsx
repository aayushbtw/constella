import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonSize } from "@/components/ui/button";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
  fonts,
} from "@/lib/tokens.stylex";
import { Stage, Well } from "~/components/demos/frame";

const radiusScale = [
  { name: "xs", value: radii.xs },
  { name: "sm", value: radii.sm },
  { name: "md", value: radii.md },
  { name: "full", value: radii.full },
] as const;

const controls = [
  { name: "controlXs", size: "xs", value: sizes.controlXs },
  { name: "controlSm", size: "sm", value: sizes.controlSm },
  { name: "controlMd", size: "default", value: sizes.controlMd },
  { name: "controlLg", size: "lg", value: sizes.controlLg },
] as const satisfies readonly {
  name: string;
  size: ButtonSize;
  value: string;
}[];

const styles = stylex.create({
  value: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xxs,
    fontVariantNumeric: "tabular-nums",
    textAlign: "end",
  },
  items: {
    alignItems: "flex-end",
    display: "flex",
    flexWrap: "wrap",
    gap: space.lg,
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  label: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    fontFamily: fonts.mono,
    fontVariantLigatures: "none",
    fontSize: fontSizes.xxs,
  },
  labelName: {
    color: colors.textPrimary,
  },
  // A quarter of a large square, so the curve of each radius reads at its true size.
  corner: (borderRadius: string) => ({
    borderBlockColor: colors.edge,
    borderInlineColor: colors.edge,
    borderStartStartRadius: borderRadius,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: strokes.border,
    height: 64,
    width: 64,
  }),
  cornerWell: {
    borderEndEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderStartStartRadius: radii.md,
    paddingBlockStart: space.md,
    paddingInlineStart: space.md,
  },
});

// Read off the rendered element, so the label shows what a theme resolved, not `var(…)`.
function useMeasured<T extends HTMLElement>(read: (element: T) => string) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    const update = () => {
      if (ref.current !== null) {
        setValue(read(ref.current));
      }
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributeFilter: ["class", "data-theme"],
    });
    return () => {
      observer.disconnect();
    };
  }, [read]);
  return [ref, value] as const;
}

const readRadius = (element: HTMLElement) =>
  getComputedStyle(element).borderTopLeftRadius;
const readHeight = (element: HTMLElement) => `${element.offsetHeight}px`;

function Label({ name, value }: { name: string; value: string }) {
  return (
    <span {...stylex.props(styles.label)}>
      <span {...stylex.props(styles.labelName)}>{name}</span>
      <span {...stylex.props(styles.value)}>{value}</span>
    </span>
  );
}

function RadiusItem({ name, value }: { name: string; value: string }) {
  const [ref, resolved] = useMeasured<HTMLSpanElement>(readRadius);
  return (
    <div {...stylex.props(styles.item)}>
      <Well sx={styles.cornerWell}>
        <span ref={ref} {...stylex.props(styles.corner(value))} />
      </Well>
      <Label name={name} value={resolved} />
    </div>
  );
}

function SizeItem({ name, size }: { name: string; size: ButtonSize }) {
  const [ref, resolved] = useMeasured<HTMLButtonElement>(readHeight);
  return (
    <div {...stylex.props(styles.item)}>
      <Button ref={ref} size={size} variant="outline">
        Button
      </Button>
      <Label name={name} value={resolved} />
    </div>
  );
}

function LayoutRadiiDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.items)}>
        {radiusScale.map(({ name, value }) => (
          <RadiusItem key={name} name={name} value={value} />
        ))}
      </div>
    </Stage>
  );
}

function LayoutSizesDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.items)}>
        {controls.map(({ name, size }) => (
          <SizeItem key={name} name={name} size={size} />
        ))}
      </div>
    </Stage>
  );
}

export { LayoutRadiiDemo, LayoutSizesDemo };
