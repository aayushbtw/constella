# Components

What each component does beyond the shared rules in the other files. Alphabetical.

## Alert

A box like a card, a control's radius and padding: `edge` border, `raised` fill. Its `status` colors only the icon, so the title and description stay neutral; the icon sits on the title's first line, and an action takes its own column at the end, centered on the text.

## Alert dialog

Wears the dialog's surface, motion and footer (dialog exports `dialogStyles`), so a confirm and a dialog never drift apart. Its media is a `fill` tile a `media` square above the title. At `sm` it's a short confirm: centered text over two equal buttons. The action doesn't close it, so a confirm can stay open while its work runs.

## Avatar

Follows the control heights (24, 32, 36), so it lines up with a button of the same size; its photo draws its `edge` inside itself. Avatars in a group, and an avatar and its badge, are cut apart by a 2px gap masked out of the one beneath, so any surface shows through it, not a ring of the page color. An avatar and a group's count fill with `fillOpaque` (`gray-3`, which matches `fill` on the page), so an overlapped avatar doesn't show through. Its badge's status is a `Solid` dot (online, away, busy) or `textMuted` (offline), named for screen readers. The fallback can't stay mounted (Base UI unmounts it), so the photo fades in over `fillOpaque`.

## Badge

Takes the button's six variants, so emphasis means the same thing on both, at 18, 20 or 24px with `radii.chip` corners. A status tints a `secondary` badge and colors a `ghost` or `link` one's text; an `outline` badge keeps its label neutral and puts the status in its dot, spinner or icons, so a row of them stays quiet. `primary` and `danger` already carry their color and ignore it. A dot is muted with no status, and follows the text on `primary` and `danger`.

## Button group

Joins its items into one control: the corners where two meet go square, and the item before draws the shared edge, so the seam is one line, not two. A separator between filled buttons draws that line instead, full height, and the buttons on both sides keep their own padding. Nested groups sit `space.xs` apart and don't join.

## Card

Its corner is `radii.lg`; its padding (`space.md`, `sm` at `sm`, none at `flush` for rows that pad themselves) is one variable its header, content and footer read, so they line up at every size. Its footer is the dialog's. A `well` is a `fillSubtle` tray a ladder step around a card, `space.xxs` padding and the card's corner a step down to `md`, so the two are concentric; a header in the tray lines its text up with the card's.

## Choice card

Its edge turns `accent` when checked.

## Collapsible

The one surface that animates its height: what sits below it has to make room, so the panel grows to Base UI's measured height on `layout`, fading in with it, and jumps under reduced motion. Base UI owns that measurement, so the animation never feeds back into it.

## Command

A menu that stays open under a search field: the menu's rows on a `raised` surface, the field an input group whose corner nests in the command's, and the first match always highlighted so Enter runs it.

## Conversation

Reads as a page with the user's words set off: a user's message is a `fillOpaque` bubble on `radii.lg` at the end, at most 80% wide; an answer is plain `md` text on `lineHeights.prose`, with its actions as ghost icon buttons under it. The composer is an input group on `radii.xl`, the top of the corner ladder, whose text grows to six lines; its submit is a primary pill that swaps its arrow for a stop square while an answer streams. The scroller opens at the newest message and follows a stream only while the reader is at the end; its jump-to-end pill rises in on `popover` when there's more below.

## Copy button

A button that swaps its copy icon for a tick for `durations.confirm` and back.

## Data table

A table whose rows render only while on screen, so its layout is fixed and narrow columns set their width; text too long for a column ends in an ellipsis. A sortable header is a ghost button pulled back to line its label up with the cells, with a muted unfold, up or down mark that cross-fades through SwapIcon as the sort changes; a selected row takes `fill`; the row open beside it (`aria-current`) takes `fillStrong`, a step above, since only one row is open at a time. Hovering a filled row stacks `fillSubtle` on it as an inset shadow, as in the sidebar.

A numbered row shows its number in `textMuted` until it's pointed at, focused or any row is selected, then the checkbox in the same spot; on touch it's always the checkbox. The swap fades on `hover` + `ease` for the pointer only. While a query is pending the body holds five skeleton rows; while the next page loads over the old one, the body fades to `opacities.busy`.

Pagination sits under the table: the range in `textSecondary` at the start; rows per page (a small Select) and outline icon-sm buttons for first, previous, next and last at the end. The column menu is an outline button that opens a menu of checkbox items.

## Dialog

Pads `space.md`. A dialog opened from another sits on top, and the one behind steps back like a toast stack: shrinks by `motion.stackScale` and peeks `space.sm` above it.

## Empty state

Centered, balanced text in a short measure (`sizes.measure`), led by its media: an icon on a `fill` tile a control tall, or an avatar as it is. It draws no box of its own, so it sits in whatever holds its place, a card or a page.

## File input

Its button is a `fill` chip set into the box with an even inset on three sides, its corner concentric with the box's; the file name beside it is `textSecondary`, so the chip leads.

## Hover card

A popover opened by resting on a link, with the popover's surface and motion; the link still leads somewhere, so nothing lives only in the card. It waits `hoverCardDelay`, a tooltip's rest: half Base UI's default, so a card answers a deliberate rest without opening for a pointer sweeping past. Triggers can share one card: moving between them it glides on `move` + `out`, grows to the new content's height, and cross-fades the content in place, so reading a row of mentions is one card following the pointer, not cards opening and closing.

## Input group

An input's surface drawn once around a borderless control and its addons, so the group carries the edge, invalid halo, ring and disabled fade. Buttons in a header or footer gather at its end. An input stacked with a header or footer takes the addon's line height and a 4px step between them, so the two lines space as evenly as their outer edges.

## Item

A row of media, text and actions, the shape a list or a settings row takes. It reserves a border like a control, `edge` when `outline`, and has `fillSubtle` when `muted`. Only an item rendered as a link or button answers: `fillSubtle` on hover, `presses.row` held. Its media sits level with the title's first line when there's a description.

## Keycap (Kbd)

A `fill` chip with `textSecondary` type in the surrounding font, not monospace, so a shortcut reads as part of the sentence. Its corner is `radii.chip`. Inside a button or input group it sits as far from the side as from the top and bottom, and its corner nests in the box's up to `default`; at `lg` the inset reaches the radius, so it keeps its own. Inside a tooltip it takes `onInvertedFill` and `onInverted`, and the tooltip's end padding drops to `space.xxs` around a trailing key so the corners stay concentric.

## Popups (select, menu, popover)

Share one surface and one motion: `background` on `shadows.popover`, a fade and a 0.96 scale from the trigger on `durations.popover`, leaving faster on `popoverExit`, above dialogs on `layers.popover`. Opened from the keyboard or dismissed with Esc, a popup appears and leaves at once (Base UI's `data-instant`); so do arrow keys and a picked item. Base UI marks only some of these, and none on a select, so both track the open-change reason with `useSkipMotion`. A submenu only fades, on `popoverExit`: it opens many times a minute while the pointer sweeps a menu, and a scale from beside its row reads as decoration.

A select's items and a menu's are the same row: `controlSm` tall (`size` on the content makes it `controlXs` with `xs` type, or `controlMd`, and a submenu inherits it), `xs` corners inside the popup's `xxs` padding so the two are concentric, `fillSubtle` while highlighted, and a tick on the end for the picked option. A menu stays open while a checkbox or radio item toggles, so its tick draws in and fades out like a checkbox's. A danger item turns red and highlights in `dangerFillSubtle`.

A filtered menu is a command in a popup: its field is the command's input group, sized with the rows a step up and its corner `xs` like theirs, and the first match is highlighted while filtering so Enter runs it. The field stays put and the list scrolls to `sizes.menuHeight`. Items hide and show at once as you type, and the popup snaps to the new height.

## Progress and meter

The slider's track: `strokes.track` tall, `fill` under `accent`, full corners. The fill travels to a new value on `move` + `out`, and jumps under reduced motion. While the amount isn't known, a third-width segment sweeps across the track on `pulse` + `inOut`, and breathes in place under reduced motion. A meter at or past its max turns `dangerSolid`, so a spent quota reads at a glance; it needs no roles of its own.

## Radio

A round checkbox with a dot that grows from the center, from half its size, a touch past full on `overshoot`.

## Scroll area

Its scrollbar is an overlay: a 10px rail with an `edge` thumb on full corners, shown only while the area is hovered or scrolling, fading on `hover` + `ease`. It takes no room, so content lines up the same whether it scrolls or not.

## Select

Its trigger is an input's surface, so a select and an input in one form read as one family. It opens below its trigger, as wide as it (never under `sizes.menu`), like a menu; opened over it instead (`alignItemWithTrigger`), it appears in place, with no motion; scrolled, it grows to `sizes.menuHeight` and then scrolls, instead of stretching to the viewport.

## Separator

A 1px `edgeSubtle` line: it groups content, it doesn't bound a control. A vertical one stretches to its row, so it matches whatever sits beside it.

## Sheet

Travels the whole way in from its edge on `layout` (the drawer curve, `durations.layout`), and leaves the same way, faster, on `dialog`: in and out along one path, so where it went is where it comes from. Its sides are physical, like the slide. Under reduced motion it fades in place. It is the dialog's surface (backdrop, `raised`, `shadows.dialog`, footer bar), so a side panel and its narrow-window sheet read alike.

## Side panel

Part of the layout, not a layer: it opens into a slot after the whole page, so it runs the full height beside the page's header too. It sits on the page's `background`, split by an `edgeSubtle` hairline, so the content narrows instead of being covered. What it holds is the app's: details, a form, anything. It's non-modal, so the page beside it stays usable and picking another row swaps what it shows. It slides `space.sm` in and fades on `layout`, and closes at once, so the content widens in one step.

Its header is a row `sizes.header` tall, the page header's height, so the two hairlines line up across the edge, like the sidebar's. It holds a title, any actions, then Close, and never info or a description: that goes in the body. The header and footer are pinned; the body scrolls on its own. The footer is the sidebar's, a column with a `space.xs` gap, on the body's `space.md` inset.

## Sidebar

Sits on `sidebar`, a step off the page, split from it by an `edgeSubtle` hairline, so it reads as the frame and the page as the content. It's in the flow and sticky, not fixed, so it sits beside the page at any height. Its header is a row `sizes.header` tall, the page header's height, so the two line up across the edge, with the trigger at its end.

Rows are a control tall, `space.xxxs` apart. The whole row answers the pointer, its action included, on `fillSubtle`, and stays lit while a menu from it is open. The current row takes `fill`, and hover stacks on it as an inset shadow so it still fades. Rows don't press. The current one keeps regular weight, since a weight change shifts the label. A label cut off fades over its last `space.lg` instead of an ellipsis, and fades out before an action drawn over the row's end; its tooltip shows it whole. A row's shortcut shows only while the row is pointed at or focused, and keeps its room when hidden so the label never moves.

The one surface whose width animates. It morphs on screen rather than entering or leaving, so it runs on `inOut`, taking `sidebar` to open and `sidebarExit` to close.

Everything that changes with it runs on that one clock, with no delays. The inner panel keeps its full width, so the content is clipped and never reflowed. Labels fade. Rows size to the column, so they narrow with the edge and a pill keeps its rounded end. Sub-menus and group labels fold. The hairline rides the column's edge.

Nothing snaps at the start. The rail layout applies only once the width settles, and by then it matches what's already showing. From the keyboard (⌘B, or Enter on the trigger) it changes at once, with no animation.

Narrowed, it's `sizes.sidebarIcon` wide, a control plus its group padding. Each row names itself in a tooltip, which points away from the window's edge. The trigger sits on the rows' icon column and shows the app's mark where the brand's logo was. Pointed at or focused, the toggle cross-fades in on `hover`, scaling from `motion.popoverScale` under `motion.crossfadeTextBlur`, and at once on keyboard focus.

Below `media.md` it opens as a sheet, where the trigger closes it.

A section change (into Settings and back) slides like a stack: the header and content leave `motion.exitOffset` toward where they came from, on `popoverExit`, and the new section arrives from the other side on `popover`, both on `crossfade` under `motion.crossfadeBlur`, clipped to their own boxes. The blur is the one exception to "no blur-ins": it's rare, and it tells two sections apart. The footer and the page stay put. Under `media.reducedMotion` it only fades. It's a view transition, so the old section is a snapshot and never re-renders.

## Skeleton

Breathes, `fill` dimming to `opacities.pulse` and back over `durations.pulse` on `inOut`: slow and in place, so loading reads as calm. It doesn't move, so it keeps breathing under reduced motion.

## Slider

The thumb is 12px on a 4px track; at 16px it outweighed the bar. It gives (`presses.icon`) for as long as it's held, on `[data-dragging]`, which Base UI sets on press, so a tap on the track gives too. Arrow keys don't set it, so they stay still.

## Switch

A checkbox that slides: `fillStrong` track off, `accent` on, a `textSecondary` thumb that turns `onAccent` when on, so it reads in both themes without its own token. Held, the thumb stretches a quarter of its width toward where it will travel (back from the end when on, so it stays in the track), and travels on `overshoot` over `durations.move`. Under reduced motion it jumps and doesn't stretch.

## Table

Rows are divided by `edgeSubtle` and its footer sits on `fillSubtle`. A selected row takes `fill`. The cells draw the dividers on separate borders: collapsed, Chrome hid them under a selected row in a cell that clips its text.

## Textarea

An input's surface, two control heights tall, growing with its content and resizing only vertically.

## Toggle

A ghost or outline button that stays pressed, with the button's sizes and press. Pressed it takes `fill`. A toggle group passes its variant and size to every item; at spacing `0` they join through the ButtonGroup variables into one segmented control.
