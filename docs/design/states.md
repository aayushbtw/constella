# States

## Focus

One ring, set once in `base.css`, the same on every control: a 1px `gray-a8` line flush outside the edge. Flush, not offset: an offset ring read as a second box around a text field, and it broke at a button group's squared seams. Outside, not over the edge: over it, the line vanished on a filled button. An invalid control's ring is red, so the error survives focus. An input group takes the ring for the control inside it, so the ring wraps the box the user sees. A popup (a dialog, menu or list) takes focus to hold it, not as a control, so it draws none; a menu takes it whenever the pointer rests off its items. A list item shows the keyboard on its highlight, so it draws no ring. Components never style focus themselves; `constella/no-focus-style` enforces it.

## Disabled and busy

Every control shows disabled the same way: one shared fade (`opacities.disabled`) and a not-allowed cursor, never a per-control look; a sunken fill read as fillable, not off. A button at work (`aria-busy`) is not a disabled one: it takes a busy cursor, and fades only to `opacities.busy` when it also can't be pressed. Busy and still pressable (Generate turning into Stop generating) stays at full strength.

## Hover

Hover styles sit behind `media.hover` so touch doesn't stick, and repeat ungated on `:active`, so a tap highlights on touch the way a hover does on a pointer. Only what acts answers hover: a badge or item rendered as a link or button, not a static one. A trigger keeps its hover look while its popup is open (`[data-popup-open]`).

## Selected

Selected is `fill`; hover stays a step under at `fillSubtle`, so on and hovered never read alike. The current sidebar row, a selected table row and a pressed toggle all take it.

## Press

Pressables scale down on `:active`, from `presses`: `icon` for icon buttons, `link` for buttons, `row` for full-width rows. The smaller the target, the bigger the give. Two exceptions: a trigger (`[aria-haspopup]`) doesn't give, since pressing it opens something rather than acting; a text link answers with an underline, not a press.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`.
