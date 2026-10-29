# Components

What each component does beyond the shared rules in the other files. Alphabetical.

## Alert

A box like a card, a control's radius and padding: `border` border, `raised` fill. Its `color` colors only the icon, so the title and description stay neutral; the icon sits on the title's first line, and an action takes its own column at the end, centered on the text. In an alert under 24rem the action drops under the text instead.

## Alert dialog

Wears the dialog's surface (`radii.xl`), motion and footer (dialog exports `dialogStyles`), so a confirm and a dialog never drift apart. Its media is a `fill` tile a `media` square above the title. At `sm` it's a short confirm: centered text over two equal buttons. The action doesn't close it, so a confirm can stay open while its work runs.

## Approval

An `sm` card that names itself by its title. The title leads with its icon bare, no tile: `iconSm`, about the title's cap height, `space.row` from the text and centered on its line. Arguments are a `dl` grid, labels in `textSecondary`. A full-bleed separator splits the arguments from a long body. Once answered, the footer goes and a Badge in the action says what happened.

## Attachment

A file as a small `raised` card on a `border`, its corner the media's plus the inset so the two nest. The media is a `fill` tile; an image fills it and waits at `opacities.busy` until the file is in. Idle is a dashed edge; uploading and processing shimmer the title in `textSecondary`; an error tints the media `dangerSubtle`, turns the edge `dangerBorder` as an invalid field's is, and says why in the description, so color is never the only signal. A trigger covers the card and takes the ring on the card's corner; actions sit above it. A group sits `space.xs` apart, scrolls sideways, snaps and fades its edges.

The text block is exactly the media's height, so the media's inset holds on every side; text is `textSm` at every size. Horizontal, the text's end inset matches its gap from the media. A vertical card is `sizes.attachment` wide, `attachmentWide` with text.

| Size | Media | Text | Media to text, text end |
| --- | --- | --- | --- |
| `default` | `media` | Two 20px lines | `space.sm` |
| `sm` | `controlMd` | Two 16px lines (`captionLg` leading) | `space.popup` |
| `xs` | `controlSm` (28) | One line: title and description inline, on one baseline, `space.xs` apart | `space.row` |

## Avatar

Follows the control heights, so it lines up with a button of the same size; its photo draws its `border` inside itself. Avatars in a group, and an avatar and its badge, are cut apart by a 2px gap masked out of the one beneath, so any surface shows through it, not a ring of the page color. An avatar and a group's count fill with `fillOpaque` (`gray-3`, which matches `fill` on the page), so an overlapped avatar doesn't show through; the count draws the avatars' `border` ring too, so it reads as one of them. Its badge's presence is a `Solid` dot (online, away, busy) or `textMuted` (offline), named for screen readers. The fallback can't stay mounted (Base UI unmounts it), so the photo fades in over `fillOpaque`. A logo takes `rounded` corners, a ladder step under a control's (`radii.sm`, `xs` at `sm` and leading a badge, which keeps its `chip` corner around it); a group's cut-outs assume pills.

## Badge

Takes the button's five variants, so emphasis means the same thing on both. A `color` tints a `secondary` badge and colors a `ghost` or `link` one's text; an `outline` badge keeps its label neutral and puts the color in its dot, spinner or icons, so a row of them stays quiet. A `primary` takes the color's tint, as a danger button does, since a status color is never a solid fill (see [color](color.md)). A dot is muted with no color, and follows the text on `primary`. It never grows past its container: a longer label clips at its end, sideways only, so tall accents still show. An avatar leading it is the badge's height less `space.xxxs` and the border on each side, and the badge rounds its ends to `radii.full` around a pill avatar, so the two stay concentric. In a sentence it centers on the text (`vertical-align: middle`), since a badge opening on an icon or avatar would take that child's bottom as its baseline. In a table cell it sits on the line's top instead, so it fills the line rather than growing the row.

## Breadcrumb

A `textSm` trail in `textSecondary`, `space.xs` apart, with an `iconSm` arrow between steps that flips in RTL. Links turn `textPrimary` on hover; the current page is `textPrimary` and not a link. It sits above a page's title, not in place of it.

## Button group

Joins its items into one control: the corners where two meet go square, and the item before draws the shared edge, so the seam is one line, not two. A separator between filled buttons draws that line instead, full height, and the buttons on both sides keep their own padding. Nested groups sit `space.xs` apart and don't join.

## Card

Its padding (none at `flush`, for rows that pad themselves) is one variable its header, content and footer read, so they line up at every size. Its footer is the dialog's. A `well` is a `fillSubtle` tray a ladder step around a card, `space.xxs` padding and the card's corner a step down to `md`, so the two are concentric; a header in the tray lines its text up with the card's. A `filled` card is a `fillSubtle` surface with no edge, for a section or stat that sits on the page. The action spans the description's row only when there is one, so a lone title stays one row tall.

## Choice card

Its edge turns `accentSolid` when checked. In a `flush` card's field group, choice cards become the card's rows: no edge, corner or checked fill of their own, `space.md` inline padding, a `borderSubtle` hairline between them, and `fillSubtle` on hover. The switch shows the state, so a row doesn't.

## Chart

Axes, ticks and grid lines take `textMuted` through `currentColor`, with no axis line or tick stubs in the examples: the grid carries the scale. Series take `chart1` to `chart6` in order and keep their color when another is hidden. Bars round 4px and sit 2px apart (each bar's `inset: 1`, with `chartGroupScale`'s padding defaulting to 0); lines are 2px. Axis labels are 12px, `captionLg`'s size: `Chart` sets `tickLabels.fontSize` on every axis, not CSS, since TanStack measures labels by that number for margins and thinning; a definition's own `fontSize` wins. A hovered bar column takes a `fillSubtle` band under its bars, the hover fill; a line chart takes a rule. Count axes read compact (`12M`) through `chartTickFormat`, which takes the locale, since the server's default can differ from the reader's.

The tooltip is a popover's surface, not the Tooltip's inverted one: it holds figures to read, not a one-line hint. Title in medium, then a row per series: a short bar in its paint, its label in `textSecondary` and its value in medium. Rows share three columns, so a row without a bar (a total) lines up with the rest. The hovered series' label steps up to `textPrimary`, with no fill. It sits beside the pointer so it never covers the values it reads. It keeps that shape with one series shown.

Under RTL the header, legend and tooltip flip; the plot doesn't. Time and figures read left to right in most RTL locales, as in shadcn's charts.

The legend is a row of small ghost toggles that wraps, pulled back to line its first dot up with the text above. Labels are regular, so the legend never outranks the title. Every entry starts shown, so shown stays quiet (`textPrimary`, filled dot) and hidden reads: `textMuted` and a hollow dot, never color alone. The change fades on `ease` at `hover` speed, like a toggle's fill. The last shown entry can't be hidden in the examples; an empty chart answers nothing.

A clicked legend entry moves the plot for `chart` on `out`; from the keyboard it snaps. Values ease; shapes don't morph. Each type moves as below:

| Chart | Hiding a series | Showing one |
| --- | --- | --- |
| Pie | Its slice shrinks; the rest turn to close the gap | It grows; the rest turn to make room |
| Stacked area | Its layer flattens; the layers above settle | It rises from the baseline |
| Bar | Its bars sink as their slot closes under a neighbour; the rest widen | The rest narrow; it rises from under them |
| Line | It fades as it follows the scale out of the plot | It fades in as the scale settles |

The axis takes its final scale at the click, and the marks move to it from where they were. A tick label that arrives, moves or changes fades in from 0.4 on `crossfade` over the same `chart`: the old one is gone at once, so it never starts from nothing. Under `media.reducedMotion` the plot snaps and the labels still fade.

## Citation

A pill capped at `sizes.citation`, its first publication's name truncating, with the logo leading it as a bare `iconXs` favicon (no tile or edge, `radii.xs` on an image), as far from the start as from the top and bottom, like a Button's Kbd, and the other sources counted after it (`+2`, `textMuted`). Every citation opens one shared card, so hovering the next moves it there. The card lists each source as a menu-style row: a link on `radii.sm` with `space.row` padding, `space.xxs` apart inside the card's `space.xxs` inset so its fill nests in the card's corner, lit `fillSubtle` on hover (`stateStyles.ghost`), with no underline. Each holds the logo (`iconSm`, bare) and publication in `textSecondary`, `space.row` apart like the row's padding, the headline in medium `textBase` clamped to 2 lines, the description in `textSecondary` clamped to 2 lines, the date in `textMuted`. Lines sit `space.xs` apart, except headline to description at `xxs`, so the two read as one block between publication and date. A logo loads without a referrer; without one a globe stands in, waiting `durations.fallbackDelay` behind a loading logo so it doesn't flash first. A group's "N more" is `textMuted`, like the pill's count.

## Code Block

A `fillSubtle` tray, read left to right. Long lines scroll sideways with no scrollbar. The end fades while there's more, drawn around the scroller so the numbers stay clear. Its actions are ghost buttons always shown: at the header's end, or floating centered on the first line with the code's end padding clearing them; the end fade then stops where the floating action starts, so scrolled code never shows beside it. A header holds a `textSecondary` icon and a medium sans title cut short. Line numbers and diff marks sit in the header icon's column, so the code starts under the title. Line numbers stay put beside the code, never over it. With `wrap`, a marked line's gutter fill covers only its first row. Numbers and marks are `textMuted` (marks `successText` and `dangerText`) and never copy. A highlighted line takes `fill`, an added one `successSubtle` and a removed one `dangerSubtle`, each reaching the tray's edges. `danger` turns the tray `dangerSubtle` and its text `danger`. A tall block is capped by a `maxHeight` and `overflowY` through `CodeBlockContent`'s `sx`, with no scrollbar; never with `lineNumbers`, since the numbers sit on that wrapper and would scroll and clip.

## Collapsible

Animates its height, since what sits below it has to make room: the panel grows to Base UI's measured height on `layout`, fading in with it, and shuts quicker, on `layoutExit` + `out`; it jumps under reduced motion. Base UI owns that measurement, so the animation never feeds back into it. Toggled from the keyboard it opens and closes at once, and its trigger carries `data-collapsible-instant`, so a chevron in it snaps too. A later change from the app's `open` still animates.

## Calendar and date range picker

A month grid on `sizes.controlMd` cells, its arrows ghost icon buttons beside the first and last month's names. A selected day, and both ends of a range, are `infoSolid` with `accentOnSolid` text, like Switch's checked track; the days between sit in an `infoSubtle` band that runs on under the ends, so it reaches their edge. Today is medium weight, days outside the month are hidden, and a blocked day takes the disabled opacity. Days highlight like a ghost button. The picker is a default-size secondary button in a popover, with presets as ghost buttons on `radii.md` in a column set off by a `borderSubtle` edge, sized like a default menu's items (32px rows, 14px text, `space.sm` at both ends, the tick on the end); the pressed preset takes `fill`. A pick closes it at once, with the popover's exit.

## Command

A menu that stays open under a search field: a default menu's rows on a `raised` surface at `radii.lg`, the field an `lg` input group a step above them, its corner `md` like theirs, nesting in the command's corner (a Command Dialog's popup is `lg` too), and the first match always highlighted so Enter runs it. Its field is flat, with no drop shadow, on `fill`, so in a dark dialog the popup's own edge stays readable above it. In a dialog it sits near the top of the window at `lg` width, so the list grows downward without the box jumping. A footer is a `fillSubtle` bar flush with the command's edges, for key hints (a `Kbd` beside its label, pairs `space.md` apart).

## Markdown

An answer reads as the page: `textBase`, headings in semibold (`heading6`, then `textLg`), bold text in semibold too, so size alone sets a heading apart, and two levels down in the outline, so they sit under the page's own; h4 to h6 all render as h6. Spacing is in `em`, so it follows the text's size, and margins collapse, so two blocks sit as far apart as the larger margin asks, with nothing before the first or after the last. A block (paragraph, list, quote, code block, table) has 1em after it. A heading has 1.5em of its own size before and 0.5em after, so it sits with what it heads. List items sit 0.5em apart, and a nested list sits 0.5em under its item's text, as an item does. A list indents 1.25em and each item 0.25em more, which puts the marker that far from the text; markers are `textSecondary`. A rule has 1em on each side. Inline code is a `fill` chip in mono at 0.875em; a fenced block is a Code Block. A quote is `textSecondary` behind a 2px `border` rule. Tables are the Table component, taking GFM's column alignment; a table has no box, so its first and last cells drop their inline padding and its text lines up with the prose, while a code block and a quote keep their insets. Links keep the text color, underlined in `textMuted`, and open in a new tab.

## Marker

A note between messages, in `textSecondary` at `sm`: plain, over a `border` hairline (`border`), or a centered label between two hairlines (`separator`). As a link it's underlined and turns `textPrimary` on hover. While work runs it's an `output` with a spinner and shimmering text.

## Conversation

Reads as a page with the user's words set off: a user's message is a `fillOpaque` bubble on `radii.lg` at the end, at most 80% wide; an answer is plain `textBase`, with its actions as ghost icon buttons under it. The composer is an input group on `radii.xl` with the `raised` fill, the top of the corner ladder, whose text grows to six lines; its submit is a primary pill that swaps its arrow for a stop square while an answer streams. Its header and footer sit `radii.xl` minus half `controlSm` from the edge (6px by default), so its pills nest in its corner at any radius; `sm` attachments match them at the default radius. A well is a tray around it in `well` (`neutral-a2` in light, `a3` in dark, where a2 sits too close to `raised`) for context like a project or connected apps, usually one bar on one side; a bar's quiet ghost pills take `textSecondary`, and a leading icon lines up with the composer's text. A command list opened from the composer (slash commands) is a Command's surface and rows on `shadows.lg`, as wide as the composer and `offsets.popover` above it, or below it with no room; it appears and leaves at once, since only typing, Esc and a pick open and close it. The scroller opens at the newest message and follows a stream only while the reader is at the end; its jump-to-end pill rises in on `popover` when there's more below.

## Copy button

A button that swaps its copy icon for a tick for `durations.confirm` and back. With a label it's an `sm` button, icon first at the size's icon size, and the label names it. Its name never changes; a polite live region announces "Copied".

## Data table

A table whose rows render only while on screen, so its layout is fixed and narrow columns set their width; text too long for a column ends in an ellipsis. A column of figures aligns to its end (`meta: { align: "end" }`), header and cells. A sortable header is a ghost button pulled back by its padding and border to line its label up with the cells, with a muted unfold, up or down mark that cross-fades through SwapIcon as the sort changes; in an end-aligned column the mark leads, so the label ends over the digits; a selected row takes `fill`; the row open beside it (`aria-current`) takes `fillStrong`, a step above, since only one row is open at a time. Hovering a filled row stacks `fillSubtle` on it as an inset shadow, as in the sidebar.

A numbered row shows its number in `textMuted` until it's pointed at, focused or any row is selected, then the checkbox in the same spot; on touch it's always the checkbox. The swap fades on `hover` + `ease` for the pointer only. While a query is pending the body holds five skeleton rows as tall as loaded ones: each cell a bar `iconSm` tall and 60% wide in a `textSm` line, keeping its column's width and alignment, and the checkbox column a `sizes.icon` square; while the next page loads over the old one, the body fades to `opacities.busy`.

The action bar floats at the window's foot while any row is selected: a popover's fill and shadow (`raised`, `shadows.lg`) at `radii.md` a `space.xxs` inset around `sm` buttons with `rounded` corners, which nest in its corner, on `layers.bar`, under dialogs. "N selected" leads in medium; Clear ends it. It enters and leaves as a popup does, a fade and 0.96 scale from `motion.exitOffset` below, on `popover` and `popoverExit`, and under reduced motion only fades. A selection made from the keyboard, or a key pressed in the bar, shows and hides it at once. Esc does nothing there: it would also reach a menu opened from an action, whose own Esc closes it. The count is announced through a live region outside the bar, since a hidden bar isn't read.

Pagination sits under the table: the range in `textSecondary` at the start; rows per page (a small Select) and outline icon-sm buttons for first, previous, next and last at the end. The column menu is an outline button that opens a menu of checkbox items.

## Dialog

Its popup is `raised` on `radii.xl`. Its backdrop is `overlay` over the page blurred by `blurs.backdrop`, so the page behind recedes without reading as content. A dialog opened from another sits on top, and the one behind steps back like a toast stack: shrinks by `motion.stackScale` and peeks `space.sm` above it.

## Empty state

Centered, balanced text in a short measure (`sizes.measure`), led by its media: an icon on a `fill` tile a control tall, or an avatar as it is. It draws no box of its own, so it sits in whatever holds its place, a card or a page.

## File input

Its button is a `fill` chip set into the box with an even inset on three sides, its corner concentric with the box's; the file name beside it is `textSecondary`, so the chip leads.

## Hover card

A popover opened by resting on a link, with the popover's surface (`radii.lg`) and motion; the link still leads somewhere, so nothing lives only in the card. It waits `hoverCardDelay`, a tooltip's rest: half Base UI's default, so a card answers a deliberate rest without opening for a pointer sweeping past. Triggers can share one card: moving between them it glides on `move` + `out`, grows to the new content's height, and cross-fades the content in place, so reading a row of mentions is one card following the pointer, not cards opening and closing.

## Input group

An input's surface, at `radii.md`, drawn once around a borderless control and its addons, so the group carries the edge, invalid halo, ring and disabled fade. Buttons in a header or footer gather at its end. An input stacked with a header or footer takes the addon's line height and a 4px step between them, so the two lines space as evenly as their outer edges.

## Item

A row of media, text and actions, the shape a list or a settings row takes. It reserves a border like a control, `border` when `outline`, and has `fillSubtle` when `secondary`. Only an item rendered as a link, a button or a label for its control answers: `fillSubtle` on hover, `presses.row` held. A default item reads at `textMd`, its title regular, its description `textSecondary`; `sm` and `xs` items keep `textSm`. Its media sits level with the title's first line when there's a description; a `tile` is the image's box and corner in `fillSubtle`, for a logo that would float on the page. Its text keeps at least `sizes.itemText`; narrower, the actions drop under it rather than squeeze it.

## Keycap (Kbd)

A `fill` chip with `textSecondary` type in the surrounding font, not monospace, so a shortcut reads as part of the sentence. Inside a button or input group it sits as far from the side as from the top and bottom, and its corner nests in the box's up to `default`; at `lg` the inset reaches the radius, so it keeps its own. Inside a tooltip it takes `invertedFill` and `invertedOnSolid`, and the tooltip's end padding drops to `space.xxs` around a trailing key so the corners stay concentric.

## Model picker

A popover whose popup is no surface: it holds two cards, a Command list at `sizes.modelPicker` and the highlighted model's details, opening and closing together on the popover's motion. The card shows once a row is reached by arrow key or the pointer rests on it for `hoverCardDelay`, then follows the highlight, so skimming the list never flashes it. A pick closes the picker at once, with no exit. The card opens at the list's `inline-end`, or `inline-start` for a picker at a row's end; opening upward it lines up with the list's bottom, nearest the trigger, and it wraps under the list when both don't fit. Logos are one-color masks painted in the text color. While the card shows, each row is described by it (`aria-describedby`), so a screen reader hears the highlighted model's details after its name.

## Popups (select, menu, popover)

Share one surface and one motion: `raised` on `shadows.lg` at `radii.lg`, a fade and a 0.96 scale from the trigger on `durations.popover`, leaving faster on `popoverExit`, above dialogs on `layers.popover`. Opened from the keyboard or dismissed with Esc, a popup appears and leaves at once (Base UI's `data-instant`); so do arrow keys and a picked item. Base UI marks only some of these, and none on a select, so both track the open-change reason with `useSkipMotion`. A submenu only fades, on `popoverExit`: it opens many times a minute while the pointer sweeps a menu, and a scale from beside its row reads as decoration.

A select's items and a menu's are the same row: `md` corners inside the popup's `xxs` padding so the two are concentric, `fillSubtle` while highlighted, and a tick on the end for the picked option. `size` on the content sets the row, after Grok's menus at `default`; a submenu inherits it:

| Size | Row | Text | Side inset | End column |
| --- | --- | --- | --- | --- |
| `sm` | `controlSm` (28) | `textSm` | `space.row` (6) | `icon + 2 × row` (28) |
| `default` | `controlMd` (32) | `textMd` | `space.sm` (12) | `icon + sm` (28) |
| `lg` | `controlLg` (36) | `textBase` | `space.md` (16) | `icon + md` (32) |

Labels pad by the side inset and separators stop at it, so a label's text, a row's text and a separator's ends line up; the tick sits the side inset from the end. A menu is at least `sizes.menuLg` (200px) wide, room for a label beside its value, or `sizes.menu` (144px) at `sm`. A menu stays open while a checkbox or radio item toggles, so its tick draws in and fades out like a checkbox's. A danger item turns red and highlights in `dangerSubtle`. A popup never grows past the viewport (`--available-width`); a long item wraps, anywhere if it must, and its icon and shortcut keep their size.

A filtered menu is a command in a popup: its field is the command's input group, a step above the rows (`lg` at most) and its corner `md` like theirs, and the first match is highlighted while filtering so Enter runs it. The field stays put and the list scrolls to `sizes.menuHeight`. Items hide and show at once as you type, and the popup snaps to the new height.

## Progress and meter

The slider's track: `strokes.track` tall, `fillOpaque` under `accentSolid`, full corners (`trackStyles`, shared with the label and value above it). The fill travels to a new value on `move` + `out`, and jumps under reduced motion. While the amount isn't known, a third-width segment sweeps across the track on `pulse` + `inOut`, and breathes in place under reduced motion. A meter's `color` swaps the fill for that role's `Solid`; it never picks one from its value, since a full meter can be good (battery) or bad (quota). It needs no roles of its own.

A `ring` meter is the same track and fill as a ring a step under an icon, centered in an icon's box like Spinner, so it sits in a table cell or beside text: `fillOpaque` under the fill, which starts at twelve o'clock and runs clockwise with round caps, butt at zero so an empty ring draws no dot. It travels like the bar, and takes `color` the same way.

## Questionnaire

One question at a time, each answer a choice card. The card is Field's: `border`, `radii.md`, `fillSubtle` on hover and when picked, an `accentSolid` edge when picked and `dangerBorder` when invalid. Its Checkbox or Radio indicator is drawn to match, since shadcn's headless questionnaire needs a native input. The whole card rings on keyboard focus. A shortcut is a Kbd at the card's end. Previous sits at the start of the actions, Skip and Next or Submit at the end. The active question swaps at once, with no motion: it's usually changed from the keyboard.

## Radio

A round checkbox with a dot that grows from the center, from half its size, a touch past full on `overshoot`.

## Scroll area

Its scrollbar is an overlay: a 10px rail with a `border` thumb on full corners, shown only while the area is hovered or scrolling, fading on `hover` + `ease`. It takes no room, so content lines up the same whether it scrolls or not. Where a scroll fade already shows there's more, like the docs sidebar, `hideScrollbar` drops the scrollbar.

## Scroll fade

A mask over the scroller, not a gradient in the page's color, so it works on any surface. An edge fades only while content is past it, up to `min(12%, space.xl)` deep and in full once `2 × space.xl` is past, driven by the scroll itself, so a list at rest is never dimmed. Without scroll-driven animations both edges fade.

## Segmented control

One pick among a few, read like tabs: items are `semimedium` `textSecondary` on no fill, the picked one `textPrimary`, and a `fill` pill on full corners slides to it on `move` + `inOut`. The pill is measured from the picked item, so it follows a webfont swap or a resize; until it's placed, the picked item takes the fill itself. Arrow keys move it at once, and so does reduced motion.

## Select

Its trigger is an input's surface at `radii.md`, so a select and an input in one form read as one family; at `sm` the trigger takes `captionLg`, and the chevron and tick follow `controlIconSize`. `size` on the content sizes the rows as a menu's. It opens below its trigger, as wide as it (never under `sizes.menu`), like a menu; opened over it instead (`alignItemWithTrigger`), it appears in place, with no motion; scrolled, it grows to `sizes.menuHeight` and then scrolls, instead of stretching to the viewport.

## Separator

A 1px `borderSubtle` line: it groups content, it doesn't bound a control. A vertical one stretches to its row, so it matches whatever sits beside it.

## Sheet

Travels the whole way in from its edge on `layout` (the drawer curve, `durations.layout`), and leaves the same way, faster, on `dialog`: in and out along one path, so where it went is where it comes from. Its sides are physical, like the slide. Under reduced motion it fades in place. It is the dialog's surface (backdrop, `raised`, `shadows.xl`, footer bar), so a side panel and its narrow-window sheet read alike.

## Settings dialog

A dialog `sizes.settingsDialog` wide and `sizes.settingsDialogHeight` tall, capped to the window, with no padding: a sidebar that doesn't collapse beside a page, stacked above it below `media.sm`, where the nav's rows end before the close button. The page pads `space.lg` and is the one pane that scrolls on its own, since the page behind a dialog can't. Its header ends its text clear of the close button, as a dialog's does, and its title reads at `textLg`, a step over a dialog's, since it heads a page. The title line is `sizes.controlSm` tall; beside the nav the close button drops to the page's `space.lg` padding, so the two centre on one line on every page, and a line's `action` ends `space.lg` before it, so a control there doesn't read as part of Close.

## Side panel

Part of the layout, not a layer: it opens into a slot after the whole page, so the content narrows instead of being covered. The slot is sticky below the header row, the window's height less it, so the panel stays in view while the page scrolls. It floats `space.row` (6px) in from the content and the window's edges, lifted off the page as the composer is: `raised` fill, `radii.lg`, its edge a ring in its `defaultRingSubtle` shadow. What it holds is the app's: details, a form, anything. It's non-modal, so the page beside it stays usable and picking another row swaps what it shows. It slides `space.sm` in and fades on `layout`, and closes at once, so the content widens in one step.

Its header is a strip `sizes.header` less the panel's `space.row` inset above and below (44px), padded `space.row`, so its controls centre on the header row's line and its title's text sits on the body's edge. It holds a title, any actions, then Close, and never info or a description: that goes in the body. The header and footer are pinned; the body scrolls on its own. The footer is the sidebar's, a column with a `space.xs` gap, on the body's `space.md` inset.

## Sidebar

Sits on `sidebar`, a step off the page, split from it by an `borderSubtle` hairline, so it reads as the frame and the page as the content. It's in the flow and sticky, not fixed, so it sits beside the page at any height. Its header is a row `sizes.header` (56px) tall, the page header's height, so the two line up across the edge, with the trigger at its end.

Its content scrolls under `scrollFade.y`, so a list running past the footer fades instead of slicing. Rows are a control tall and `space.xxxs` apart, their text `textMd`, a step over the controls (`textSm` at `sm`). The whole row answers the pointer, its action included, on `fillSubtle`, and stays lit while a menu from it is open. The current row takes `fill`, and hover stacks on it as an inset shadow so it still fades. Rows don't press. The current one keeps regular weight, since a weight change shifts the label. A label cut off fades over its last `space.lg` instead of an ellipsis, and fades out before an action drawn over the row's end; its tooltip shows it whole. A row's shortcut shows only while the row is pointed at or focused, and keeps its room when hidden so the label never moves.

The one surface whose width animates. It morphs on screen rather than entering or leaving, so it runs on `inOut`, taking `sidebar` to open and `sidebarExit` to close.

Everything that changes with it runs on that one clock, with no delays. The inner panel keeps its full width, so the content is clipped and never reflowed. Labels fade. Rows size to the column, so they narrow with the edge and a pill keeps its rounded end. Sub-menus and group labels fold. The hairline rides the column's edge.

Nothing snaps at the start. The rail layout applies only once the width settles, and by then it matches what's already showing. From the keyboard (⌘B, or Enter on the trigger) it changes at once, with no animation.

Narrowed, it's `sizes.sidebarIcon` wide, a control plus its group padding. Each row names itself in a tooltip, which points away from the window's edge. The trigger sits on the rows' icon column and shows the app's mark where the brand's logo was. Pointed at or focused, the toggle cross-fades in on `hover`, scaling from `motion.popoverScale` under `motion.crossfadeTextBlur`, and at once on keyboard focus.

Below `media.md` it opens as a sheet, where the trigger closes it.

A section change (into Settings and back) slides like a stack: the header and content leave `motion.exitOffset` toward where they came from, on `popoverExit`, and the new section arrives from the other side on `popover`, both on `crossfade` under `motion.crossfadeBlur`, clipped to their own boxes. The blur is the one exception to "no blur-ins": it's rare, and it tells two sections apart. The footer, the page and the header's `SidebarTrigger` stay put: the trigger is the same control in both sections, so sliding it would read as a shake. Under `media.reducedMotion` it only fades. It's a view transition, so the old section is a snapshot and never re-renders.

## Skeleton

Breathes, `fill` dimming to `opacities.pulse` and back over `durations.pulse` on `inOut`: slow and in place, so loading reads as calm. It doesn't move, so it keeps breathing under reduced motion.

## Slider

The thumb is 12px on a 4px track; at 16px it outweighed the bar. It gives (`presses.icon`) for as long as it's held, on `[data-dragging]`, which Base UI sets on press, so a tap on the track gives too. Arrow keys don't set it, so they stay still.

## Suggestions

`outline` `sm` pill buttons in one row that scrolls sideways with no scrollbar; `scrollFade.x` shows there's more. The row keeps `space.xxs` around the pills so the viewport doesn't clip a focus ring.

## Switch

A checkbox that slides: `fillStrong` track off, `infoSolid` on. Off, the thumb takes `fillOnStrong`: white in light, `gray-12` in dark. On, it takes `accentOnSolid`. Either way it stands off its track. A `textSecondary` thumb read as disabled on the light track. It takes `shadows.default` in both states; `shadows.defaultRing`'s ring made off look heavier than on. Held, the thumb stretches a quarter of its width toward where it will travel (back from the end when on, so it stays in the track), and travels on `overshoot` over `durations.move`. Under reduced motion it jumps and doesn't stretch.

## Table

Rows are divided by `borderSubtle` and its footer sits on `fillSubtle`. Cells read at `textMd` with `space.sm` at their sides; the header is regular `textSecondary`, so the data leads. Its container scrolls sideways with no scrollbar and fades its edges (`scrollFade.x`). A selected row takes `fill`. Hover and press light a row `fillSubtle`, except in a reference table (`interactive={false}`, as in docs), where nothing answers the pointer. The cells draw the dividers on separate borders: collapsed, Chrome hid them under a selected row in a cell that clips its text.

## Tabs

The default list has no track: a `fill` pill on full corners slides between `semimedium` tabs, as a segmented control's does. The line variant keeps an `accentSolid` line on a `borderSubtle` baseline.

## Textarea

An input's surface at `radii.md`, two control heights tall, growing with its content and resizing only vertically.

## Toast

Enters and leaves along one path: from and back to `translateY(100%)` with a fade, in on `move` + `out`, out on `popoverExit`. A swipe leaves the way it was thrown. Its height animates as the stack expands, the exception to animating a height: Base UI's stack measures each toast and sets the height, so the animation never feeds its own measurement. Under reduced motion it only fades.

## Toggle

A ghost or outline button that stays pressed, with the button's sizes and press. Pressed it takes `fill`. A toggle group passes its variant and size to every item; at spacing `0` they join through the ButtonGroup variables into one joined row.

## Trace

The one shape for an agent's run: reasoning, tool calls, sources and files are all steps on one rail, not components of their own. Everything in it stays a step back from the answer ([type](type.md#agent-process)).

| Part | Look |
| --- | --- |
| Rail | 1px `border` at the marker column's center, drawn as two halves per step so it shows on any surface. It stops at each marker's `controlXs` box, whose room around the icon is the gap. It starts on the first step, runs on beside a step's open content and ends on the last step |
| Marker | The step's `iconSm` icon centered in a `controlXs` box, in the line's color, so it brightens with a trigger's line on hover. `dangerText` when failed; dimmed with the line while pending. While running, only the title's shimmer shows it. In a step's trigger, the icon cross-fades to a chevron while pointed at or focused |
| Line | `controlMd` tall, no fill, `textSecondary` at `sm`; `textPrimary` on hover inside a link or trigger. A failed step keeps its color and says "Failed ..."; `pending` dims to `opacities.disabled` |
| Title | The verb, regular, in the line's color; cut short; shimmers while running. The run's trigger reads as one line: title and description both `textSecondary` |
| Subject | `textMuted`, regular, so the verb leads; cut short |
| Description | `textMuted`, tabular; never truncates. `dangerText` when the step failed, for the reason ("Exit code 1 · 3 errors"), which goes in the step's content under the title |
| Content | `textSecondary` at `sm`, lined up with the title; a ring on its edge stays inside the clip |
| Reasoning | `textMuted`, a window of four lines, the top one fading under a mask once full. Open only while the model thinks; a finished thought is a plain line, not a trigger |
| Substeps | Rows like a step's line under it, `controlMd` tall, each with its own icon and no rail of their own; `textSecondary`. Nothing in a run is `textPrimary` |

| Motion | Values |
| --- | --- |
| A step arriving | Its space grows from `0fr` on `move` + `out`, then it fades in from `motion.arriveOffset` down under `motion.crossfadeTextBlur`, `durations.stagger` later. Only steps that arrive after the Trace mounts; once each, so a shut panel showing again replays none. Reduced motion: a fade |
| Content opening and shutting | A [Collapsible](#collapsible)'s panel: its height and opacity on `layout`, shutting on `layoutExit` + `out` |
| State change | The marker's color fades on `hover` + `ease` |
| A step trigger's marker | Icon and chevron share one cell: the outgoing one shrinks to `motion.popoverScale` under `motion.crossfadeTextBlur` and fades, on `hover` + `crossfade`; keyboard focus swaps at once. Reduced motion: opacity only. The chevron turns a quarter on the panel's timing |
| Text changing | Titles and counts sit in a Swap Text: tense morphs, numbers roll |
| The run trigger's chevron | After its text, on the panel's timing each way: `layout` opening, `layoutExit` + `out` shutting, so it lands as the panel does. It turns a quarter |

A link or a Dialog or Sheet trigger around a line takes `traceActionStyles()`, so it adds no chrome of its own. A step that opens its own content uses `TraceStepTrigger`, which does the same.
