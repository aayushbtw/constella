"use client";

import * as stylex from "@stylexjs/stylex";
import {
  ScrollArea as ScrollAreaPrimitive,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area";
import type { ComponentProps, Ref } from "react";

import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  durations,
  radii,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

/** Pass to a scroll area root built by hand, so its bar fades the moment the pointer leaves, like `ScrollArea`'s. */
const scrollHideDelay = 0;

const horizontal = ":is([data-orientation='horizontal'])";

const styles = stylex.create({
  viewport: {
    borderStartStartRadius: "inherit",
    borderStartEndRadius: "inherit",
    borderEndStartRadius: "inherit",
    borderEndEndRadius: "inherit",
    height: "100%",
    width: "100%",
  },
  noScrollbar: {
    scrollbarWidth: "none",
  },
  scrollbar: {
    display: "flex",
    flexDirection: { default: "row", [horizontal]: "column" },
    height: { default: "auto", [horizontal]: space.popup },
    opacity: { default: 0, ":is([data-visible])": 1 },
    paddingBlockEnd: strokes.border,
    paddingBlockStart: strokes.border,
    paddingInlineEnd: strokes.border,
    paddingInlineStart: strokes.border,
    transitionDuration: durations.hover,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease",
    width: { default: space.popup, [horizontal]: "auto" },
  },
  thumb: {
    backgroundColor: colors.border,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    flex: 1,
    position: "relative",
  },
});

/** Renders the viewport, a `scrollbar` on that axis (vertical by default, or none) and the corner around its children. `viewportRef` and `viewportSx` reach the element that scrolls, for a virtualizer to watch or a scroll fade. */
function ScrollArea({
  children,
  scrollbar = "vertical",
  sx,
  viewportRef,
  viewportSx,
  ...props
}: Styled<ComponentProps<typeof ScrollAreaPrimitive>> & {
  scrollbar?: "vertical" | "horizontal" | "none";
  viewportRef?: Ref<HTMLDivElement>;
  viewportSx?: stylex.StyleXStyles;
}) {
  return (
    <ScrollAreaPrimitive
      scrollHideDelay={scrollHideDelay}
      {...props}
      {...stylex.props(sx)}
    >
      <ScrollAreaViewport
        ref={viewportRef}
        {...stylex.props(
          styles.viewport,
          scrollbar === "none" && styles.noScrollbar,
          viewportSx
        )}
      >
        {children}
      </ScrollAreaViewport>
      {scrollbar !== "none" && <ScrollBar orientation={scrollbar} />}
      <ScrollAreaCorner />
    </ScrollAreaPrimitive>
  );
}

function ScrollBar({
  orientation = "vertical",
  sx,
  ...props
}: Styled<ComponentProps<typeof ScrollAreaScrollbar>>) {
  return (
    <ScrollAreaScrollbar
      orientation={orientation}
      {...props}
      {...stylex.props(styles.scrollbar, sx)}
    >
      <ScrollAreaThumb {...stylex.props(styles.thumb)} />
    </ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar, scrollHideDelay };
