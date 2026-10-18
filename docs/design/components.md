# Components

What each component does beyond the shared rules in the other files. Alphabetical.

## Alert

A box like a card, a control's radius and padding: `border` border, `raised` fill. Its `color` colors only the icon, so the title and description stay neutral; the icon sits on the title's first line, and an action takes its own column at the end, centered on the text. In an alert under 24rem the action drops under the text instead.

## Alert dialog

Wears the dialog's surface, motion and footer (dialog exports `dialogStyles`), so a confirm and a dialog never drift apart. Its media is a `fill` tile a `media` square above the title. At `sm` it's a short confirm: centered text over two equal buttons. The action doesn't close it, so a confirm can stay open while its work runs.

## Approval

An `sm` card that names itself by its title. The title leads with a `fill` media tile `sizes.iconLg` square. Arguments are a `dl` grid, labels in `textSecondary`. A full-bleed separator splits the arguments from a long body. Once answered, the footer goes and a Badge in the action says what happened.

## Attachment

A file as a small `raised` card on a `border`, its corner the media's plus the inset so the two nest. The media is a `fill` tile; an image fills it and waits at `opacities.busy` until the file is in. Idle is a dashed edge; uploading and processing shimmer the title in `textSecondary`; an error tints the media `dangerSubtle`, turns the edge `dangerBorder` as an invalid field's is, and says why in the description, so color is never the only signal. A trigger covers the card and takes the ring on the card's corner; actions sit above it. A group scrolls sideways, snaps and fades its edges.

## Avatar

Follows the control heights (24, 32, 36), so it lines up with a button of the same size; its photo draws its `border` inside itself. Avatars in a group, and an avatar and its badge, are cut apart by a 2px gap masked out of the one beneath, so any surface shows through it, not a ring of the page color. An avatar and a group's count fill with `fillOpaque` (`gray-3`, which matches `fill` on the page), so an overlapped avatar doesn't show through. Its badge's presence is a `Solid` dot (online, away, busy) or `textMuted` (offline), named for screen readers. The fallback can't stay mounted (Base UI unmounts it), so the photo fades in over `fillOpaque`. A logo takes `rounded` corners, a ladder step under a control's (`radii.sm`, `xs` at `sm` and leading a badge, which keeps its `chip` corner around it); a group's cut-outs assume pills.

## Badge

Takes the button's five variants, so emphasis means the same thing on both, at 18, 20 or 24px with `radii.chip` corners. A `color` tints a `secondary` badge and colors a `ghost` or `link` one's text; an `outline` badge keeps its label neutral and puts the color in its dot, spinner or icons, so a row of them stays quiet. A `primary` takes the color's tint, as a danger button does, since a status color is never a solid fill (see [color](color.md)). A dot is muted with no color, and follows the text on `primary`. It never grows past its container: a longer label clips at its end, sideways only, so tall accents still show. An avatar leading it is the badge's height less `space.xxxs` and the border on each side, and the badge rounds its ends to `radii.full` around a pill avatar, so the two stay concentric. In a sentence it centers on the text (`vertical-align: middle`), since a badge opening on an icon or avatar would take that child's bottom as its baseline.

## Button group

Joins its items into one control: the corners where two meet go square, and the item before draws the shared edge, so the seam is one line, not two. A separator between filled buttons draws that line instead, full height, and the buttons on both sides keep their own padding. Nested groups sit `space.xs` apart and don't join.

## Card

Its corner is `radii.lg`; its padding (`space.md`, `sm` at `sm`, none at `flush` for rows that pad themselves) is one variable its header, content and footer read, so they line up at every size. Its footer is the dialog's. A `well` is a `fillSubtle` tray a ladder step around a card, `space.xxs` padding and the card's corner a step down to `md`, so the two are concentric; a header in the tray lines its text up with the card's. The action spans the description's row only when there is one, so a lone title stays one row tall.

## Choice card

Its edge turns `accentSolid` when checked.

## Chart

Axes, ticks and grid lines take `textMuted` through `currentColor`, with no axis line or tick stubs in the examples: the grid carries the scale. Series take `chart1` to `chart6` in order and keep their color when another is hidden. Bars round 4px and sit 2px apart; lines are 2px. A hovered bar column takes a `fillSubtle` band under its bars, the hover fill; a line chart takes a rule. Count axes read compact (`12M`) through `chartTickFormat`, which takes the locale, since the server's default can differ from the reader's.

The tooltip is a popover's surface, not the Tooltip's inverted one: it holds figures to read, not a one-line hint. Title in medium, then a row per series: a short bar in its paint, its label in `textSecondary` and its value in medium. Rows share three columns, so a row without a bar (a total) lines up with the rest. The hovered series' label steps up to `textPrimary`, with no fill. It sits beside the pointer so it never covers the values it reads. It keeps that shape with one series shown.

Under RTL the header, legend and tooltip flip; the plot doesn't. Time and figures read left to right in most RTL locales, as in shadcn's charts.

The legend is a row of small ghost toggles that wraps, pulled back to line its first dot up with the text above. Every entry starts shown, so shown stays quiet (`textPrimary`, filled dot) and hidden reads: `textMuted` and a hollow dot, never color alone. The change fades on `ease` at `hover` speed, like a toggle's fill. The last shown entry can't be hidden in the examples; an empty chart answers nothing.

A clicked legend entry moves the plot for `chart` on `out`; from the keyboard it snaps. Values ease; shapes don't morph. Each type moves as below:

| Chart | Hiding a series | Showing one |
| --- | --- | --- |
| Pie | Its slice shrinks; the rest turn to close the gap | It grows; the rest turn to make room |
| Stacked area | Its layer flattens; the layers above settle | It rises from the baseline |
| Bar | Its bars sink as their slot closes under a neighbour; the rest widen | The rest narrow; it rises from under them |
| Line | It fades as it follows the scale out of the plot | It fades in as the scale settles |

The axis takes its final scale at the click, and the marks move to it from where they were. A tick label that arrives, moves or changes fades in from 0.4 on `crossfade` over the same `chart`: the old one is gone at once, so it never starts from nothing. Under `media.reducedMotion` the plot snaps and the labels still fade.

## Citation

A pill capped at `sizes.citation` (160px), its publication name truncating, with the logo as the badge's leading avatar. Every citation opens one shared card, so hovering the next moves it there: the logo and publication in `textSecondary`, the headline in medium `textBase` clamped to 2 lines, the date in `textMuted`.

## Code Block

A `fillSubtle` tray on `radii.md`, `textSm` mono (`captionLg` at `sm`), read left to right. Long lines scroll sideways with no scrollbar. The end fades while there's more, drawn around the scroller so the numbers stay clear. Its actions are ghost buttons always shown: at the header's end, or floating centered on the first line with the code's end padding clearing them. A header holds a `textSecondary` icon and a medium sans title cut short. Line numbers and diff marks sit in the header icon's column, so the code starts under the title. Line numbers stay put beside the code, never over it. With `wrap`, a marked line's gutter fill covers only its first row. Numbers and marks are `textMuted` (marks `successText` and `dangerText`) and never copy. A highlighted line takes `fill`, an added one `successSubtle` and a removed one `dangerSubtle`, each reaching the tray's edges. `danger` turns the tray `dangerSubtle` and its text `danger`. A tall block is capped by a `maxHeight` and `overflowY` through `CodeBlockContent`'s `sx`, with no scrollbar; never with `lineNumbers`, since the numbers sit on that wrapper and would scroll and clip.

## Collapsible

The one surface that animates its height: what sits below it has to make room, so the panel grows to Base UI's measured height on `layout`, fading in with it, and jumps under reduced motion. Base UI owns that measurement, so the animation never feeds back into it. Toggled from the keyboard it opens and closes at once, and its trigger carries `data-collapsible-instant`, so a chevron in it snaps too. A later change from the app's `open` still animates.

## Command

A menu that stays open under a search field: the menu's rows on a `raised` surface, the field an input group whose corner nests in the command's, and the first match always highlighted so Enter runs it.

## Markdown

An answer reads as the page: `textLg`, blocks `space.md` apart, headings in semibold (`heading4`, then `heading6`) and two levels down in the outline, so they sit under the page's own. Inline code is a `fill` chip in mono at 0.875em; a fenced block is a Code Block. A quote is `textSecondary` behind a 2px `border` rule. Tables are the Table component, taking GFM's column alignment. Links keep the text color, underlined in `textMuted`, and open in a new tab.

## Marker

A note between messages, in `textSecondary` at `sm`: plain, over a `border` hairline (`border`), or a centered label between two hairlines (`separator`). As a link it's underlined and turns `textPrimary` on hover. While work runs it's an `output` with a spinner and shimmering text.

## Conversation

Reads as a page with the user's words set off: a user's message is a `fillOpaque` bubble on `radii.lg` at the end, at most 80% wide; an answer is plain `textLg`, with its actions as ghost icon buttons under it. The composer is an input group on `radii.xl` with the `raised` fill, the top of the corner ladder, whose text grows to six lines; its submit is a primary pill that swaps its arrow for a stop square while an answer streams. Its header and footer sit `radii.xl` minus half `controlSm` from the edge (6px by default), so its pills nest in its corner at any radius; `sm` attachments match them at the default radius. A well is a tray around it in `well` (`neutral-a2` in light, `a3` in dark, where a2 sits too close to `raised`) for context like a project or connected apps, usually one bar on one side; a bar's quiet ghost pills take `textSecondary`, and a leading icon lines up with the composer's text. The scroller opens at the newest message and follows a stream only while the reader is at the end; its jump-to-end pill rises in on `popover` when there's more below.

## Copy button

A button that swaps its copy icon for a tick for `durations.confirm` and back. With a label it's an `sm` button, icon first at the size's icon size, and the label names it. Its name never changes; a polite live region announces "Copied".

## Data table

A table whose rows render only while on screen, so its layout is fixed and narrow columns set their width; text too long for a column ends in an ellipsis. A sortable header is a ghost button pulled back to line its label up with the cells, with a muted unfold, up or down mark that cross-fades through SwapIcon as the sort changes; a selected row takes `fill`; the row open beside it (`aria-current`) takes `fillStrong`, a step above, since only one row is open at a time. Hovering a filled row stacks `fillSubtle` on it as an inset shadow, as in the sidebar.

A numbered row shows its number in `textMuted` until it's pointed at, focused or any row is selected, then the checkbox in the same spot; on touch it's always the checkbox. The swap fades on `hover` + `ease` for the pointer only. While a query is pending the body holds five skeleton rows; while the next page loads over the old one, the body fades to `opacities.busy`.

Pagination sits under the table: the range in `textSecondary` at the start; rows per page (a small Select) and outline icon-sm buttons for first, previous, next and last at the end. The column menu is an outline button that opens a menu of checkbox items.

## Dialog

Pads `space.md`. Its backdrop is `overlay` over the page blurred by `blurs.backdrop`, so the page behind recedes without reading as content. A dialog opened from another sits on top, and the one behind steps back like a toast stack: shrinks by `motion.stackScale` and peeks `space.sm` above it.

## Empty state

Centered, balanced text in a short measure (`sizes.measure`), led by its media: an icon on a `fill` tile a control tall, or an avatar as it is. It draws no box of its own, so it sits in whatever holds its place, a card or a page.

## File input

Its button is a `fill` chip set into the box with an even inset on three sides, its corner concentric with the box's; the file name beside it is `textSecondary`, so the chip leads.

## Hover card

A popover opened by resting on a link, with the popover's surface and motion; the link still leads somewhere, so nothing lives only in the card. It waits `hoverCardDelay`, a tooltip's rest: half Base UI's default, so a card answers a deliberate rest without opening for a pointer sweeping past. Triggers can share one card: moving between them it glides on `move` + `out`, grows to the new content's height, and cross-fades the content in place, so reading a row of mentions is one card following the pointer, not cards opening and closing.

## Input group

An input's surface drawn once around a borderless control and its addons, so the group carries the edge, invalid halo, ring and disabled fade. Buttons in a header or footer gather at its end. An input stacked with a header or footer takes the addon's line height and a 4px step between them, so the two lines space as evenly as their outer edges.

## Item

A row of media, text and actions, the shape a list or a settings row takes. It reserves a border like a control, `border` when `outline`, and has `fillSubtle` when `muted`. Only an item rendered as a link or button answers: `fillSubtle` on hover, `presses.row` held. Its media sits level with the title's first line when there's a description. Its text keeps at least `sizes.itemText`; narrower, the actions drop under it rather than squeeze it.

## Keycap (Kbd)

A `fill` chip with `textSecondary` type in the surrounding font, not monospace, so a shortcut reads as part of the sentence. Its corner is `radii.chip`. Inside a button or input group it sits as far from the side as from the top and bottom, and its corner nests in the box's up to `default`; at `lg` the inset reaches the radius, so it keeps its own. Inside a tooltip it takes `invertedFill` and `invertedOnSolid`, and the tooltip's end padding drops to `space.xxs` around a trailing key so the corners stay concentric.

## Model picker

A popover whose popup is no surface: it holds two cards, a Command list at `sizes.modelPicker` and the highlighted model's details, opening and closing together on the popover's motion. The card shows once a row is reached by arrow key or the pointer rests on it for `hoverCardDelay`, then follows the highlight, so skimming the list never flashes it. A pick closes the picker at once, with no exit. The card opens at the list's `inline-end`, or `inline-start` for a picker at a row's end; opening upward it lines up with the list's bottom, nearest the trigger, and it wraps under the list when both don't fit. Logos are one-color masks painted in the text color. While the card shows, each row is described by it (`aria-describedby`), so a screen reader hears the highlighted model's details after its name.

## Popups (select, menu, popover)

Share one surface and one motion: `background` on `shadows.lg`, a fade and a 0.96 scale from the trigger on `durations.popover`, leaving faster on `popoverExit`, above dialogs on `layers.popover`. Opened from the keyboard or dismissed with Esc, a popup appears and leaves at once (Base UI's `data-instant`); so do arrow keys and a picked item. Base UI marks only some of these, and none on a select, so both track the open-change reason with `useSkipMotion`. A submenu only fades, on `popoverExit`: it opens many times a minute while the pointer sweeps a menu, and a scale from beside its row reads as decoration.

A select's items and a menu's are the same row: `controlSm` tall (`size` on the content makes it `controlXs` with `xs` type, or `controlMd`, and a submenu inherits it), `xs` corners inside the popup's `xxs` padding so the two are concentric, `fillSubtle` while highlighted, and a tick on the end for the picked option. A menu stays open while a checkbox or radio item toggles, so its tick draws in and fades out like a checkbox's. A danger item turns red and highlights in `dangerSubtle`. A popup never grows past the viewport (`--available-width`); a long item wraps, anywhere if it must, and its icon and shortcut keep their size.

A filtered menu is a command in a popup: its field is the command's input group, sized with the rows a step up and its corner `xs` like theirs, and the first match is highlighted while filtering so Enter runs it. The field stays put and the list scrolls to `sizes.menuHeight`. Items hide and show at once as you type, and the popup snaps to the new height.

## Progress and meter

The slider's track: `strokes.track` tall, `fill` under `accentSolid`, full corners. The fill travels to a new value on `move` + `out`, and jumps under reduced motion. While the amount isn't known, a third-width segment sweeps across the track on `pulse` + `inOut`, and breathes in place under reduced motion. A meter's `color` swaps the fill for that role's `Solid`; it never picks one from its value, since a full meter can be good (battery) or bad (quota). It needs no roles of its own.

## Questionnaire

One question at a time, each answer a choice card. The card is Field's: `border`, `radii.md`, `fillSubtle` on hover and when picked, an `accentSolid` edge when picked and `dangerBorder` when invalid. Its Checkbox or Radio indicator is drawn to match, since shadcn's headless questionnaire needs a native input. The whole card rings on keyboard focus. A shortcut is a Kbd at the card's end. Previous sits at the start of the actions, Skip and Next or Submit at the end. The active question swaps at once, with no motion: it's usually changed from the keyboard.

## Radio

A round checkbox with a dot that grows from the center, from half its size, a touch past full on `overshoot`.

## Scroll area

Its scrollbar is an overlay: a 10px rail with a `border` thumb on full corners, shown only while the area is hovered or scrolling, fading on `hover` + `ease`. It takes no room, so content lines up the same whether it scrolls or not. Where a scroll fade already shows there's more, like the docs sidebar, `hideScrollbar` drops the scrollbar.

## Scroll fade

A mask over the scroller, not a gradient in the page's color, so it works on any surface. An edge fades only while content is past it, up to `min(12%, space.xl)` deep and in full once `2 × space.xl` is past, driven by the scroll itself, so a list at rest is never dimmed. Without scroll-driven animations both edges fade.

## Select

Its trigger is an input's surface, so a select and an input in one form read as one family. It opens below its trigger, as wide as it (never under `sizes.menu`), like a menu; opened over it instead (`alignItemWithTrigger`), it appears in place, with no motion; scrolled, it grows to `sizes.menuHeight` and then scrolls, instead of stretching to the viewport.

## Separator

A 1px `borderSubtle` line: it groups content, it doesn't bound a control. A vertical one stretches to its row, so it matches whatever sits beside it.

## Sheet

Travels the whole way in from its edge on `layout` (the drawer curve, `durations.layout`), and leaves the same way, faster, on `dialog`: in and out along one path, so where it went is where it comes from. Its sides are physical, like the slide. Under reduced motion it fades in place. It is the dialog's surface (backdrop, `raised`, `shadows.xl`, footer bar), so a side panel and its narrow-window sheet read alike.

## Side panel

Part of the layout, not a layer: it opens into a slot after the whole page, so it runs the full height beside the page's header too. It sits on the page's `background`, split by an `borderSubtle` hairline, so the content narrows instead of being covered. What it holds is the app's: details, a form, anything. It's non-modal, so the page beside it stays usable and picking another row swaps what it shows. It slides `space.sm` in and fades on `layout`, and closes at once, so the content widens in one step.

Its header is a row `sizes.header` tall, the page header's height, so the two hairlines line up across the edge, like the sidebar's. It holds a title, any actions, then Close, and never info or a description: that goes in the body. The header and footer are pinned; the body scrolls on its own. The footer is the sidebar's, a column with a `space.xs` gap, on the body's `space.md` inset.

## Sidebar

Sits on `sidebar`, a step off the page, split from it by an `borderSubtle` hairline, so it reads as the frame and the page as the content. It's in the flow and sticky, not fixed, so it sits beside the page at any height. Its header is a row `sizes.header` tall, the page header's height, so the two line up across the edge, with the trigger at its end.

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

## Suggestions

`outline` `sm` pill buttons in one row that scrolls sideways with no scrollbar; `scrollFade.x` shows there's more. The row keeps `space.xxs` around the pills so the viewport doesn't clip a focus ring.

## Switch

A checkbox that slides: `fillStrong` track off, `accentSolid` on. Off, the thumb takes `fillOnStrong`: white in light, `gray-12` in dark. On, it takes `accentOnSolid`. Either way it stands off its track. A `textSecondary` thumb read as disabled on the light track. It takes `shadows.default` in both states; `shadows.defaultRing`'s ring made off look heavier than on. Held, the thumb stretches a quarter of its width toward where it will travel (back from the end when on, so it stays in the track), and travels on `overshoot` over `durations.move`. Under reduced motion it jumps and doesn't stretch.

## Table

Rows are divided by `borderSubtle` and its footer sits on `fillSubtle`. A selected row takes `fill`. Hover and press light a row `fillSubtle`, except in a reference table (`interactive={false}`, as in docs), where nothing answers the pointer. The cells draw the dividers on separate borders: collapsed, Chrome hid them under a selected row in a cell that clips its text.

## Textarea

An input's surface, two control heights tall, growing with its content and resizing only vertically.

## Toggle

A ghost or outline button that stays pressed, with the button's sizes and press. Pressed it takes `fill`. A toggle group passes its variant and size to every item; at spacing `0` they join through the ButtonGroup variables into one segmented control.

## Trace

The one shape for an agent's steps: reasoning, tool calls and sources are all Trace lines, not components of their own. A line is a quiet text row a control tall with no fill, `textSecondary` at `sm`: an icon's column, a title cut short and a `textMuted` description that never truncates. It turns `textPrimary` on hover only inside a link or trigger, and a collapsible's chevron turns a quarter on `move` + `out`. `error` is `dangerText`, hover included; `pending` dims to `opacities.disabled`; a running title shimmers. A trailing icon sits `space.xxs` closer, as the indicator. Lines stack `space.xs` apart. An open line's detail sits in `textSecondary` beside a 1px `border` rail that starts `space.xxs` under the line's icon, lined up with the title, so a nested trace lines up its icons there too. A link or a Dialog or Sheet trigger around a line takes `traceActionStyles()`, so it adds no chrome of its own.
