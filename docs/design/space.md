# Space and corners

## Spacing

`space.xxxs` (2) and `space.xxs` (4) are fixed hairline gaps; `xs` and up come from the theme's sizing preset.

| Gap | Step |
| --- | --- |
| A prefix or suffix to its value (`https://`, `%`) | `xxxs`, so the two read as one string |
| Rows in a sidebar | `xxxs`, so a hovered row's fill never merges into the active one |
| A popup's padding around its rows | `xxs` |
| Nested groups side by side | `xs`, and they don't join |
| A dialog or card's padding | `md`; any more and a 16px title looks lost |

One owner per gap: a group sets the gap between its children, and a child adds no margin of its own. Items with separators between them drop their gap and let their own padding space them.

## Control heights

Controls have fixed heights from `sizes.control*`, so a button and an input in one row line up. Text fields stop at `sm`: at 24px a typed line has no room above and below. Anything sized to sit beside a control follows the same heights: an avatar (24, 32, 36), a list's row, an item's image (`media` 40, then 32 and 24).

## Insets

Whatever sits inside a box keeps an even inset on every side it touches: an xs button 3px in from an input group's edge at the default height, a keycap 5px, both recomputed for each group size, and a header or footer's trailing button as far from the side as from the edge it rests on.

## Corners

Nested corners are concentric: outer radius = inner radius + the padding between them (`radii.md` 12 around `radii.sm` 8 at `space.xxs` 4). So the corners are one ladder, `xs` to `xl`, a `space.xxs` step apart: a card (`lg`) holds an `md` surface, a composer (`xl`) an `lg` one. The step shrinks under a 4px radius so every corner reaches 0 together. When the padding is at least the outer radius, the inner corner no longer reads against the outer one and keeps its own radius.

`radii.chip` (6px) sits off the ladder, for the 20px pieces (badge, keycap): at that size 4 reads square and 8 a pill.

## Alignment

- **Optical, not boxed.** An icon marked `data-icon="inline-start"` or `"inline-end"` tightens its side's padding; Button's sizes take shadcn's numbers exactly (padding, icon side, gap, icon size per size).
- **Hit areas.** Anything smaller than `sizes.hitArea` grows its target with an invisible `::before` to that size. Neighbouring targets never overlap.
