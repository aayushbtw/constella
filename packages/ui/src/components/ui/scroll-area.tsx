"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import * as stylex from "@stylexjs/stylex";

import { colors, durations, radii, space, strokes } from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const horizontal = ":is([data-orientation='horizontal'])";
// Shown while the pointer is over the area or it's scrolling, like an overlay scrollbar.
const shown = ":is([data-hovering], [data-scrolling])";

// shadcn's thickness, off our 4px grid.
const px10 = `calc(${space.sm} - ${space.xxxs})`;

const styles = stylex.create({
  root: {
    position: "relative",
  },
  viewport: {
    borderStartStartRadius: "inherit",
    borderStartEndRadius: "inherit",
    borderEndStartRadius: "inherit",
    borderEndEndRadius: "inherit",
    height: "100%",
    width: "100%",
  },
  scrollbar: {
    display: "flex",
    flexDirection: { default: "row", [horizontal]: "column" },
    height: { default: "100%", [horizontal]: px10 },
    opacity: { default: 0, [shown]: 1 },
    paddingBlockEnd: strokes.border,
    paddingBlockStart: strokes.border,
    paddingInlineEnd: strokes.border,
    paddingInlineStart: strokes.border,
    touchAction: "none",
    transitionDuration: durations.hover,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
    userSelect: "none",
    width: { default: px10, [horizontal]: "100%" },
  },
  thumb: {
    backgroundColor: colors.edge,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    flex: 1,
    position: "relative",
  },
});

/** Renders the viewport, a vertical scrollbar and the corner around its children. */
function ScrollArea({
  children,
  sx,
  ...props
}: Styled<ScrollAreaPrimitive.Root.Props>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      {...props}
      {...stylex.props(styles.root, sx)}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        {...stylex.props(styles.viewport)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  orientation = "vertical",
  sx,
  ...props
}: Styled<ScrollAreaPrimitive.Scrollbar.Props>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-orientation={orientation}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
      {...stylex.props(styles.scrollbar, sx)}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        {...stylex.props(styles.thumb)}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
