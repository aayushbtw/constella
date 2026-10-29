# Space and corners

## Units

Every px value in these docs is at the default 16px root. Interfere puts spacing, sizes and corners on Tailwind's `--spacing` (`0.25rem`), so when a reader raises their browser font size, controls, padding and corners grow with the text.

| Group | Unit | Why |
| --- | --- | --- |
| `space`, `sizes`, theme control heights and spacing | rem | A control grows with its label, and a dialog or sidebar keeps its line length. |
| `radii` (but `full`) | rem | Corners stay concentric with the `space` padding between them. |
| `strokes.track` | rem | A bar sized beside its thumb, not a line. |
| `strokes.border`, `indicator`, `spinner` | px | A hairline stays one crisp device pixel; at 1.25px it blurs. |
| `strokes.icon` | unitless | In the icon's own units, so it already scales with the icon. |
| `shadows`, `blurs`, `motion` distances, `offsets` | px | Effects and the gap to a trigger don't need to grow; Base UI takes offsets in px. |

## Spacing

`space.xxxs` (2) and `space.xxs` (4) are hairline gaps that stay the same in every theme; `xs` and up come from the theme's sizing preset. shadcn's off-grid insets are a hairline under a step, so they follow the preset too:

| Token | Default | Is | For |
| --- | --- | --- | --- |
| `space.row` | 6 | `xs` − `xxxs` | A row's inline padding and gap; an `sm` menu's side inset and end column, so a tick and a shortcut end on one line |
| `space.popup` | 10 | `sm` − `xxxs` | A popover's and a chart tooltip's padding; an `sm` button's inline padding |
| `sizes.controlXxxs` | 18 | `controlXxs` − `xxxs` | An `sm` badge |

| Gap | Step |
| --- | --- |
| A prefix or suffix to its value (`https://`, `%`) | `xxxs`, so the two read as one string |
| Rows in a sidebar | `xxxs`, so a hovered row's fill never merges into the active one |
| A popup's padding around its rows | `xxs` |
| Chips in a row | `xxs` for 20px pills (citations); `xs` for control-height pills and cards (suggestions, attachments) |
| Nested groups side by side | `xs`, and they don't join |
| A dialog or card's padding | `md`; any more and a 16px title looks lost |

One owner per gap: a group sets the gap between its children, and a child adds no margin of its own. Items with separators between them drop their gap and let their own padding space them. Markdown is the exception: prose flows rather than lays out, so each block carries margins in its own `em`, which collapse ([Markdown](components.md#markdown)).

## Control heights

Controls have fixed heights from `sizes.control*`, so a button and an input in one row line up. Text fields stop at `sm`: at 24px a typed line has no room above and below. Anything sized to sit beside a control follows the same heights: an avatar (24, 32, 36), a list's row, an item's image (`media` 40, then 32 and 24).

## Insets

Whatever sits inside a box keeps an even inset on every side it touches: an xs button 3px in from an input group's edge at the default height, a keycap 5px, both recomputed for each group size, and a header or footer's trailing button as far from the side as from the edge it rests on.

A header's gap from title to description goes by the title's size. Beside a close button, the header ends its text `sizes.controlSm + space.xs` from the edge, so a long title wraps before the X; the X keeps shadcn's 8/8 corner inset.

| Header | Title to description | Close button |
| --- | --- | --- |
| `textBase` title: dialog, alert dialog, sheet, card | `xxs` | 8 from the end and top |
| `textSm` title: popover, toast, alert, item | `xxxs` | — |
| Empty state | `xs` | — |
| Side panel, a strip `sizes.header − 2 × space.row` (44) tall | — | `space.row` (6) from the end; the title `space.row + space.popup` in, on the body's edge |

## Corners

Nested corners are concentric: outer radius = inner radius + the padding between them (`radii.lg` 16 around `radii.md` 12 at `space.xxs` 4). So the corners are one ladder, `xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (20), a `space.xxs` step apart: a card (`lg`) holds an `md` surface, a composer (`xl`) an `lg` one. The step shrinks under a 4px radius so every corner reaches 0 together. The radius follows the padding: a popup padded `xxs` around its rows (a menu, a select, a command, ⌘K's dialog, a date range picker's presets) takes `lg` around `md` rows; a popover and a hover card are `lg` too, and a dialog and an alert dialog `xl`. Fields (an input group, a textarea, a select trigger) are `md`. When the padding is at least the outer radius, the inner corner no longer reads against the outer one and keeps its own radius. The one corner past `xl` is a prompt input's well: `xl` plus its `space.xxs` padding, so the composer keeps `xl` inside it. A bar's ghost pills show no shape at rest, so they line up with the composer's text instead of nesting in the well's corner.

`radii.chip` (6px) sits off the ladder, for the 20px pieces (badge, keycap): at that size 4 reads square and 8 a pill.

## Alignment

- **Optical, not boxed.** An icon marked `data-icon="inline-start"` or `"inline-end"` tightens its side's padding; Button's sizes take shadcn's numbers exactly (padding, icon side, gap, icon size per size).
- **Icon size per control size.** An icon a part draws itself (a select's chevron and tick, a copy button's) takes `controlIconSize[size]` from `styles.ts`: `iconXs` at `xs` and `icon-xs`, `iconSm` at `sm`, `icon` at every other size.
- **Hit areas.** Anything smaller than `sizes.hitArea` grows its target with an invisible `::before` to that size. Neighbouring targets never overlap.
