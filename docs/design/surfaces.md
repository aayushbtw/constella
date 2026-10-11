# Surfaces

## Controls

Controls (buttons, inputs) have a real border for their edge and a shadow for their height: the edge takes space, so what the user sees is what's laid out, and a shadow ring would draw outside the box, look 2px larger and double up at a button group's seams. The height is a ladder of soft drops with no ring: `shadows.control` at rest, `controlHover` a step higher, `controlPressed` nearly flat while held, and `primary`/`primaryPressed` for the solid fill. Only pressables climb it (an outline button, a select trigger); a field stays at rest. Every variant reserves the border, transparent when it has no edge, so a fill and an outline are the same size. A bordered control sets `background-clip: padding-box`: otherwise the fill paints under the translucent edge and muddies it, and bleeds through anti-aliased corners.

The primary button is the one control with depth of its own (`shadows.primary`): a lit line inside its top edge (`--primary-lit`) and a shaded one inside its bottom (`--primary-shade`), over a small drop. They're per-theme so both read lit from above:

| Theme | Lit | Shade | Why |
| --- | --- | --- | --- |
| Light | `white-a3` | `black-a3` | A faint white line shows on the dark fill. |
| Dark | `white-a11` | `black-a1` | Near-white fill hides a faint highlight and turns any real shade into a band. |

A slider thumb rides above its track, so it does the same: `shadows.thumb` is a gray ring plus a drop shadow. `shadows.control` alone vanishes on the dark page and leaves the thumb flat. A switch thumb takes `control`: its fill does the separating.

## Edges

Every control and box draws its border in `edge`: a button, an input, a tabs list and a choice card match, so a row of them reads as one family. `edgeSubtle` is too faint for that: an input's fill sits inside its edge, and with the faint one it reads 30px tall beside a 32px button on the dark page. `edgeSubtle` is for dividers that group content without bounding a control: a separator, table rows, the hairline beside a side panel or sidebar. `edgeFaint` (`neutral-a3`) is only the composer's ring, a large surface whose shadow carries most of its edge.

A surface set into a tinted frame draws its edge inside itself. An outer edge would stack on the frame's tint and leave a light halo around the inner surface.

## Layout boxes

A box in the layout (a card, an alert) takes a real `edge` border, not a shadow, and the `raised` fill: white on the off-white page, a step lighter in dark.

## Composer

The prompt input is a surface, not a control: no border, and its edge is a 0.5px `edgeFaint` ring inside `shadows.composer`, over a soft drop, so the biggest box on the page reads lighter than a field. It never sits in a button group, so the ring's drawing outside the box costs nothing. Invalid swaps in `composerInvalid`, a 1px `danger` ring and its halo. In a well the ring stays outside: `edgeFaint` over the well's `fill` darkens the edge rather than leaving the light halo an outer edge leaves on a frame. Its fill is `raised`, like a layout box.

## Floating

Floating surfaces (toasts, popovers, dialogs) draw their edge with `shadows`. They sit above the layout, so the edge taking no space is right for them. A near shadow and a far one, so the surface sits at a distance. Their fill is `raised`: white on the off-white page in light, `gray-2` in dark, where a shadow barely shows and lightness has to say what floats. A field inside a dialog keeps `background`, so in dark it reads sunk into the surface.

## Footers

A dialog's or card's footer is a `fillSubtle` bar with a top edge, set flush into the sides and bottom, so the actions read as their own row instead of floating under the text.
