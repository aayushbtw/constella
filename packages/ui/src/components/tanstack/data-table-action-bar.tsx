"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, visuallyHidden } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  layers,
  media,
  motion,
  radii,
  shadows,
  space,
} from "@/lib/constella/tokens.stylex";

// What the row selection feature adds to a table.
interface ActionBarTable {
  getSelectedRowIds: () => string[];
  resetRowSelection: (defaultState?: boolean) => void;
}

const closed = ":is([data-closed])";
// A key in the table, or in the bar itself, moved it: the keyboard never animates.
const byKeyboard =
  ":is(:root:has([data-slot='data-table'] :focus-visible) *, :has(:focus-visible))";

const styles = stylex.create({
  // Centered by its auto margins between both edges, so the transform is free for the motion.
  bar: {
    alignItems: "center",
    backgroundColor: colors.raised,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    boxShadow: shadows.lg,
    color: colors.textPrimary,
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    insetBlockEnd: space.lg,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    justifyContent: "center",
    marginInlineEnd: "auto",
    marginInlineStart: "auto",
    maxWidth: `calc(100% - 2 * ${space.md})`,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.xxs,
    position: "fixed",
    width: "fit-content",
    zIndex: layers.bar,
  },
  motion: {
    opacity: { default: 1, [closed]: 0 },
    transform: {
      default: "none",
      [closed]: {
        default: `translateY(${motion.exitOffset}) scale(${motion.popoverScale})`,
        [media.reducedMotion]: "none",
      },
    },
    transformOrigin: "bottom center",
    transitionDuration: {
      default: durations.popover,
      [closed]: durations.popoverExit,
      [byKeyboard]: "0s",
    },
    transitionProperty: "opacity, transform, visibility",
    transitionTimingFunction: easings.out,
    // Hidden once it has faded, so a bar that has left is out of the tab order.
    visibility: { default: "visible", [closed]: "hidden" },
  },
  count: {
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.medium,
    paddingInlineEnd: space.popup,
    paddingInlineStart: space.popup,
    whiteSpace: "nowrap",
  },
});

/** A bar of actions for the selected rows (needs `rowSelectionFeature`), floating at the bottom of the window while any row is selected: the count, `children`, then a Clear button. */
function DataTableActionBar({
  children,
  label,
  sx,
  table,
}: {
  /** The actions, such as Buttons or a Dropdown Menu trigger. */
  children?: ReactNode;
  /** Names the bar for screen readers. */
  label: string;
  sx?: Sx;
  table: ActionBarTable;
}) {
  const count = table.getSelectedRowIds().length;
  // The last count stays on screen while the bar leaves.
  const [held, setHeld] = useState(count);
  if (count > 0 && count !== held) {
    setHeld(count);
  }
  return (
    <>
      <div
        aria-label={label}
        data-closed={count === 0 ? "" : undefined}
        data-slot="data-table-action-bar"
        role="toolbar"
        {...stylex.props([typeStyles.textSm, styles.bar], styles.motion, sx)}
      >
        <span {...stylex.props(styles.count)}>
          {count > 0 ? count : held} selected
        </span>
        {children}
        <Button
          aria-label="Clear selection"
          corners="rounded"
          onClick={() => {
            table.resetRowSelection(true);
          }}
          size="sm"
          variant="ghost"
        >
          Clear
        </Button>
      </div>
      {/* Outside the bar, which is hidden while empty: a hidden region isn't announced. */}
      <output aria-live="polite" {...stylex.props(visuallyHidden.base)}>
        {count > 0 && `${count} selected`}
      </output>
    </>
  );
}

export { DataTableActionBar };
