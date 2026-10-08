import * as stylex from "@stylexjs/stylex";

import { joins, radii, strokes } from "@/lib/tokens.stylex";

// A group's own parts, not the focus guards Base UI drops beside an open popup's trigger.
const notFirst = ":not(:nth-child(1 of [data-slot]))";
const notLast = ":not(:nth-last-child(1 of [data-slot]))";

// The neighbor before draws the shared edge, or the separator does.
const joined =
  ":not(:nth-child(1 of [data-slot]), [data-slot='button-group-separator'] + *)";

/* eslint-disable func-style -- StyleX evaluates arrow functions inside `stylex.create`, not declarations. */

// Whole on their own; in a ButtonGroup, the corners that meet a neighbor take its join.
const corners = (radius: string) => ({
  borderEndEndRadius: {
    default: radius,
    [notLast]: `calc(${radius} * ${joins.either})`,
  },
  borderEndStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.inline})`,
    [notLast]: {
      default: `calc(${radius} * ${joins.block})`,
      [notFirst]: `calc(${radius} * ${joins.either})`,
    },
  },
  borderStartEndRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.block})`,
    [notLast]: {
      default: `calc(${radius} * ${joins.inline})`,
      [notFirst]: `calc(${radius} * ${joins.either})`,
    },
  },
  borderStartStartRadius: {
    default: radius,
    [notFirst]: `calc(${radius} * ${joins.either})`,
  },
});

/* eslint-enable func-style */

/** Corners and start edge that join a neighbor in a ButtonGroup. Apply after a part's own styles. */
const joinStyles = stylex.create({
  edges: {
    borderBlockStartWidth: {
      default: strokes.border,
      [joined]: `calc(${strokes.border} * ${joins.block})`,
    },
    borderInlineStartWidth: {
      default: strokes.border,
      [joined]: `calc(${strokes.border} * ${joins.inline})`,
    },
  },
  full: corners(radii.full),
  sm: corners(radii.sm),
  xs: corners(radii.xs),
});

export { joinStyles };
