# Design

## Personality

Quiet, crisp, and finished, with a pulse. Near-monochrome by default, so the craft shows in the details: a press that gives, a hover that answers, a popover that settles. Most go unnoticed one at a time. Together they are the point.

A few moments carry the character, and only these: a primary button that reads as a key, lit on top and shaded below; a switch thumb that stretches under the finger and lands with a little give; a radio dot that pops; floating surfaces that sit at a distance, with a near shadow and a far one, and a step lighter than the page in dark. A brand theme adds one hue to the accent, the focus ring, the text selection and the caret, and changes nothing else. Everything outside these stays still.

## Color

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A component asks for what it means, so a palette change is one file. Three roles differ by theme, through variables in `base.css`. `textMuted` is `gray-10` in light; in dark, halfway between `gray-10` and `gray-11`, since `gray-10` is too faint for small labels (APCA Lc 32) and `gray-11` would merge it with `textSecondary`. The status tints are step 9 mixed at 14% (`FillSubtle`) and 22% (`Fill`) in both themes: Radix's dark alpha steps go muddy, and the vivid step stays the same hue on any page. Status text is step 11 in dark; in light it leans 30% toward step 12, since step 11 drops under 4.5:1 on its own tint. `onInvertedFill`, a fill on the inverted surface (a tooltip), is white `a4` in light and black `a2` in dark, since that surface flips from near-black to near-white.

The default accent is near-black (near-white in dark), not a hue, so color stays out of the way and type, spacing and motion carry the design. A theme can make it a brand hue (`--accent-solid`, step 9 of a generated scale); a tooltip stays on `inverted`, the gray ink, so a hint never reads as a call to action.

Hue is reserved for status: `danger` (red), `success` (green), `warning` (amber), `info` (blue). The default accent is gray, so none of them collides with it; a theme's accent should keep its distance from them. Each has the base for icons and short labels, `FillSubtle` and `Fill` as tints that mirror the neutral fills, and `Solid` for a dot that carries the status alone. Status color marks the small thing that carries the meaning and never body text, so copy inside an alert stays neutral. And never alone: the icon's shape or the text says it too, and a dot with no text beside it has an accessible name.

Status is never a saturated solid behind text. A destructive action is red text on a red tint: a full red fill shouts in a quiet interface, and white on it can't reach text contrast in both themes anyway. Only a dot is solid, step 9, and amber takes step 11 in light, since step 9 is 1.5:1 on the page.

## Theme

Light and dark get the same care. Every color is a role token, so a component looks right in both without knowing which one it's in.

A theme switch cross-fades the whole page as one (a view transition, on the `crossfade` curve). Transitions pause for the flip, so no control fades into the new theme on its own clock after the page.

## Surfaces

Controls (buttons, inputs) have a real border for their edge and a shadow for their height: the edge takes space, so what the user sees is what's laid out, and a shadow ring would draw outside the box, look 2px larger and double up at a button group's seams. The height is a ladder of soft drops with no ring: `shadows.control` at rest, `controlHover` a step higher, `controlPressed` nearly flat while held, and `primary`/`primaryPressed` for the solid fill. Only pressables climb it (an outline button, a select trigger); a field stays at rest. Every variant reserves the border, transparent when it has no edge, so a fill and an outline are the same size. A bordered control sets `background-clip: padding-box`: otherwise the fill paints under the translucent edge and muddies it, and bleeds through anti-aliased corners.

Controls have fixed heights from `sizes.control*`, so a button and an input in one row line up. Text steps down with the height like a button's (13px at `sm`, 14px from `default`), but an input keeps 16px below 640px so iOS doesn't zoom on focus. Text fields stop at `sm`: at 24px a typed line has no room above and below.

Every control and box draws its border in `edge`: a button, an input, a tabs list and a choice card match, so a row of them reads as one family. `edgeSubtle` is too faint for that: an input's fill sits inside its edge, and with the faint one it reads 30px tall beside a 32px button on the dark page. A choice card's edge turns `accent` when checked. A file input's button is a `fill` chip set into the box with an even inset on three sides, its corner concentric with the box's; the file name beside it is `textSecondary`, so the chip leads. A textarea is the same surface, two control heights tall, growing with its content and resizing only vertically.

An input group is that surface drawn once around a borderless control and its addons, so the group carries the edge, invalid halo, ring and disabled fade. Whatever sits inside keeps an even inset on every side it touches: an xs button 3px in from the edge at the default height (the file chip's inset and corner), a keycap 5px, both recomputed for each group size, and a header or footer's trailing button as far from the side as from the edge it rests on. Buttons in a header or footer gather at its end. A text prefix (`https://`, `$`) or suffix (`%`) sits 2px from the value, so the two read as one string. An input stacked with a header or footer takes the addon's line height and a 4px step between them, so the two lines space as evenly as their outer edges.

Every control shows disabled the same way: one shared fade (`opacities.disabled`) and a not-allowed cursor, never a per-control look; a sunken fill read as fillable, not off. A button at work (`aria-busy`) is not a disabled one: it takes a busy cursor, and fades only to `opacities.busy` when it also can't be pressed. Busy and still pressable (Generate turning into Stop generating) stays at full strength.

Floating surfaces (toasts, popovers, dialogs) draw their edge with `shadows`. They sit above the layout, so the edge taking no space is right for them. Their fill is `raised`: white on the off-white page in light, `gray-2` in dark, where a shadow barely shows and lightness has to say what floats. A field inside a dialog keeps `background`, so in dark it reads sunk into the surface.

The primary button is the one control with depth of its own (`shadows.primary`): a white-a3 line inside its top edge and a black-a3 one inside its bottom, over a small drop. In dark, where the fill is near-white, the bottom shade does the work.

A slider thumb rides above its track, so it does the same: `shadows.thumb` is a gray ring plus a drop shadow. `shadows.control` alone vanishes on the dark page and leaves the thumb flat. The thumb is 12px on a 4px track; at 16px it outweighed the bar.

A keycap (`Kbd`) is a `fill` chip with `textSecondary` type in the surrounding font, not monospace, so a shortcut reads as part of the sentence. Its corner is `radii.chip` (6px): at 20px, 4 reads square and 8 a pill. Inside a button or input group it sits as far from the side as from the top and bottom, and its corner nests in the box's up to `default`; at `lg` the inset reaches the radius, so it keeps its own. Inside a tooltip it takes `onInvertedFill` and `onInverted`, and the tooltip's end padding drops to `space.xxs` around a trailing key so the corners stay concentric.

A separator is a 1px `edgeSubtle` line, the same faint edge as a divider anywhere else, not `edge`: it groups content, it doesn't bound a control. A vertical one stretches to its row, so it matches whatever sits beside it.

A button group joins its items into one control: the corners where two meet go square, and the item before draws the shared edge, so the seam is one line, not two. A separator between filled buttons draws that line instead, full height, and the buttons on both sides keep their own padding. Nested groups sit `space.xs` apart and don't join.

Popups opened from a control (select, dropdown menu, popover) share one surface and one motion: `background` on `shadows.popover`, a fade and a 0.96 scale from the trigger on `durations.popover`, leaving faster on `popoverExit`, above dialogs on `layers.popover`. Opened from the keyboard or dismissed with Esc, a popup appears and leaves at once (Base UI's `data-instant`); so do arrow keys and a picked item. Base UI marks only some of these, and none on a select, so both track the open-change reason with `useSkipMotion`. A submenu only fades, on `popoverExit`: it opens many times a minute while the pointer sweeps a menu, and a scale from beside its row reads as decoration. A select opens below its trigger, as wide as it (never under `sizes.menu`), like a menu; opened over it instead (`alignItemWithTrigger`), it appears in place, with no motion; scrolled, it grows to `sizes.menuHeight` and then scrolls, instead of stretching to the viewport. A select's items and a menu's are the same row: `controlSm` tall (`size` on the content makes it `controlXs` with `xs` type, or `controlMd`, and a submenu inherits it), `xs` corners inside the popup's `xxs` padding so the two are concentric, `fillSubtle` while highlighted, and a tick on the end for the picked option. A menu stays open while a checkbox or radio item toggles, so its tick draws in and fades out like a checkbox's. A danger item turns red and highlights in `dangerFillSubtle`. A list item shows the keyboard on its highlight, so it draws no focus ring.

A select's trigger is an input's surface, so a select and an input in one form read as one family. A switch is a checkbox that slides: `fillStrong` track off, `accent` on, a `textSecondary` thumb that turns `onAccent` when on, so it reads in both themes without its own token. A radio is a round checkbox with a dot that grows from the center, from half its size, a touch past full on `overshoot`. Held, a switch thumb stretches a quarter of its width toward where it will travel (back from the end when on, so it stays in the track), and travels on `overshoot` over `durations.move`. Under reduced motion it jumps and doesn't stretch.

A badge takes the button's six variants, so emphasis means the same thing on both, at 18, 20 or 24px with `radii.chip` corners. Only a badge rendered as a link answers hover. A status tints a `secondary` badge and colors a `ghost` or `link` one's text; an `outline` badge keeps its label neutral and puts the status in its dot, spinner or icons, so a row of them stays quiet. `primary` and `danger` already carry their color and ignore it. A dot is muted with no status, and follows the text on `primary` and `danger`.

A table's rows are divided by `edgeSubtle`, the faint divider, and its footer sits on `fillSubtle`. A selected row takes `fill`. An avatar follows the control heights (24, 32, 36), so it lines up with a button of the same size; its photo draws its `edge` inside itself, and avatars in a group, and an avatar and its badge, are cut apart by a 2px gap masked out of the one beneath, so any surface shows through it, not a ring of the page color. An avatar and a group's count fill with `fillOpaque` (`gray-3`, which matches `fill` on the page), so an overlapped avatar doesn't show through. Its badge's status is a `Solid` dot (online, away, busy) or `textMuted` (offline), named for screen readers.

A dialog's footer is a `fillSubtle` bar with a top edge, set flush into the popup's sides and bottom, so the actions read as their own row instead of floating under the text. The popup pads `space.md`; any more and the 16px title looks lost in it.

A card is a box in the layout, so it takes a real `edge` border, not a shadow, and the `raised` fill: white on the off-white page, a step lighter in dark. Its corner is `radii.lg`; its padding (`space.md`, `sm` at `sm`, none at `flush` for rows that pad themselves) is one variable its header, content and footer read, so they line up at every size. Its footer is the dialog's: a `fillSubtle` bar with a top edge, flush with the sides and bottom. A `well` is a `fillSubtle` tray a ladder step around a card, `space.xxs` padding and the card's corner a step down to `md`, so the two are concentric; a header in the tray lines its text up with the card's.

An item is a row of media, text and actions, the shape a list or a settings row takes. It reserves a border like a control, `edge` when `outline`, and has `fillSubtle` when `muted`. Only an item rendered as a link or button answers: `fillSubtle` on hover, `presses.row` held. Its media sits level with the title's first line when there's a description, and an image follows the control heights (`media` 40, then 32 and 24). Items with separators between them drop their gap and let their own padding space them.

An empty state is centered, balanced text in a short measure (`sizes.measure`), led by its media: an icon on a `fill` tile a control tall, or an avatar as it is. It draws no box of its own, so it sits in whatever holds its place, a card or a page.

An alert is a box like a card, a control's radius and padding: `edge` border, `raised` fill. Its `status` colors only the icon, so the title and description stay neutral; the icon sits on the title's first line, and an action takes its own column at the end, centered on the text.

A progress bar and a meter are the slider's track: `strokes.track` tall, `fill` under `accent`, full corners. The fill travels to a new value on `move` + `out`, and jumps under reduced motion. A meter at or past its max turns `dangerSolid`, so a spent quota reads at a glance; it needs no roles of its own.

A toggle is a ghost or outline button that stays pressed, with the button's sizes and press. Pressed it takes `fill`, the selected role, and hover stays a step under it at `fillSubtle`, so on and hovered never read alike. A toggle group passes its variant and size to every item; at spacing `0` they join through the ButtonGroup variables into one segmented control.

On the site, the demo stage is the stage color, a step below the page in both themes, so the preview sits in a well instead of washing into the page and controls lift off it: `gray-2` in light, `#050505` in dark (Radix has nothing below `gray-1`).

The sidebar sits on `sidebar`, a step off the page, so it reads as the frame and the page as the content. Its current item takes `fill`, as a selected table row does, and a resting track, avatar or user message takes `fillOpaque`: one role per meaning, not per component.

A surface set into a tinted frame draws its edge inside itself. An outer edge would stack on the frame's tint and leave a light halo around the inner surface.

Nested corners are concentric: outer radius = inner radius + the padding between them (`radii.md` 12 around `radii.sm` 8 at `space.xxs` 4). So the corners are one ladder, `xs` to `xl`, a `space.xxs` step apart: a card (`lg`) holds an `md` surface, a composer (`xl`) an `lg` one. The step shrinks under a 4px radius so every corner reaches 0 together. When the padding is at least the outer radius, the inner corner no longer reads against the outer one and keeps its own radius.

## Details

- **Crisp text.** Grayscale antialiasing on the root; subpixel rendering makes light text on dark look heavy on macOS.
- **Wrapping.** Headings and titles `text-wrap: balance`; body and descriptions `pretty`, so no line ends on one word.
- **Weights stop at 600.** `fontWeights.semibold` is the heaviest, for bold in prose; nothing is 700. Heavier type shouts in a quiet interface.
- **Numbers.** Anything that changes in place (counts, timers, prices, table columns) sets `font-variant-numeric: tabular-nums`, so digits don't shift as they update.
- **Optical alignment.** Align what the eye sees, not the box: an icon marked `data-icon="inline-start"` or `"inline-end"` tightens its side's padding; Button's sizes take shadcn's numbers exactly (padding, icon side, gap, icon size per size). An icon centers on the first line of text, not the block.
- **Icon stroke follows text weight.** `strokes.icon` is tuned for medium text; one icon set (Hugeicons) everywhere.
- **Hit areas.** Anything smaller than `sizes.hitArea` grows its target with an invisible `::before` to that size. Neighbouring targets never overlap.

## Docs site

Only the navigation a reader needs, added as it's needed: a header (name, theme toggle), a sidebar grouped by section (Getting started, Components), and an "On this page" outline of the h2s and h3s that marks the section being read. The sidebar appears once it fits beside the content, the outline once both fit; below that the page is one column. Header, sidebar and outline stay put; only the content scrolls. Content starts right under the header, so a linked section lands at its edge with nothing showing above it. Sidebar and outline sit at the window's edges with the content centered between them, so nothing is squeezed together. Line numbers stay pinned while long lines scroll. Text is Inter; code is JetBrains Mono with ligatures off, so `</` and `...` read as the characters typed. Sidebar rows sit `space.xxxs` apart, so a hovered row's fill never merges into the active one.

The home page is the tagline set large with Docs, GitHub and X links under it, then labeled sections: a muted label in a sidebar-width column, its content beside it (stacked below `media.sidebar`). No prose beyond the tagline.

## Focus

One ring, set once in `base.css`, the same on every control: a 1px `gray-a8` line flush outside the edge. Flush, not offset: an offset ring read as a second box around a text field, and it broke at a button group's squared seams. Outside, not over the edge: over it, the line vanished on a filled button. An invalid control's ring is red, so the error survives focus. An input group takes the ring for the control inside it, so the ring wraps the box the user sees. A popup (a dialog, menu or list) takes focus to hold it, not as a control, so it draws none; a menu takes it whenever the pointer rests off its items. Components never style focus themselves; `constella/no-focus-style` enforces it.

## Motion

### Should it animate

Ask how often it's seen. Something used dozens of times a day gets little or no motion. Keyboard-initiated actions never animate.

### Easing

| Token       | For                                                          |
| ----------- | ------------------------------------------------------------ |
| `out`       | Entrances and presses: moves at once, so it feels responsive |
| `inOut`     | Things traveling across the screen: leave and arrive gently  |
| `overshoot` | A small mark landing in place: a switch thumb, a radio dot   |
| `ease`      | Color and hover changes (the CSS keyword, no token)          |
| `crossfade` | One state replacing another in place: icons, text            |
| `layout`    | A surface changing size: leaves at once, settles gently      |

Never `ease-in`: it delays the moment the eye is watching.

### Duration

| Token         | For                                     |
| ------------- | --------------------------------------- |
| `hover`       | Color changes on hover                  |
| `press`       | Scale on `:active`                      |
| `popover`     | Small surfaces that open from a trigger |
| `popoverExit` | The same surfaces leaving, and submenus |
| `dialog`      | A dialog and its backdrop               |
| `move`        | Indicators and thumbs that travel       |
| `crossfade`   | Cross-fades between states              |
| `layout`      | A surface growing or shrinking to fit   |
| `spin`        | One turn of a spinner                   |

Interface motion stays under 300ms. A spinner is the exception: unhurried, so waiting reads as working, not urgent.

The home page is the one exception, seen rarely and there to sell: on the first document load the logo spins in and the page staggers in inside that spin, landing as it settles. It never replays on client navigation.

A skeleton breathes, `fill` dimming to `opacities.pulse` and back over `durations.pulse` on `inOut`: slow and in place, so loading reads as calm. It doesn't move, so it keeps breathing under reduced motion.

Restraint is the default. A component used every day gets one motion that explains a change, not several that decorate it: no blur-ins, no timers drawing on screen, and no bounce on a surface or anything that travels far. `overshoot` is only for a small mark landing where it already almost is.

### Crossfades

When one state replaces another in place, both stay on screen and cross-fade, so there's never an empty frame. An icon arrives from `motion.crossfadeScale` and `motion.crossfadeBlur`, on transitions so a quick change back reverses. Text can't stay mounted (it's the same node), so the old copy is kept as a layer that fades out under the new one, both blurred by `motion.crossfadeTextBlur` so they read as one changing. An avatar's fallback can't stay either (Base UI unmounts it), so the photo fades in over the avatar's `fillOpaque`. A status change only fades color, on `ease` + `hover`.

### Layout animation

When content changes, the layout takes its new size at once and only the surface and content travel from the old size, with transforms and clipping, on `layout`. Anything measuring the layout (Base UI does, for stacks) then always reads the truth; animating `height` itself feeds the animation back into the measurement.

A collapsible is the one surface that animates its height: what sits below it has to make room, so the panel grows to Base UI's measured height on `layout`, fading in with it, and jumps under reduced motion. Base UI owns that measurement, so the animation never feeds back into it.

### Press and hover

Pressables scale down on `:active`, from `presses`: `icon` for icon buttons, `link` for buttons, `row` for full-width rows. The smaller the target, the bigger the give. Two exceptions: a trigger (`[aria-haspopup]`) doesn't give, since pressing it opens something rather than acting, and keeps its hover look while its popup is open (`[data-popup-open]`); a text link answers with an underline, not a press.

A slider thumb gives (`presses.icon`) for as long as it's held, on `[data-dragging]`, which Base UI sets on press, so a tap on the track gives too. Arrow keys don't set it, so they stay still.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`. Hover styles sit behind `media.hover` so touch doesn't stick, and repeat ungated on `:active`, so a tap highlights on touch the way a hover does on a pointer.

### Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears. Popovers scale from their trigger via Base UI's `--transform-origin`. A dialog belongs to no trigger, so it scales from its own center (`motion.dialogScale`). A dialog opened from another sits on top, and the one behind steps back like a toast stack: shrinks by `motion.stackScale` and peeks `space.sm` above it.

### Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel land instantly. Press feedback and reveals that don't move stay. There is no global kill, so every animation that moves something says what it does under `media.reducedMotion`.
