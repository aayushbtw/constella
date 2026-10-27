# Surfaces

## Controls

Controls (buttons, inputs) have a real border for their edge: the edge takes space, so what the user sees is what's laid out, and a shadow ring would draw outside the box, look 2px larger and double up at a button group's seams. Buttons are flat: a secondary is a `fillSubtle` fill, an outline its border, a primary its solid fill, and none carries a shadow. A field, a checkbox, a select trigger and an outline toggle keep `shadows.default` under their edge (in a raised theme, [depth](#depth)); a select trigger and an outline toggle climb a step to `defaultHover` on hover and settle to `defaultPressed` while held. Every variant reserves the border, transparent when it has no edge, so a fill and an outline are the same size. A bordered control sets `background-clip: padding-box`: otherwise the fill bleeds through the edge's anti-aliased corners.

A slider thumb rides above its track, so it takes a shadow too: `shadows.defaultRing` is a gray ring plus a drop shadow. `shadows.default` alone vanishes on the dark page and leaves the thumb flat. A switch thumb takes `default`: its fill does the separating.

## Depth

A theme picks its depth: `raised`, the default, or `flat`. Raised gives controls and in-page surfaces a drop: the `shadows.default` steps under a field or a trigger, the drop under a slider thumb's ring and under the composer's ring. Flat drops all of them, so an edge is a border, a ring or a fill and nothing in the page lifts; a select trigger and an outline toggle then answer hover with their fill alone. The theme sets the drops (`--shadow-*` in `theme.stylex.ts`) and parts read `shadows.*` as before, so no part branches on depth. Rings that draw an edge, the invalid halo and the focus ring stay at both depths. A side panel keeps `shadows.panel` at both depths: it stands apart from the content beside it. What floats always keeps `lg` or `xl`: a popover, menu, select list, hover card, dialog, sheet, toast, tooltip and a data table's action bar, since their shadow says they sit above the page, not how deep the page is.

## Edges

Every control and box draws its border in `border`: a button, an input and a choice card match, so a row of them reads as one family. `borderSubtle` is too faint for that: an input's fill sits inside its edge, and with the faint one it reads 30px tall beside a 32px button on the dark page. `borderSubtle` is for dividers that group content without bounding a control: a separator, table rows, the hairline beside a side panel or sidebar. Every edge is a solid step: `border` is `neutral-6` and `borderSubtle` `neutral-4`. The rings of floating surfaces and slider thumbs are too. An empty checkbox draws `borderStrong` (`neutral-9`), 3:1 on the page as WCAG asks of a control's own edge, since nothing else marks it. A translucent edge shows what's behind it, such as text under a popover or an avatar's photo. Shadows stay translucent. Edges and shadows stay px while the box around them grows in rem ([units](space.md#units)), so a 1px edge stays sharp at any text size.

A surface set into a tinted frame draws its edge inside itself. An outer edge would stack on the frame's tint and leave a light halo around the inner surface.

## Layout boxes

A box in the layout (a card, an alert) takes a real `border` border, not a shadow, and the `raised` fill: white on the off-white page, a step lighter in dark.

## Composer

The prompt input is a surface, not a control: no border, and its edge is a 0.5px `borderSubtle` ring inside `shadows.defaultRingSubtle`, over a soft drop, so the biggest box on the page reads lighter than a field. It never sits in a button group, so the ring's drawing outside the box costs nothing. Invalid swaps in `defaultRingInvalid`, a 1px `danger` ring and its halo. In a well the ring stays outside, a step darker than the well in both themes. Its fill is `raised`, like a layout box.

## Floating

Floating surfaces draw their edge with `shadows`: `lg` for toasts, popovers and menus, `xl` for a dialog or sheet. They sit above the layout, so the edge taking no space is right for them. A near shadow and a far one, so the surface sits at a distance. Their fill is `raised`: white on the off-white page in light, `gray-2` in dark, where a shadow barely shows and lightness has to say what floats. A field inside a dialog keeps `background`, so in dark it reads sunk into the surface.

## Footers

A dialog's or card's footer is a `fillSubtle` bar with a top edge, set flush into the sides and bottom, so the actions read as their own row instead of floating under the text.

A surface with a header, body and footer has one scroller: the header and footer stay pinned and only the body scrolls (a dialog with `DialogBody`, a sheet, a side panel), so the popup itself never scrolls.
