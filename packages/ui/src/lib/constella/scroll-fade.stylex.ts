import * as stylex from "@stylexjs/stylex";

// How deep each edge fades. Typed, so a scroll timeline can animate them.
export const scrollFadeVars = stylex.defineVars({
  end: stylex.types.lengthPercentage("0px"),
  // How far short of the end `xEndAround`'s fade finishes, clearing what floats over that end.
  endInset: stylex.types.lengthPercentage("0px"),
  start: stylex.types.lengthPercentage("0px"),
});
