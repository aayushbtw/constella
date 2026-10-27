import * as stylex from "@stylexjs/stylex";

import { space } from "./tokens.stylex";

// How far a row's first and last cells keep their content from the table's edges.
export const tableVars = stylex.defineVars({
  inset: space.sm,
});
